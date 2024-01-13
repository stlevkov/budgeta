# Budgeta
A web application that helps plan the family budget and save funds without requiring daily inputs. 
Once configured, the application will monitor the savings.

![NodeJS](https://github.com/stlevkov/budgeta/actions/workflows/node.js.yml/badge.svg)  ![Spring](https://github.com/stlevkov/budgeta/actions/workflows/maven.yml/badge.svg)

### Supported Platforms

| OS     | Version | Tested |
| ------ | ------- | ------ |
| Ubuntu | 22.04   |    ✔   |

### UI Preview
![demo image not available](resources/budgeta_demo_preview_unreleased.png?raw=true)

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
- nodejs v18.16.0
- npm v9.3.1
- java v11.0.8

### Building

Follow the deployment or development setup

#### Deployment
Execute the [./build.sh](./setup/build.sh) script

use `systemctl` to get information about the service processes

| service name | startup script dir |
| ------------ |--------------------|
| budgeta-ui   | /opt/budgeta/ui    |
| budgeta-sdk  | /opt/budgeta/sdk   |

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
| BUDGETA_MONGODB_HOST | mongodb host           | localhost  |

### Logging

To see the logs from the applications check the systemd service logs

To enable spring security debug, set `@EnableWebSecurity(debug = true)` in [WebSecurityConfig](./sdk-api/src/main/java/com/budgeta/sdk/api/config/WebSecurityConfig.java)
