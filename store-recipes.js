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

client.info()
  .then(response => console.log(response))
  .catch(error => console.error(error));

async function run() {
    await client.index({
        index: "recipes",
        body: {
            name: "Shepherd's Pie",
            yield: 2,
            ingredients: [
                {food: "oil", quantity: "2 tsp"},
                {food: "beef", quantity: "1 cut"},
                {food: "potato", quantity: "3"}, 
                {food: "salt", quantity: null}    
            ],
            directions: "Step 1: Cook beef. Step 2: Fry potatoes. Step 3: Salt as desired."
        }
    });

    await client.index({
        index: "recipes",
        body: {
            name: "Steak Tacos",
            yield: 1,
            ingredients: [
                {food: "taco shell", quantity: "1"},
                {food: "lettuce", quantity: "1/2"},
                {food: "beef", quantity: "handful"},
                {food: "potato", quantity: "1"}    
            ],
            directions: "Step 1: Put fillings in taco shell."
        }
    });

    await client.indices.refresh({index: "recipes"});
}

run().catch(console.log);