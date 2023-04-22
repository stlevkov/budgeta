#!/bin/bash
clear;
SCRIPT_DIR=$( cd -- "$( dirname -- "${BASH_SOURCE[0]}" )" &> /dev/null && pwd )

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
    "Run                  | Open the browser to access the Budgeta App"
#    "Update (TODO)        | Auto update the Budgeta App to the latest version"
)

PS3=""

while true; do
    displayHeader

    select item in "${items[@]}" Quit
    do
        case $REPLY in
            1) echo "Selected item $item"
               source "$SCRIPT_DIR"/install.sh
               source "$SCRIPT_DIR"/build.sh
               break;;
            2) echo "Selected item $item"
               source "$SCRIPT_DIR"/install.sh
               break;;
            3) echo "Selected item $item"
               source "$SCRIPT_DIR"/build.sh
               break;;
            4) echo "Selected item $item"; 
               xdg-open http://localhost:3006
               break;;
            $((${#items[@]}+1))) echo "Quiting..."; break 2;;
            *) echo "Unknown choice $REPLY"; clear; break;
        esac
    done
done