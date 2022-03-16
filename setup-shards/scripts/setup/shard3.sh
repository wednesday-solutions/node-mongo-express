#!/bin/bash

echo "shard3------------------------"

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