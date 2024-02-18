# Budgeta [Hobby Project]
A web application that helps plan the family budget and save funds without requiring daily inputs. 
Once configured, the application will monitor the savings. The UI has hooks which allows you to get result from the render while you edit values on the board. This functionality allows you, to visualise your planned budget interactively while changing the expenses on the dashboard - e.g. daily recommended will be automatically updated based on the change on any value on the dashboard.

# Purpose
This project was created with the primary goal of learning and implementing new technologies. It serves as a personal exploration of learning how React works with Spring and MongoDB, allowing me to gain hands-on experience and deepen my understanding of these tools.

## Project Intentions:
- Learning: The main purpose of this project is educational, aiming to expand my knowledge and skills in react, node.js and spring technologies.
- Personal Use: While I've designed this project for my own learning journey, I also find it useful for personal use. It's tailored to address certain needs or interests that I have.

## Development Information
- Free Time: This project has been developed during my free time, reflecting a passion for continuous learning and a commitment to personal growth.
- No Commercial Intent: It's important to note that this project is not intended for commercial purposes. It's a personal endeavor driven by a genuine interest in technology and its applications.

## Contributing
While contributions are welcome, please keep in mind the project's origin as a learning exercise. Feel free to share feedback or suggest improvements, but understand that the primary focus is on personal development.

Thank you for your interest in Budgeta project!

# Technical Information

[![Node.js CI](https://github.com/stlevkov/budgeta/actions/workflows/node.js.yml/badge.svg?branch=main)](https://github.com/stlevkov/budgeta/actions/workflows/node.js.yml)  [![Spring CI with Maven](https://github.com/stlevkov/budgeta/actions/workflows/maven.yml/badge.svg?branch=main)](https://github.com/stlevkov/budgeta/actions/workflows/maven.yml)  [![Azure Deploy Budgeta UI](https://github.com/stlevkov/budgeta/actions/workflows/azure-main-budgeta-ui.yml/badge.svg)](https://github.com/stlevkov/budgeta/actions/workflows/azure-main-budgeta-ui.yml)  [![Azure Deploy Budgeta Backend](https://github.com/stlevkov/budgeta/actions/workflows/azure-main-budgeta-sdk-api.yml/badge.svg?branch=main)](https://github.com/stlevkov/budgeta/actions/workflows/azure-main-budgeta-sdk-api.yml)

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
``` http://localhost:3006 ``` to use the Budgeta Project

### Environment Setup

| env name                         | description                 | need by        | set during | default    |
|----------------------------------|-----------------------------|----------------|------------|------------|
| BUDGETA_UI_DIST_PATH             | path to ui dist folder      | express server | runtime    | ../ui/dist |
| BUDGETA_UI_HOST                  | react ui host               | spring boot    | build time | localhost  |
| BUDGETA_UI_PORT                  | express http port           | express server | runtime    | 3006       |
| BUDGETA_UI_PROTOCOL              | http or https               | spring, react  | build time | http       |
|                                  |                             |                |            |            |
| BUDGETA_SDK_API_HOST             | spring boot host            | react ui       | build time | localhost  |
| BUDGETA_SDK_API_PORT             | spring boot http port       | react ui       | build time | 8080       |
| BUDGETA_SDK_API_PROTOCOL         | http or https               | react ui       | build time | http       |
|                                  |                             |                |            |            |
| BUDGETA_MONGODB_PORT             | mongodb port                | spring boot    | runtime    | 27017      |
| BUDGETA_MONGODB_HOST             | mongodb host                | spring boot    | runtime    | localhost  |
|                                  |                             |                |            |            |
| BUDGETA_GITHUB_APP_CLIENT_ID     | github app reg client       | spring boot    | build time |            |
| BUDGETA_GITHUB_APP_CLIENT_SECRET | github app reg secret       | spring boot    | build time |            |
| BUDGETA_GOOGLE_APP_CLIENT_ID     | github app reg client       | spring boot    | build time |            |
| BUDGETA_GOOGLE_APP_CLIENT_SECRET | github app reg secret       | spring boot    | build time |            |
|                                  |                             |                |            |            |
| BUDGETA_SINGLE_USER_EMAIL        | register enabled for 1 user | spring boot    | build time |            |
| BUDGETA_SDK_API_SECURITY_LEVEL   | enable spring security log  | spring boot    | build time | INFO       |

### Logging

To see the logs from the applications check the systemd service logs

To enable spring security debug, set BUDGETA_SDK_API_SECURITY_LEVEL to DEBUG.
