const http = require("http");
const dotenv = require("dotenv");
const express = require("express");
const mongoose = require("mongoose");
dotenv.config({ path: "./config.env" });
const carRoute = require("./routes/carRoutes");
const viewRoute = require("./routes/viewRoutes");

const app = express();

app.use(express.json({ limit: "1mb" }));
app.use(express.urlencoded({ extended: true, limit: "1mb" }));

const DB = process.env.DATABASE.replace(
  "<PASSWORD>",
  process.env.DATABASE_PASSWORD
);

mongoose.connect(DB).then(() => {
  console.log("DB connection successful");
});

const port = process.env.PORT || 5000;

// app.get("/", (req, res) => {
//   //get requests to the root ("/") will route here
//   res.sendFile("/public/index.html", { root: __dirname }); //server responds by sending the index.html file to the client's browser
//   //the .sendFile method needs the absolute path to the file, see: https://expressjs.com/en/4x/api.html#res.sendFile
// });

app.use("/", viewRoute);
app.use("/api/v1/cars", carRoute);

app.listen(port, () => {
  console.log(`Now listening on port ${port}`);
});
