import React, { useState } from "react";
import ReactDOM from "react-dom/client";
import ReportUltimate from "./imocha-report-ultimate.jsx";
import ReportV2 from "./imocha-report-v2.jsx";

function App() {
  const [active, setActive] = useState("ultimate");
  return (
    <>
      <div style={{ position: "fixed", top: 12, right: 12, zIndex: 9999, display: "flex", gap: 8 }}>
        <button
          onClick={() => setActive("ultimate")}
          style={{
            padding: "6px 14px",
            borderRadius: 6,
            border: "none",
            cursor: "pointer",
            background: active === "ultimate" ? "#6366f1" : "#e5e7eb",
            color: active === "ultimate" ? "#fff" : "#111",
            fontWeight: 600,
          }}
        >
          Ultimate
        </button>
        <button
          onClick={() => setActive("v2")}
          style={{
            padding: "6px 14px",
            borderRadius: 6,
            border: "none",
            cursor: "pointer",
            background: active === "v2" ? "#6366f1" : "#e5e7eb",
            color: active === "v2" ? "#fff" : "#111",
            fontWeight: 600,
          }}
        >
          V2
        </button>
      </div>
      {active === "ultimate" ? <ReportUltimate /> : <ReportV2 />}
    </>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(<App />);
