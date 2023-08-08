// worker.js
function sleep(ms) {
	const wakeUpTime = Date.now() + ms;
	while (Date.now() < wakeUpTime) {}
}

function printTime() {
	var time = new Date();
	return time;
}

const { parentPort } = require('worker_threads');

parentPort.on('message', (message) => {
	console.log(printTime() + ' > got message : ' + message);
	sleep(1000);
	console.log(printTime() + ' > check message : ' + message);
	let result = message + ' check';
	parentPort.postMessage(result);
});
