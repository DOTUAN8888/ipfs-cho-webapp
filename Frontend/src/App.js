import React, { useState } from "react";
import axios from "axios";

function App() {
  const [file, setFile] = useState(null);
  const [qrCode, setQrCode] = useState("");
  const [ipfsUrl, setIpfsUrl] = useState("");

  const handleUpload = async () => {
    const formData = new FormData();
    formData.append("file", file);

    const res = await axios.post("https://YOUR-BACKEND-URL.onrender.com/upload", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });

    setIpfsUrl(res.data.ipfsUrl);
    setQrCode(res.data.qrCodeData);
  };

  return (
    <div style={{ textAlign: "center", marginTop: "50px" }}>
      <h1>BSChain Product Uploader</h1>
      <input type="file" onChange={(e) => setFile(e.target.files[0])} />
      <button onClick={handleUpload}>Upload</button>

      {ipfsUrl && (
        <div>
          <p>IPFS Link: <a href={ipfsUrl} target="_blank" rel="noreferrer">{ipfsUrl}</a></p>
          <img src={qrCode} alt="QR Code" />
        </div>
      )}
    </div>
  );
}

export default App;
