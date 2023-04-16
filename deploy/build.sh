#!/bin/bash

echo "Deployment started"

# Navigate to the project directory
cd ..

# Stop the budgeta processes if any
pm2 stop budgeta-ui
pm2 stop budgeta-sdk-api

# Install dependencies for the react ui
cd ui || exit
npm install

# Build the react ui
npm run build

# Remove the node_modules folder from the react ui directory
rm -rf node_modules

# Build the java sdk-api
cd ../sdk-api || exit
mvn clean install

# Navigate back to the project directory
cd ..

# Start the java sdk-api using pm2
pm2 start deploy/spring.sh --name budgeta-sdk-api # --watch

# Start the react ui using pm2
pm2 start deploy/server.js --name budgeta-ui # --watch

echo "Deployment complete"