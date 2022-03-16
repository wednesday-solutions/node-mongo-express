#!/bin/bash
echo "config servers------------------------"

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
)" > configsvr.txt

# connect and setup replica sets for configsvr
mongosh mongodb://$ip:30003 < configsvr.txt