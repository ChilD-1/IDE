const express = require("express");
const http = require("http");
const utf8 = require("utf8");
const app = express();
const serverPort = 4000;
const server = http.createServer(app);
const fs = require("fs");
const path = require("path");
const Docker = require("dockerode");
const dirTree = require("directory-tree");

const { exec } = require("child_process");

const { getRandomInt, get_playground_id } = require('./utils')


server.listen(serverPort);

//socket.io instantiation
const io = require("socket.io")(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
  },
});

let dockerid = "";
let containerName = "";
let files = [];
//Socket Connection




io.on("connection", function (socket) {
  const docker = new Docker();
  console.log("New client connected");
  socket.on("disconnect", function () {
    console.log("Client disconnected");

    console.log("37 Container name: " + containerName);
    // docker.getContainer(dockerid).kill();
    // docker.getContainer(containerName).kill();
    if (containerName) {
      // docker.getContainer(containerName).stop();
      // docker.getContainer(containerName).remove();

        exec(`docker rm -f ${containerName}`, (error, stdout, stderr) => {
          if (error) {
              console.log(`error: ${error.message}`);
              return;
          }
          if (stderr) {
              console.log(`stderr: ${stderr}`);
              return;
          }
          console.log(`stdout: ${stdout}`);
      });
    }

    console.log("Container killed");
  });


  var name2 = get_playground_id();
  var port2 = getRandomInt();
  console.log("67 Container name: ", name2, port2);
  socket.emit("generate name", { name: name2, port: port2})

  socket.on("start", function ({ name, port }) {
    console.log("55 ", name)
    console.log("56 ", port)

    containerName = name


    // Create bind mount directory
    var dir = `./Dcode/${name}`;
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir);
      fs.create
    }

    fs.writeFile(`Dcode/${name}/index.js`, '//Learn Node FS module', function (err) {
      if (err) throw err;
      console.log('File is created successfully.');
    });

    docker.createContainer(
      {
        Image: "playground",
        name: name,
        Tty: true,
        OpenStdin: true,
        StdinOnce: true,
        WorkingDir: "/home/code",
        HostConfig: {
          AutoRemove: true,
          Binds: [`${__dirname + "/Dcode/" + name + "/"}:/home/code/`],
          PortBindings: {
            "3000/tcp": [{ HostPort: port.toString() }],
          },
        },
        ExposedPorts: {
          "3000/tcp": {},
        },
      },
      function (err, container) {
        if (err) {
          console.log(err);
          return;
        }
        console.log("60 container id: ", container.id)
        console.log("60 container id: ", container.name)
        dockerid = container.id;
        container.attach(
          {
            stream: true,
            stdin: true,
            stdout: true,
            stderr: true,
          },
          function (err, stream) {
            if (err) {
              console.log(err);
              return;
            }
            socket.on("data", function (data) {
              stream.write(data);
            });
            stream.on("data", function (data) {
              socket.emit("data", utf8.decode(data.toString("binary")));
              files = dirTree(`${"./Dcode/" + name}`, { attributes: ["type", "extension"] });
              socket.emit("filesystem", files);
            });
            container.start(function (err, data) {
              if (err) {
                console.log(err);
                return;
              }
              console.log("Container started");
            });
          }
        );
      }
    );
  });


  socket.on("msg", function (code, file) {
    fs.writeFile(path.join(__dirname, `/${file}`), code, function (err) {
      if (err) {
        console.log(err);
        return;
      }
    });
  });
  socket.on("content", function (file) {
    fs.readFile(path.join(__dirname, `/${file}`), function (err, data) {
      if (err) {
        console.log(err);
        return;
      }
      socket.emit("content", data.toString());
    });
  });
});
