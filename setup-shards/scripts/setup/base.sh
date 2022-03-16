#!/bin/bash
# get IP
export ip=`ipconfig getifaddr en0`
./setup-shards/scripts/setup/docker-containers.sh
./setup-shards/scripts/setup/config-server.sh
./setup-shards/scripts/setup/shard1.sh
./setup-shards/scripts/setup/shard2.sh
./setup-shards/scripts/setup/shard3.sh
./setup-shards/scripts/setup/shard4.sh
./setup-shards/scripts/setup/create-sharded-collections.sh
./setup-shards/scripts/setup/cleanup-files.sh

