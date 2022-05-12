#!/bin/bash
export DIVISOR=$1
set -a . .env.local set +a

node seeders/index.js false &
node seeders/referenced.js false &
node seeders/unsharded.js false &
node seeders/unshardedReferenced.js false