
  import { createRoot } from "react-dom/client";
  import App from "./App.tsx";
  import "./index.css";
  import "./services/api"; // API 함수들을 글로벌로 등록
  import "./services/iframe-integration"; // iframe 통신 연동

  createRoot(document.getElementById("root")!).render(<App />);
  