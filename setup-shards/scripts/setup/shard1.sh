#!/bin/bash

echo "shard1------------------------"

echo "
rs.initiate(
  {
    _id: \"shard1rs\",
    members:
     [
        { _id : 0, host : \"$ip:50001\" },
        { _id : 1, host : \"$ip:50002\" },
        { _id : 2, host : \"$ip:50003\" }
    ]
  }
)" > shard1rs.txt

mongosh mongodb://$ip:50003 < shard1rs.txt

echo "
sh.addShard(\"shard1rs/$ip:50001,$ip:50002,$ip:50003\")
" > mongos.txt

mongosh mongodb://$ip:60000 < mongos.txt
