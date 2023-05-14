import '@/styles/globals.css';
import '@/styles/style.css';
import type { AppProps } from 'next/app'
import customTheme from "@/styles/theme"
import localFont from "@next/font/local"
import { Jura } from "@next/font/google"
import { ConfigProvider, theme } from "antd"
import { createClient, WagmiConfig } from 'wagmi'
import { ToastContainer, toast } from 'react-toastify';
  import 'react-toastify/dist/ReactToastify.css';

import {
  metaMaskWalletConnector,
  provider,
  trustWalletConnector,
  webSocketProvider,
} from '@/config';
import Navbar from '@/components/Navbar';
import { useRouter } from 'next/router';
import { ChakraProvider } from '@chakra-ui/react';

const wagmiClient = createClient({
  autoConnect: true,
  provider,
  webSocketProvider,
  connectors: [metaMaskWalletConnector, trustWalletConnector],
});

export const jura = Jura({
	subsets: ["latin"],
	variable: "--font-jura",
});

export const swiss721md = localFont({
	src: "../../public/fonts/Swiss-721-Medium-BT.ttf",
	variable: "--font-swiss721md",
});

export const swiss721blk = localFont({
	src: "../../public/fonts/Swiss721BT-Black.otf",
	variable: "--font-swiss721blk",
});

// export const swis721rl = localFont({
// 	src: "../public/fonts/Swis721BT-Regular2.otf",
// 	variable: "--font-swis721rl",
// });

export const swiss721 = localFont({
	src: "../../public/fonts/Swiss-721-BT-Font.ttf",
	variable: "--font-swiss",
});

const excluded = localFont({
	src: "../../public/fonts/Excluded.ttf",
	variable: "--font-excluded",
});

const nasalization = localFont({
	src: "../../public/fonts/nasalization-rg.otf",
	variable: "--font-nasalization",
});

export default function App({ Component, pageProps }: AppProps) {
  const router = useRouter();
  return (
    <ConfigProvider
				theme={{
					algorithm: theme.darkAlgorithm,
				}}
			>
      <ChakraProvider theme={customTheme}>
        <WagmiConfig client={wagmiClient}>
          { router.pathname === '/login' ? <div className="bgImg loginPageBg"></div> : null }
          <style jsx global>
            {`
            :root {
              --font-jura: ${jura.style.fontFamily};
              --font-swiss: ${swiss721.style.fontFamily}
              --font-swiss721md: ${swiss721md.style.fontFamily};
              --font-swiss721blk: ${swiss721blk.style.fontFamily};
              --font-excluded: ${excluded.style.fontFamily};
              --font-nasalization: ${nasalization.style.fontFamily};
            }
          `}
          </style>
          <main className={`font-swiss text-white`}>
            <Navbar/>
            <Component {...pageProps} />
          </main>
        </WagmiConfig>
      </ChakraProvider>
      <ToastContainer />
    </ConfigProvider>
  );
}
