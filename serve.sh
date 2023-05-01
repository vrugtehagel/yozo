#!/bin/bash

# Run the build.sh script when any file in this repo changes


# Run a local server at localhost:8787 using php
php -q -S localhost:8787 -t dist/ &
phpid=$!

# Define an update function that runs the build script and shows some life
update(){
    clear
    ./build.sh
    echo "  Last updated $(date +%T)"
}

# We run the updater immediately so we start fresh
update

# Check for file changes every second. If there are any, run the updater
while sleep 1; do 

    # Find the files that changed in the last hour. If there are none, stop serving
    [[ $(find . -type f -mtime -1h -not -path "./dist/*") ]] || break

    # Find the files that changed in the last 2s. If there are none, continue
    # Setting it to 1s doesn't always find the files, not sure why
    [[ $(find . -type f -mtime -2s -not -path "./dist/*") ]] || continue

    # Something changed! Run the updater.
    update
done

# Kill the PHP process
kill $phpid

# Say why the script stopped
echo "  Stopped serving due to inactivity."
