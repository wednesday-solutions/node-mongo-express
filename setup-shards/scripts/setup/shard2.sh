#!/bin/bash

echo "shard2------------------------"

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
)" > shard2rs.txt

mongosh mongodb://$ip:50004 < shard2rs.txt

echo "
sh.addShard(\"shard2rs/$ip:50004,$ip:50005,$ip:50006\")
" > mongos.txt

mongosh mongodb://$ip:60000 < mongos.txt
