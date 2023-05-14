import {
  Empty,
  Menu,
  MenuProps,
  Popconfirm,
  Space,
  Table,
  Tooltip,
} from "antd";
import { ColumnsType } from "antd/es/table";
import Head from "next/head";
import React, { useState } from "react";
import RemoveOrder from "@/components/Orders/RemoveOrder";
import PurchaseOrder from "@/components/Orders/PurchaseOrder";
// import { v4 as uuidv4 } from "uuid";
import { knexusAddress } from "@/config";
import { useContractRead } from "wagmi";
// import nft1 from "../../../public/images/nft1.svg";
// import nft2 from "../../../public/images/nft2.svg";
// import Bitmap from "../../../public/images/Bitmap.svg";
// import Image from "next/image";
import { doDownload } from "@/client";
import { useAccount } from "wagmi";
import { BigNumber, ethers } from "ethers";

type MenuItem = Required<MenuProps>["items"][number];

function getItem(
  label: React.ReactNode,
  key: React.Key,
  icon?: React.ReactNode,
  children?: MenuItem[],
  type?: "group"
): MenuItem {
  return {
    key,
    icon,
    children,
    label,
    type,
  } as MenuItem;
}

const items: MenuProps["items"] = [
  getItem("My Publish", "myPublish", null),
  getItem("My Purchase", "myPurchase", null),
  getItem("Public List", "publicList", null),
  // getItem("Public List", "publicList", null, [
  //   getItem("Data", "data"),
  //   getItem("NFT Prompt", "nftPrompt"),
  // ]),
];

interface DataType {
  type: string;
  key: string;
  name: string;
  description: string;
  children?: any;
}

// const handleBuy = (id: string) => {
//   // TODO:
// };



// const columns: ColumnsType<DataType> = [
//   {
//     title: "Data Name",
//     dataIndex: "name",
//     key: "name",
//     render: (text) => <a>{text}</a>,
//     width: "25%",
//   },
//   {
//     title: "Data Description",
//     dataIndex: "description",
//     key: "description",
//     width: "33%",
//   },
//   {
//     title: "Price",
//     dataIndex: "price",
//     key: "price",
//     width: "18%",
//   },
//   {
//     title: "Action",
//     key: "action",
//   },
// ];

// interface nftDataType {
//   key: string;
//   img: any;
//   title: string;
//   prompt: string;
//   price: string;
// }

// const nftColumns: ColumnsType<nftDataType> = [
//   {
//     title: "NFT",
//     dataIndex: "title",
//     key: "title",
//     render: (text, record) => (
//       <div className="bg-[#333] inline-block rounded-lg shadow-lg">
//         <Image src={record.img} alt="" />
//         <p className="p-2 flex justify-between items-center">
//           <span>{text}</span>
//           <div
//             style={{
//               filter: "drop-shadow(0px 4px 4px rgba(0, 0, 0, 0.25))",
//               padding: 4,
//               boxShadow: "-1px -1px 5px #383838",
//               borderRadius: "50%",
//             }}
//           >
//             <Image width={20} src={Bitmap} alt=""></Image>
//           </div>
//         </p>
//       </div>
//     ),
//   },
//   {
//     title: "prompt",
//     dataIndex: "prompt",
//     key: "prompt",
//     width: "30%",
//     render: (prompt: string) => (
//       <Tooltip
//         title={prompt}
//         placement="right"
//         overlayClassName="w-[600px]"
//         autoAdjustOverflow={false}
//       >
//         {prompt.substring(0, 160) + "..."}
//       </Tooltip>
//     ),
//   },
//   {
//     title: "Price",
//     dataIndex: "price",
//     key: "price",
//     render: (text) => (
//       <>
//         <span className="text-2xl font-bold">{text}</span>
//         <span className="text-base ml-2">BNB</span>
//       </>
//     ),
//   },
//   {
//     title: "Action",
//     key: "action",
//     render: (text, record) => (
//       <Popconfirm
//         title="Buy"
//         description="Confirm to buy the data?"
//         onConfirm={() => handleBuy(record.key)}
//         onCancel={() => {}}
//         okText="Yes"
//         cancelText="Cancel"
//       >
//         <a className="text-[#BBE7E6] text-3xl font-bold">Buy</a>
//       </Popconfirm>
//     ),
//   },
// ];

