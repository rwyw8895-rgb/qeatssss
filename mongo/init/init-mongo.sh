#!/bin/bash
set -e

# Seed MongoDB collections on first container initialization.
# This script is executed by the official MongoDB image when /data/db is empty.

echo "Seeding restaurant-database collections..."

mongoimport --db restaurant-database --collection restaurants --drop --file /docker-entrypoint-initdb.d/initial_data_set_restaurants.json --jsonArray
mongoimport --db restaurant-database --collection orders --drop --file /docker-entrypoint-initdb.d/initial_data_set_orders.json --jsonArray

echo "MongoDB seed completed."
