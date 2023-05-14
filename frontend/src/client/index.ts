import { GRPC_URL } from "@/config";
// import { makeRpcClient } from "@bnb-chain/greenfield-chain-sdk";
import Long from "long";
import axios from "axios";
// import { QueryClientImpl as spQueryClientImpl } from "@bnb-chain/greenfield-cosmos-types/greenfield/sp/query";
// import { QueryClientImpl as storageQueryClientImpl } from "@bnb-chain/greenfield-cosmos-types/greenfield/storage/query";

// export const getSpStoragePriceByTime = async () => {
//   const rpcClient = await makeRpcClient(GRPC_URL);

//   const rpc = new spQueryClientImpl(rpcClient);
//   const res = await rpc.QueryGetSpStoragePriceByTime({
//     spAddr: "0xA4187E64dD484ce8Fe102bfAf498c884Df37cF7b",
//     timestamp: Long.fromNumber(1678772331382),
//   });
//   return res;
// };

// export const getStorageProviders = async () => {
//   const rpcClient = await makeRpcClient(GRPC_URL);

//   const rpc = new spQueryClientImpl(rpcClient);
//   const res = await rpc.StorageProviders({
//     pagination: undefined,
//   });
//   console.log(res.sps.map((t) => t.operatorAddress));
//   return res;
// };

// export const getBucketInfo = async (rpcUrl: string, bucketName: string) => {
//   const rpcClient = await makeRpcClient(rpcUrl);

//   const rpc = new storageQueryClientImpl(rpcClient);
//   const bucketInfoRes = await rpc.HeadBucket({
//     bucketName,
//   });

//   const bucketId = bucketInfoRes?.bucketInfo?.id;
//   if (!bucketId) throw new Error("no such bucket");

//   return await rpc.HeadBucketById({
//     bucketId,
//   });
// };

export const getBucketList = async (userAddress: `0x${string}` = "0x") => {
  const res = await axios.get(`https://gnfd-testnet-sp-6.bnbchain.org`, {
    headers: {
      "x-gnfd-user-address": userAddress,
    },
  });
  return res.data;
};

export const getObjectList = async (bucketName: string) => {
  const res = await axios.get(
    `https://${bucketName}.gnfd-testnet-sp-4.bnbchain.org`
  );
  return res.data;
};

export const doDownload = async (bucketName: string, objectName: string) => {

  const downloadURL = `https://gnfd-testnet-sp-4.bnbchain.org/download/${bucketName}/${objectName}`

  const res = await fetch(downloadURL);
  const blob = await res.blob();
  const url = URL.createObjectURL(blob);
  var a = document.createElement("a");
  a.href = url;
  a.download = objectName;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
}

export const getApproval = async (
  userAddress: string = "",
  bucketName: string
) => {
  const b = (e = "") => e.charCodeAt(0).toString(16);

  const w = (e = "") => e.split("").map(b).join("");

  console.log('b', userAddress, bucketName)

  let g = w(
    JSON.stringify({
      type: "storage/CreateBucket",
      value: {
        creator: userAddress,
        bucket_name: bucketName,
        visibility: 1,
        primary_sp_address: "0xd8283E74d729B428712C2d393632Fc527B0F39CF",
        primary_sp_approval: {},
        charged_read_quota: "0",
      },
    })
  );

  const res = await axios.get(
    `https://gnfd-testnet-sp-1.bnbchain.org/greenfield/admin/v1/get-approval?action=CreateBucket`,
    {
      headers: {
        authorization:
          "authTypeV2 ECDSA-secp256k1, Signature=1234567812345678123456781234567812345678123456781234567812345678",
        "x-gnfd-unsigned-msg": g,
      },
    }
  );

  const signedMsg = res.headers["x-gnfd-signed-msg"];

  return signedMsg;
};

// export const getObjectInfo = async (
//   rpcUrl: string,
//   bucketName: string,
//   objectName: string
// ) => {
//   const rpcClient = await makeRpcClient(rpcUrl);
//   const rpc = new storageQueryClientImpl(rpcClient);
//   const objInfoRes = await rpc.HeadObject({
//     bucketName,
//     objectName,
//   });

//   const objectId = objInfoRes?.objectInfo?.id;
//   if (!objectId) throw new Error("no such object");

//   return await rpc.HeadObjectById({
//     objectId,
//   });
// };
