const express = require("express");
const app = express();
const mongoose = require("mongoose");
require("dotenv").config();
const path = require("path");
const http = require('http').createServer(app);
const io = require('socket.io')(http);
const morgan = require("morgan");
const allRoutes = require("./routes/allRoutes");
const authRoute = require("./routes/authRoute");
const cors = require("cors");
const cookieparser = require("cookie-parser");



app.use(express.json());
app.use(cookieparser());
app.use(morgan("dev"));
app.use(cors()); 
console.log('===============================================>'+(path.join(__dirname, "uploads")))
app.use(express.static(path.join(__dirname, "uploads")));
app.use("/api/user", authRoute);
app.use("/proxy", allRoutes);

io.on('connection', (socket) => {
  console.log('new');
  socket.on('message', msg => {
    console.log(msg);
    io.emit('incoming-msg', msg);
  });

})

mongoose
  .connect(process.env.DB_CONNECTION_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Connection to MongoDB cluster successfull !");
  })
  .catch((err) => {
    console.log("Error connecting to MongoDB cluster !");
  });
/*
app.use(express.static(path.join(__dirname, "frontend", "build")));
app.get("*", async (req, res) => {
  res.sendFile(path.resolve(__dirname, "frontend", "build", "index.html"));
});
*/
const port = process.env.PORT || 5000;



http.listen(port, () => {
  console.log("Server up and running! ");
});
