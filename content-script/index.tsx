import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";

const index = document.createElement("div");
index.id = "extension-root";
function getLanguage(codeBlock) {
  const classList = codeBlock.classList;
  for (let className of classList) {
    // .lang-{language}
    if (className.startsWith("lang-")) {
      return className.slice(5);
    }
  }
}
let accessToken = "";
(async () => {
  const key = "accessToken";
  accessToken = (await chrome.storage.sync.get(key))[key];
  console.log(accessToken);
  if (accessToken) {
    console.log(2, accessToken);
    const codeBlocks = document.querySelectorAll("pre > code");
    codeBlocks.forEach((codeBlock) => {
      const language = getLanguage(codeBlock);
      const container = codeBlock.parentElement;
      container?.classList.add("a2sv-container");
      ReactDOM.createRoot(container).render(
        <React.StrictMode>
          <App language={language}/>
        </React.StrictMode>
      );
    });
    
  }
})();


