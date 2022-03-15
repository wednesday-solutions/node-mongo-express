# Setup shards

Run the following script

```
./scripts/setup.sh
```

This will provision the following infrastructure

-   config server
    A replica set will be created with 2 secondary and 1 primary node. <br />
    It will run on the following ports
    -   30001
    -   30002
    -   30003
-   shard server 1
    A replica set will be created with 2 secondary and 1 primary node. <br />
    It will run on the following ports
    -   50001
    -   50002
    -   50003
-   shard server 2
    A replica set will be created with 2 secondary and 1 primary node. <br />
    It will run on the following ports
    -   50004
    -   50005
    -   50006
-   shard server 3
    A replica set will be created with 2 secondary and 1 primary node. <br />
    It will run on the following ports
    -   50007
    -   50008
    -   50009
-   shard server 4
    A replica set will be created with 2 secondary and 1 primary node. <br />
    It will run on the following ports
    -   50010
    -   50011
    -   50012
-   mongos
    This is the router and will be running on port 60000

Use the following command to connect to mongos

```
mongo mongodb://`ipconfig getifaddr en0`:60000
```

alternatively run

```
ip=`ipconfig getifaddr en0`
mongo mongodb://$ip:60000
```
