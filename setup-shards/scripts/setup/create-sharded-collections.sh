#!/bin/bash


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