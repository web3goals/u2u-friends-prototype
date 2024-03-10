import { ethers } from "hardhat";

async function main() {
  console.log("👟 Start to deploy post contract");
  const contractFactory = await ethers.getContractFactory("Post");
  const contract = await contractFactory.deploy();
  await contract.waitForDeployment();
  console.log(`✅ Post contract deployed to ${contract.target}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
