import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { TextField, Button, Typography, Box, Container, Alert } from "@mui/material";
import "../../styles/SignIn.css";

const SignIn = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await axios.post("http://localhost:5000/api/auth/login", { email, password });

      // Store token and user data in local storage
      localStorage.setItem("token", response.data.token);
      localStorage.setItem("user", JSON.stringify(response.data.user));

      // Redirect user based on role
      const userRole = response.data.user.role; // Get role from backend

      if (userRole === "admin") {
        navigate("/admin-dashboard");
      } else if (userRole === "trainer") {
        navigate("/trainer-dashboard");
      } else if (userRole === "trainee") {
        navigate("/trainee-dashboard");
      } else {
        setError("Invalid user role. Please contact support.");
      }
    } catch (err) {
      setError(err.response?.data?.message || "Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    
    <Container maxWidth="sm" className="signin-container">
      <div className="signinbackground-overlay"></div>
      <Box className="signin-box">
        <Typography variant="h4" className="signin-title">Sign In</Typography>

        {error && <Alert severity="error">{error}</Alert>}

        <form className="signin-form" onSubmit={handleSubmit}>
          {/* Email Input */}
          <Box className="input-group">
            <TextField
              label="Email"
              type="email"
              variant="outlined"
              fullWidth
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </Box>

          {/* Password Input */}
          <Box className="input-group">
            <TextField
              label="Password"
              type="password"
              variant="outlined"
              fullWidth
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </Box>

          {/* Sign In Button */}
          <Button variant="contained" className="signin-btn" fullWidth type="submit" disabled={loading}>
            {loading ? "Signing In..." : "Sign In"}
          </Button>

          {/* Links */}
          <Typography variant="body2" className="signup-link">
            Don't have an account? <Link to="/create-account">Sign Up</Link>
          </Typography>

          
          <Typography variant="body2" className="forgot-password">
            <Link to="/forgot-password">Forgot Password?</Link>
          </Typography>
        </form>
      </Box>
    </Container>
  );
};

export default SignIn;
