import express from "express";
import multer from "multer";
import cors from "cors";
import dotenv from "dotenv";
import { create } from "ipfs-http-client";
import QRCode from "qrcode";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Multer setup (lưu file vào bộ nhớ tạm)
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// IPFS client
const ipfs = create({
  host: "ipfs.infura.io",
  port: 5001,
  protocol: "https",
});

// API test
app.get("/", (req, res) => {
  res.send("✅ Backend server is running!");
});

// API upload file
app.post("/upload", upload.single("file"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    // Upload file lên IPFS
    const added = await ipfs.add(req.file.buffer);
    const cid = added.path;
    const url = `https://ipfs.io/ipfs/${cid}`;

    // Tạo QR code từ URL
    const qrCode = await QRCode.toDataURL(url);

    res.json({
      success: true,
      cid,
      url,
      qrCode, // base64 image
    });
  } catch (error) {
    console.error("❌ Upload failed:", error);

   
