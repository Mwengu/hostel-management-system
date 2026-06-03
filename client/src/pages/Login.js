import React, { useState } from "react";
import axios from "axios";

function Login({ setToken }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post("http://localhost:5000/login", {
        email,
        password,
      });

      // SAVE TOKEN (IMPORTANT)
      localStorage.setItem("token", res.data.token);

      // UPDATE APP STATE
      if (setToken) {
        setToken(res.data.token);
      }

      alert("Login successful!");
      console.log(res.data);

    } catch (err) {
      alert(err.response?.data || "Login failed");
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h1>Hostel Management System</h1>
      <h2>Login</h2>

      <form onSubmit={handleLogin}>
        <input
          type="email"
          placeholder="Enter Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <br /><br />

        <input
          type="password"
          placeholder="Enter Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <br /><br />

        <button type="submit">Login</button>
      </form>
    </div>
  );
}

export default Login;