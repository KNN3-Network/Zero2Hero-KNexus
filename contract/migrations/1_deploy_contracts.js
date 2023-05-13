const Transformer = artifacts.require("Transformer");
const Factory = artifacts.require("Factory");
const { deployProxy } = require('@openzeppelin/truffle-upgrades');


const contract = {
  "CrossChain": "0xeEBe00Ac0756308ac4AaBfD76c05c4F3088B8883",
  "TokenHub": "0x10C6E9530F1C1AF873a391030a1D9E8ed0630D26",
  "BucketHub": "0x9CfA6D15c80Eb753C815079F2b32ddEFd562C3e4",
  "ObjectHub": "0x427f7c59ED72bCf26DfFc634FEF3034e00922DD8",
  "GroupHub": "0x275039fc0fd2eeFac30835af6aeFf24e8c52bA6B",
}
module.exports = async function (deployer) {

  // console.log("contract.CrossChain", contract.CrossChain);

  // console.log("deployer", deployer.address);

  /*
  const instance = await deployProxy(Transformer, [
    contract.CrossChain,
    contract.BucketHub,
    contract.ObjectHub,
    contract.GroupHub,
    "0x",
    0,
    "0x",
    0,
    "0xD3420A3be0a1EFc0FBD13e87141c97B2C9AC9dD3"
  ]);

  console.log("instance", instance);
  console.log('Deployed', instance.address);

  */
  // const transformer = await deployer.deploy(Transformer)

  /*
  const transformer = await Transformer.at("0x95C1c52C2B56d86bC0323Bb6e0e08c29515f956E");


  // console.log("transformer", Transformer.address);
  await transformer.initialize(
    contract.CrossChain,
    contract.BucketHub,
    contract.ObjectHub,
    contract.GroupHub,
    "0x",
    0,
    "0x",
    0,
    "0xD3420A3be0a1EFc0FBD13e87141c97B2C9AC9dD3"
  )

  */
  // console.log("tx tx", tx);

  const factory = await deployer.deploy(Factory)

  // await factory.create();
};
