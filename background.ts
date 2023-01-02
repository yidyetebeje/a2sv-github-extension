import { Chrome } from "react-feather";
import { browserAction } from "webextension-polyfill";
import { getVerificationCode, pollAuthorization } from "./oauth";
import { updateOrUploadFile } from "./submitQuestion";
console.log("background process is running")
chrome.runtime.onMessage.addListener(async ({ type, payload }) => {
  const key = "accessToken";
  const at = (await chrome.storage.sync.get(key))[key];
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

      console.log("Authorized Auto Gistify");

      chrome.storage.sync.set({
        accessToken,
      });
      break;
    case "UPLOAD_FILE":
      if (!at) return;
      try {
        let tab;
        await chrome.tabs.query({ active: true, currentWindow: true }, async function (tabs) {
          tab = tabs[0];
          tab = tab?.url?.split('/')[4]
          console.log(tab);
          const uri = await updateOrUploadFile(
            {
              owner: "yidyedelina",
              repo: "A2SV",
              path: `${tab}${payload.extension}`,
              content: payload.content,
              message: "Test",
              authToken: "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",
            }
          );
          
          
          console.log(uri);
          await chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
            chrome.tabs.sendMessage(tabs[0].id, { payload: uri }, function (response) { });
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
            owner: "yidyedelina",
            repo: "A2SV",
            path: `${payload.filename}.${payload.extension}`,
            content: payload.content,
            message: "Test",
            authToken: "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",
          }
        );
        console.log(uri)
        await chrome.runtime.sendMessage({
          type: "UPLOAD_FILE_RESPONSE",
          payload: {
            uri,
          }
        })

      } catch (err) {
        console.log(err)
      }

  }
});
