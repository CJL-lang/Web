import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

import App from "./App";
import "./styles/tokens.css";// 设计变量
import "./styles/globals.css";// 全局样式
import { initializeTheme } from "./utils/theme";// 初始化主题
// 初始化主题
initializeTheme();
// 创建根节点
createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>
);
