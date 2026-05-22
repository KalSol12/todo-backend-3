const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");

const connectDB = require("./config/db");

const todoRoutes = require("./routes/todoRoutes");
const authRoutes = require("./routes/authRoutes");

// LOAD ENV VARIABLES
dotenv.config();

// CONNECT DATABASE
connectDB();

const app = express();

// MIDDLEWARE
app.use(cors({
  origin: [
    "http://localhost:5173",
    "https://todo-app-3-eoyg.onrender.com"
  ],
  credentials: true
}));

app.use(express.json());

// ROUTES
app.use("/api/auth", authRoutes);

app.use("/api/todos", todoRoutes);

// TEST ROUTE
app.get("/", (req, res) => {
  res.send("Todo API Running 🚀");
});

// PORT
const PORT = process.env.PORT || 5000;

// START SERVER
app.listen(PORT, () => {

  console.log(
    `Server running on port ${PORT}`
  );

});