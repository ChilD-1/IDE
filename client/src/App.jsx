import TerminalEditor from "./Components/Terminal";
import Editor from "@monaco-editor/react";
import { useEffect, useState } from "react";
import Split from "react-split";
import socket from "./helper.jsx";
import Folder from "./Components/Folder";
import Browser from "./Components/Browser";
import "./app.css";

const App = () => {
  const [selectedLang, setSelectedLang] = useState("javascript");
  const [code, setCode] = useState("");
  const [files, setfiles] = useState([]);
  const [selectedFile, setSelectedFile] = useState("/Dcode/index.js");
  const [link, setlink] = useState();
  const [demoPort, setDemoPort] = useState();

  const [playground, setPlayground] = useState()

  useEffect(() => {

    socket.on("generate name", ({name, port}) => {
      console.log("34 ", name, port)
      setPlayground(name)
      setSelectedFile(`Dcode/${name}/index.js`)
      setlink(`http://localhost:${port}`)
      setDemoPort(port)
    })

  }, [])

  useEffect(() => {
    console.log("43 ", playground)
    console.log("44 ", demoPort)

    if (playground != undefined && demoPort != undefined) {
      socket.emit("start", {name: playground, port: demoPort})
    }
  }, [playground, demoPort])

  useEffect(() => {
    socket.emit("content", selectedFile); //send the file name to the server

    socket.on("content", (data) => {
      setCode(data);
    });
  }, [selectedFile]);

  useEffect(() => {
    socket.emit("msg", code, selectedFile);
  }, [code]);

  useEffect(() => {
    socket.on("filesystem", (file) => {
      setfiles(file);
    });
  }, [files]);

  return (
    <Split
      sizes={[15, 45, 40]}
      style={{
        background: "black",
        height: "100vh",
      }}
      className="w-100 flex"
    >
      <div
        className="filesys"
        style={{ width: "20%", color: "white", overflowY: "auto" }}
      >
        <Folder
          explorer={files}
          setlang={setSelectedLang}
          setFile={setSelectedFile}
        />
      </div>
      <Split direction="vertical" sizes={[80, 20]}>
        <div>
          <div style={{width: "max-content", height: "20px", color: "white",background:"#2d2d2d"}}>
            <p style={{margin:"0px 5px 0px 5px",fontSize:"smaller"}}>{selectedFile.split("\\").slice(-1)[0]}</p>
          </div>
          <Editor
            height="calc(100% - 20px)"
            defaultLanguage={selectedLang}
            theme="vs-dark"
            defaultValue={code}
            onChange={(value) => {
              setCode(value);
            }}
            language={selectedLang}
            value={code}
            options={{
              scrollBeyondLastLine: false,
            }}
          />
        </div>
        <TerminalEditor />
      </Split>
      <Browser link={link} setlink={setlink} />
    </Split>
  );
};

export default App;
