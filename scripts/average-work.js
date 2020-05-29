const Blockchain = require("../blockchain/blockchain");

const blockchain = new Blockchain();

blockchain.addBlock({
  data: "initial",
});

console.log("firstblock", blockchain.chain[blockchain.chain.length - 1]);

let prevTimestamp, nextTimestamp, nextBlock, timeDiff, average;

const time = [];

for (let i = 0; i < 10000; i++) {
  prevTimestamp = blockchain.chain[blockchain.chain.length - 1].timestamp;

  blockchain.addBlock({
    data: `block ${i}`,
  });

  nextBlock = blockchain.chain[blockchain.chain.length - 1];

  nextTimestamp = nextBlock.timestamp;
  timeDiff = nextTimestamp - prevTimestamp;
  time.push(timeDiff);

  average = time.reduce((total, num) => total + num) / time.length;

  console.log(
    `Time to mine block: ${timeDiff}ms. Difficulty: ${nextBlock.difficulty}. Average time: ${average}ms.`
  );
}
