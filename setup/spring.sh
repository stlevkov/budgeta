#!/bin/bash
SCRIPT_DIR=$( cd -- "$( dirname -- "${BASH_SOURCE[0]}" )" &> /dev/null && pwd )

java -jar "$SCRIPT_DIR"/../sdk-api/target/budgeta.sdk.api-0.0.1-SNAPSHOT.jar