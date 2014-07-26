mongo < drop.js
mongoimport --db wildstar --collection classes --file classes.json --jsonArray
mongoimport --db wildstar --collection factions --file factions.json --jsonArray
mongoimport --db wildstar --collection paths --file paths.json --jsonArray
mongoimport --db wildstar --collection professions --file professions.json --jsonArray
mongoimport --db wildstar --collection races --file races.json --jsonArray
mongoimport --db wildstar --collection tradeskills --file tradeskills.json --jsonArray
mongoimport --db wildstar --collection users --file users.json --jsonArray
pause