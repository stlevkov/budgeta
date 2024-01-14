const express = require('express');
const path = require('path');
const cors = require('cors');

const app = express();

// Enable CORS
app.use(cors());

const distPath = process.env.BUDGETA_UI_DIST_PATH || path.join(__dirname, '../../ui/dist');
const distIndex = process.env.BUDGETA_UI_DIST_PATH || path.join(__dirname, '../ui/dist', 'index.html');

// Serve the static files from the dist directory
app.use(express.static(distPath));

// Serve the index.html file for all other requests
app.get('*', (req, res) => {
  res.sendFile(distIndex);
});

// Start the server
const port = process.env.BUDGETA_UI_PORT || 3006;
app.listen(port, () => {
  console.log(`Server started on port ${port}`);
});
