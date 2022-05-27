#!/bin/bash
export DIVISOR=$1
set -o allexport
source .env.local
set +o allexport

node seeders/index.js false &
node seeders/referenced.js false &
node seeders/unsharded.js false &
node seeders/unshardedReferenced.js false