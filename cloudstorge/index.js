const express = require("express");
const fs = require("fs");
const path = require("path");
const basicAuth = require("express-basic-auth");

const app = express();

// Username and password for authentication
const AUTH_USERNAME = "draw";
const AUTH_PASSWORD = "draw123";

// Basic authentication middleware
const authMiddleware = basicAuth({
  users: { [AUTH_USERNAME]: AUTH_PASSWORD },
  challenge: true,
  unauthorizedResponse: "Unauthorized",
});

app.use(authMiddleware);

// Custom middleware for logging request information
app.use((req, res, next) => {
  const now = new Date();
  console.log(`[${now.toLocaleString()}] ${req.method} ${req.url}`);
  next();
});

// Serve static files from a directory
app.use(
  "/draw",
  authMiddleware,
  express.static(path.join(__dirname, "public")),
);

// Enable CORS
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*"); // Replace * with your allowed origins
  res.setHeader("Access-Control-Allow-Methods", "GET, PUT, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Authorization, Content-Type");
  next();
});

app.options("*", (req, res) => {
  res.sendStatus(200);
});

app.put("*", express.text(), (req, res) => {
  const { url, body } = req;
  const filePath = path.join(__dirname, url);

  // Check if the directory exists, create if not
  const directoryPath = path.dirname(filePath);
  if (!fs.existsSync(directoryPath)) {
    fs.mkdirSync(directoryPath, { recursive: true });
  }

  fs.writeFile(filePath, body, "utf8", (err) => {
    if (err) {
      res.status(500).send("Error writing to file");
    } else {
      res.status(201).send("File written successfully");
    }
  });
});

app.get("*", (req, res) => {
  const { url } = req;
  const filePath = path.join(__dirname, url);

  fs.readFile(filePath, "utf8", (err, data) => {
    if (err) {
      res.status(404).send("File not found");
    } else {
      res.setHeader("Content-Type", "application/octet-stream");
      res.status(200).send(data);
    }
  });
});

const PORT = 4000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
