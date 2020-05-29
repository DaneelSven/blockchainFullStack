// this file will be responsible for handling the express API and application,
// here we will create the blockchain instance for the overall project.
const bodyParser = require("body-parser");
const express = require("express");
const request = require("request");
const Blockchain = require("./blockchain");
const PubSub = require("./pubsub");

const app = express();
const blockchain = new Blockchain();
const pubsub = new PubSub({ blockchain });

const DEFAULT_PORT = 3000;
const ROOT_NODE_ADDRESS = `http://localhost:${DEFAULT_PORT}`;

//make the api body to receive json objects
app.use(bodyParser.json());

// create a http get request to read data from the backend.
app.get("/api/blocks", (request, response) => {
  response.json(blockchain.chain);
});

// create a http post request to write data to the application
app.post("/api/mine", (req, res) => {
  const { data } = req.body;

  blockchain.addBlock({
    data,
  });

  pubsub.broadcastChain();

  res.redirect("/api/blocks");
});

const syncChains = () => {
  request(
    { url: `${ROOT_NODE_ADDRESS}/api/blocks` },
    (error, response, body) => {
      if (!error && response.statusCode === 200) {
        const rootChain = JSON.parse(body);

        console.log("replace chain on a sync with", rootChain);
        blockchain.replaceChain(rootChain);
      }
    }
  );
};

// when the app starts up it will start listening to request until it is told not to do
let PEER_PORT;

if (process.env.GENERATE_PEER_PORT === "true") {
  PEER_PORT = DEFAULT_PORT + Math.ceil(Math.random() * 1000);
}
const PORT = PEER_PORT || DEFAULT_PORT;
app.listen(PORT, () => {
  console.log(`listening at localhost:${PORT}`);

  if (PORT !== DEFAULT_PORT) {
    syncChains();
  }
});