// const dataNfts: nftDataType[] = [
//   {
//     key: uuidv4(),
//     title: "No.2518",
//     price: "1.12443554",
//     img: nft1,
//     prompt: `The portrait is centered,(close-up:1.0),(nagative space:0.8),(solo)(portrait:1.1), (head and shoulder: full image 1:1), Azuki, head and shoulder_only, profile, masterpiece, best quality, boxer, 1girl, solo, facing left, down, open_mouth, smiling, happy emotion, white shirt, hair_ornament, green hair, Pink_cloat, light green hair, :d, multicolored_hair, blue eyes, wings, white_hairclip, blue eyes, hair_bun, chibi, ponytail, black_choker, blush_stickers, hands behind body, both hands in pocket, animal ears, cherry blossoms, Dehya, elderly woman, (floating colorful {wind|water magic|ink|crystals|ice|fire|flame|lightning|web|rocks|sand|particles|sparkles|blood}:1.0),(many colorful {soap bubbles|clouds|thorns|spikes|vines|currents|spirals|halos|wings|tatoos|cubes|octahedron}:1.0),, feathered_wings, angel_wings, white_wings, <lora:mixProV3_v3-000002:0.8>`,
//   },
//   {
//     key: uuidv4(),
//     title: "No.10",
//     price: "2.2121212",
//     img: nft2,
//     prompt: `The portrait is centered,(close-up:1.0),(nagative space:0.8),(solo)(portrait:1.1), (head and shoulder: full image 1:1), Azuki, head and shoulder_only, profile, masterpiece, best quality, boxer, 1girl, solo, facing left, down, open_mouth, smiling, happy emotion, white shirt, hair_ornament, green hair, Pink_cloat, light green hair, :d, multicolored_hair, blue eyes, wings, white_hairclip, blue eyes, hair_bun, chibi, ponytail, black_choker, blush_stickers, hands behind body, both hands in pocket, animal ears, cherry blossoms, Dehya, elderly woman, (floating colorful {wind|water magic|ink|crystals|ice|fire|flame|lightning|web|rocks|sand|particles|sparkles|blood}:1.0),(many colorful {soap bubbles|clouds|thorns|spikes|vines|currents|spirals|halos|wings|tatoos|cubes|octahedron}:1.0),, feathered_wings, angel_wings, white_wings, <lora:mixProV3_v3-000002:0.8>`,
//   },
// ];
const columnsSubtree: (
  action: "Buy" | "Unlist" | "Download"
) => ColumnsType<DataType> = (action) => {
  return [
    {
      title: "Data Name",
      dataIndex: "name",
      key: "name",
      render: (text) => <a>{text}</a>,
    },
    {
      title: "Group ID",
      dataIndex: "groupId",
      key: "groupId",
      render: text => <span>{BigNumber.from(text).toNumber()}</span>
    },
    {
      title: "Description",
      dataIndex: "description",
      key: "description",
    },
    {
      title: "Price",
      dataIndex: "price",
      key: "price",
      render: text => <span>{ethers.utils.formatUnits(text)} BNB</span>
    },
    {
      title: "",
      key: "action",
      render: (_, record:any) => (
        <Space size="middle">
          {action === "Buy" && (
            <PurchaseOrder id={record.id} price={record.price}>
              <a className="text-[#BBE7E6] font-bold">{action}</a>
            </PurchaseOrder>
            // <Popconfirm
            //   title="Buy"
            //   description="Confirm to buy the data?"
            //   onConfirm={() => handleBuy(record.key)}
            //   onCancel={() => {}}
            //   okText="Yes"
            //   cancelText="Cancel"
            // >
            //   <a className="text-[#BBE7E6] font-bold">{action}</a>
            // </Popconfirm>
          )}
          {action === "Download" && (
            <a className="text-[#BBE7E6] font-bold" onClick={() => doDownload('knexus', record.name)}>Download</a>
          )}
          {action === "Unlist" && (
            <RemoveOrder id={record.id}>
              <a className="text-[#BBE7E6] font-bold">Unlist</a>
            </RemoveOrder>
            // <Popconfirm
            //   title="Buy"
            //   description="Confirm to unlist the data?"
            //   onConfirm={() => handleBuy(record.key)}
            //   onCancel={() => {}}
            //   okText="Yes"
            //   cancelText="Cancel"
            // >
            //   <a className="text-[#BBE7E6] font-bold">Unlist</a>
            // </Popconfirm>
          )}
        </Space>
      ),
    },
  ];
};


