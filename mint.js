import { ThirdwebSDK } from "@thirdweb-dev/sdk";
import { ethers } from "ethers";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Only POST requests allowed" });
  }

  try {
    const { walletAddress } = req.body;

    if (!walletAddress) {
      return res.status(400).json({ error: "Missing walletAddress" });
    }

    // RPC + ví admin
    const provider = new ethers.providers.JsonRpcProvider(process.env.RPC_URL);
    const wallet = new ethers.Wallet(process.env.PRIVATE_KEY, provider);

    // Kết nối contract
    const sdk = ThirdwebSDK.fromSigner(wallet, provider);
    const contract = await sdk.getContract(process.env.CONTRACT_ADDRESS);

    // Mint NFT
    const tx = await contract.erc721.mintTo(walletAddress, {
      name: "Tour NFT Ticket",
      description: "NFT Kỷ Niệm Của Blog Nguyễn Nam Thắng",
      image: "https://nguyennamthang.com/wp-content/uploads/2025/08/blog-nguyen-nam-thang-cham-com.png", // thay link ảnh NFT của bạn
    });

    return res.status(200).json({ success: true, tx });
  } catch (error) {
    console.error("Mint error:", error);
    return res.status(500).json({ error: "Minting failed", details: error.message });
  }
}