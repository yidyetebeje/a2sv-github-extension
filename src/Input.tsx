import React, { useEffect, useState } from 'react'
import browser from 'webextension-polyfill'
import Repos from './Repos'


export default function Input() {
  const [code, setCode] = useState("")
  const [lan, setLan] = useState("")
  const [filename, setFilename] = useState("")
  const [state, setState] = useState(0)
  useEffect(() => {
      const onMessage = async ({ type, payload }: { type: string; payload: any })=> {
        switch (type) {
          case "UPLOAD_FILE_RESPONSE":
            setCode('')
            setLan('')
            setFilename('')
            setState(0)
          await navigator.clipboard.writeText(payload?.content.html_url);
       // Replace button with link to gist
        }
    };

    browser.runtime.onMessage.addListener(onMessage);

    return () => {
      browser.runtime.onMessage.removeListener(onMessage);
    };
  }, [])
   
  const submitCode = async () => {
    await browser.runtime.sendMessage({
      type: "UPLOAD_FILE_FROM_POPUP",
      payload: {
        content: code,
        filename,
      }
    })
    setState(1)
  }
  return (
    <div className="container flex flex-col justify-center align-center w-ful">
      <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
        Select Repo
      </label>
      <Repos />

      <div>
        <label
          htmlFor="message"
          className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
        >
          paste your code
        </label>
        <textarea
          id="message"
          rows={4}
          value={code}
          onChange={(e) => setCode(e.target?.value)}
          className="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
          placeholder="Write your thoughts here..."
        ></textarea>
      </div>
      <div>
        <label
          htmlFor="small-input"
          className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
        >
          Path
        </label>
        <input
          placeholder="pillingup.py"
          value={filename}
          onChange={(e) => setFilename(e.target.value)}
          type="text"
          id="small-input"
          className="block w-full p-2 text-gray-900 border border-gray-300 rounded-lg bg-gray-50 sm:text-xs focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
        />
      </div>
      <button
        onClick={submitCode}
        className="mt-2 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
      >
        push
      </button>
      <div></div>
    </div>
  );
}

