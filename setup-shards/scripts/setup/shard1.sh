#!/bin/bash

echo "shard1------------------------"

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


# create shard
echo "
sh.addShard(\"shard1rs/$ip:50001,$ip:50002,$ip:50003\")
sh.status()
" > mongos.txt

# adding shard
mongo mongodb://$ip:60000 < mongos.txt
