import React from "react";
import { knexusAddress } from "@/config";
import { ethers, BigNumber } from "ethers";
import { toast } from "react-toastify";
import { Spin } from "antd";
import {
  usePrepareContractWrite,
  useContractWrite,
  useWaitForTransaction,
} from "wagmi";

export default function PurchaseOrder({ children, id, price }: any) {
  console.log("purchase", price);
  // const payEther = BigNumber.from(
  //   ethers.utils.parseUnits(price, "ether")
  // ).toString();
  // console.log("payether", payEther);
  const { config } = usePrepareContractWrite({
    address: knexusAddress,
    abi: [
      {
        inputs: [
          {
            internalType: "uint256",
            name: "id",
            type: "uint256",
          },
        ],
        name: "purchaseOrder",
        outputs: [],
        stateMutability: "payable",
        type: "function",
      },
    ],
    functionName: "purchaseOrder",
    args: [id],
    overrides: {
      value: BigNumber.from(Number(price)),
    },
  });

  const { write, data } = useContractWrite(config);

  const { isLoading, isSuccess } = useWaitForTransaction({
    hash: data?.hash,
    onSuccess: () => {
      toast.success("Success");
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
