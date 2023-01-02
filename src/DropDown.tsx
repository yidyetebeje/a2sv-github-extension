import { Label, Select } from "flowbite-react";
import React from "react";

export default function DropDown() {
  const languages = [
    "js",
    "py",
    "cpp",
    "java",
    "c",
    "cs",
    "go",
    "php",
    "rb",
    "swift",
    "ts",
    "rs",
    "scala",
    "dart",
    "bash",
    "sh",
    "html",
    "css",
    "scss",
    "less",
    "json",
    "xml",
    "yaml",
    "yml",
    "md",
    "txt",
    "sql",
    "pl",
    "rb",
    "r",
    "hs",
    "lua",
    "erl",
    "ex",
    "exs",
    "clj",
    "cljc",
    "cljs",
    "cljx",
    "lisp",
    "jl",
    "kt",
    "kts",
    "dart",
    "scala",
  ];
  const [lan, setLan] = React.useState("cpp");
  return (
    <div>
      <div id="select">
        <div className="mb-2 block">
          <Label htmlFor="countries" value="Select your country" />
        </div>
        <Select id="languages" required={true}>
          {languages.map((language) => (
            <option value={language} selected={lan === language} className="" onSelect={()=> setLan(language)}>
              {language}
            </option>
          ))}
        </Select>
      </div>
    </div>
  );
}
