if (process.env.NODE_ENV !== "production") {
      require("dotenv").config();
}

const express = require('express');
const mongoose = require('mongoose');
const puppeteer = require('puppeteer');
const path = require('path');
const fs = require('fs');
const ejsMate = require('ejs-mate');
const EmailTemplate = require('./models/EmailBuilder');
const upload = require('./cloudConfig');
const EmailBuilder = require('./router/emailBuilder');
const ejs = require('ejs');

const app = express();
const port = process.env.PORT || 8080;

// Middleware
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));
app.engine("ejs", ejsMate);
let mongodb_uri = process.env.MONGODB_URI;
// MongoDB Connection
mongoose
      .connect(mongodb_uri)
      .then(() => console.log('Connected to MongoDB'))
      .catch((err) => console.error('Error connecting to MongoDB:', err));

// Default Route
app.get('/', (req, res) => {
      res.redirect('/getEmailLayout');
});
app.use('/', EmailBuilder);
app.use("*", (req, res) => {
      res.send("Page Not Found");
});
app.listen(port, () => {
      console.log(`Server is running on port ${port}`);
});
