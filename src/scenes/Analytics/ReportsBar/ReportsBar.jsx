import React, { useContext,useState } from "react";
import { AppContext } from "../../../services/AppContext";
import {
  Box,
  IconButton,
  TextField,
  Autocomplete,
  useTheme,
} from "@mui/material";
import {
  fetchHistoricalBatteryandChargerdetails,
  fetchDaywiseBatteryandChargerdetails,
  fetchAlarmsBatteryandChargerdetails,
} from "../../../services/apiService";
import { ColorModeContext, tokens } from "../../../theme.js";
import LightModeOutlinedIcon from "@mui/icons-material/LightModeOutlined";
import DarkModeOutlinedIcon from "@mui/icons-material/DarkModeOutlined";
import NotificationsOutlinedIcon from "@mui/icons-material/NotificationsOutlined";
import LogoutOutlinedIcon from "@mui/icons-material/LogoutOutlined";
import SearchIcon from "@mui/icons-material/Search";

const ReportsBar = ({ pageType }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const colorMode = useContext(ColorModeContext);

  const {
    siteOptions,
    serialNumberOptions,
    siteId,
    serialNumber,
    startDate,
    endDate,
    setSiteId,
    setSerialNumber,
    setStartDate,
    setEndDate,
    setData,
  } = useContext(AppContext);

  const [loadingReport, setLoadingReport] = useState(false);
  

  const handleSearch = async () => {
    if (siteId && serialNumber && startDate && endDate) {
      try {
        setLoadingReport(true);

        let result;
        switch (pageType) {
          case "historical":
            result = await fetchHistoricalBatteryandChargerdetails(
              serialNumber,
              siteId,
              startDate,
              endDate
            );
            break;

          case "daywise":
            result = await fetchDaywiseBatteryandChargerdetails(
              serialNumber,
              siteId,
              startDate,
              endDate
            );
            break;

          case "alarms":
            result = await fetchAlarmsBatteryandChargerdetails(
              serialNumber,
              siteId,
              startDate,
              endDate
            );
            break;

          default:
            throw new Error("Invalid page type");
        }

        setData(result); // Update report data
        setLoadingReport(false);
      } catch (error) {
        console.error("Error during search:", error);
        setLoadingReport(false);
      }
    } else {
      console.error("Please select all fields.");
    }
  };
  const renderHighlightedOption = (props, option, value) => (
    <li
      {...props}
      style={{
        backgroundColor: value === option ? "#d82b27" : "inherit",
        color: value === option ? "#ffffff" : "inherit",
      }}
    >
      {option}
    </li>
  );
  return (

    <Box display="grid" gridTemplateColumns="repeat(2, 1fr)" p={2} gap={2} >
      {/* Filters and Search Section */}
      <Box display="grid" gridTemplateColumns="repeat(5, 1fr)" gap={2} >
      <Autocomplete
          disablePortal
          disableClearable
          options={siteOptions.map((site) => site.siteId)}
          value={siteId}
          onChange={(event, newValue) => setSiteId(newValue)}
          renderOption={(props, option) =>
            renderHighlightedOption(props, option, siteId)
          }
          renderInput={(params) => (
            <TextField
              {...params}
              label="SubStation ID"
              InputLabelProps={{
                sx: {
                  fontWeight: "bold",
                },
              }}
              fullWidth
              sx={{
                "& .MuiInputBase-root": {
                  fontWeight: "bold",
                  height: "40px", // Adjust the height here
                  marginTop:'5px'
                },
              }}
            />
          )}
          sx={{ width: "150px" }}
        />

        {/* Serial Number */}
        <Autocomplete
          disablePortal
          disableClearable
          options={serialNumberOptions}
          value={serialNumber}
          onChange={(event, newValue) => setSerialNumber(newValue)}
          renderOption={(props, option) =>
            renderHighlightedOption(props, option, serialNumber)
          }
          renderInput={(params) => (
            <TextField
              {...params}
              label="Serial Number"
              InputLabelProps={{
                sx: {
                  fontWeight: "bold",
                },
              }}
              fullWidth
              sx={{
                "& .MuiInputBase-root": {
                  fontWeight: "bold",
                  height: "40px", // Adjust the height here
                  marginTop:'5px'
                },
              }}
            />
          )}
          sx={{ width: "150px" }}
        />

        <TextField
          label="Start Date"
          
          type="date"
          value={startDate?.split("%")[0] || ""}
          onChange={(e) => {
            const updatedDate = e.target.value + "%2000:00:00";
            setStartDate(updatedDate);
          }}
          fullWidth
              sx={{
                width: 200,
                "& .MuiInputBase-root": {
                  fontWeight: "bold",
                  height: "40px", // Adjust the height here
                  marginTop: "5px",
                },
                "& .MuiInputLabel-root": {
                  fontWeight: "bold",
                },
              }}
              InputLabelProps={{
                shrink: true,
              }}
        />

            <TextField
              label="End Date"
              type="date"
              value={endDate?.split("%")[0] || ""}
              onChange={(e) => setEndDate(e.target.value + "%2023:59:59")}
              fullWidth
              sx={{
                width: 200,
                "& .MuiInputBase-root": {
                  fontWeight: "bold",
                  height: "40px", // Adjust the height here
                  marginTop: "5px",
                },
                "& .MuiInputLabel-root": {
                  fontWeight: "bold",
                },
              }}
              InputLabelProps={{
                shrink: true,
              }}
            />


        <IconButton onClick={handleSearch} disabled={loadingReport}>
          <SearchIcon />
        </IconButton>
      </Box>

    
    </Box>
  );
};

export default ReportsBar;
