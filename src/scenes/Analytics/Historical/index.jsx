import React, { useContext, useState } from "react";
import { useTheme,IconButton } from "@mui/material";
import { AppContext } from "../../../services/AppContext";
import ReportsBar from "../ReportsBar/ReportsBar";
import * as XLSX from "xlsx";
import excelIcon from "../../../assets/images/png/ExcellTrans100_98.png";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  TablePagination,
  TableSortLabel,
} from "@mui/material";

const columnMappings = {
  bmsManufacturerID: "BMS Manufacturer ID",
  installationDate: "Installation Date",
  cellsConnectedCount: "Connected Cells Count",
  problemCells: "Problem Cells",
  stringVoltage: "String Voltage (V)",
  systemPeakCurrentInChargeOneCycle: "Peak Current",
  averageDischargingCurrent: "Avg Discharging(A)",
  averageChargingCurrent: "Avg Charging(A)",
  ahInForOneChargeCycle: "Ah In for 1 Charge Cycle",
  ahOutForOneDischargeCycle: "Ah Out for 1  Discharge Cycle",
  cumulativeAHIn: "Cumulative Ah In",
  cumulativeAHOut: "Cumulative Ah Out",
  chargeTimeCycle: "Charge Time Cycle (s)",
  dischargeTimeCycle: "Discharge Time Cycle (s)",
  totalChargingEnergy: "Total Charging Energy (kWh)",
  totalDischargingEnergy: "Total Discharging Energy (kWh)",
  everyHourAvgTemp: "Every Hour Avg Temp (°C)",
  cumulativeTotalAvgTempEveryHour: "Cumulative Avg Temp Every Hour (°C)",
  chargeOrDischargeCycle: "Charge/Discharge Cycle Count",
  socLatestValueForEveryCycle: "SOC Latest Value (%)",
  dodLatestValueForEveryCycle: "DOD Latest Value (%)",
  systemPeakCurrentInDischargeOneCycle: "System Peak Current (Discharge)",
  instantaneousCurrent: "Instantaneous Current (A)",
  ambientTemperature: "Ambient Temperature (°C)",
  batteryRunHours: "Battery Run Hours (s)",
  serverTime: "Server Time",
  packetDateTime: "Packet Date Time",
  bmsalarmsString: "BMS Alarms String",
};

