import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import cors from 'cors';
import fs from 'fs';

const distDir = process.env.BUDGETA_UI_DIST_PATH || '../../ui/dist';
const port = process.env.BUDGETA_UI_PORT || 3006;
const app = express();


console.log('[Server] dist path from env: ', distDir);

if(!fs.existsSync(distDir)) {
  console.log('[Server] Unable to start. Did you forget to build dist? Try with \'npm run build\'.');
  process.exit(1);
}

// Enable CORS
app.use(cors());

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const distPath = path.join(__dirname, distDir);

// Serve the static files from the dist directory
app.use(express.static(distPath));

app.get('*', (req, res) => {
  console.log('[Server] Receiving req path: ', req.url)
  res.sendFile(path.join(__dirname, distDir + '/index.html'), (err) => { // found
      if(err) { // not found
        console.log('[Error] path not found, navigating to index. Reason: ', err)
        res.sendFile(path.join(__dirname, distDir + '/error.html')); 
      }
  });
});

// Start the server

app.listen(port, () => {
  console.log(`[Server] started on port ${port}`);
});