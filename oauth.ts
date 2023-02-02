const BASE_URL = "https://github.com/login";

const USER_CODE_ENDPOINT = "/device/code";
const USER_AUTH_ENDPOINT = "/oauth/access_token";

const CLIENT_ID1 = "15ca1014289369cdbd6c";
const CLIENT_ID = "8b1dfbc467199f0ffda9";

export const getVerificationCode = async ()=> {
  const response = await fetch(BASE_URL + USER_CODE_ENDPOINT, {
    method: "POST",
    body: JSON.stringify({
      client_id: CLIENT_ID,
      scope: "repo",
    }),
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
  });

  const data = await response.json();
  return data;
};
export const pollAuthorization = async (deviceCode: string, interval: number) : Promise<string> => {
  let data;
  while (!data?.access_token) {
    const response = await fetch(BASE_URL + USER_AUTH_ENDPOINT, {
      method: "POST",
      body: JSON.stringify({
        client_id: CLIENT_ID,
        device_code: deviceCode,
        grant_type: "urn:ietf:params:oauth:grant-type:device_code",
      }),
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    });
    data = await response.json();
    await new Promise((resolve) => setTimeout(resolve, interval * 1000));
  }
  console.log(data);
  return data.access_token;
};