const Historical = () => {
  const theme = useTheme();
  const { data = [] } = useContext(AppContext);
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);
  const [order, setOrder] = React.useState("asc");
  const [orderBy, setOrderBy] = React.useState("date");
  const [pageType, setPageType] = useState(0);

  const handleRequestSort = (property) => {
    const isAscending = orderBy === property && order === "asc";
    setOrder(isAscending ? "desc" : "asc");
    setOrderBy(property);
  };

  function TimeFormat(dateString) {
    if (dateString == null) {
      return "";
    }
    const utcDate = new Date(dateString);

    const year = utcDate.getFullYear();
    const month = String(utcDate.getMonth() + 1).padStart(2, '0');
    const day = String(utcDate.getDate()).padStart(2, '0');
    const hours = String(utcDate.getHours()).padStart(2, '0');
    const minutes = String(utcDate.getMinutes()).padStart(2, '0');
    const seconds = String(utcDate.getSeconds()).padStart(2, '0');
    const milliseconds = String(utcDate.getMilliseconds()).padStart(3, '0');

    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}.${milliseconds}`;
  }

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const dataArray = data.content;

  const combineAlarmsData = (dataArray) => {
    if (!dataArray || dataArray.length === 0) return [];

    const combinedData = {};

    dataArray.forEach((current) => {
      const { id, bmsalarmsString, deviceId, bmsManufacturerID, installationDate, cellsConnectedCount, problemCells, siteId, serialNumber, ...rest } = current;
      if (!combinedData[current.id]) {
        combinedData[current.id] = { ...rest };
      } else {
        combinedData[current.id] = { ...combinedData[current.id], ...rest };
      }
    });

    const rows = Object.values(combinedData);

    return rows.map((row) => {
      const { packetDateTime, ...rest } = row;
      return { packetDateTime, ...rest };
    });
  };

  const sortedData = (dataArray) => {
    return [...dataArray].sort((a, b) => {
      if (order === "asc") {
        return a[orderBy] > b[orderBy] ? 1 : -1;
      }
      return a[orderBy] < b[orderBy] ? 1 : -1;
    });
  };

  const formattedData = combineAlarmsData(dataArray);
  const displayedData = sortedData(formattedData);
  const handleDownloadExcel = () => {
    if (!formattedData || formattedData.length === 0) {
      alert("No data available to export!");
      return;
    }
  
    // Create a new workbook
    const workbook = XLSX.utils.book_new();
  
    // Map data to Excel format
    const excelData = displayedData.map((row) => {
      return Object.keys(row).map((key) => {
        if (key === "packetDateTime" || key === "serverTime") {
          return TimeFormat(row[key]);
        } else if (key === "dcVoltageOLN") {
          return row[key] === 0 ? "Low" : row[key] === 1 ? "Normal" : row[key] === 2 ? "Over" : row[key];
        } else if (typeof row[key] === "boolean") {
          return row[key] ? "Fail" : "Normal";
        } else {
          return row[key] !== undefined && row[key] !== null ? row[key] : "No Data";
        }
      });
    });
  
    // Add headers only if data exists
    if (formattedData.length > 0) {
      const headers = Object.keys(formattedData[0]).map((key) => columnMappings[key] || key);
      excelData.unshift(headers);
    }
  
    // Create a worksheet
    const worksheet = XLSX.utils.aoa_to_sheet(excelData);
  
    // Add the worksheet to the workbook
    XLSX.utils.book_append_sheet(workbook, worksheet, "Historical Data");
  
    // Generate Excel file and trigger download
    XLSX.writeFile(workbook, "Historical_Data.xlsx");
  };
  

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "10px" }}>
        <ReportsBar pageType="historical" />
        <IconButton onClick={handleDownloadExcel} color="primary" aria-label="Download Excel">
  <img src={excelIcon} alt="Download Excel" style={{ width: "24px", height: "24px" }} />
</IconButton>

      </div>

      {formattedData && formattedData.length > 0 ? (
        <>
         <TableContainer
            component={Paper}
            sx={{ marginTop: 1, overflowX: "auto",
              border: "1px solid black", // Red border for all four sides
              borderRadius: "8px",
              paddingBottom: 3, // Adding padding at the bottom
              height: '379px',
             }}
          >
            <Table stickyHeader aria-label="sticky table">
              {/* Table Header */}
              <TableHead>
                <TableRow>
                  {Object.keys(formattedData[0]).map((key) => (
                    <TableCell
                      key={key}
                      sx={{
                        fontWeight: "bold",
                        backgroundColor: "#d82b27", // Blue header
                        color: "#ffffff", // White text
                        padding: '3px', // Decreased padding
                      }}
                    >
                      <TableSortLabel
                        active={orderBy === key}
                        direction={orderBy === key ? order : "asc"}
                        onClick={() => handleRequestSort(key)}
                        aria-label={`Sort by ${columnMappings[key] || key}`}
                      >
                        {columnMappings[key] || key} {/* Map column names */}
                      </TableSortLabel>
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>

              {/* Table Body */}
              <TableBody sx={{ overflowY: 'auto' }}>
                {displayedData
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((row, index) => (
                    <TableRow
                      key={index}
                      sx={{
                        "&:hover": { backgroundColor: "#e1e2fe" }, // Hover effect
                      }}
                    >
                      {/* Render each value in the row */}
                      {Object.entries(row).map(([key, value], idx) => (
                        <TableCell
                          key={idx}
                          sx={{ 
                            border: '1px solid #ccc', // Ensure visibility
                            padding: '3px', // Decreased padding
                            fontWeight: 'bold', // Bold text
                          }}
                        >
                          {key === 'dcVoltageOLN'
                            ? (value === 0
                                ? 'Low'
                                : value === 1
                                ? 'Normal'
                                : value === 2
                                ? 'Over'
                                : value) // Custom mapping for dcVoltageOLN
                            : typeof value === 'boolean'
                            ? value
                              ? 'Fail' // If true, show 'Fail'
                              : 'Normal' // If false, show 'Normal'
                            : key === 'packetDateTime' || key === 'serverTime' // Added serverTime check
                            ? TimeFormat(value)
                            : value !== undefined && value !== null
                            ? value // Otherwise, just show the actual value
                            : 'No Data'}
                        </TableCell>
                      ))}
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
          </TableContainer>

          {/* Pagination */}
          <TablePagination
            rowsPerPageOptions={[5, 10, 15]}
            component="div"
            count={formattedData.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </>
      ) : (
        <Typography variant="body1" sx={{ marginTop: 2 }}>
          No data available
        </Typography>
      )}
    </div>
  );
};

export default Historical;