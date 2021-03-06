import * as dotenv from "dotenv";

import { HardhatUserConfig, task } from "hardhat/config";
import "@nomiclabs/hardhat-etherscan";
import "@nomiclabs/hardhat-waffle";
import "@typechain/hardhat";
import "hardhat-gas-reporter";
import "solidity-coverage";
import geneateMerkle from "./scripts/generateMerkle";
import { generateRandomAddresses } from "./utils/generateRandomAddresses";

dotenv.config();

// Generate merkle tree and print rootHash/proof for a given address
task("merkle", "Generate merkle tree").setAction(async () => {
  const numberOfAddresses = parseInt(
    process.env.NUMBER_OF_ADRESSES_TO_GENERATE || "32"
  );
  const { rootHash } = geneateMerkle(
    generateRandomAddresses(numberOfAddresses)
  );
  console.log(`root hash: ${rootHash}`);
});

// You need to export an object to set up your config
// Go to https://hardhat.org/config/ to learn more

const config: HardhatUserConfig = {
  solidity: "0.8.14",
  networks: {
    ropsten: {
      url: process.env.ROPSTEN_URL || "",
      accounts:
        process.env.PRIVATE_KEY !== undefined ? [process.env.PRIVATE_KEY] : [],
    },
  },
  gasReporter: {
    enabled: process.env.REPORT_GAS !== undefined,
    currency: "USD",
  },
  etherscan: {
    apiKey: process.env.ETHERSCAN_API_KEY,
  },
};

export default config;
