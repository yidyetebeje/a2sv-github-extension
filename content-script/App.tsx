



function App({language}) {
  const [content, setContent] = useState("");
  const handleClick = async () => {
    const extension = language ? `.${language}` : "";
    const filename = crypto.randomUUID() + extension;
    await chrome.runtime.sendMessage({
      type: "UPLOAD_FILE",
      payload: {
        filename,
        content,
      },
    });
    await chrome.runtime.onMessage.addListener(async ({ type, payload }) => {
      switch(type){
        case "UPLOAD_FILE_RESPONSE":
          const url = await payload.uri;
      }
    });
  }
  return (
      <button
        className="px-4 py-2 font-semibold text-sm bg-teal-800 text-white rounded-full shadow-sm absolute top-0 right-10"
      onClick={handleClick}
      
      >
         a2svify
      </button>
  );
}

export default App;
