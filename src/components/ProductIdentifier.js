import React, { useState } from "react";

export default function ProductIdentifier() {

  const API_BASE = process.env.REACT_APP_API_BASE_URL || "";
  
  const [result, setResult] = useState(null);

  const handleUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('image', file);

    try {
      const response = await fetch(`${API_BASE}/api/identify`, {
        method: 'POST',
        body: formData,
      });
      // const response = await fetch('/api/identify', {
      //   method: 'POST',
      //   body: formData,
      // });

      const data = await response.json();
      setResult(data.product);
    } catch (error) {
      console.error('Upload error:', error);
    }
  };

  const handleCapture = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.capture = 'environment';
    input.onchange = handleUpload;
    input.click();
  };

  return (
    <div style={{ padding: '20px' }}>
      <h2>Product Identifier</h2>

      <input type="file" accept="image/*" onChange={handleUpload} />
      <br /><br />
      <button onClick={handleCapture}>Take Picture</button>

      {result && (
        <div style={{ marginTop: '20px' }}>
          <h3>Identified Product:</h3>
          <p>{result}</p>
        </div>
      )}
    </div>
  );
}