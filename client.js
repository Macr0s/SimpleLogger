var log4js = require("log4js");
var WebSocket = require('ws');
var ws = new WebSocket('ws://localhost:3001');

log4js.configure({
	appenders: [
		{ type: 'console' },
		{ type: 'file', filename: 'all.log', category: '[all]' }
	],
	replaceConsole: true
});

exports.trace = function (tag, info){
	var logger = log4js.getLogger(tag);

	logger.trace(info);
	ws.send(JSON.stringify({
		cmd: "send",
		level: "trace",
		tag: tag,
		info: info
	}));
};

exports.debug = function (tag, info){
	var logger = log4js.getLogger(tag);

	logger.debug(info);
	ws.send(JSON.stringify({
		cmd: "send",
		level: "debug",
		tag: tag,
		info: info
	}));
};

exports.info = function (tag, info){
	var logger = log4js.getLogger(tag);

	logger.info(info);
	ws.send(JSON.stringify({
		cmd: "send",
		level: "info",
		tag: tag,
		info: info
	}));
};

exports.warn = function (tag, info){
	var logger = log4js.getLogger(tag);

	logger.warn(info);
	ws.send(JSON.stringify({
		cmd: "send",
		level: "warn",
		tag: tag,
		info: info
	}));
};

exports.error = function (tag, info){
	var logger = log4js.getLogger(tag);

	logger.error(info);
	ws.send(JSON.stringify({
		cmd: "send",
		level: "error",
		tag: tag,
		info: info
	}));
};

exports.fatal = function (tag, info){
	var logger = log4js.getLogger(tag);

	logger.fatal(info);
	ws.send(JSON.stringify({
		cmd: "send",
		level: "fatal",
		tag: tag,
		info: info
	}));
};
