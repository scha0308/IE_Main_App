import React, { useState, useEffect } from 'react';
import Veggies_Score from '../assets/images/Veggies_Score.png';
import Green_Background from '../assets/images/Green_Background.png';
import VegetablesBanner from '../assets/images/Vegetables_banner.jpg';
import ChineseCabbageImage from '../assets/images/Chinese_Cabbage.jpg';
import Ecosnap_Logo from '../assets/images/logo.png';
import CameraCapture from '../components/CameraCapture';

export default function DesktopView() {
    const [score, setScore] = useState(null);
    const [product, setProduct] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);
    const [resultMessage, setResultMessage] = useState("No image");
    const [openCamera, setOpenCamera] = useState(false);
    const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

    const API_BASE = process.env.REACT_APP_API_BASE_URL || "";

    useEffect(() => {
        const handleResize = () => setIsMobile(window.innerWidth < 768);
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

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
            setResultMessage(`Failed to analyze image: ${error.message || error}`);
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
        <div>
            <CameraCapture
                isOpen={openCamera}
                onClose={()=> setOpenCamera(false)}
                onCapture={(blob) =>{
                    const file = new File([blob], 'capture.jpg', {type: 'image/jpeg'});
                    uploadFile(file)
                    setOpenCamera(false)
                }}
            />

            {/* Top Section */}
            <div style={{
                width: "100%",
                flexDirection: "column",
                backgroundImage: `url(${Green_Background})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
                display: "flex",
                justifyContent: "center",
                alignItems: "center"
            }}>
                <div style={{ width: "100%" }}>
                    <div style={{
                            width: "100%", 
                            minHeight: isMobile ? "auto" : "600px", 
                            display: "flex",
                            flexDirection: isMobile ? "column" : "row",
                            alignItems: "center",
                            padding: isMobile ? "20px" : "0"
                        }}
                    >
                        {/* Left Column */}
                        <div style={{
                            width: isMobile ? "100%" : "55%",
                            padding: "20px", 
                            boxSizing: "border-box",
                            display: "flex",         
                            justifyContent: "center",
                            alignItems: "center",
                            marginLeft: isMobile ? "0" : "100px",
                            flexDirection: "column",
                            textAlign: isMobile ? "center" : "left"
                        }}>
                            <p style={{ fontSize: "1.5rem", fontWeight: "bold" }}>
                                Scan a barcode or upload an image and get eco-friendly score instantly.
                            </p>

                            <div>
                                <p style={{ fontSize: isMobile ? "2.0rem" : "3.0rem", display: "inline", fontWeight: "bold" }}> How </p>
                                <p style={{ fontSize: isMobile ? "2.0rem" : "3.0rem", display: "inline", fontWeight: "bold", color: "#00b207" }}> eco-friendly </p>
                                <p style={{ fontSize: isMobile ? "2.0rem" : "3.0rem", display: "inline", fontWeight: "bold" }}> is the product in your hand? </p>
                            </div> <br />

                            <div>
                                <p style={{ fontSize: isMobile ? "1.1rem" : "1.2rem", fontWeight: "bold", color: "#00b207" }}> Scan. Snap. See the Score </p>
                            </div>

                            <div style={{
                                    display: "flex",
                                    justifyContent: "center",
                                    alignItems: "center",
                                    gap: isMobile ? "20px" : "50px", 
                                    marginTop: "10px",
                                    flexDirection: isMobile ? "column" : "row"
                                }}
                            >
                                {/* Column 1 - Placeholder for barcode */}
                                <div style={{ textAlign: "center" }}>
                                    <i className="bi bi-upc-scan" style={{ fontSize: "3rem" }}></i>
                                    <br />
                                    <button onClick={() => setOpenCamera(true)}
                                     style={{
                                        marginTop: "15px",
                                        padding: "12px 24px",
                                        fontSize: isMobile ? "1rem" : "1.2rem",
                                        backgroundColor: "#00b207",
                                        border: "0px",
                                        color: "whitesmoke",
                                        borderRadius: "40px"
                                    }}>
                                        Scan barcode now
                                    </button>
                                </div>

                                {/* Column 2 - Upload Image */}
                                <div style={{ textAlign: "center" }}>
                                    <i className="bi bi-upload" style={{ fontSize: "3rem" }}></i>
                                    <br />
                                    <label htmlFor="imageUpload" style={{
                                        marginTop: "15px",
                                        padding: "12px 24px",
                                        fontSize: isMobile ? "1rem" : "1.2rem",
                                        backgroundColor: "#00b207",
                                        border: "0px",
                                        color: "whitesmoke",
                                        borderRadius: "40px",
                                        cursor: "pointer"
                                    }}>
                                        Upload Image
                                    </label>
                                    <input
                                        type="file"
                                        accept="image/*"
                                        id="imageUpload"
                                        style={{ display: "none" }}
                                        onChange={handleUpload}
                                    />
                                </div>
                            </div>

                            {/* Result Message */}
                            <div style={{
                                marginTop: "15px",
                                fontSize: isMobile ? "1rem" : "1.1rem",
                                fontWeight: "bold"
                            }}>
                                <p>{resultMessage}</p>
                            </div>

                            {/* <div style={{ textAlign: "center" }}>
                                <button
                                    onClick={() => {
                                        setTimeout(() => {
                                            document.getElementById("product-info")
                                                ?.scrollIntoView({ behavior: "smooth" });
                                        }, 500)
                                    }}
                                    style={{
                                        padding: "12px 24px",
                                        fontSize: "1.2rem",
                                        backgroundColor: "#00b207",
                                        border: "0px",
                                        color: "whitesmoke",
                                        borderRadius: "40px"
                                    }}>
                                    Check Eco-Score
                                </button>
                            </div> */}
                        </div>

                        {/* Right Column */}
                        <div style={{
                                width: isMobile ? "100%" : "45%",
                                height: isMobile ? "auto" : "650px",
                                padding: "25px",  
                                marginRight: isMobile ? "0" : "100px",
                                marginTop: isMobile ? "20px" : "0",
                                display: "flex",
                                justifyContent: "center"
                            }}
                        >
                            <img
                                src={Veggies_Score}
                                alt="veggies_score"
                                style={{ width: "100%", height: "100%", objectFit: "contain" }}
                            />
                        </div>
                    </div>
                </div>
            </div>

            {/* Banner */}
            <div style={{
                position: "relative",
                width: "100%",
                height: isMobile ? "100px" : "150px",
                overflow: "hidden"
            }}>
                <div style={{
                    position: "absolute",
                    width: "100%",
                    height: "100%",
                    backgroundImage: `url(${VegetablesBanner})`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                    zIndex: 0
                }}></div>

                <div style={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    width: "100%",
                    height: "100%",
                    backgroundColor: "rgba(0, 0, 0, 0.7)",
                    zIndex: 1
                }}></div>

                <div style={{
                    position: "relative",
                    zIndex: 2,
                    display: "flex",
                    color: "white",
                    justifyContent: "center",
                    alignItems: "center",
                    height: "100%",
                    padding: isMobile ? "10px" : "20px",
                    fontSize: isMobile ? "1rem" : "2rem",
                    fontWeight: "bold",
                    textAlign: "center"
                }}>
                    <p>In just one Scan, EcoSnap reveals the truth behind the products</p>
                </div>
            </div>

            {/* Product Info */}
            <div
                id="product-info"
                style={{
                    width: "100%", 
                    minHeight: isMobile ? "auto" : "600px", 
                    display: "flex",
                    flexDirection: "column",
                    backgroundColor: "whitesmoke",
                    padding: isMobile ? "20px" : "20px 40px",
                    boxSizing: "border-box",
                }}
            >
                <h1 style={{ marginBottom: "20px", textAlign: "center", fontSize: isMobile ? "1.5rem" : "2rem" }}>
                    Product Information
                </h1>

                <div style={{
                    display: "flex",
                    justifyContent: "space-between",
                    gap: "20px",
                    flex: 1,
                }}>
                    {/* Left: Image */}
                    <div style={{
                        width: isMobile ? "100%" : "50%",
                        padding: "20px", 
                        display: "flex",         
                        justifyContent: "center",
                        alignItems: "center",
                        flexDirection: "column",
                        borderRadius: "20px",
                        boxShadow: "0 2px 6px rgba(0,0,0,0.3)",
                        backgroundColor: "whitesmoke"
                    }}>
                        <img
                            src={imagePreview || ChineseCabbageImage}
                            alt="Product Preview"
                            style={{ maxWidth: "100%", maxHeight: "100%", objectFit: "contain", borderRadius: "30px" }}
                        />
                    </div>

                    {/* Right: Product Details */}
                    <div style={{
                        width: isMobile ? "100%" : "50%",
                        padding: "20px", 
                        display: "flex",         
                        justifyContent: "center",
                        alignItems: isMobile ? "center" : "flex-start",
                        flexDirection: "column",
                        borderRadius: "20px",
                        boxShadow: "0 2px 6px rgba(0,0,0,0.3)",
                        backgroundColor: "whitesmoke",
                        border: `4px solid ${scoreColor}`,
                        textAlign: isMobile ? "center" : "left"
                    }}>
                        <div style={{ display: "flex", alignItems: "center", gap: "20px", flexDirection: isMobile ? "column" : "row" }}>
                            <h2 style={{ margin: 0, fontSize: isMobile ? "1.5rem" : "2rem" }}>{product || "No Product Scanned"}</h2>
                            <div style={{
                                width: isMobile ? "120px" : "min(60%, 250px)",  // scales with card width
                                aspectRatio: "1 / 1",                           // ensures perfect circle
                                borderRadius: "50%",
                                backgroundColor: scoreColor,
                                boxShadow: "0 2px 6px rgba(0,0,0,0.9)",
                                display: "flex",
                                justifyContent: "center",
                                alignItems: "center",
                                fontSize: isMobile ? "clamp(0.9rem, 2vw, 1.2rem)" : "clamp(1.2rem, 2.5vw, 2rem)",
                                fontWeight: "bold",
                                color: "white",
                                textAlign: "center",
                                flexShrink: 0,
                                maxWidth: "100%" // never overflows card
                            }}>
                                {score !== null ? `${score}%` : "?"} <br />
                                {scoreMessage}
                            </div>
                        </div>

                        <p style={{ fontSize: isMobile ? "1rem" : "1.1rem" }}>
                            Brand : Farmery <br />
                            Category : Vegetables <br />
                            Sub-Category : Cabbage <br /><br />
                        </p>
                    </div>
                </div>
            </div>

            {/* Footer */}
            <div style={{
                width: "100%",
                color: "whitesmoke",
                backgroundColor: "black",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                textAlign: "center",
                padding: isMobile ? "20px" : "30px 20px",
                boxSizing: "border-box",
                marginTop: "20px",
            }}>
                <div style={{
                    marginBottom: "15px", 
                    fontSize: isMobile ? "1rem" : "1.2rem", 
                    fontWeight: "bold" 
                }}>
                    <img src={Ecosnap_Logo} alt="Ecosnap_Logo" height={isMobile ? "50" : "65"} width={isMobile ? "45" : "60"} style={{ display: "inline" }} /> 
                    <p style={{ display : "inline", fontSize: isMobile ? "1.2rem" : "1.5rem"}}> EcoSnap </p><br />
                    <p style={{ fontSize: isMobile ? "0.9rem" : "1rem" }}>
                        EcoSnap helps shoppers make sustainable choices with instant product scans, clear climate scores and trusted data.
                    </p>
                
                    <hr style={{ borderWidth: "2.5px", borderColor: "whitesmoke", width: "95%", margin: "10px auto" }} />

                    <p style={{ fontSize: isMobile ? "0.9rem" : "1rem" }}>
                        EcoSnap <i className="bi bi-c-circle"></i> 2025. All rights reserved.
                    </p>
                </div>
            </div>
        </div>
    );
}
