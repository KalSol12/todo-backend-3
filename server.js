const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const os = require("os");

const connectDB = require("./config/db");
const todoRoutes = require("./routes/todoRoutes");
const authRoutes = require("./routes/authRoutes");

dotenv.config();

connectDB();

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/todos", todoRoutes);

app.get("/", (req, res) => {
  res.send("Todo API Running 🚀");
});

const PORT = process.env.PORT || 5000;
const HOST = "0.0.0.0";

function getLocalIP() {
  for (const interfaces of Object.values(os.networkInterfaces())) {
    for (const iface of interfaces) {
      if (iface.family === "IPv4" && !iface.internal) {
        return iface.address;
      }
    }
  }
  return "localhost";
}

app.listen(PORT, HOST, () => {
  const lanIP = getLocalIP();
  console.log(`Server running on port ${PORT}`);
  console.log(`  Local:   http://localhost:${PORT}`);
  console.log(`  Network: http://${lanIP}:${PORT}  (share this IP with others on your Wi-Fi)`);
});