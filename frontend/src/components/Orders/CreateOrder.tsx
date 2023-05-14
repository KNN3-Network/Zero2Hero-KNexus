import React from "react";
import { knexusAddress } from "@/config";
import {
  usePrepareContractWrite,
  useContractWrite,
  useWaitForTransaction,
} from "wagmi";
import { toast } from "react-toastify";
import { Spin } from "antd";
import { BigNumber, ethers } from "ethers";

export default function CreateOrder({
  children,
  price,
  description,
  objectName,
  id,
  groupId,
  onSuccess,
}: any) {
  console.log("create order", price, description, objectName, id, groupId);
  const { config } = usePrepareContractWrite({
    address: knexusAddress,
    abi: [
      {
        inputs: [
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
            name: "_dataId",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "_groupId",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "price",
            type: "uint256",
          },
        ],
        name: "createOrder",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
      },
    ],
    functionName: "createOrder",
    args: [
      objectName,
      description,
      id,
      groupId,
      price ? ethers.utils.parseUnits(price, "ether") : BigNumber.from(0),
    ],
  });

  const { write, data } = useContractWrite(config);

  const { isLoading, isSuccess } = useWaitForTransaction({
    hash: data?.hash,
    onSuccess: () => {
      toast.success("Success");
      onSuccess();
    },
  });

  return (
    <Spin spinning={isLoading}>
      <div
        onClick={() => {
          !isLoading && write?.();
        }}
      >
        {children}
      </div>
    </Spin>
  );
}
