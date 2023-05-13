pragma solidity ^0.8.4;

import "forge-std/Test.sol";
import "../contracts/KNexus.sol";

contract KNexusTest is Test {
    KNexus kNexus;
    address alice = vm.addr(1);
    address eve = vm.addr(2);
    address blob = vm.addr(3);

    struct Order {
        address creator;
        string name;
        string description;
        uint256 dataId;
        uint256 groupId;
        uint256 price;
        bool isAvailable;
        address purchaser;
    }

    function setUp() public {
        vm.prank(alice);

        // nft = new KNexus(name, symbol, contractURI, baseURI);

        kNexus = new KNexus();
        // kNexus.initialize(
        //     address(0xeEBe00Ac0756308ac4AaBfD76c05c4F3088B8883),
        //     address(0x9CfA6D15c80Eb753C815079F2b32ddEFd562C3e4),
        //     address(0x427f7c59ED72bCf26DfFc634FEF3034e00922DD8),
        //     address(0x275039fc0fd2eeFac30835af6aeFf24e8c52bA6B),
        //     address(0),
        //     0,
        //     address(0xD3420A3be0a1EFc0FBD13e87141c97B2C9AC9dD3),
        //     2,
        //     address(0xD3420A3be0a1EFc0FBD13e87141c97B2C9AC9dD3)
        // );
    }

    function test() public {
        console.log("test");
        // console.log("test");
    }

    function testCreateOrder() public {
        vm.prank(alice);
        kNexus.createOrder("name", "description", 1, 1, 1);
    }

    function testGetAllOrders() public {
        testCreateOrder();

        kNexus.getAllOrders();
        // console.log(orderArr);
    }

    function testRemoveOrder() public {
        testCreateOrder();

        kNexus.removeOrder(1);
        kNexus.getAllOrders();
        // console.log(orderArr);
    }

    function testPurchaseOrder() public {
        testCreateOrder();

        vm.prank(blob);
        deal(blob, 1 ether);
        kNexus.purchaseOrder{value: 1}(1);
        kNexus.getAllOrders();

        assertEq(address(alice).balance, 1 wei);
        // console.log(orderArr);
    }

    function testIsPublished() public {
        testCreateOrder();
        assertEq(kNexus.isPublished(2), false);
        assertEq(kNexus.isPublished(1), true);
        // console.log(orderArr);
    }
}
