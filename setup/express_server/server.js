const express = require('express');
const path = require('path');
const cors = require('cors');
const fs = require('fs');

const app = express();

// Enable CORS
app.use(cors());

const distPath = process.env.BUDGETA_UI_DIST_PATH || path.join(__dirname, '../../ui/dist');

// Serve the static files from the dist directory
app.use(express.static(distPath));

// Serve the index.html file for all routes
app.get('*', (req, res) => {
  // Extract the path requested by the client
  const requestedPath = req.url;

  // Construct the absolute path to the file based on the requested path
  const filePath = path.join(distPath, requestedPath);
  console.log('requested path: ', filePath)
  // Check if the file exists
  fs.access(filePath, fs.constants.F_OK, (err) => {
    if (err) {
      // File does not exist, send the index.html file
      res.sendFile(path.join(distPath, 'index.html'));
    } else {
      // File exists, send the requested file
      res.sendFile(filePath);
    }
  });
});

// Start the server
const port = process.env.BUDGETA_UI_PORT || 3006;
app.listen(port, () => {
  console.log(`Server started on port ${port}`);
});
