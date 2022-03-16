#!/bin/bash

echo "shard4------------------------"

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
)" > shard4rs.txt

mongosh mongodb://$ip:50010 < shard4rs.txt


echo "
sh.addShard(\"shard4rs/$ip:50010,$ip:50011,$ip:50012\")
" > mongos.txt

mongosh mongodb://$ip:60000 < mongos.txt