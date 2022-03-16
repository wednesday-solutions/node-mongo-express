#!/bin/bash

echo "docker containers------------------------"
# setup env
echo "ip=$ip" > setup-shards/mongos/.env

docker-compose -f setup-shards/configsvr/docker-compose.yml up -d
docker-compose -f setup-shards/shardsvr1/docker-compose.yml up -d
docker-compose -f setup-shards/mongos/docker-compose.yml up -d
docker-compose -f setup-shards/shardsvr2/docker-compose.yml up -d
docker-compose -f setup-shards/shardsvr3/docker-compose.yml up -d
docker-compose -f setup-shards/shardsvr4/docker-compose.yml up -d
sleep 20