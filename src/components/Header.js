import Ecosnap_Logo from '../assets/images/logo.png'

export default function Header() {

    return (
        <div>
            <div style={{
                width: "100%",
                position: "sticky",
                top: 0,
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                backgroundColor: "black",
                padding: "10px 0"
            }}>
                {/* <div
                    style={{
                        backgroundColor: "black",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        width: "100%",   // full width if needed
                    }}
                > */}
                    <img src={Ecosnap_Logo} alt="Ecosnap_Logo" height="55" width="50" />
                    <p style={{ fontSize: "1.50rem", fontWeight: "bold", color: "whitesmoke", margin: 0 }}> EcoSnap </p>
                </div>
            </div>
        // </div>
    );
};