export default function Datamarket() {
  const { address } = useAccount();
  const [activeMenu, setActiveMenu] = useState<
    "myPublish" | "myPurchase" | "publicList" | "data" | "nftPrompt"
  >("myPublish");
  const onClick: MenuProps["onClick"] = (e: any) => {
    setActiveMenu(e.key);
  };

  const {data : orders} = useContractRead({
    address: knexusAddress,
    abi: [
      {
        inputs: [],
        name: "getAllOrders",
        outputs: [
          {
            components: [
              {
                internalType: "uint256",
                name: "id",
                type: "uint256",
              },
              {
                internalType: "address",
                name: "creator",
                type: "address",
              },
              {
                internalType: "string",
                name: "name",
                type: "string",
              },
              {
                internalType: "string",
                name: "description",
                type: "string",
              },
              {
                internalType: "uint256",
                name: "dataId",
                type: "uint256",
              },
              {
                internalType: "uint256",
                name: "groupId",
                type: "uint256",
              },
              {
                internalType: "uint256",
                name: "price",
                type: "uint256",
              },
              {
                internalType: "bool",
                name: "isAvailable",
                type: "bool",
              },
              {
                internalType: "address",
                name: "purchaser",
                type: "address",
              },
            ],
            internalType: "struct KNexus.Order[]",
            name: "",
            type: "tuple[]",
          },
        ],
        stateMutability: "view",
        type: "function",
      },
    ],
    functionName: "getAllOrders",
    watch: true,
  });

  return (
    <>
      <Head>
        <title>Create Api Key</title>
        <meta name="description" content="Generated by create next app" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <div className="mt-[50px]">
        <div className="mx-20">
          <h1 className="text-2xl font-bold">Data Market</h1>
          <p className="text-xl my-2">View your data list</p>
          <div className="flex my-6">
            <Menu
              onClick={onClick}
              style={{ width: 256, background: "transparent", height: 600 }}
              defaultSelectedKeys={["myPublish"]}
              defaultOpenKeys={["publicList"]}
              mode="inline"
              items={items}
            />
            <div className="flex-1">
              <div className="w-11/12 mx-auto">
                {activeMenu === "myPublish" ? (
                  <Table
                    columns={columnsSubtree("Unlist") as any}
                    scroll={{ y: 600 }}
                    pagination={false}
                    // expandable={{
                    //   expandedRowRender: (record) => (
                    //     <>
                    //       {record.children ? (
                    //         <Table
                    //           pagination={false}
                    //           columns={columnsSubtree("Unlist")}
                    //           showHeader={false}
                    //           dataSource={record.children}
                    //         />
                    //       ) : (
                    //         <Empty
                    //           style={{ marginBlock: 0, padding: "20px 0" }}
                    //           image={Empty.PRESENTED_IMAGE_SIMPLE}
                    //         />
                    //       )}
                    //     </>
                    //   ),
                    //   defaultExpandAllRows: true,
                    // }}
                    dataSource={orders?.filter(item => item.creator === address && item.isAvailable)}
                  />
                ) : null}
                {activeMenu === "myPurchase" ? (
                  <Table
                    columns={columnsSubtree('Download') as any}
                    scroll={{ y: 600 }}
                    pagination={false}
                    // expandable={{
                    //   expandedRowRender: (record) => (
                    //     <>
                    //       {record.children ? (
                    //         <Table
                    //           pagination={false}
                    //           columns={columnsSubtree("Download")}
                    //           showHeader={false}
                    //           dataSource={record.children}
                    //         />
                    //       ) : (
                    //         <Empty
                    //           style={{ marginBlock: 0, padding: "20px 0" }}
                    //           image={Empty.PRESENTED_IMAGE_SIMPLE}
                    //         />
                    //       )}
                    //     </>
                    //   ),
                    //   defaultExpandAllRows: true,
                    // }}
                    dataSource={orders?.filter(item => item.purchaser === address)}
                  />
                ) : null}
                {activeMenu === "publicList" ? (
                  <Table
                    columns={columnsSubtree('Buy') as any}
                    scroll={{ y: 600 }}
                    pagination={false}
                    // expandable={{
                    //   expandedRowRender: (record) => (
                    //     <>
                    //       {record.children ? (
                    //         <Table
                    //           pagination={false}
                    //           columns={columnsSubtree("Buy")}
                    //           showHeader={false}
                    //           dataSource={record.children}
                    //         />
                    //       ) : (
                    //         <Empty
                    //           style={{ marginBlock: 0, padding: "20px 0" }}
                    //           image={Empty.PRESENTED_IMAGE_SIMPLE}
                    //         />
                    //       )}
                    //     </>
                    //   ),
                    //   defaultExpandAllRows: true,
                    // }}
                    dataSource={orders?.filter(item => item.isAvailable)}
                  />
                ) : null}
                {/* {activeMenu === "nftPrompt" ? (
                  <Table
                    dataSource={dataNfts}
                    columns={nftColumns}
                    pagination={false}
                  />
                ) : null} */}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
