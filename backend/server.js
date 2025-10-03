import express from "express";
import cors from "cors";
import multer from "multer";
import QRCode from "qrcode";
import axios from "axios";
import FormData from "form-data";
import fs from "fs";

const app = express();
const upload = multer({ dest: "uploads/" });
app.use(cors());
app.use(express.json());

// ⚡ Cấu hình API token Web3.Storage (đăng ký free: https://web3.storage/)
const WEB3_TOKEN = "YOUR_WEB3_STORAGE_API_TOKEN";

app.post("/upload", upload.single("file"), async (req, res) => {
  try {
    const filePath = req.file.path;
    const fileStream = fs.createReadStream(filePath);

    // Upload file lên Web3.Storage
    const formData = new FormData();
    formData.append("file", fileStream);

    const uploadRes = await axios.post("https://api.web3.storage/upload", formData, {
      headers: {
        Authorization: `Bearer ${WEB3_TOKEN}`,
        ...formData.getHeaders(),
      },
    });

    const cid = uploadRes.data.cid;
    const ipfsUrl = `https://ipfs.io/ipfs/${cid}`;

    // Tạo QR code
    const qrCodeData = await QRCode.toDataURL(ipfsUrl);

    // Xoá file tạm
    fs.unlinkSync(filePath);

    res.json({
      success: true,
      ipfsUrl,
      qrCodeData,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Upload failed" });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Backend running on port ${PORT}`));
