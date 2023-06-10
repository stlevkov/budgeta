#!/bin/bash

# Check if running with root or sudo permissions
if [ "$EUID" -ne 0 ]; then
    echo "Root permissions are required to run this script."
    exit 1
fi

echo "Installing Budgeta App..."

SCRIPT_DIR=$( cd -- "$( dirname -- "${BASH_SOURCE[0]}" )" &> /dev/null && pwd )

echo "During installation, a few prompts might occur"

echo "Checking platform... $(uname -a)"

sudo apt update

echo "Installing MongoDB dependencies..."
sudo apt install dirmngr gnupg apt-transport-https ca-certificates software-properties-common

wget -qO - https://www.mongodb.org/static/pgp/server-6.0.asc | sudo apt-key add -

echo "deb [ arch=amd64,arm64 ] https://repo.mongodb.org/apt/ubuntu focal/mongodb-org/6.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-6.0.list

sudo apt-get update

echo "Installing MongoDB..."
sudo apt-get install -y mongodb-org

echo "Starting the MongoDB systemd..."
sudo systemctl start mongod
sudo systemctl enable mongod

echo "Setting up the initial state of Budgeta App DB..."
mongorestore -d budgeta "$SCRIPT_DIR"/db_init/mongodump/budgeta

echo "Installing Java & Maven..."
sudo apt install default-jdk -y
sudo apt install maven -y
java -version
mvn -version

echo "Installing Node.js..."
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.1/install.sh | bash
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"  # This loads nvm
[ -s "$NVM_DIR/bash_completion" ] && \. "$NVM_DIR/bash_completion"  # This loads nvm bash_completion
nvm install v18.16.0
node -v