# Budgeta
WEB Application that monitors the availability of the family budget and helps save and spend easily.

![NodeJS](https://github.com/stlevkov/budgeta/actions/workflows/node.js.yml/badge.svg)  ![Spring](https://github.com/stlevkov/budgeta/actions/workflows/maven.yml/badge.svg)

### UI Preview
![demo image not available](resources/budgeta_demo_preview_unreleased.jpg?raw=true)

## Setup
Execute the [./autorun.sh](./setup/autorun.sh) script and use the provided options

![autorun image not available](resources/autorun.png?raw=true)

## Advanced
### Prerequisites
#### Install the latest working dependencies:

- Execute the [./install.sh](./setup/install.sh) script

Or install the dependencies manually:
- Mongodb v6.0.5
- maven v3.6.3
- nodejs v18.14.1
- npm v9.3.1
- java v11.0.8
- pm2 v5.3.0

#### Set the initial Mongodb state

`mongorestore -d budgeta setup/db_init/mongodump/budgeta`

### Building

Follow the deployment or development setups

#### Deployment
Execute the [./build.sh](./setup/build.sh) script

use `pm2 status` to get information about the processes

#### Development
Execute `npm install && npm start` in the [react ui](./ui/README.md) directory

Execute  `mvn spring-boot:run` in the [java sdk-api](./sdk-api/README.md) directory

### Running
Access:
``` http://localhost:3006 ``` to use the Budgeta App

### Environment Setup

| env name             | description            | default    |
|----------------------|------------------------|------------|
| BUDGETA_UI_DIST_PATH | path to ui dist folder | ../ui/dist |
| BUDGETA_UI_PORT      | express http port      | 3006       |
| BUDGETA_SDK_API_HOST | spring boot host       | localhost  |
| BUDGETA_SDK_API_PORT | spring boot http port  | 8080       |
| BUDGETA_MONGODB_PORT | mongodb port           | 27017      |

### Logging

To see the logs from the applications use: `pm2 logs`

To enable spring security debug, set `@EnableWebSecurity(debug = true)` in [WebSecurityConfig](./sdk-api/src/main/java/com/budgeta/sdk/api/config/WebSecurityConfig.java) 
TODO
