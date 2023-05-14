import React, { useEffect } from "react";
import Image from "next/image";
import acctIcon from "../../public/images/account-icon.svg";
import { useAccount, useConnect } from "wagmi";
import { metaMaskWalletConnector } from '@/config';

export default function ConnectWallet() {
	const {address} = useAccount();
	const { connect } = useConnect({
		connector: metaMaskWalletConnector,
	});


	useEffect(()=>{
		connect();
	}, [])
	return (
		<div
			style={{ background: "rgba(255, 255, 255, 0.1)",  height: 40 }}
			className="flex text-md items-center justify-center relative px-3"
		>
			<div>
				{address && address ? 
					<span className={`text-[#B4B4B4]`} onClick={() => { navigator.clipboard.writeText(address); }}>
						{ address.substring(0, 5) + "..." + address.substring(address.length - 4, address.length)}
					</span>
				 : 
					<span className="cursor-pointer text-base" onClick={() => connect()}>
						Connect wallet
					</span>
				}
			</div>
			<div className="text-right">
				<Image
					src={acctIcon}
					alt=""
					className="inline-block rounded-full w-[25px] ml-2"
				/>
			</div>
		</div>
	);
}
