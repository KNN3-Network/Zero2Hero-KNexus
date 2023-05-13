// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/proxy/transparent/TransparentUpgradeableProxy.sol";
import "@openzeppelin/contracts/proxy/transparent/ProxyAdmin.sol";
import "@openzeppelin/contracts/proxy/Clones.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "./KNexus.sol";

contract Factory is Context {
    event Created(
        address creator,
        address indexed contractAddress,
        address indexed proxyAddress
    );

    address implementation;

    constructor() {
        implementation = address(new KNexus());

        create();
    }

    /**
     * @dev create NFT contract
     */
    function create() public returns (address) {
        address clone = Clones.clone(implementation);
        ProxyAdmin admin = new ProxyAdmin();

        bytes memory data = abi.encodeWithSignature(
            "initialize(address,address,address,address,address,uint256,address,uint8,address)",
            address(0xeEBe00Ac0756308ac4AaBfD76c05c4F3088B8883),
            address(0x9CfA6D15c80Eb753C815079F2b32ddEFd562C3e4),
            address(0x427f7c59ED72bCf26DfFc634FEF3034e00922DD8),
            address(0x275039fc0fd2eeFac30835af6aeFf24e8c52bA6B),
            address(0),
            0,
            address(0xD3420A3be0a1EFc0FBD13e87141c97B2C9AC9dD3),
            2,
            address(0xD3420A3be0a1EFc0FBD13e87141c97B2C9AC9dD3)
        );

        TransparentUpgradeableProxy proxy = new TransparentUpgradeableProxy(
            clone,
            address(admin),
            data
        );

        // NFT(address(proxy)).transferOwnership(_msgSender());
        emit Created(msg.sender, address(clone), address(proxy));
        return address(proxy);
    }
}
