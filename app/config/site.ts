import { defineChain } from "viem";

export type SiteConfig = typeof siteConfig;

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
    profile: "0x96E6AF6E9e400d0Cd6a4045F122df22BCaAAca59" as `0x${string}`,
    post: "0x17DC361D05E1A608194F508fFC4102717666779f" as `0x${string}`,
  },
};
