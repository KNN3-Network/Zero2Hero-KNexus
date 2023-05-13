// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@bnb-chain/greenfield-contracts-sdk/BucketApp.sol";
import "@bnb-chain/greenfield-contracts-sdk/ObjectApp.sol";
import "@bnb-chain/greenfield-contracts-sdk/GroupApp.sol";
import "@bnb-chain/greenfield-contracts-sdk//interface/IERC1155.sol";
import "@bnb-chain/greenfield-contracts-sdk//interface/IERC721Nontransferable.sol";
import "@bnb-chain/greenfield-contracts-sdk//interface/IERC1155Nontransferable.sol";
import "@openzeppelin/contracts/utils/Strings.sol";

contract KNexus is BucketApp, ObjectApp, GroupApp {
    /*----------------- constants -----------------*/
    // error code
    // 0-3: defined in `baseApp`
    string public constant ERROR_INVALID_NAME = "4";
    string public constant ERROR_RESOURCE_EXISTED = "5";
    string public constant ERROR_INVALID_PRICE = "6";
    string public constant ERROR_GROUP_NOT_EXISTED = "7";
    string public constant ERROR_DATA_NOT_ONSHELF = "8";
    string public constant ERROR_NOT_ENOUGH_VALUE = "9";

    // admins
    address public owner;
    mapping(address => bool) public operators;

    // system contract
    address public bucketToken;
    address public objectToken;
    address public groupToken;
    address public memberToken;

    // tokenId => series name
    mapping(uint256 => string) public seriesName;
    // series name => tokenId
    mapping(string => uint256) public seriesId;

    // order
    struct Order {
        uint256 id;
        address creator;
        string name;
        string description;
        uint256 dataId;
        uint256 groupId;
        uint256 price;
        bool isAvailable;
        address purchaser;
    }

    // order mapping
    mapping(uint256 => Order) public orders;
    uint256 public orderCount;

    event OrderCreated(
        uint256 indexed id,
        string name,
        string description,
        uint256 indexed dataId,
        uint256 groupId,
        uint256 indexed price,
        bool isAvailable,
        address purchaser
    );
    event OrderPurchased(uint256 indexed id);
    event OrderRemoved(uint256 indexed id);

    event OwnershipTransferred(
        address indexed previousOwner,
        address indexed newOwner
    );

    modifier onlyOwner() {
        require(msg.sender == owner, "caller is not the owner");
        _;
    }

    modifier onlyOperator() {
        require(
            msg.sender == owner || _isOperator(msg.sender),
            "caller is not the owner or operator"
        );
        _;
    }

    function initialize(
        address _crossChain,
        address _bucketHub,
        address _objectHub,
        address _groupHub,
        address _paymentAddress,
        uint256 _callbackGasLimit,
        address _refundAddress,
        uint8 _failureHandleStrategy,
        address _owner
    ) public initializer {
        require(
            _owner != address(0),
            string.concat("Transformer: ", ERROR_INVALID_CALLER)
        );
        _transferOwnership(_owner);

        bucketToken = IBucketHub(_bucketHub).ERC721Token();
        // IBucketHub(_bucketHub).grant(address(this), 3, 0);

        objectToken = IObjectHub(_objectHub).ERC721Token();
        // IObjectHub(_objectHub).grant(address(this), 2, 0);

        groupToken = IGroupHub(_groupHub).ERC721Token();
        // IGroupHub(_groupHub).grant(address(this), 3, 0);

        memberToken = IGroupHub(_groupHub).ERC1155Token();

        __base_app_init_unchained(
            _crossChain,
            _callbackGasLimit,
            _refundAddress,
            _failureHandleStrategy
        );
        __bucket_app_init_unchained(_bucketHub, _paymentAddress);
        __group_app_init_unchained(_groupHub);
        __object_app_init_unchained(_objectHub);
    }

    /**
     * @notice  . greenfieldCall
     * @dev     .
     * @param   status  .
     * @param   resoureceType  .
     * @param   operationType  .
     * @param   resourceId  .
     * @param   callbackData  .
     */
    function greenfieldCall(
        uint32 status,
        uint8 resoureceType,
        uint8 operationType,
        uint256 resourceId,
        bytes calldata callbackData
    ) external override(BucketApp, ObjectApp, GroupApp) {
        require(
            msg.sender == crossChain,
            string.concat("dApp: ", ERROR_INVALID_CALLER)
        );

        if (resoureceType == RESOURCE_BUCKET) {
            _bucketGreenfieldCall(
                status,
                operationType,
                resourceId,
                callbackData
            );
        } else if (resoureceType == RESOURCE_OBJECT) {
            _objectGreenfieldCall(
                status,
                operationType,
                resourceId,
                callbackData
            );
        } else if (resoureceType == RESOURCE_GROUP) {
            _groupGreenfieldCall(
                status,
                operationType,
                resourceId,
                callbackData
            );
        } else {
            revert(string.concat("dApp: ", ERROR_INVALID_RESOURCE));
        }
    }

    /**
     * @notice  . createSeries
     * @dev     .
     * @param   name  .
     * @param   visibility  .
     * @param   chargedReadQuota  .
     * @param   spAddress  .
     * @param   expireHeight  .
     * @param   sig  .
     */
    function createSeries(
        string calldata name,
        BucketStorage.BucketVisibilityType visibility,
        uint64 chargedReadQuota,
        address spAddress,
        uint256 expireHeight,
        bytes calldata sig
    ) external payable {
        require(
            bytes(name).length > 0,
            string.concat("dApp: ", ERROR_INVALID_NAME)
        );
        require(
            seriesId[name] == 0,
            string.concat("dApp: ", ERROR_RESOURCE_EXISTED)
        );

        bytes memory _callbackData = bytes(name); // use name as callback data
        _createBucket(
            msg.sender,
            name,
            visibility,
            chargedReadQuota,
            spAddress,
            expireHeight,
            sig,
            _callbackData
        );
    }

    /**
     * @notice  .
     * @dev     .
     * @param   name  .
     * @param   tokenId  .
     */
    function registerSeries(string calldata name, uint256 tokenId) external {
        require(
            IERC721NonTransferable(bucketToken).ownerOf(tokenId) == msg.sender,
            string.concat("dApp: ", ERROR_INVALID_CALLER)
        );
        require(
            bytes(name).length > 0,
            string.concat("dApp: ", ERROR_INVALID_NAME)
        );
        require(
            seriesId[name] == 0,
            string.concat("dApp: ", ERROR_RESOURCE_EXISTED)
        );

        seriesName[tokenId] = name;
        seriesId[name] = tokenId;
    }

    /**
     * @notice  .
     * @dev     .
     * @param   name  .
     */
    function createGroup(string memory name) public payable {
        bytes memory _callbackData = bytes(name); // use name as callback data
        _createGroup(msg.sender, name, _callbackData);
    }

    /**
     * @notice  .
     * @dev     .
     * @param   name  .
     * @param   description  .
     * @param   _dataId  .
     * @param   _groupId  .
     * @param   price  .
     */
    function createOrder(
        string memory name,
        string memory description,
        uint256 _dataId,
        uint256 _groupId,
        uint256 price
    ) external {
        require(
            IERC721NonTransferable(objectToken).ownerOf(_dataId) == msg.sender,
            string.concat("dApp: ", ERROR_INVALID_CALLER)
        );

        require(
            IERC721NonTransferable(groupToken).ownerOf(_groupId) == msg.sender,
            string.concat("dApp: ", ERROR_INVALID_CALLER)
        );

        orderCount++;

        Order memory _order = Order(
            orderCount,
            msg.sender,
            name,
            description,
            _dataId,
            _groupId,
            price,
            true,
            address(0)
        );

        orders[orderCount] = _order;
        emit OrderCreated(
            orderCount,
            _order.name,
            _order.description,
            _order.dataId,
            _order.groupId,
            _order.price,
            _order.isAvailable,
            _order.purchaser
        );
    }

    /**
     * @notice  .
     * @dev     .
     * @param   id  .
     * @return  address  .
     * @return  string  .
     * @return  string  .
     * @return  uint256  .
     * @return  uint256  .
     * @return  bool  .
     */
    function getOrder(
        uint256 id
    )
        public
        view
        returns (address, string memory, string memory, uint256, uint256, bool)
    {
        require(id <= orderCount && id > 0, "Invalid order ID");
        Order storage order = orders[id];
        return (
            order.creator,
            order.name,
            order.description,
            order.dataId,
            order.price,
            order.isAvailable
        );
    }

    /**
     * @notice  .
     * @dev     .
     * @param   dataId  .
     * @return  bool  .
     */
    function isPublished(uint256 dataId) public view returns (bool) {
        for (uint256 i = 1; i <= orderCount; i++) {
            Order storage order = orders[i];
            if (order.dataId == dataId) {
                return true;
            }
        }

        return false;
    }

    /**
     * @notice  .
     * @dev     .
     * @return  Order[]  .
     */
    function getAllOrders() public view returns (Order[] memory) {
        Order[] memory allOrders = new Order[](orderCount);
        for (uint256 i = 1; i <= orderCount; i++) {
            allOrders[i - 1] = orders[i];
        }
        return allOrders;
    }

    function removeOrder(uint256 id) public {
        require(id <= orderCount && id > 0, "Invalid order ID");
        Order storage order = orders[id];
        require(order.isAvailable, "Order is not available");
        require(order.creator == msg.sender, "invalid caller");

        order.isAvailable = false;
        emit OrderRemoved(id);
    }

    /**
     * @notice  .
     * @dev     .
     * @param   id  .
     */
    function purchaseOrder(uint256 id) external payable {
        require(id <= orderCount && id > 0, "Invalid order ID");
        Order storage order = orders[id];
        require(order.isAvailable, "Order is not available");
        require(msg.value == order.price, "Incorrect payment amount");

        order.isAvailable = false;
        order.purchaser = msg.sender;

        address _owner = IERC721NonTransferable(groupToken).ownerOf(
            order.groupId
        );

        address[] memory _member = new address[](1);
        _member[0] = msg.sender;

        _updateGroup(_owner, order.groupId, UPDATE_ADD, _member);

        (bool success, ) = payable(order.creator).call{value: order.price}("");

        require(success, "purchase fail");
        emit OrderPurchased(id);
    }

    function retryPackage(uint8 resoureceType) external override {
        if (resoureceType == RESOURCE_BUCKET) {
            _retryBucketPackage();
        } else if (resoureceType == RESOURCE_OBJECT) {
            _retryObjectPackage();
        } else if (resoureceType == RESOURCE_GROUP) {
            _retryGroupPackage();
        } else {
            revert(string.concat("dApp: ", ERROR_INVALID_RESOURCE));
        }
    }

    function skipPackage(uint8 resoureceType) external override {
        if (resoureceType == RESOURCE_BUCKET) {
            _skipBucketPackage();
        } else if (resoureceType == RESOURCE_OBJECT) {
            _skipObjectPackage();
        } else if (resoureceType == RESOURCE_GROUP) {
            _skipGroupPackage();
        } else {
            revert(string.concat("dApp: ", ERROR_INVALID_RESOURCE));
        }
    }

    function addOperator(address newOperator) public onlyOwner onlyOperator {
        operators[newOperator] = true;
    }

    function removeOperator(address operator) public onlyOwner onlyOperator {
        delete operators[operator];
    }

    /*----------------- internal functions -----------------*/
    function _transferOwnership(address newOwner) internal {
        emit OwnershipTransferred(owner, newOwner);
        owner = newOwner;
    }

    function _isOperator(address account) internal view returns (bool) {
        return operators[account];
    }
}
