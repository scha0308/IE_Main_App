import React, { useRef, useState } from 'react';
import Ecosnap_Logo from '../assets/images/logo.png';
import Green_Background from '../assets/images/Green_Background.png';
import ChineseCabbageImage from '../assets/images/Chinese_Cabbage.jpg';
import CameraCapture from '../components/CameraCapture';

export default function MobileView() {
    const [score, setScore] = useState(null);
    const [product, setProduct] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);
    const [resultMessage, setResultMessage] = useState("No image");
    const [openCamera, setOpenCamera] = useState(false);

    const API_BASE = process.env.REACT_APP_API_BASE_URL || "";

    const scrollToScoreSection = () => {
        const el = document.getElementById("product-info");
        if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
    };
    
    const uploadFile = async(file) =>{
        setImagePreview(URL.createObjectURL(file));
        setResultMessage("Analyzing...");

        const formData = new FormData();
        formData.append('image', file, file.name || 'capture.jpg');

        try {
            const res = await fetch(`${API_BASE}/api/identify`, {
                method: 'POST',
                body: formData,
            });
            // const res = await fetch('/api/identify', {
            //     method: 'POST',
            //     body: formData,
            // });

            if (!res.ok){
                const err = await res.json().catch(() => ({}));
                throw new Error(err.error || `Server error (${res.status})`);
            }

            const data = await res.json();

            setProduct(data.product || "Unknown Product");
            setScore(data.score || 0);
            setResultMessage("");
            setTimeout(scrollToScoreSection, 50);
        } catch (error) {
            console.error('Upload error:', error);
            setResultMessage("Failed to analyze image.");
            setScore(null)
        }
    };

    const handleUpload = async (event) => {
        const file = event.target.files[0];
        if (file) uploadFile(file);
    };

    const scoreColor = (() => {
        if (score === null) return "gray";
        if (score > 80) return "#00B207";
        if (score > 60) return '#84D187';
        if (score > 40) return "#d3d604ff";
        if (score > 20) return "#FF8A00";
        return "#EA4B48";
    })();

    const scoreMessage = (() => {
        if (score === null) return "No Score";
        if (score > 80) return "Excellent";
        if (score > 60) return 'Good';
        if (score > 40) return "Average";
        if (score > 20) return "Poor";
        return "Critical";
    })();

    return (
        <div style={{ width: "100%", backgroundColor: "whitesmoke" }}>

            <CameraCapture
                            isOpen={openCamera}
                            onClose={()=> setOpenCamera(false)}
                            onCapture={(blob) =>{
                                const file = new File([blob], 'capture.jpg', {type: 'image/jpeg'});
                                uploadFile(file)
                                setOpenCamera(false)
                            }}
                        />
            {/* Header Section */}
            <div style={{
                padding: "20px",
                display: "flex",
                flexDirection: "column",
                backgroundImage: `url(${Green_Background})`,
                justifyContent: "center",
                alignItems: "center",
                textAlign: "center",
                height: "600px"
            }}>
                <p style={{ fontSize: "1.5rem", fontWeight: "bold" }}>
                    Scan a barcode or upload an image and get eco-friendly score instantly.
                </p>

                <p style={{ fontSize: "2.5rem", fontWeight: "bold" }}>
                    How <span style={{ color: "#00b207" }}>eco-friendly</span> is the product in your hand?
                </p>

                <p style={{ fontSize: "1.5rem", fontWeight: "bold", color: "#00b207", marginTop: "8px" }}>
                    Scan. Snap. See the Score
                </p>

                <div style={{ marginTop: "15px", display: "flex", flexDirection: "column", gap: "15px" }}>
                    <button onClick={() => setOpenCamera(true)}
                     style={{
                        padding: "15px 25px",
                        fontSize: "1.5rem",
                        backgroundColor: "#00b207",
                        border: "0px",
                        color: "whitesmoke",
                        borderRadius: "30px"
                    }}>
                        Scan barcode now
                    </button>

                    {/* Upload Button */}
                    <label htmlFor="mobileUpload" style={{
                        padding: "15px 25px",
                        fontSize: "1.5rem",
                        backgroundColor: "#00b207",
                        border: "0px",
                        color: "whitesmoke",
                        borderRadius: "30px",
                        textAlign: "center",
                        cursor: "pointer"
                    }}>
                        Upload Image
                    </label>
                    <input
                        type="file"
                        accept="image/*"
                        id="mobileUpload"
                        style={{ display: "none" }}
                        onChange={handleUpload}
                    />
                </div>

                <p style={{ marginTop: "15px", fontSize: "1.2rem", fontWeight: "bold" }}>
                    {resultMessage}
                </p>

                {/* <button
                    onClick={() => {
                        setTimeout(() => {
                            document.getElementById("product-info")
                                ?.scrollIntoView({ behavior: "smooth" });
                        }, 500)
                    }}
                    style={{
                        marginTop: "10px",
                        padding: "15px 25px",
                        fontSize: "1.5rem",
                        backgroundColor: "#00b207",
                        border: "0px",
                        color: "whitesmoke",
                        borderRadius: "30px"
                    }}>
                    Check Eco-Score
                </button> */}
            </div>

            {/* Product Info Section */}
            <div id="product-info" style={{
                padding: "20px",
                display: "flex",
                flexDirection: "column",
                gap: "15px",
                backgroundColor: "whitesmoke",
                borderTop: `4px solid ${scoreColor}`,
                boxShadow: "0 2px 6px rgba(0,0,0,0.2)"
            }}>
                <h1 style={{ marginBottom: "20px", textAlign: "center" }}>
                    Product Information
                </h1>

                <h2 style={{ fontSize: "1.8rem", textAlign: "center" }}>{product || "No Product Scanned"}</h2>

                <div style={{
                    width: "210px",
                    height: "210px",
                    borderRadius: "50%",
                    backgroundColor: scoreColor,
                    boxShadow: "0 2px 6px rgba(0,0,0,0.6)",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    fontSize: "2.0rem",
                    fontWeight: "bold",
                    color: "white",
                    textAlign: "center",
                    margin: "0 auto"
                }}>
                    {score !== null ? `${score}%` : "?"} <br /> {scoreMessage}
                </div>

                {/* Image preview */}
                <div style={{
                    width: "100%",
                    display: "flex",
                    justifyContent: "center"
                }}>
                    <img
                        src={imagePreview || ChineseCabbageImage}
                        alt="Product"
                        style={{ width: "100%", maxWidth: "300px", borderRadius: "20px", marginTop: "15px" }}
                    />
                </div>

                <p style={{ fontSize: "1.5rem", textAlign: "center" }}>
                    <b>Brand:</b> Farmery <br />
                    <b>Category:</b> Vegetables <br />
                    <b>Sub-Category:</b> Cabbage
                </p>
            </div>

            {/* Footer */}
            <div style={{
                width: "100%",
                color: "whitesmoke",
                backgroundColor: "black",
                textAlign: "center",
                padding: "20px",
                fontSize: "1.2rem",
                marginTop: "20px"
            }}>
                <img src={Ecosnap_Logo} alt="Ecosnap_Logo" height="65" width="60" display="inline" />
                <p style={{ fontSize: "1.5rem", fontWeight: "bold", display: "inline" }}>EcoSnap</p>

                <p>EcoSnap helps shoppers make sustainable choices with instant product scans, clear climate scores and trusted data.</p>
                <hr style={{ borderWidth: "2px", borderColor: "whitesmoke", width: "90%", margin: "10px auto" }} />
                EcoSnap <i className="bi bi-c-circle"></i> 2025. All rights reserved.
            </div>
        </div>
    );
}