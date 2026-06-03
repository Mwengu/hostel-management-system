import React, { useEffect, useState } from "react";
import axios from "axios";

function Dashboard() {
  // ================= STATE =================
  const [rooms, setRooms] = useState([]);

  const [room_number, setRoomNumber] = useState("");
  const [type, setType] = useState("");
  const [price, setPrice] = useState("");
  const [status, setStatus] = useState("available");

  const [file, setFile] = useState(null);

  // ================= LOGOUT =================
  const logout = () => {
    localStorage.removeItem("token");
    window.location.reload();
  };

  // ================= FETCH ROOMS =================
  const fetchRooms = async () => {
    try {
      const res = await axios.get("http://localhost:5000/rooms");
      setRooms(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchRooms();
  }, []);

  // ================= ADD ROOM =================
  const addRoom = async () => {
    try {
      await axios.post("http://localhost:5000/rooms", {
        room_number,
        type,
        price,
        status,
      });

      setRoomNumber("");
      setType("");
      setPrice("");
      setStatus("available");

      fetchRooms();
    } catch (err) {
      console.log(err);
    }
  };

  // ================= DELETE ROOM =================
  const deleteRoom = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/rooms/${id}`);
      fetchRooms();
    } catch (err) {
      console.log(err);
    }
  };

  // ================= FILE UPLOAD =================
  const uploadFile = async () => {
    const formData = new FormData();
    formData.append("file", file);

    try {
      await axios.post("http://localhost:5000/upload", formData);
      alert("File uploaded successfully");
    } catch (err) {
      console.log(err);
    }
  };

  // ================= CALCULATIONS =================
  const totalRooms = rooms.length;
  const availableRooms = rooms.filter(r => r.status === "available").length;
  const occupiedRooms = rooms.filter(r => r.status === "occupied").length;

  return (
    <div style={{
      padding: "20px",
      fontFamily: "Arial",
      background: "#f4f6f8",
      minHeight: "100vh"
    }}>

      {/* NAVBAR */}
      <div style={{
        background: "#1976d2",
        color: "white",
        padding: "15px",
        marginBottom: "20px",
        borderRadius: "8px"
      }}>
        <h2>Hostel Management System</h2>
      </div>

      {/* LOGOUT */}
      <button
        onClick={logout}
        style={{
          marginBottom: "20px",
          padding: "10px",
          background: "red",
          color: "white",
          border: "none",
          borderRadius: "5px",
          cursor: "pointer"
        }}
      >
        Logout
      </button>

      {/* STATS */}
      <div style={{ display: "flex", gap: "20px", marginBottom: "20px" }}>

        <div style={{
          background: "#fff",
          padding: "20px",
          width: "200px",
          borderRadius: "10px",
          boxShadow: "0 2px 8px rgba(0,0,0,0.1)"
        }}>
          <h3>Total Rooms</h3>
          <p>{totalRooms}</p>
        </div>

        <div style={{
          background: "#fff",
          padding: "20px",
          width: "200px",
          borderRadius: "10px",
          boxShadow: "0 2px 8px rgba(0,0,0,0.1)"
        }}>
          <h3>Available</h3>
          <p>{availableRooms}</p>
        </div>

        <div style={{
          background: "#fff",
          padding: "20px",
          width: "200px",
          borderRadius: "10px",
          boxShadow: "0 2px 8px rgba(0,0,0,0.1)"
        }}>
          <h3>Occupied</h3>
          <p>{occupiedRooms}</p>
        </div>

      </div>

      {/* ADD ROOM */}
      <h2>Add Room</h2>

      <input
        placeholder="Room Number"
        value={room_number}
        onChange={(e) => setRoomNumber(e.target.value)}
      />

      <input
        placeholder="Type"
        value={type}
        onChange={(e) => setType(e.target.value)}
      />

      <input
        placeholder="Price"
        value={price}
        onChange={(e) => setPrice(e.target.value)}
      />

      <select value={status} onChange={(e) => setStatus(e.target.value)}>
        <option value="available">Available</option>
        <option value="occupied">Occupied</option>
      </select>

      <button onClick={addRoom}>Add Room</button>

      {/* UPLOAD */}
      <h2 style={{ marginTop: "20px" }}>Upload File</h2>

      <input type="file" onChange={(e) => setFile(e.target.files[0])} />
      <button onClick={uploadFile}>Upload</button>

      {/* ROOMS TABLE */}
      <h2 style={{ marginTop: "20px" }}>Rooms</h2>

      <table border="1" cellPadding="10" style={{ background: "white" }}>
        <thead>
          <tr>
            <th>ID</th>
            <th>Room Number</th>
            <th>Type</th>
            <th>Price</th>
            <th>Status</th>
            <th>Action</th>
          </tr>
        </thead>

        <tbody>
          {rooms.map(room => (
            <tr key={room.id}>
              <td>{room.id}</td>
              <td>{room.room_number}</td>
              <td>{room.type}</td>
              <td>{room.price}</td>
              <td>{room.status}</td>
              <td>
                <button
                  onClick={() => deleteRoom(room.id)}
                  style={{
                    background: "red",
                    color: "white",
                    border: "none",
                    padding: "5px",
                    borderRadius: "5px"
                  }}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

    </div>
  );
}

export default Dashboard;