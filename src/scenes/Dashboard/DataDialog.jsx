import React, { useState } from "react";
import { Dialog,DialogTitle,DialogContent, DialogActions,Button, Table, TableHead,TableBody,TableRow,TableCell,Paper,TableContainer,Typography, TablePagination,
} from "@mui/material";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  LabelList,
} from "recharts";

// Table Dialog to display data in table format
const TableDialog = ({ open, handleClose, data }) => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const paginatedData = data.details?.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );
  return (
    <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
      <DialogTitle sx={{ backgroundImage: "linear-gradient(90deg, #00d4ff 0%, #090979 35%, #00d4ff 100%)", color: "white", fontWeight: "bold", textAlign: "center" }}>
        Data for {data.name}
      </DialogTitle>
      <DialogContent>
      <Typography variant="body1">
        <TableContainer
          component={Paper}
          sx={{
            marginTop: 1,
            overflowX: "auto",
            border: "1px solid black",
            borderRadius: "8px",
            paddingBottom: 3,
            height: "379px",
          }}
        >
          <Table aria-label="simple table">
            <TableHead sx={{ backgroundColor: "#d82b27", color: "#ffffff" }}>
              <TableRow>
                <TableCell sx={{ border: "1px solid #ccc", padding: "5px", fontWeight: "bold", color: "#ffffff" }}>
                  Substation ID
                </TableCell>
                <TableCell sx={{ border: "1px solid #ccc", padding: "5px", fontWeight: "bold", color: "#ffffff" }}>
                  Serial Number
                </TableCell>
                <TableCell sx={{ border: "1px solid #ccc", padding: "5px", fontWeight: "bold", color: "#ffffff" }}>
                  Cell Count
                </TableCell>
                <TableCell sx={{ border: "1px solid #ccc", padding: "5px", fontWeight: "bold", color: "#ffffff" }}>
                  String Voltage(V)
                </TableCell>
                <TableCell sx={{ border: "1px solid #ccc", padding: "10px", fontWeight: "bold", color: "#ffffff" }}>
                  String Current(A)
                </TableCell>
                <TableCell sx={{ border: "1px solid #ccc", padding: "5px", fontWeight: "bold", color: "#ffffff" }}>
                  String Ambient Temperature(°C)
                </TableCell>
                <TableCell sx={{ border: "1px solid #ccc", padding: "5px", fontWeight: "bold", color: "#ffffff" }}>
                  SOC
                </TableCell>
                <TableCell sx={{ border: "1px solid #ccc", padding: "5px", fontWeight: "bold", color: "#ffffff" }}>
                  DOD
                </TableCell>
                <TableCell sx={{ border: "1px solid #ccc", padding: "5px", fontWeight: "bold", color: "#ffffff" }}>
                  Battery Run Hours
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {paginatedData?.map((item, index) => (
                <TableRow
                  key={index}
                  sx={{
                    "&:nth-of-type(odd)": { backgroundColor: "#fafafa" },
                    "&:hover": { backgroundColor: "#f0f0f0" },
                  }}
                >
                  <TableCell>{item.siteId}</TableCell>
                  <TableCell>{item.serialNumber}</TableCell>
                  <TableCell>{item.cellsConnectedCount}</TableCell>
                  <TableCell>{item.stringvoltage}</TableCell>
                  <TableCell>{item.instantaneousCurrent}</TableCell>
                  <TableCell>{item.ambientTemperature}</TableCell>
                  <TableCell>{item.socLatestValueForEveryCycle}</TableCell>
                  <TableCell>{item.dodLatestValueForEveryCycle}</TableCell>
                  <TableCell>{item.batteryRunHours}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={data.details?.length || 0}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
            sx={{
              borderTop: "1px solid #ccc",
              backgroundColor: "#f5f5f5",
            }}
          />
        </TableContainer>
      </Typography>
    </DialogContent>
      <DialogActions>
        <Button
            onClick={handleClose}
            sx={{
              backgroundColor: "red",
              color: "white",
              "&:hover": {
                backgroundColor: "#b30000",
              },
            }}
          >
            Close
          </Button>
      </DialogActions>
    </Dialog>
  );
};

const DataDialog = ({ openDialog, handleCloseDialog, selectedStatus, barChartData }) => {
  const [openTableDialog, setOpenTableDialog] = useState(false);
  const [tableData, setTableData] = useState(null);

  // Mapping of status to gradient IDs
  const statusGradients = {
    'Most Critical Count': 'mostcriticalGradient',
    'Critical Count': 'CriticalGradient',
    'Major Count': 'majorGradient',
    'Minor Count': 'minoralarmsGradient',
  };

  // Determine the current gradient based on selected status
  const currentGradient = statusGradients[selectedStatus] || 'defaultGradient';

  const handleBarClick = (data) => {
    const filteredData = barChartData.find((item) => item.name === data.name);
    if (filteredData) {
      setTableData({
        name: data.name,
        details: filteredData.details,
      });
      setOpenTableDialog(true);
    }
  };

  return (
    <>
      <Dialog
        open={openDialog}
        onClose={handleCloseDialog}
        maxWidth="md"
        fullWidth
        sx={{ "& .MuiDialog-paper": { maxWidth: "600px", padding: "16px" } }}
      >
        <DialogTitle
          sx={{
            backgroundImage: "linear-gradient(90deg, #00d4ff 0%, #090979 35%, #00d4ff 100%)",
            color: "white",
            fontWeight: "bold",
            textAlign: "center",
            padding: "16px",
            borderRadius: "8px",
            boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
            marginBottom: "16px",
          }}
        >
          Alarms for {selectedStatus}
        </DialogTitle>
        <DialogContent>
          {/* Define gradients */}
          <svg width={0} height={0} style={{ position: 'absolute' }}>
            <defs>
              <linearGradient id="mostcriticalGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#DB3445" />
                <stop offset="100%" stopColor="#F71735" />
              </linearGradient>
              <linearGradient id="CriticalGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#d82b27" />
                <stop offset="100%" stopColor="#f09819" />
              </linearGradient>
              <linearGradient id="majorGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#9d50bb" />
                <stop offset="100%" stopColor="#6e48aa" />
              </linearGradient>
              <linearGradient id="minoralarmsGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#e8b409" />
                <stop offset="100%" stopColor="#f4ee2e" />
              </linearGradient>
              <linearGradient id="defaultGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#8884d8" />
                <stop offset="100%" stopColor="#8884d8" />
              </linearGradient>
            </defs>
          </svg>

          <ResponsiveContainer width="100%" height={350}>
            <BarChart 
              data={barChartData} 
              barSize={25} 
              margin={{ bottom: 40 }} 
              barCategoryGap="20%" 
              barGap={5} 
              scale="linear"
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" interval={0} angle={-45} textAnchor="end" dx={-5} dy={15} />
              <YAxis hide={true} tick={{ fontSize: 14,  color:"black" , fontWeight: 500}} tickCount={5} domain={[1, barChartData.length]} />
              <Tooltip cursor={{ fill: "rgba(0, 0, 0, 0.1)" }} />
              <Legend />
              
              <Bar 
                dataKey="count" 
                fill={`url(#${currentGradient})`} 
                onClick={handleBarClick}
              >
                <LabelList 
                  dataKey="count" 
                  position="top" 
                  offset={5} 
                  style={{ fontSize: "12px", fontWeight: "bold" }} 
                />
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={handleCloseDialog}
            sx={{
              backgroundColor: "red",
              color: "white",
              "&:hover": {
                backgroundColor: "#b30000",
              },
            }}
          >
            Close
          </Button>
        </DialogActions>
      </Dialog>

      {/* Table Dialog */}
      <TableDialog
        open={openTableDialog}
        handleClose={() => setOpenTableDialog(false)}
        data={tableData || {}}
      />
    </>
  );
};

export default DataDialog;