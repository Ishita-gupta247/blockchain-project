const hexToBinary = require("hex-to-binary");
const { GENESIS_DATA, MINE_RATE } = require("./config");
const cryptoHash = require("./crypto-hash");
class Block {
  constructor({ timestamp, prevHash, hash, data, nonce, difficulty }) {
    this.timestamp = timestamp;
    this.prevHash = prevHash;
    this.hash = hash;
    this.data = data;
    this.nonce = nonce;
    this.difficulty = difficulty;
  }
  static genesis() {
    return new this(GENESIS_DATA);
  }
  static mineBlock({ prevBlock, data }) {
    let hash, timestamp;
    const prevHash = prevBlock.hash;
    let { difficulty } = prevBlock;

    let nonce = 0;
   do {
       nonce++;
       timestamp = Date.now(); //00cdef ,00
      difficulty = Block.adjustDifficulty({
        originalBlock: prevBlock,
        timestamp,
      });
      hash = cryptoHash(timestamp, prevHash, data, nonce, difficulty );
  } 
while (
      hexToBinary( hash).substring(0, difficulty) !== "0".repeat(difficulty)
     );
    return new this({
      timestamp,
      prevHash,
      data,
     difficulty,
      nonce,
      hash,
    });
}
//with time it adjust the difficulty..difficulty should be in limit to 
//prevent quick adding of blocks or diff inc so much no new block is been 
//added
  static adjustDifficulty({ originalBlock, timestamp }) {
    const { difficulty } = originalBlock;
    if (difficulty < 1) return 1;
    const difference = timestamp - originalBlock.timestamp;
    if (difference > MINE_RATE) return difficulty - 1;
    //adjusting difficulty acc to minerate..if time is more than difficulty is reduced else inc
    return difficulty + 1;
   }}
 

const block1 = new Block({
  hash: "0xacb",
  timestamp: "2/09/22",
  prevHash: "0xc12",
  data: "hello",
  nonce:0,
  difficulty:2
});

//console.log(block1);
const genesisblock=Block.genesis();
//console.log(genesisblock);




module.exports = Block;
