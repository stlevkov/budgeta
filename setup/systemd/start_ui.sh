#!/bin/bash

BUDGETA_DIR_UI="/opt/budgeta/ui"
BUDGETA_DIR_DPL="/opt/budgeta/deployment"
source "$BUDGETA_DIR_DPL/env.sh"

node "$BUDGETA_DIR_UI/server.js"