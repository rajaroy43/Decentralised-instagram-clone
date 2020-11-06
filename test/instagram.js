const instagram = artifacts.require("instagram");

/*
 * uncomment accounts to access the test accounts made available by the
 * Ethereum client
 * See docs: https://www.trufflesuite.com/docs/truffle/testing/writing-tests-in-javascript
 */
const assert = require("assert");
contract("instagram", async (accounts) => {
  let instance, imageCount;
  let account = accounts[0];
  before(async () => {
    instance = await instagram.deployed();
  });
  it("For Deployment", async () => {
    assert.notEqual("0x0", instance.address);
  });
  it("has a name", async () => {
    const name = await instance.name();
    assert.equal("InstagramDapp", name);
  });

  it("images", async () => {
    const result = await instance.uploadImage("hash", "Image Description", {
      from: account,
    });
    imageCount = await instance.imageCount();
    const event = result.logs[0].args;
    assert(imageCount, 1);
    assert.equal(event.id.toNumber(), imageCount.toNumber(), "id is incorrect");
    assert.equal(event.hash, "hash", "Hash is incorrect");
    assert.equal(
      event.description,
      "Image Description",
      "Description is correct"
    );
    assert.equal(event.tipAmmount.toNumber(), 0, "Tip ammount is incorrect");
    assert.equal(event.author, account);
  });
  it("Allow user to tip images", async () => {
    let oldAuthorBalance;
    oldAuthorBalance = await web3.eth.getBalance(account);
    oldAuthorBalance = new web3.utils.BN(oldAuthorBalance);
    const result = await instance.tipImageOwner(imageCount, {
      from: accounts[1],
      value: web3.utils.toWei("1", "ether"),
    });
    // SUCCESS
    const event = result.logs[0].args;
    assert.equal(event.id.toNumber(), imageCount.toNumber(), "id is correct");
    assert.equal(
      event.tipAmmount,
      "1000000000000000000",
      "tip amount is correct"
    );
    assert.equal(event.postTipper, accounts[1], "author is incorrect");
    // Check that author received funds
    let newAuthorBalance;
    newAuthorBalance = await web3.eth.getBalance(account);
    console.log(newAuthorBalance);
  });
});
