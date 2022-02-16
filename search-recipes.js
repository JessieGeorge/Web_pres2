const { Client } = require("@elastic/elasticsearch");
const config = require("config");
const elasticConfig = config.get("elastic");

const client = new Client({
  cloud: {
    id: elasticConfig.cloudID
  },
  auth: {
    username: elasticConfig.username,
    password: elasticConfig.password
  }
});

/*
client.info()
  .then(response => console.log(response))
  .catch(error => console.error(error))
*/

function printResults(body) {
    for (let i = 0; i < body.hits.hits.length; i++) {
        console.log("RECIPE ID: " + body.hits.hits[i]._id + 
                    " NAME: " + body.hits.hits[i]._source.name);
    }
}

async function getAllRecipes() {
    const { body } = await client.search({
        index: "recipes",
        body: {
            query: {
                match_all: {}
            }
        }
    });

    console.log("\n\n--------------------------------------------\n\n");
    console.log("ALL RECIPES:");
    printResults(body);
}

async function getSteak() {
    const { body } = await client.search({
        index: "recipes",
        body: {
            query: {
                match: { name: "steak" }
            }
        }
    });

    console.log("\n\n--------------------------------------------\n\n");
    console.log("RECIPES WHOSE NAMES INCLUDE " +
                "THE WORD steak - NOT CASE SENSITIVE:");
    printResults(body);
}

async function getWithWildcard(w) {
    const { body } = await client.search({
        index: "recipes",
        body: {
            query: {
                wildcard: { name: w }
            }
        }
    });

    console.log("\n\n--------------------------------------------\n\n");
    console.log("RECIPES WHOSE NAMES ARE LIKE " + w + ":");
    printResults(body);
}

async function getWithFuzzy(typo) {
    const { body } = await client.search({
        index: "recipes",
        body: {
            query: {
                fuzzy: { name: typo}
            }
        }
    });

    console.log("\n\n--------------------------------------------\n\n");
    console.log("RECIPES WHOSE NAMES ARE LIKE " + typo + ":");
    printResults(body);
}

async function getBeefAndPotato() {
    const { body } = await client.search({
        index: "recipes",
        body: {
            query: {
                bool: {
                    must: [
                        {
                            match: {
                                "ingredients.food": "beef"
                            }
                        },
                        {
                            match: {
                                "ingredients.food": "potato"
                            }
                        }
                    ]
                }
            }
        }
    });

    console.log("\n\n--------------------------------------------\n\n");
    console.log("RECIPES THAT USE INGREDIENTS beef AND potato:");
    printResults(body);

    console.log("\n\nPRINTING body:");
    console.log(body);

    console.log("\n\nPRINTING body.hits.hits:");
    console.log(body.hits.hits);
}

async function main() {
    await getAllRecipes().catch(console.log);
    await getSteak().catch(console.log);
    await getWithWildcard("p*").catch(console.log);
    await getWithWildcard("p*a").catch(console.log);
    await getWithFuzzy("pitza").catch(console.log);
    await getBeefAndPotato().catch(console.log);
}

main();