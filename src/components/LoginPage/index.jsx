import React, { useState, useEffect,useContext } from "react";
import Login from "../../assets/images/login.jpg"; // Import the image
import { fetchLoginRoles ,fetchLoginDetails } from "../../services/apiService";
import { Navigate } from "react-router-dom";
import { AppContext } from "../../services/AppContext";



const LoginPage = () => {
  const [role, setRole] = useState("");
  const [roles, setRoles] = useState([]); // Initialize roles as an empty array
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const {setIsAuthenticated ,isAuthenticated
  } = useContext(AppContext);

  const fetchRoles = async () => {
    try {
      const response = await fetch("http://122.175.45.16:51270/getListofLoginRoles");
      if (!response.ok) {
        throw new Error("Failed to fetch roles");
      }
      const data = await response.json();
      setRoles(data || []); // Ensure roles is an array
    } catch (error) {
      console.error("Error fetching roles:", error);
      alert("Failed to fetch roles. Please try again later.");
    }
  };
  
  useEffect(() => {
    fetchRoles();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    // Validate that all fields are filled
    if (!role || !username || !password) {
      alert("Please fill in all fields.");
      return;
    }
  
    try {
      // Call the login function from appService.js
      const data = await fetchLoginDetails(role, username, password);
      console.log("Login Response:", data);
  
      // Check if the response object is empty or has no success property
      if (!data || Object.keys(data).length === 0 ){
        alert("Invalid credentials. Please try again.");
      } else {
        alert("Login Successful!");
        setIsAuthenticated(true);
       <Navigate to="/"></Navigate>
      }
    } catch (error) {
      console.error("Error during login:", error);
      alert("An error occurred during login. Please try again.");
    }
  };
  

  const togglePasswordVisibility = () => {
    setShowPassword((prevState) => !prevState);
  };

  const styles = {
    background: {
      position: "fixed",
      top: 0,
      left: 0,
      width: "100%",
      height: "100%",
      backgroundImage: `url(${Login})`,
      backgroundSize: "150%", // Zoom-out effect
      backgroundPosition: "center",
      zIndex: -1,
    },
    backgroundShade: {
      position: "fixed",
      top: 0,
      left: 0,
      width: "100%",
      height: "100%",
      backgroundColor: "rgba(0, 0, 0, 0.5)", // Semi-transparent black overlay
      zIndex: 0,
    },
    wrapper: {
      width: "90%",
      maxWidth: "350px",
      padding: "20px",
      margin: "auto",
      border: "1px solid rgba(255, 255, 255, 0.2)",
      borderRadius: "15px",
      boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
      textAlign: "center",
      backgroundColor: "rgba(255, 255, 255, 0.1)", // Transparent effect
      backdropFilter: "blur(10px)", // Frosted glass effect
      zIndex: 1,
      position: "absolute",
      top: "50%",
      left: "50%",
      transform: "translate(-50%, -50%)", // Center the box
    },
    title: {
      marginBottom: "20px",
      fontSize: "24px",
      fontWeight: "bold",
      color: "#fff",
    },
    form: {
      display: "flex",
      flexDirection: "column",
      gap: "15px",
    },
    inputBox: {
      textAlign: "left",
    },
    label: {
      display: "block",
      marginBottom: "5px",
      fontSize: "14px",
      color: "#ddd",
    },
    input: {
      width: "100%",
      padding: "10px",
      fontSize: "16px",
      border: "1px solid #ccc",
      borderRadius: "4px",
      backgroundColor: "rgba(255, 255, 255, 0.8)",
      boxSizing: "border-box",
      outline: "none",
    },
    passwordContainer: {
      position: "relative",
      display: "flex",
      alignItems: "center",
    },
    showPasswordButton: {
      position: "absolute",
      right: "10px",
      background: "none",
      border: "none",
      cursor: "pointer",
      fontSize: "18px",
      color: "#666",
      outline: "none",
    },
    button: {
      padding: "12px",
      fontSize: "16px",
      backgroundColor: "#007BFF",
      color: "white",
      border: "none",
      borderRadius: "4px",
      cursor: "pointer",
      transition: "background-color 0.3s ease",
    },
  };

  return isAuthenticated ? (
    <Navigate to="/" /> // Redirect to home page on successful login
  ) : (
    <div>
      <div style={styles.background}></div>
      <div style={styles.backgroundShade}></div>
      <div style={styles.wrapper}>
        <h2 style={styles.title}>Login</h2>
        <form onSubmit={handleSubmit} style={styles.form}>
          <div style={styles.inputBox}>
            <label style={styles.label}>Role</label>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              required
              style={styles.input}
            >
              <option value="" disabled>
                Select your role
              </option>
              {/* Only map over roles if it's not empty */}
              {Array.isArray(roles) && roles.length > 0 ? (
                roles.map((roleOption, index) => (
                  <option key={index} value={roleOption}>
                    {roleOption}
                  </option>
                ))
              ) : (
                <option disabled>Loading roles...</option>
              )}
            </select>
          </div>
          <div style={styles.inputBox}>
            <label style={styles.label}>Username</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              style={styles.input}
            />
          </div>
          <div style={styles.inputBox}>
            <label style={styles.label}>Password</label>
            <div style={styles.passwordContainer}>
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                style={{ ...styles.input, paddingRight: "40px" }}
              />
              <button
                type="button"
                onClick={togglePasswordVisibility}
                style={styles.showPasswordButton}
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? "🙈" : "👁️"}
              </button>
            </div>
          </div>
          <button type="submit" style={styles.button}>
            Login
          </button>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
