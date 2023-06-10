#!/bin/bash
clear;
SCRIPT_DIR=$( cd -- "$( dirname -- "${BASH_SOURCE[0]}" )" &> /dev/null && pwd )

# Check if running with root or sudo permissions
if [ "$EUID" -ne 0 ]; then
    echo "Root permissions are required to run this script."
    exit 1
fi

displayHeader() {
    echo ""
    echo "---------------------------------------------------------------------------"
    echo "                         Budgeta App Autorun Menu                          "
    echo "---------------------------------------------------------------------------" 
    echo ""
}

items=(
    "Complete setup       | Execute all of the steps and open the Application"
    "Install Dependencies | Install all latest working versions" 
    "Build                | Build/Rebuild the Budgeta App and activate it" 
    "Run                  | Prints link to access the Budgeta App"
#    "Update (TODO)        | Auto update the Budgeta App to the latest version"
)

PS3=""

while true; do
    displayHeader

    select item in "${items[@]}" Quit
    do
        case $REPLY in
            1) source "$SCRIPT_DIR"/install.sh
               source "$SCRIPT_DIR"/build.sh
               break;;

            2) source "$SCRIPT_DIR"/install.sh
               break;;

            3) source "$SCRIPT_DIR"/build.sh
               break;;

            4) if [[ -d "/opt/budgeta/ui" && "$(systemctl is-active budgeta-ui.service)" == "active" ]]; then
                   echo "Access http://localhost:3006"
               else
                   echo "WARNING: UI is not installed or running, press 3 to reinstall."
               fi
               break;;

            $((${#items[@]}+1))) echo "Quiting..."; break 2;;
            *) echo "Unknown choice $REPLY"; clear; break;
        esac
    done
done