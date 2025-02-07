import React, { useContext } from "react";
import { Box, Typography, Link } from "@mui/material";
import { ColorModeContext } from "../../theme"; // Import the ColorModeContext

const Footer = () => {
  const colorMode = useContext(ColorModeContext); // Access the colorMode from context

  return (
    <Box
      className="footer"
      style={{
        position: "absolute",
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: "#000",
        color: "#fff",
        textAlign: "center",
        justifyContent: "center",
        padding: "4px 0",
        display: "flex",
        width: "100%",
        alignItems: "center",
        flexDirection: "row",
        marginLeft:"200px",
        gap: "20px",
      }}
    >
      <Box style={{ display: "flex", gap: "10px", alignItems: "center" }}>
        {/* Facebook Icon */}
        <a href="https://facebook.com" target="_blank" rel="noopener noreferrer">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 40 40" width="20" height="20">
            <circle cx="20" cy="20" r="20" fill="#1877F2" />
            <path
              d="M26 20h-4v14h-6V20h-3v-5h3v-3c0-4 2-6 6-6h4v5h-2c-2 0-2 1-2 2v2h4z"
              fill="white"
            />
          </svg>
        </a>

        {/* Instagram Icon */}
        <a href="https://instagram.com" target="_blank" rel="noopener noreferrer">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 40 40" width="20" height="20">
            <circle cx="20" cy="20" r="20" fill="#E4405F" />
            <circle cx="20" cy="20" r="6" fill="none" stroke="white" strokeWidth="2" />
            <circle cx="27" cy="13" r="1.5" fill="white" />
            <rect
              x="10"
              y="10"
              width="20"
              height="20"
              rx="5"
              ry="5"
              fill="none"
              stroke="white"
              strokeWidth="2"
            />
          </svg>
        </a>

        {/* Twitter/X Icon */}
        <a href="https://twitter.com" target="_blank" rel="noopener noreferrer">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 40 40" width="20" height="20">
            <circle cx="20" cy="20" r="20" fill="#000" />
            <path d="M28 15l-4 4 4 4h-3l-5-5v5h-3V15h3v5l5-5z" fill="white" />
          </svg>
        </a>

        {/* LinkedIn Icon */}
        <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 40 40" width="20" height="20">
            <circle cx="20" cy="20" r="20" fill="#0A66C2" />
            <path
              d="M15 15h-3v12h3zm-1.5-2a1.5 1.5 0 100-3 1.5 1.5 0 000 3zm13.5 7c0-3-1-5-3.5-5-1.5 0-2.5.5-3 1.5V15h-3v12h3v-6c0-1 1-2 2-2s2 .5 2 2v6h3v-7z"
              fill="white"
            />
          </svg>
        </a>

        {/* Google Icon */}
        <a href="https://google.com" target="_blank" rel="noopener noreferrer">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 40 40" width="20" height="20">
            <circle cx="20" cy="20" r="20" fill="#DB4437" />
            <path
              d="M28 20h-8v3h5c-1 3-3 4-5 4-3 0-6-3-6-6s3-6 6-6c1.5 0 3 .5 4 1.5l2-2C24 13 22 12 20 12c-5 0-8 4-8 8s3 8 8 8c7 0 8-6 8-7z"
              fill="white"
            />
          </svg>
        </a>
      </Box>

      <Typography variant="body2">
        <Link
          href="https://www.vajraiot.com"
          target="_blank"
          rel="noopener noreferrer"
          color="primary"
        >
          Powered By Vajra IoT Pvt. Ltd.
        </Link>
      </Typography>
    </Box>
  );
};

export default Footer;
