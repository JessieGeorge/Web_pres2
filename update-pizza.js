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
  .catch(error => console.error(error));

// STORING ORIGINAL PIZZA
async function run() {
    await client.index({
        index: "recipes",
        body: {
            name: "Pizza",
            yield: 1,
            ingredients: [
                {food: "flour", quantity: "7 cups"},
                {food: "cheese", quantity: "3 cubes"},
                {food: "sauce", quantity: "20 oz"} 
            ],
            directions: "Step 1: Toss dough. Step 2: Add toppings."
        }
    });

    await client.indices.refresh({index: "recipes"});
}

run().catch(console.log);
*/

async function updateYield() {
    await client.update({
      index: "recipes",
      id: "uJEIp30BR6Yx29b_lKGq", // pizza recipe id
      body: {
        script: {
          source: 'ctx._source.yield = "2"'
        }
      }
    });

    const { body } = await client.get({
      index: "recipes",
      id: "uJEIp30BR6Yx29b_lKGq"
    });
  
    console.log(body)
}
  
updateYield().catch(console.log);
