import React, { useState, useEffect, useContext } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import { fetchCommunicationStatus } from "../../services/apiService";
import DataDialog from "./DataDialog"
import DataDialogComm from"./DataDialogComm"
import PieChartComponent2 from './PieChartComponent2';
import PieChartComponent from './PieChartComponent';
import MapComponent from './MapComponent';
import {Box,Grid,} from "@mui/material";
import "leaflet/dist/leaflet.css";
import DashBoardBar from "../Dashboard/DashBoardBar/DashBoardBar";
import { AppContext } from "../../services/AppContext";



const Dashboard = () => {
  const [selectedStatus, setSelectedStatus] = useState(null);
  const [selectedcategory, setSelectedcategory] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const { data = [],mapMarkers, setMapMarkers } = useContext(AppContext);
  const [data1, setData1] = useState([]);
  const [data2, setData2] = useState([]);
  const [marginMinutes, setMarginMinutes] = useState(60);
  // const [mapMarkers, setMapMarkers] = useState([]);
  const [columns, setColumns] = useState([]);
  const [rows, setRows] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [siteId, setSiteId] = useState(''); 
  const [barChartData, setBarChartData] = useState([]);


  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch communication status data
        const data = await fetchCommunicationStatus(marginMinutes);
        console.log("Fetched Communication Data:", data);

        let communicatingCount = 0;
        let nonCommunicatingCount = 0;


        let MostCriticalCount = 0;
        let CriticalCount = 0;
        let MajorCount = 0;
        
        let MinorCount = 0;
        const markers = [];

        data.forEach((item) => {
          
          if (item.statusType === 1) communicatingCount++;
          else if (item.statusType === 0) nonCommunicatingCount++;

          const MostCriticalConditions = item?.generalDataDTO?.deviceDataDTO?.[0]?.bmsAlarmsDTO;
          const ChargerMonitoringMostCritical = item?.generalDataDTO?.chargerMonitoringDTO?.[0]?.chargerDTO;
          
          if (MostCriticalConditions || ChargerMonitoringMostCritical) {
            if (
              MostCriticalConditions?.stringVoltageLNH === 0 ||      // String Voltage Low
              MostCriticalConditions?.cellVoltageLNH === 0 ||        // Cell Voltage Low
              MostCriticalConditions?.socLN === true ||              // SOC Low
              MostCriticalConditions?.batteryCondition === true ||   // Battery Open
              ChargerMonitoringMostCritical?.chargerTrip === true    // Charger Trip
            ) {
              MostCriticalCount++;
            }
          }
          
          console.log(MostCriticalCount);
          

          const CriticalConditions = item?.generalDataDTO?.deviceDataDTO?.[0]?.bmsAlarmsDTO;
          const ChargerMonitoringCritical = item?.generalDataDTO?.chargerMonitoringDTO?.[0]?.chargerDTO;
          
          if (CriticalConditions || ChargerMonitoringCritical) {
            if (
              CriticalConditions?.stringVoltageLNH === 2 ||              // String Voltage High
              CriticalConditions?.cellVoltageLNH === 2 ||                // Cell Voltage High
              CriticalConditions?.stringCurrentHN === true ||            // String Current High
              ChargerMonitoringCritical?.inputMains === true ||          // Input Mains Failure
              ChargerMonitoringCritical?.inputPhase === true ||          // Input Phase Failure
              ChargerMonitoringCritical?.rectifierFuse === true ||       // Rectifier Fuse Failure
              ChargerMonitoringCritical?.filterFuse === true ||          // Filter Fuse Failure
              ChargerMonitoringCritical?.outputMccb === true ||          // Output MCCB Failure
              ChargerMonitoringCritical?.batteryCondition === true ||    // Battery Condition Failure
              ChargerMonitoringCritical?.inputFuse === true ||           // Input Fuse Failure
              ChargerMonitoringCritical?.acVoltageULN === 2              // AC Voltage Abnormal
            ) {
              CriticalCount++;
            }
          }
          
          console.log(CriticalCount);
          

          const MajorConditions = item?.generalDataDTO?.deviceDataDTO?.[0]?.bmsAlarmsDTO;
          const ChargerMonitoring = item?.generalDataDTO?.chargerMonitoringDTO?.[0]?.chargerDTO;
          
          if (MajorConditions || ChargerMonitoring) {
            const isMajorCondition =
              MajorConditions?.ambientTemperatureHN === true ||  // Ambient Temperature High
              MajorConditions?.cellCommunication === true ||     // Cell Communication Failure
              ChargerMonitoring?.dcVoltageOLN === 2 ||           // DC Over Voltage Detection
              ChargerMonitoring?.dcVoltageOLN === 0 ||           // DC Under Voltage Detection
              ChargerMonitoring?.acVoltageULN === 0 ||           // AC Under Voltage Detection
              ChargerMonitoring?.outputFuse === true;            // Output Fuses Failure Detection
          
            if (isMajorCondition) {
              MajorCount++;
            }
          }
   
          const MinorConditions = item?.generalDataDTO?.deviceDataDTO?.[0]?.bmsAlarmsDTO;
          const ChargerMonitoringMinor = item?.generalDataDTO?.chargerMonitoringDTO?.[0]?.chargerDTO;
          
          if (MinorConditions || ChargerMonitoringMinor) {
            const isMinorCondition =
              MinorConditions?.bankDischargeCycle === true ||      // Battery Status (Discharging)
              MinorConditions?.bmsSedCommunication === true || // String Communication
              MinorConditions?.cellTemperatureHN === true ||   // Cell Temperature High
              MinorConditions?.buzzer === true ||              // Buzzer Alarm
              ChargerMonitoringMinor?.chargerLoad === true ||  // Charger Load Detection
              ChargerMonitoringMinor?.alarmSupplyFuse === true 
              ChargerMonitoringMinor?.testPushButton === true 
              ChargerMonitoringMinor?.resetPushButton === true 
              // Alarm Supply Fuse Detection
          
            if (isMinorCondition) {
              MinorCount++;
            }
          }
        // Add marker data for map
          if (item.siteLocationDTO) {
            const { latitude, longitude, area ,vendorName} = item.siteLocationDTO;
            if (latitude && longitude) {
              markers.push({
                lat: latitude,
                lng: longitude,
                name: area || "Unnamed Site",
                vendor:vendorName ,
                statusType: item.statusType ,
                 // Add the statusType here
              });
            }
          }
          console.log("Marker Data:", markers);
        });

        // Set the transformed data for the first set of stats
        setData1([
          { name: "Communicating", value: communicatingCount },
          { name: "Non-Communicating", value: nonCommunicatingCount },
        ]);

        // Set the transformed data for the second set of stats
        setData2([
          { name: "Most Critical Count", value: MostCriticalCount },
          { name: "Critical Count", value: CriticalCount },
          { name: "Major Count", value: MajorCount },
          { name: "Minor Count", value: MinorCount },
        ]);

        // Update map markers
        setMapMarkers(markers);
      

      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [marginMinutes]); 

  const handlePieClick = async (data) => {
    // Set the selected status and open the dialog
    setSelectedStatus(data.name);
    setOpenDialog(true);
  
    // Initialize alarm counts
    const alarmCounts = {
      stringVoltageLNH: 0,
      cellVoltageLNH: 0,
      socLN: 0,
      batteryCondition: 0,
      chargerTrip: 0,
      stringVoltageLNHHigh: 0,
      cellVoltageLNHHigh: 0,
      stringCurrentHN: 0,
      inputMains: 0,
      inputPhase: 0,
      rectifierFuse: 0,
      filterFuse: 0,
      outputMccb: 0,
      inputFuse: 0,
      acVoltageULN: 0,
      ambientTemperatureHN: 0,
      cellCommunication: 0,
      dcVoltageOLN: 0,
      acVoltageOLN: 0,
      buzzer: 0,
      chargerLoad: 0,
      alarmSupplyFuse: 0,
      testPushButton: 0,
      resetPushButton: 0,
    };
  
    // Helper function to filter data based on conditions
    const filterData = (response, conditions) => {
      return response.filter((item) => {
        const bmsAlarms = item?.generalDataDTO?.deviceDataDTO?.[0]?.bmsAlarmsDTO;
        const chargerMonitoring = item?.generalDataDTO?.chargerMonitoringDTO?.[0]?.chargerDTO || {};
        return conditions(bmsAlarms, chargerMonitoring);
      });
    };
  
    // Helper function to generate chart data
    const generateChartData = (filteredData, alarmType, condition) => {
      const count = filteredData.filter((item) => condition(item)).length;
      const details = filteredData
        .filter((item) => condition(item))
        .map((item) => ({
          siteId: item.siteId,
          serialNumber: item.generalDataDTO?.deviceDataDTO?.[0]?.serialNumber || "N/A", 
          cellsConnectedCount:item.generalDataDTO?.deviceDataDTO?.[0]?.cellsConnectedCount,
          stringvoltage: item.generalDataDTO?.deviceDataDTO?.[0]?.stringvoltage || "N/A",
          instantaneousCurrent:item.generalDataDTO?.deviceDataDTO?.[0]?.instantaneousCurrent,
          ambientTemperature:item.generalDataDTO?.deviceDataDTO?.[0]?.ambientTemperature,
          socLatestValueForEveryCycle:item.generalDataDTO?.deviceDataDTO?.[0]?.socLatestValueForEveryCycle,
          dodLatestValueForEveryCycle:item.generalDataDTO?.deviceDataDTO?.[0]?.dodLatestValueForEveryCycle,
          batteryRunHours:item.generalDataDTO?.deviceDataDTO?.[0]?.batteryRunHours,
        }));
      console.log("item", filteredData);
      return { name: alarmType, count, details };
    };
    try {
      const response = await fetchCommunicationStatus(marginMinutes);
      let filteredData;
      let chartData = [];
  
      // Define conditions and chart data generation logic for each case
      switch (data.name) {
        case 'Most Critical Count':
          filteredData = filterData(response, (bmsAlarms, chargerMonitoring) => (
            bmsAlarms?.stringVoltageLNH === 0 || // String Voltage Low
            bmsAlarms?.cellVoltageLNH === 0 || // Cell Voltage Low
            bmsAlarms?.socLN === true || // SOC Low
            bmsAlarms?.batteryCondition === true || // Battery Open
            chargerMonitoring?.chargerTrip === true
          ));
  
          chartData = [
            generateChartData(filteredData, "String(V) Low", (item) => item?.generalDataDTO?.deviceDataDTO?.[0]?.bmsAlarmsDTO?.stringVoltageLNH === 0),
            generateChartData(filteredData, "Cell(V) Low", (item) => item?.generalDataDTO?.deviceDataDTO?.[0]?.bmsAlarmsDTO?.cellVoltageLNH === 0),
            generateChartData(filteredData, "SOC Low", (item) => item?.generalDataDTO?.deviceDataDTO?.[0]?.bmsAlarmsDTO?.socLN === true),
            generateChartData(filteredData, "Battery Open", (item) => item?.generalDataDTO?.deviceDataDTO?.[0]?.bmsAlarmsDTO?.batteryCondition === true),
            generateChartData(filteredData, "Charger Trip", (item) => item?.generalDataDTO?.chargerMonitoringDTO?.[0]?.chargerDTO?.chargerTrip === true),
          ];
          break;
  
        case 'Critical Count':
          filteredData = filterData(response, (bmsAlarms, chargerMonitoring) => (
            bmsAlarms?.stringVoltageLNH === 2 || // String Voltage High
            bmsAlarms?.cellVoltageLNH === 2 || // Cell Voltage High
            bmsAlarms?.stringCurrentHN === true || // String Current High
            chargerMonitoring?.inputMains === true || // Input Mains Failure
            chargerMonitoring?.inputPhase === true || // Input Phase Failure
            chargerMonitoring?.rectifierFuse === true || // Rectifier Fuse Failure
            chargerMonitoring?.filterFuse === true || // Filter Fuse Failure
            chargerMonitoring?.outputMccb === true || // Output MCCB Failure
            chargerMonitoring?.inputFuse === true || // Input Fuse Failure
            chargerMonitoring?.acVoltageULN === 2
          ));
  
          chartData = [
            generateChartData(filteredData, "String(V) High", (item) => item?.generalDataDTO?.deviceDataDTO?.[0]?.bmsAlarmsDTO?.stringVoltageLNH === 2),
            generateChartData(filteredData, "Cell(V) High", (item) => item?.generalDataDTO?.deviceDataDTO?.[0]?.bmsAlarmsDTO?.cellVoltageLNH === 2),
            generateChartData(filteredData, "String(A) High", (item) => item?.generalDataDTO?.deviceDataDTO?.[0]?.bmsAlarmsDTO?.stringCurrentHN === true),
            generateChartData(filteredData, "Input Mains Fail", (item) => item?.generalDataDTO?.chargerMonitoringDTO?.[0]?.chargerDTO?.inputMains === true),
            generateChartData(filteredData, "Input Phase Fail", (item) => item?.generalDataDTO?.chargerMonitoringDTO?.[0]?.chargerDTO?.inputPhase === true),
            generateChartData(filteredData, "Rectifier Fuse Fail", (item) => item?.generalDataDTO?.chargerMonitoringDTO?.[0]?.chargerDTO?.rectifierFuse === true),
            generateChartData(filteredData, "Filter Fuse Fail", (item) => item?.generalDataDTO?.chargerMonitoringDTO?.[0]?.chargerDTO?.filterFuse === true),
            generateChartData(filteredData, "Output MCCB Fail", (item) => item?.generalDataDTO?.chargerMonitoringDTO?.[0]?.chargerDTO?.outputMccb === true),
            generateChartData(filteredData, "Input Fuse Fail", (item) => item?.generalDataDTO?.chargerMonitoringDTO?.[0]?.chargerDTO?.inputFuse === true),
            generateChartData(filteredData, "AC(V) ULN", (item) => item?.item?.generalDataDTO?.chargerMonitoringDTO?.[0]?.chargerDTO?.acVoltageULN === 2),
          ];
          break;
  
        case 'Major Count':
          filteredData = filterData(response, (bmsAlarms, chargerMonitoring) => (
            bmsAlarms?.ambientTemperatureHN === true || // Ambient Temperature High
            bmsAlarms?.cellCommunication === true || // Cell Communication Failure
            chargerMonitoring?.dcVoltageOLN === 2 || // DC Over Voltage Detection
            chargerMonitoring?.dcVoltageOLN === 0 || // DC Under Voltage Detection
            chargerMonitoring?.acVoltageULN === 0 || // AC Under Voltage Detection
            chargerMonitoring?.outputFuse === true // Output Fuse Failure
          ));
  
          chartData = [
            generateChartData(filteredData, "Ambient Temperature High", (item) => item?.generalDataDTO?.deviceDataDTO?.[0]?.bmsAlarmsDTO?.ambientTemperatureHN === true),
            generateChartData(filteredData, "Cell Communication Failure", (item) => item?.generalDataDTO?.deviceDataDTO?.[0]?.bmsAlarmsDTO?.cellCommunication === true),
            generateChartData(filteredData, "DC Over Voltage Detection", (item) => item?.generalDataDTO?.chargerMonitoringDTO?.[0]?.chargerDTO?.dcVoltageOLN === 2),
            generateChartData(filteredData, "DC Under Voltage Detection", (item) => item?.generalDataDTO?.chargerMonitoringDTO?.[0]?.chargerDTO?.dcVoltageOLN === 0),
            generateChartData(filteredData, "AC Under Voltage Detection", (item) =>item?.generalDataDTO?.chargerMonitoringDTO?.[0]?.chargerDTO?.acVoltageULN === 0),
            generateChartData(filteredData, "Output Fuse Failure", (item) =>item?.generalDataDTO?.chargerMonitoringDTO?.[0]?.chargerDTO?.chargerDTO?.outputFuse === true),
          ];
          break;
  
        case 'Minor Count':
          filteredData = filterData(response, (bmsAlarms, chargerMonitoring) => (
            bmsAlarms?.bmsSedCommunication === true || // Battery Status (Discharging)
            bmsAlarms?.stringCommunication === true || // String Communication
            bmsAlarms?.cellTemperatureHN === true || // Cell Temperature High
            bmsAlarms?.buzzer === true || // Buzzer Alarm
            chargerMonitoring?.chargerLoad === true || // Charger Load Detection
            chargerMonitoring?.alarmSupplyFuse === true || // Alarm Supply Fuse Failure
            chargerMonitoring?.testPushButton === true || // Test Push Button Pressed
            chargerMonitoring?.resetPushButton === true // Reset Push Button Pressed
          ));
  
          chartData = [
            generateChartData(filteredData, "Battery Status (Discharging)", (item) => item?.generalDataDTO?.deviceDataDTO?.[0]?.bmsAlarmsDTO?.bmsSedCommunication === true),
            generateChartData(filteredData, "String Communication", (item) => item?.generalDataDTO?.deviceDataDTO?.[0]?.bmsAlarmsDTO?.stringCommunication === true),
            generateChartData(filteredData, "Buzzer Alarm", (item) => item?.generalDataDTO?.deviceDataDTO?.[0]?.bmsAlarmsDTO?.buzzer === true),
            generateChartData(filteredData, "Charger Load Detection", (item) => item?.generalDataDTO?.chargerMonitoringDTO?.[0]?.chargerDTO?.chargerLoad === true),
            generateChartData(filteredData, "Alarm Supply Fuse Failure", (item) => item?.generalDataDTO?.chargerMonitoringDTO?.[0]?.chargerDTO?.alarmSupplyFuse === true),
            generateChartData(filteredData, "Test Push Button Pressed", (item) => item?.generalDataDTO?.chargerMonitoringDTO?.[0]?.chargerDTO?.testPushButton === true),
            generateChartData(filteredData, "Reset Push Button Pressed", (item) => item?.generalDataDTO?.chargerMonitoringDTO?.[0]?.chargerDTO?.resetPushButton === true),
          ];
          break;
  
        default:
          console.warn("Unknown status selected:", data.name);
          return;
      }
  
      // Update the bar chart with the generated data
      setBarChartData(chartData);
    } catch (error) {
      console.error("Error fetching communication status:", error);
    }
  };
  const handlePieClickCommu = (data) => { 
    // Set the selected status
    setSelectedcategory(data.name);
  
    // Open the dialog on pie chart slice click
    setOpenDialog(true);
  
    // Dynamically set columns for the dialog
    setColumns([
      { field: 'siteId', headerName: 'Site ID' },
      { field: 'statusType', headerName: 'Status' },
      { field: 'vendor', headerName: 'Vendor' },
      { field: 'location', headerName: 'Location' },
      { field: 'cellsConnectedCount', headerName: 'Cells Count' },
      { field: 'stringVoltage', headerName: 'String Voltage' },
      { field: 'instantaneousCurrent', headerName: 'Instantaneous Current' },
      { field: 'ambientTemperature', headerName: 'Ambient Temperature' },
      { field: 'batteryRunHours', headerName: 'Battery Run Hours' },
    ]);
  
    const fetchDataForStatus = async () => {
      try {
        const response = await fetchCommunicationStatus(marginMinutes);
        let filteredData = [];
  
        // Filter data based on the clicked slice (Communicating or Non-Communicating)
        switch (data.name) {
          case 'Communicating':
            filteredData = response.filter(item => item.statusType === 1); // statusType 1 = Communicating
            break;
          case 'Non-Communicating':
            filteredData = response.filter(item => item.statusType === 0); // statusType 0 = Non-Communicating
            break;
          default:
            filteredData = []; // No data for unknown status
        }
  
        // Map filtered data into table rows for dialog
        const newRows = filteredData.map((item) => ({
          siteId: item?.siteId || '--',
          statusType: item?.statusType === 1 ? 'Communicating' : 'Non-Communicating',
          vendor: item?.siteLocationDTO?.vendorName || '--',
          location: item?.siteLocationDTO?.area || '--',
          cellsConnectedCount: item?.generalDataDTO?.deviceDataDTO?.[0]?.cellsConnectedCount || 0,
          stringVoltage: item?.generalDataDTO?.deviceDataDTO?.[0]?.stringVoltage || 0,
          instantaneousCurrent: item?.generalDataDTO?.deviceDataDTO?.[0]?.instantaneousCurrent || 0,
          ambientTemperature: item?.generalDataDTO?.deviceDataDTO?.[0]?.ambientTemperature || 0,
          batteryRunHours: item?.generalDataDTO?.deviceDataDTO?.[0]?.batteryRunHours || 0,
        }));
  
        // Set rows for the table in the dialog
        setRows(newRows);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
  
    // Call the function to fetch data
    fetchDataForStatus();
  };
  
  
  


  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedStatus(null);
  };
  const handleOpenDialog = () => setOpenDialog(true);
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };
  const handleSearch = (newSiteId) => {
    setSiteId(newSiteId); // Update the siteId state when search is triggered
  };
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0); // Reset to first page when rows per page is changed
  };
  // Gradient colors for pie charts
  const COLORS = ['#28a745', '#f39c12', '#17a2b8', '#6c757d', '#007bff', '#d9534f'];

  return (
    <Box className="dashboard-container" sx={{ padding: 1 ,
      border: '1px solid black',   // Adding black border
        
      boxShadow: '0px 0px 10px rgba(0,0,0,0.1)'  }}>
       <DashBoardBar onSearch={handleSearch} />
      <Grid container spacing={3}>
        {/* Left Side - Map */}
        <Grid item xs={12} md={7}>
        <MapComponent mapMarkers={mapMarkers} />
        </Grid>

        {/* Right Side - Pie Charts */}
        <Grid item xs={12} md={5}>
            <Grid container spacing={1} direction="column" alignItems="center" >
              {/* Communication Status Pie Chart */}
              <Grid item>
              <PieChartComponent2 data1={data1} handlePieClick={handlePieClickCommu} />
              </Grid>

              {/* BMS Alarms Pie Chart */}
              <Grid item>
              <PieChartComponent data2={data2} handlePieClick={handlePieClick} />
                </Grid>

            </Grid>
        
        </Grid>
      </Grid>

    

      <DataDialog
        openDialog={openDialog}
        handleCloseDialog={handleCloseDialog}
        selectedStatus={selectedStatus}
        barChartData={barChartData}
      />
 {/* <DataDialogComm 
        openDialog={openDialog}
        handleCloseDialog={handleCloseDialog}
        selectedcategory={selectedcategory}
        columns={columns}
        rows={rows}
        page={page}
        rowsPerPage={rowsPerPage}
        handleChangePage={handleChangePage}
        handleChangeRowsPerPage={handleChangeRowsPerPage}
      />  */}
    </Box>
  );
};

export default Dashboard;
