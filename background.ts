import { Chrome } from "react-feather";
import { getVerificationCode, pollAuthorization } from "./oauth";
import { updateOrUploadFile } from "./submitQuestion";
console.log("background process is running")

chrome.runtime.onMessage.addListener(async ({ type, payload }) => {
  const key = "accessToken";
  const at = (await chrome.storage.sync.get(key))[key];
  const repo = (await chrome.storage.sync.get("repo"))["repo"];
  switch (type) {
    case "AUTH_REQUEST":
      const verification = await getVerificationCode();

      console.log("Open %s", verification.verification_uri);
      console.log("Enter code: %s", verification.user_code);

      // Sends code to display to browser
      chrome.runtime.sendMessage({
        type: "AUTH_RESPONSE",
        payload: {
          code: verification.user_code,
          uri: verification.verification_uri,
        },
      });

      // Waits for user authorization
      const accessToken = await pollAuthorization(
        verification.device_code,
        verification.interval
      );

      await chrome.storage.sync.set({
        accessToken,
      });
      let userData = await fetch('https://api.github.com/user', {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      userData = await userData.json();
      await chrome.storage.sync.set({
        userData,
      });
      break;
    case "UPLOAD_FILE":
      if (!at) return;
      try {
        const language = {
          python: "py",
          cpp: "cpp",
        }
        let tab;
        await chrome.tabs.query({ active: true, currentWindow: true }, async function (tabs) {
          tab = tabs[0];
          tab = tab?.url?.split('/')[4]
          console.log(tab);
          console.log(language[payload.extension.slice(1)] + payload.extension + "payload")
          const uri = await updateOrUploadFile(
            {
              repo,
              path: `${tab}.${language[payload.extension.slice(1)] || payload.extension}`,
              content: payload.content,
              message: `added ${tab}${language[payload.extension] || payload.extension}`,
              authToken: at,
            }
          );


          console.log(uri);
          await chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
            chrome.tabs.sendMessage(tabs[0].id, { payload: uri , type: "UPLOAD_CODE"}, function (response) { });
          });
        });

      } catch (error) {
        console.log(error);
      }
      break;
    case "UPLOAD_FILE_FROM_POPUP":
      if (!at) return;
      try {
        const uri = await updateOrUploadFile(
          {
            repo,
            path: `${payload.filename}`,
            content: payload.content,
            message: `added ${payload.filename}`,
            authToken: at,
          }
        );
        console.log(uri)
        await chrome.runtime.sendMessage({
          type: "UPLOAD_FILE_RESPONSE",
          payload: uri
        })

      } catch (err) {
        console.log(err)
      }

  }
});
chrome.tabs.onUpdated.addListener(function (tabId, changeInfo, tab) {
  if (changeInfo.status == 'complete') {
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
      //check the url of the current tab is contain leetcode
      console.log(tabs[0].url)
      if (tabs[0].url.includes("leetcode")) {
        console.log("found leetcode")
        chrome.tabs.sendMessage(tabs[0].id, { payload: "reload", type: "RELOAD_PAGE" }, function (response) { });
      }
    });
  }
});
