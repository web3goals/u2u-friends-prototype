import { siteConfig } from "@/config/site";
import pinataSDK from "@pinata/sdk";
import axios from "axios";

const pinata = new pinataSDK(
  process.env.NEXT_PUBLIC_PINATA_API_KEY,
  process.env.NEXT_PUBLIC_PINATA_API_SECRET
);

export async function uploadJsonToIpfs(json: any): Promise<string> {
  const { IpfsHash } = await pinata.pinJSONToIPFS(json, {
    pinataMetadata: {
      name: `${siteConfig.name} - Data`,
    },
  });
  return ipfsHashToIpfsUri(IpfsHash);
}

export async function loadJsonFromIpfs(uri: string): Promise<any> {
  const response = await axios.get(ipfsUriToHttpUri(uri));
  if (response.data.errors) {
    throw new Error(`Fail to loading json from IPFS: ${response.data.errors}`);
  }
  return response.data;
}

export function ipfsHashToIpfsUri(ipfsHash: string): string {
  return `ipfs://${ipfsHash}`;
}

export function ipfsUriToHttpUri(ipfsUri?: string): string {
  if (!ipfsUri || !ipfsUri.startsWith("ipfs://")) {
    throw new Error(`Fail to converting IPFS URI to HTTP URI: ${ipfsUri}`);
  }
  return ipfsUri.replace(
    "ipfs://",
    `${process.env.NEXT_PUBLIC_PINATA_GATEWAY}/ipfs/`
  );
}
