#!/bin/bash

docker-compose -f setup-shards/configsvr/docker-compose.yml down
docker-compose -f setup-shards/shardsvr1/docker-compose.yml down
docker-compose -f setup-shards/mongos/docker-compose.yml down
docker-compose -f setup-shards/shardsvr2/docker-compose.yml down
docker-compose -f setup-shards/shardsvr3/docker-compose.yml down
docker-compose -f setup-shards/shardsvr4/docker-compose.yml down