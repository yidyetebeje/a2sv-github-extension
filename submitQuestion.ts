export async function updateOrUploadFile({ repo, path, content, message, authToken }: { repo: string, path: string, content: string, message: string, authToken: string }){
  const url = `${repo}/contents/${path}`;
  let response;
  try {
    const getPost = await fetch(url, {
      method: "get",
      headers: {
        Accept: "application/vnd.github+json",
        Authorization: `Bearer ${authToken}`,
      },
    });
    if (getPost.status == 200) {
      const data = await getPost.json();
      const sha = data.sha;
      response = await fetch(url, {
        method: "put",
        body: JSON.stringify({
          message: message,
          content: btoa(content),
          sha: sha,
        }),
        headers: {
          Accept: "application/vnd.github+json",
          Authorization: `Bearer ${authToken}`,
        },
      });
    } else {
      response = await fetch(url, {
        method: "put",
        body: JSON.stringify({
          message: message,
          content: btoa(content),
        }),
        headers: {
          Accept: "application/vnd.github+json",
          Authorization: `Bearer ${authToken}`,
        },
      });
    }
  } catch (err) {
    response = await fetch(url, {
        method: "put",
        body: JSON.stringify({
          message: message,
          content: btoa(content),
        }),
        headers: {
          Accept: "application/vnd.github+json",
          Authorization: `Bearer ${authToken}`,
        },
      });
  } finally {
    return response.json();
  }  
}
