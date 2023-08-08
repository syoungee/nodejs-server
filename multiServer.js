// MultiThreadServer.js
const express = require('express');
const app = express();
const { Worker, isMainThread, parentPort } = require('worker_threads');

app.get('/request?', function (req, res) {
    const seprateThread = new Worker(__dirname + "/worker.js");
    seprateThread.on("message", (result) => {
        res.send(printTime() + ' > ' + result + '\r\n');
    });
    seprateThread.postMessage(req.query.menu)
});
let port = 3000
app.listen(port, () => {
    console.log(`listening at http://localhost:${port}`);
});

function printTime() {
    var time = new Date()
    return time
}