import React, { useState } from "react";
import Quiz from "./components/Quiz";
import "./index.css";

function App() {
  const [started, setStarted] = useState(false);

  return (
    <div className="container">
      <header style={{ textAlign: "center", padding: "40px 0" }}>
        <h1 style={{ color: "#5e548e", fontSize: "2.5rem" }}>
          人格依恋类型测试
        </h1>
        <p style={{ fontSize: "1.2rem", color: "#666" }}>
          基于 ECR-RS 亲密关系体验量表
        </p>
      </header>

      <main>
        {!started ? (
          <div
            className="card"
            style={{ textAlign: "center", padding: "40px" }}
          >
            <h2>发现你的依恋风格</h2>
            <p style={{ margin: "20px 0", lineHeight: "1.6" }}>
              本测试将帮助你了解自己在亲密关系中的依恋模式（安全型、焦虑型、回避型或恐惧型）。
              <br />
              测试包含四个部分：母亲、父亲、伴侣及一般关系。
            </p>
            <button className="btn" onClick={() => setStarted(true)}>
              开始测试
            </button>
          </div>
        ) : (
          <Quiz />
        )}
      </main>
    </div>
  );
}

export default App;
