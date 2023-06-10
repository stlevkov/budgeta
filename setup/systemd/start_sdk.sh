#!/bin/bash

BUDGETA_DIR_SDK="/opt/budgeta/sdk"
BUDGETA_DIR_DPL="/opt/budgeta/deployment"

source "$BUDGETA_DIR_DPL/env.sh"

java -jar "$BUDGETA_DIR_SDK/budgeta.jar"