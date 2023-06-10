#!/bin/bash

SCRIPT_DIR=$( cd -- "$( dirname -- "${BASH_SOURCE[0]}" )" &> /dev/null && pwd )

# Check if running with root or sudo permissions
if [ "$EUID" -ne 0 ]; then
    echo "Root permissions are required to run this script."
    exit 1
fi

echo "Deployment started in $SCRIPT_DIR"

echo "Loading environment..."
source "$SCRIPT_DIR/systemd/env.sh"

JAR="budgeta.sdk.api-0.0.1-SNAPSHOT.jar"

# Check for /opt/budgeta folder, remove and recreate
BUDGETA_DIR="/opt/budgeta"
BUDGETA_DIR_UI="/opt/budgeta/ui"
BUDGETA_DIR_SDK="/opt/budgeta/sdk"
BUDGETA_DIR_DPL="/opt/budgeta/deployment"

rm -rf "/opt/budgeta"
mkdir -p "$BUDGETA_DIR_UI" "$BUDGETA_DIR_UI/dist" "$BUDGETA_DIR_SDK" "$BUDGETA_DIR_DPL"

# Stop the budgeta processes if any
echo "Stopping and removing any Budgeta systemd services..."
systemctl stop budgeta-ui && systemctl disable budgeta-ui
systemctl stop budgeta-sdk && systemctl disable budgeta-sdk
rm /etc/systemd/system/budgeta-sdk.service
rm /etc/systemd/system/budgeta-ui.service

echo "Building UI..."
# Install dependencies for the react ui
cd "$SCRIPT_DIR"/../ui || exit
npm install

# Build the react ui dist
npm run build

# Remove the node_modules folder from the react ui directory
rm -rf node_modules

# Install dependencies for the express server
cd "$SCRIPT_DIR"/../setup/express_server || exit
npm install

echo "Building SDK..."
# Build the java sdk-api
cd "$SCRIPT_DIR"/../sdk-api || exit
mvn clean install

echo "Copying files..."

cp "$SCRIPT_DIR/../sdk-api/target/$JAR" "$BUDGETA_DIR_SDK/budgeta.jar"
echo "SDK jar copy complete: $(ls -l "$BUDGETA_DIR_SDK")"

cp -r "$SCRIPT_DIR/../setup/express_server/." "$BUDGETA_DIR_UI"
cp -r "$SCRIPT_DIR/../ui/dist/." "$BUDGETA_DIR_UI/dist"
echo "UI dist and server copy complete: $(ls -l "$BUDGETA_DIR_UI")"

cp -r "$SCRIPT_DIR/../setup/systemd/." "$BUDGETA_DIR_DPL"
echo "Systemd files copy complete: $(ls -l "$BUDGETA_DIR_DPL")"

echo "Copy the systemd files"

cp "$BUDGETA_DIR_DPL/budgeta-sdk.service" "/etc/systemd/system/."
cp "$BUDGETA_DIR_DPL/budgeta-ui.service" "/etc/systemd/system/."

echo "Setting permissions..."
chmod +x $BUDGETA_DIR_DPL/start_sdk.sh
chmod +x $BUDGETA_DIR_DPL/start_ui.sh

systemctl enable "budgeta-sdk" && systemctl enable "budgeta-ui"
systemctl start "budgeta-sdk" && systemctl start "budgeta-ui"

echo "Deployment complete"