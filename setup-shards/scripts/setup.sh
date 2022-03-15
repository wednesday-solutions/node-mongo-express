#!/bin/bash -x -e

# docker compose configsvr
docker-compose -f configsvr/docker-compose.yml up -d
sleep 20
# get IP
ip=`ipconfig getifaddr en0`

# create replica sets of configsvr
echo "rs.initiate(
    {
        _id : \"cfgrs\",
        configsvr: true,
        members:
        [
            { _id: 0, host: \"$ip:30001\" },
            { _id: 1, host: \"$ip:30002\" },
            { _id: 2, host: \"$ip:30003\" }
        ]
    }
)

rs.status()" > configsvr.txt

# connect and setup replica sets for configsvr
mongo mongodb://$ip:30003 < configsvr.txt

# docker compose shardsvr1
docker-compose -f shardsvr/docker-compose.yml up -d
sleep 20

# create replica sets of shard1rs
echo "
rs.initiate(
    {
        _id : \"shard1rs\",
        members:
        [
            { _id: 0, host: \"$ip:50001\" },
            { _id: 1, host: \"$ip:50002\" },
            { _id: 2, host: \"$ip:50003\" }
        ]
    }
)

rs.status()" > shard1rs.txt

# connect and setup replica sets for shard1rs

mongo mongodb://$ip:50001 < shard1rs.txt


# setup router

# setup env
echo "ip=$ip" > mongos/.env

# docker compose mongos
docker-compose -f mongos/docker-compose.yml up -d
sleep 20
# create shard
echo "
sh.addShard(\"shard1rs/$ip:50001,$ip:50002,$ip:50003\")
sh.status()
" > mongos.txt

# adding shard
mongo mongodb://$ip:60000 < mongos.txt


#docker compose shardsvr2

docker-compose -f shardsvr2/docker-compose.yml up -d
sleep 20
echo "
rs.initiate(
  {
    _id: \"shard2rs\",
    members:
     [
        { _id : 0, host : \"$ip:50004\" },
        { _id : 1, host : \"$ip:50005\" },
        { _id : 2, host : \"$ip:50006\" }
    ]
  }
)

rs.status()" > shard2rs.txt

mongo mongodb://$ip:50004 < shard2rs.txt


echo "
sh.addShard(\"shard2rs/$ip:50004,$ip:50005,$ip:50006\")
sh.status()
" > mongos.txt

mongo mongodb://$ip:60000 < mongos.txt



# -------------------------------------------------------------------------------

#docker compose shardsvr3

docker-compose -f shardsvr3/docker-compose.yml up -d
sleep 20
echo "
rs.initiate(
  {
    _id: \"shard3rs\",
    members:
     [
        { _id : 0, host : \"$ip:50007\" },
        { _id : 1, host : \"$ip:50008\" },
        { _id : 2, host : \"$ip:50009\" }
    ]
  }
)

rs.status()" > shard3rs.txt

mongo mongodb://$ip:50007 < shard3rs.txt


echo "
sh.addShard(\"shard3rs/$ip:50007,$ip:50008,$ip:50009\")
sh.status()
" > mongos.txt

mongo mongodb://$ip:60000 < mongos.txt


# -------------------------------------------------------------------------------

#docker compose shardsvr4

docker-compose -f shardsvr4/docker-compose.yml up -d
sleep 20
echo "
rs.initiate(
  {
    _id: \"shard4rs\",
    members:
     [
        { _id : 0, host : \"$ip:50010\" },
        { _id : 1, host : \"$ip:50011\" },
        { _id : 2, host : \"$ip:50012\" }
    ]
  }
)

rs.status()" > shard4rs.txt

mongo mongodb://$ip:50010 < shard4rs.txt


echo "
sh.addShard(\"shard4rs/$ip:50010,$ip:50011,$ip:50012\")
sh.status()
" > mongos.txt

mongo mongodb://$ip:60000 < mongos.txt



rm mongos.txt
rm shard4rs.txt
rm shard3rs.txt
rm shard2rs.txt
rm shard1rs.txt
rm configsvr.txt


# script to create sharded collections

echo "

use ecommerce

sh.enableSharding(\"ecommerce\")

db.createCollection(\"suppliers\");
db.createCollection(\"stores\");
db.createCollection(\"products\");
db.createCollection(\"orders\");
db.createCollection(\"store_products\");
db.createCollection(\"supplier_products\");


sh.shardCollection(\"ecommerce.suppliers\", { name: \"hashed\" });
sh.shardCollection(\"ecommerce.stores\", { name: \"hashed\" });
sh.shardCollection(\"ecommerce.products\", { name: \"hashed\" });
sh.shardCollection(\"ecommerce.orders\", { _id: \"hashed\" });
sh.shardCollection(\"ecommerce.store_products\", { productId: \"hashed\" });
sh.shardCollection(\"ecommerce.supplier_products\", { productId: \"hashed\" });


" > setup.txt

mongo mongodb://$ip:60000 < setup.txt

rm setup.txt