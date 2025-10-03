import express from "express";
import multer from "multer";
import { create } from "ipfs-http-client";
import QRCode from "qrcode";
import cors from "cors";
import path from "path";

const app = express();
app.use(cors());
app.use(express.json());

// Cấu hình Multer (upload file tạm)
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// Kết nối IPFS (dùng Infura)
const projectId = process.env.IPFS_PROJECT_ID || "YOUR_INFURA_PROJECT_ID";
const projectSecret = process.env.IPFS_PROJECT_SECRET || "YOUR_INFURA_PROJECT_SECRET";
const auth =
  "Basic " + Buffer.from(projectId + ":" + projectSecret).toString("base64");

const ipfs = create({
  host: "ipfs.infura.io",
  port: 5001,
  protocol: "https",
  headers: { authorization: auth },
});

// API Upload
app.post("/upload", upload.single("file"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    // Đẩy file lên IPFS
    const { cid } = await ipfs.add(req.file.buffer);
    const url = `https://ipfs.io/ipfs/${cid.toString()}`;

    // Tạo mã QR
    const qrCode = await QRCode.toDataURL(url);

    res.json({
      cid: cid.toString(),
      url,
      qrCode,
    });
  } catch (error) {
    console.error("Upload error:", error);
    res.status(500).json({ error: "Upload failed" });
  }
});

// Chạy server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
