# Note: Kiva server only tool
#
#!/bin/bash
GREEN='\e[0;32m'
WHITE='\e[97m'
TITLE="${GREEN}Kiva${WHITE} UI server"

display_help() {
    echo -e "${TITLE} : Help"
    echo
    echo "Usage: ui-server.sh {status|log|restart}" >&2
    echo
    exit 1
}

# clear screen
printf "\033c"

if [ "$1" == "status" ]; then
    sudo systemctl status ui-server
elif [ "$1" == "log" ]; then
    sudo journalctl -fu ui-server
elif [ "$1" == "restart" ]; then
    sudo systemctl restart ui-server
    echo -e "${TITLE} : Restarting"
    echo
elif [ "$1" == "--help" ]; then
    display_help
else
    display_help
fi
