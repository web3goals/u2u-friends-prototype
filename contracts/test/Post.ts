import { loadFixture } from "@nomicfoundation/hardhat-toolbox/network-helpers";
import { ethers } from "hardhat";
import { expect } from "chai";

describe("Post", function () {
  async function initFixture() {
    // Get signers
    const [deployer, userOne, userTwo, userThree] = await ethers.getSigners();
    // Deploy contracts
    const postContractFactory = await ethers.getContractFactory("Post");
    const postContract = await postContractFactory.deploy();
    return {
      deployer,
      userOne,
      userTwo,
      userThree,
      postContract,
    };
  }

  it("Should support the main flow", async function () {
    const { userOne, userTwo, userThree, postContract } = await loadFixture(
      initFixture
    );
    // Create posts
    await expect(postContract.connect(userOne).create("ipfs://1")).to.be.not
      .reverted;
    await expect(postContract.connect(userOne).create("ipfs://2")).to.be.not
      .reverted;
    expect(await postContract.getPosts(userOne))
      .to.include(0n)
      .and.to.include(1n);
    // Like posts
    const firstPostTokenId = 0n;
    await expect(postContract.connect(userTwo).like(firstPostTokenId)).to.be.not
      .reverted;
    await expect(postContract.connect(userThree).like(firstPostTokenId)).to.be
      .not.reverted;
    await expect(postContract.connect(userThree).like(firstPostTokenId)).to.be
      .reverted;
    expect((await postContract.getLikers(firstPostTokenId)).length).to.be.equal(
      2
    );
    // Comment posts
    const secondPostTokenId = 1n;
    await expect(
      postContract.connect(userTwo).comment(secondPostTokenId, "ipfs://3")
    ).to.be.not.reverted;
    await expect(
      postContract.connect(userThree).comment(secondPostTokenId, "ipfs://4")
    ).to.be.not.reverted;
    expect(await postContract.getComments(secondPostTokenId))
      .to.include(2n)
      .and.to.include(3n);
  });
});
