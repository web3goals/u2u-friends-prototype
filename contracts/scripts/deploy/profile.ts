import { ethers } from "hardhat";

async function main() {
  console.log("👟 Start to deploy profile contract");
  const contractFactory = await ethers.getContractFactory("Profile");
  const contract = await contractFactory.deploy();
  await contract.waitForDeployment();
  console.log(`✅ Profile contract deployed to ${contract.target}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
