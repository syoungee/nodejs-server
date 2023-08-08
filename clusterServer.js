// cluster를 이용한 병렬 처리
const cluster = require('cluster');
const os = require('os');
const express = require('express');
const app = express();

if (cluster.isMaster) {
	os.cpus().forEach(function (cpu) {
		cluster.fork();
	});

	cluster.on('exit', function (worker, code, signal) {
		console.log('worker exit : ' + worker.id);
	});
} else {
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
}

function printTime() {
	var time = new Date();
	return time;
}

function sleep(ms) {
	const wakeUpTime = Date.now() + ms;
	while (Date.now() < wakeUpTime) {}
}
