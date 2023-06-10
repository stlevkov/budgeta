#!/bin/bash

BUDGETA_DIR_UI="/opt/budgeta/ui"

export BUDGETA_UI_DIST_PATH="/opt/budgeta/ui/dist"

source env.sh

node "$BUDGETA_DIR_UI/server.js"