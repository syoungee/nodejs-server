// http 처리하는 server 구현
const express = require('express');
const app = express();

const { Worker, isMainThread, parentPort } = require('worker_threads');

app.get('/request?', function (req, res) {
	console.log(printTime() + ' > got message : ' + req.query.menu);
	sleep(1000);
	console.log(printTime() + ' > check message : ' + req.query.menu);
	res.send(printTime() + ' > ' + req.query.menu + ' check' + '\r\n');
});

let port = 3000;
app.listen(port, () => {
	console.log(`listening at http://localhost:${port}`);
});

function printTime() {
	var time = new Date();
	return time;
}

function sleep(ms) {
	const wakeUpTime = Date.now() + ms;
	while (Date.now() < wakeUpTime) {}
}
