import Head from "next/head";
import React, { useState } from "react";
import ufo from "../../../public/images/ufo.png";
import Image from "next/image";
import { useStore } from "@/lib/store";
import { BaseModal } from "@/components/BaseModal";
import { Box, Button, Flex } from "@chakra-ui/react";
import { toast } from "react-toastify";
import { v4 as uuidv4 } from "uuid";
import { Empty, Space, Table } from "antd";
import CreateOrder from "@/components/Orders/CreateOrder";

export default function Group() {
  const [activeObject, setActiveObject] = useState<any>({});
  const [groupName, setGroupName] = useState("");
  const [price, setPrice] = useState("");
  const [description, setDescription] = useState("");
  const { setGroupModalOpen, groupModalOpen, groups, setGroups } = useStore();
  const [publishModalOpen, setPublishModalOpen] = useState(false);

  interface DataType {
    name: string;
    id: string;
    type: string;
    description: string;
    children?: DataType[];
  }
  const columns: any = [
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Description",
      dataIndex: "description",
      key: "description",
    },
    {
      title: "操作",
      dataIndex: "options",
      key: "options",
      render: (text: any, record: any) => {
        console.log(record);
        return (
          <div className="flex justify-end">
            <Space size="large" className="mr-4">
              {record.type === "data" ? (
                <a
                  onClick={() => {
                    setPublishModalOpen(true);
                    setActiveObject(record);
                    setDescription("");
                    setPrice("");
                  }}
                >
                  Publish
                </a>
              ) : null}
            </Space>
          </div>
        );
      },
    },
  ];

  // create group
  const handleSubmit = async () => {
    setGroups({
      key: uuidv4(),
      name: groupName,
      description: "",
      children: [],
      type: "group",
    });
    setGroupName("");
    setGroupModalOpen(false);
    // TODO:
  };

  // publish
  const handlePublish = async () => {
    setPublishModalOpen(false);
  };

  return (
    <>
      <Head>
        <title>Create Api Key</title>
        <meta name="description" content="Generated by create next app" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <div className="mt-[50px]">
        {!groups.length ? (
          <div className="flex flex-row justify-center items-center mx-20">
            <div className="mt-10 ">
              <div className="w-64 h-64 mx-auto my-5">
                <Image
                  src={ufo}
                  alt=""
                  className="w-full h-full object-cover"
                />
              </div>
              <p className="font-jura text-xl text-center flex justify-center -mt-10">
                No Group has been created for your account.
              </p>
              <div className="font-jura text-xl text-center flex justify-center mt-8">
                <button
                  className="flex-shrink-0 disabled mb-6 flex items-center p-1 px-4 rounded bg-stone-600 hover:bg-stone-700 active:bg-stone-500 focus:ring-stone-500 text-sm"
                  onClick={() => setGroupModalOpen(true)}
                >
                  Create Group
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="mx-20">
            <h1 className="text-2xl font-bold">Group</h1>
            <p className="text-xl my-2">Select a group to store data</p>
            <div className="flex flex-wrap my-6">
              <Button
                isDisabled={true}
                variant="grayPrimary"
                fontSize="sm"
                paddingX={6}
                color={"#fff"}
                className="!mt-[10px] h-[35px] leading-3 mr-4"
                onClick={() => setGroupModalOpen(true)}
              >
                Create Group
              </Button>
            </div>
            <div style={{ maxHeight: `calc(100vh - 320px)`, overflow: "auto" }}>
              {groups.map((item, index) => {
                return (
                  <div key={index} className="mb-6 overflow-auto">
                    <Table
                      pagination={false}
                      showHeader={false}
                      size="middle"
                      columns={columns}
                      expandable={{
                        defaultExpandAllRows: true,
                      }}
                      dataSource={[item]}
                    />
                    {!item.children ? (
                      <div className="bg-[#1C2222]">
                        <Empty
                          style={{ marginBlock: 0, padding: "20px 0" }}
                          image={Empty.PRESENTED_IMAGE_SIMPLE}
                        />
                      </div>
                    ) : null}
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
      <BaseModal
        isOpen={groupModalOpen}
        onClose={() => setGroupModalOpen(false)}
      >
        <Flex w="full" justifyContent="space-between" flexDirection="column">
          <div className="mt-[20px] lg:w-[400px] sm:w-[300px]">
            <h3>Group Name</h3>
            <input
              type="text"
              placeholder="Please enter"
              className="my-6 text-[#000] w-full h-[35px] bg-[#A0A79F] font-swiss721md border-0 block"
              value={groupName}
              onChange={(e) => setGroupName(e.target.value)}
            />
            <p className="font-jura text-sm ml-2">
              No Group has been created for your account.
            </p>
          </div>
          <Box mt={5} textAlign="right">
            <Button
              variant="grayPrimary"
              fontSize="sm"
              paddingX={6}
              color={groupName.length ? "#fff" : "#999"}
              isDisabled={!groupName.length}
              className="!mt-[10px] h-[35px] leading-3"
              onClick={handleSubmit}
            >
              Submit
            </Button>
          </Box>
        </Flex>
      </BaseModal>
      <BaseModal
        isOpen={publishModalOpen}
        onClose={() => setPublishModalOpen(false)}
      >
        <Flex w="full" justifyContent="space-between" flexDirection="column">
          <div className="mt-[20px] lg:w-[400px] sm:w-[300px]">
            <h3>Description</h3>
            <div className="relative">
              <input
                placeholder="Please enter"
                className="my-6 text-[#000] pl-2 w-full h-[35px] bg-[#A0A79F] font-swiss721md border-0 block pr-12"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>
          </div>
          <div className="mt-[20px] lg:w-[400px] sm:w-[300px]">
            <h3>Data Price</h3>
            <div className="relative">
              <input
                type="number"
                min={0}
                max={1000000000000000000000}
                placeholder="Please enter"
                className="my-6 text-[#000] w-full h-[35px] bg-[#A0A79F] font-swiss721md border-0 block pr-12"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
              />
              <span className="text-[#000] absolute right-2 top-0 translate-y-1/4">
                BNB
              </span>
            </div>
          </div>
          <Box textAlign="right" mt={1}>
            <CreateOrder
              price={price}
              onSuccess={() => setPublishModalOpen(false)}
              description={description}
              objectName={activeObject.name}
              id={activeObject.id}
              groupId={activeObject.groupId}
            >
              <Button
                variant="grayPrimary"
                fontSize="sm"
                paddingX={6}
                color={price.length ? "#fff" : "#999"}
                isDisabled={!price.length}
                className="h-[35px] leading-3"
                // onClick={handlePublish}
              >
                Submit
              </Button>
            </CreateOrder>
          </Box>
        </Flex>
      </BaseModal>
    </>
  );
}