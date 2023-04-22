#!/bin/bash

SCRIPT_DIR=$( cd -- "$( dirname -- "${BASH_SOURCE[0]}" )" &> /dev/null && pwd )

echo "Deployment started"

# Stop the budgeta processes if any
pm2 stop budgeta-ui
pm2 stop budgeta-sdk-api

# Install dependencies for the react ui
cd "$SCRIPT_DIR"/../ui || exit
npm install

# Build the react ui
npm run build

# Remove the node_modules folder from the react ui directory
rm -rf node_modules

# Install dependencies for the express server
cd "$SCRIPT_DIR"/../setup/express_server || exit
npm install

# Build the java sdk-api
cd "$SCRIPT_DIR"/../sdk-api || exit
mvn clean install

# Start the java sdk-api using pm2
pm2 start "$SCRIPT_DIR"/../setup/spring.sh --name budgeta-sdk-api --update-env # --watch

# Start the react ui using pm2
pm2 start "$SCRIPT_DIR"/../setup/express_server/server.js --name budgeta-ui --update-env # --watch

echo "Deployment complete"