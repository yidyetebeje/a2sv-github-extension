import { Chrome } from "react-feather";
import { updateOrUploadFile } from "/fileupload.js";

// For use in multiple functions
let accessToken;

// Gets the language used by a code block
function getLanguage(codeBlock) {
  const classList = codeBlock.classList;
  for (let className of classList) {
    // .lang-{language}
    if (className.startsWith("language-")) {
      return className.slice(9);
    }
  }
}

function listenForSuccessfulUpload(label) {
  chrome.runtime.onMessage.addListener(async function (response, sendResponse) {
    const res = response;
    if (res.type === "UPLOAD_CODE") {
      await navigator.clipboard.writeText(res.payload.content.html_url);
      label.textContent = "succeed";
      return setTimeout(() => {
        label.textContent = "a2svify";
      }, 3000);
    }
  });
}
// Create a button that creates gist of code content
function createSubmitButton(element, language) {
  const container = element.parentElement;
  const content = element.textContent.trim();
  container.className = "button-container";
  const button = document.createElement("button");
  button.type = "button";
  console.log("before button creation")
  button.className = "a2sv-button";
  const label = document.createElement("span");
  label.textContent = "a2svify";
  // const iconURL = chrome.runtime.getURL("vite.svg");
  // const icon = document.createElement("object");
  // icon.data = iconURL;
  // icon.type = "image/svg+xml";
  // icon.title = "GitHub icon";
  button.appendChild(label);
  //button.appendChild(icon);
  console.log("button created")
  button.addEventListener("click", async () => {
    // Create gist with target language
    const extension = language ? `.${language}` : "";
    //const url = await createGist(accessToken, filename, content);
    chrome.runtime.sendMessage({
      type: "UPLOAD_FILE",
      payload: {
        extension,
        content,
      },
    });



    // await navigator.clipboard.writeText(url);

    // Status message shown
    listenForSuccessfulUpload(label);
  });
  container.insertBefore(button, container.firstChild);
}

function render() {
  // get url 
  setTimeout(() => {
    let codeBlocks = document.querySelectorAll("pre > code");
    for (let codeBlock of codeBlocks) {
      const language = getLanguage(codeBlock);
      console.log(language)
      createSubmitButton(codeBlock, language);
    }
  }, 3000)
}

(async function main() {
  const key = "accessToken";
  console.log("from main");
  accessToken = (await chrome.storage.sync.get(key))[key];
  if (!accessToken) return;
 
  chrome.runtime.onMessage.addListener(async function (response, sendResponse) {
    const res = response;
    if (res.type === "RELOAD_PAGE") {
      render();
      console.log("reload")
    }
  });
})()
