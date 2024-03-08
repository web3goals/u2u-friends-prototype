import { defineChain } from "viem";
import { polygon } from "viem/chains";

export type SiteConfig = typeof siteConfig;

polygon;

export const siteConfig = {
  emoji: "👻",
  name: "U2U Friends",
  description: "Social network in the U2U ecosystem",
  links: {
    github: "https://github.com/web3goals/u2u-friends-prototype",
  },
  contracts: {
    chain: defineChain({
      id: 2484,
      name: "Unicorn Ultra Nebulas",
      network: "nebulas",
      nativeCurrency: { name: "U2U", symbol: "U2U", decimals: 18 },
      rpcUrls: {
        default: {
          http: ["https://rpc-nebulas-testnet.uniultra.xyz/"],
        },
        public: {
          http: ["https://rpc-nebulas-testnet.uniultra.xyz/"],
        },
      },
      blockExplorers: {
        default: {
          name: "Nebulas Testnet U2U Explorer",
          url: "https://testnet.u2uscan.xyz/",
        },
      },
      testnet: true,
    }),
    profile: "0x0000000000000000000000000000000000000000" as `0x${string}`,
    post: "0x0000000000000000000000000000000000000000" as `0x${string}`,
  },
};
