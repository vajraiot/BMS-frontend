import { Box, IconButton, useTheme } from "@mui/material";
import { useContext, useState } from "react";
import { ColorModeContext, tokens } from "../../theme";
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import LightModeOutlinedIcon from "@mui/icons-material/LightModeOutlined";
import DarkModeOutlinedIcon from "@mui/icons-material/DarkModeOutlined";
import NotificationsOutlinedIcon from "@mui/icons-material/NotificationsOutlined";
import LogoutOutlinedIcon from "@mui/icons-material/LogoutOutlined";
import PersonOutlinedIcon from "@mui/icons-material/PersonOutlined";
import SearchIcon from "@mui/icons-material/Search";
import { useNavigate } from "react-router-dom";
import deadline from "../../data/icons/deadline.png";
import { AppContext } from "../../services/AppContext";
import { fetchManufacturerDetails, fetchDeviceDetails } from "../../services/apiService";

const Topbar = ({ onLogout, vendorName, locationName = "" }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const colorMode = useContext(ColorModeContext);
  const navigate = useNavigate();

  const {
    siteOptions,
    serialNumberOptions,
    siteId,
    serialNumber,
    setSiteId,
    setSerialNumber,
    setData,
    setMdata,
    setCharger,
    liveTime,
    setLiveTime,
    charger,
    data,setLocation
  } = useContext(AppContext);


  const [errors, setErrors] = useState({
    siteId: false,
    serialNumber: false,
  });

  const handleSearch = async () => {
    if (siteId && serialNumber) {
      try {
        // Clear previous data
        setMdata(null); // Clear previous manufacturer details
        setData([]);    // Clear previous device data
        setCharger([]); // Clear previous charger data

        // Fetch manufacturer details
        const manufacturerDetails = await fetchManufacturerDetails(siteId, serialNumber);
        setMdata(manufacturerDetails); // Store manufacturer details

        // Fetch device details
        const deviceResponse = await fetchDeviceDetails(siteId, serialNumber);
        const{chargerMonitoringData,deviceData,packetDateTime}=deviceResponse
        console.log(chargerMonitoringData[0],packetDateTime+" actual response")
        setData(deviceData); // Store device data
        setLiveTime(packetDateTime)
        setCharger(chargerMonitoringData); // Store charger data
        console.log(chargerMonitoringData+" charger response")

        if (deviceResponse && deviceResponse.deviceData) {
   
         
        }
       
        if (deviceResponse ) {
         
        }
        const selectedSite = siteOptions.find((site) => site.siteId ===siteId);
        setLocation(selectedSite.siteLocation)
        // Return the fetched data for further usage
        return deviceResponse;
      } catch (error) {
        console.error("Error during search:", error);
      }
    } else {
      console.error("Please select both Site ID and Serial Number.");
    }
  };

 

  function convertOwlDatetimeToCustomDate(dateString) {
    if (dateString == null || dateString == "") {
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

  return (
    <Box
      display="grid"
      gridTemplateColumns="repeat(3,auto)"
      gridTemplateRows="auto "
      p={2}
     >
      {/* Search Options */}
      <Box
        display="grid"
        gridTemplateColumns="repeat(3, auto)"
        gap={2}
        sx={{ marginRight: 2 }}
       >
        <Autocomplete
            disablePortal
            disableClearable
            options={siteOptions.map((site) => site.siteId)}
            value={siteId}
            onChange={(event, newValue) => setSiteId(newValue)}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Substation ID"
                error={!!errors.siteId}
                helperText={errors.siteId ? "Please enter Substation ID" : ""}
                InputLabelProps={{
                  sx: {
                    fontWeight: "bold",
                  },
                }}
                fullWidth
                sx={{
                  "& .MuiInputBase-root": {
                    fontWeight: "bold",
                    height: "40px",
                    marginTop: "5px",
                  },
                }}
              />
            )}
            sx={{ width: 200 }}
          />
          <Autocomplete
            disablePortal
            disableClearable
            options={serialNumberOptions}
            value={serialNumber}
            onChange={(event, newValue) => setSerialNumber(newValue)}
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
                    height: "40px",
                    marginTop: "5px",
                  },
                }}
              />
            )}
            sx={{ width: 200 }}
          />

          

        <IconButton onClick={handleSearch}>
          <SearchIcon />
        </IconButton>
      </Box>

      {/* Location and Time */}
      <Box
        display="grid"
        gridTemplateColumns="repeat(3, auto)"
        gap="10px"
        paddingTop="5px"
        marginLeft="0px"
      >
        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          sx={{
            border: "1px solid",
            borderColor: colors.grey[500],
            borderRadius: "4px",
            height: "40px",
            width: "150px",
          }}
        >
          {locationName.name}
        </Box>
        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          sx={{
            border: "1px solid",
            borderColor: colors.grey[500],
            borderRadius: "4px",
            height: "40px",
            width: "150px",
          }}
        >
          {convertOwlDatetimeToCustomDate(liveTime)}
        </Box>
        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          sx={{
            border: "1px solid",
            borderColor: colors.grey[500],
            borderRadius: "4px",
            height: "40px",
            width: "150px",
          }}
        >
          <IconButton>
            <PersonOutlinedIcon />
          </IconButton>
          {vendorName}
        </Box>
      </Box>

      {/* Icons */}
      <Box
        display="flex"
        justifyContent="flex-end"
        alignItems="center"
        marginLeft="10px"
      >
      
      </Box>
    </Box>
  );
};

export default Topbar;