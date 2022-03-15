### PlayGround
Playground is an In-Browser IDE which soughts to provide user a wholesome experience.

#### Why Playground?
I noticed that at an initial stage where students learn a lot from tutorials, e-learning platforms, etc. While Implementing whatever learnt setting up a local development environment or even downloading specific IDE was a common barrier which results in a ***Tutorial hell***. So building the IDE in a browser, I sought to provide a simpler entry point for people to get started with their programming journey.

#### What makes it different from others?
It allows students get a taste of programming with real-world tools which developers use. Unlike a REPL, which executes a few lines of simple code, the IDE in the browser allows students to experience a more complex interaction between editing different files and executing them from a command line, keeping them at ease and thus making learning a wonderful experience.

>P.S: This Project Is Still In It's Initial Stages Of Development

#### [Back-End]
The IDE backend is responsible for spinning up new Docker containers for each user. It use sockets to communicate from the browser client, and client pipe commands from the user’s terminal into his or her corresponding Docker container and it also pipe the container output back to the client. Meanwhile, it also have a process watching for file system changes and sending those down to the client so it can construct a representation of the file tree.

#### [Front-End]
For file tree it uses React component that recurses over a JSON payload containing the names of the files and directories in the user’s container on the remote server. For the editor and terminal, it uses open-source libraries Monaco-editor and Xterm. It initialize a socket connection to backend server and push messages into the channel to which the server responds.

##### Screenshots
#### [Desktop]
![asset](https://github.com/ChilD-1/IDE/blob/master/asset/1.png)

## Dependencies
#### [Server]
* express
* socket.io
* dockerode
* utf8

#### [Client]
* monaco-editor
* socket.io-client
* xterm.js

## Setup
- Download and Install Docker Desktop Client
- Pull linux container

```bash
docker pull jaygoyal96/linux
```
- Clone the repo and install the dependencies 

```bash
git clone https://github.com/JayGoyal96/PlayGround.git
cd client
npm install
cd ..
cd server
npm install
```
- To run the app, write

```bash
cd client
npm start
cd ..
cd server
docker build -t playground .
npm start
```

##### Made with ♥ by <a href="https://github.com/jaygoyal96">Jay</a>


[![forthebadge](https://forthebadge.com/images/badges/built-with-love.svg)](https://github.com/jaygoyal96)
