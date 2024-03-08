import "@nomicfoundation/hardhat-toolbox";
import * as dotenv from "dotenv";
import { HardhatUserConfig } from "hardhat/config";

dotenv.config();

const config: HardhatUserConfig = {
  solidity: "0.8.24",
  networks: {
    nebulas: {
      url: process.env.NEBULAS_RPC_URL as string,
      accounts: [process.env.PRIVATE_KEY as string],
    },
  },
};

export default config;
