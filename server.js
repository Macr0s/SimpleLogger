var express = require("express");
var log4js = require("log4js");
var bodyParser = require('body-parser');
var WebSocketServer = require('ws').Server;
var nodemailer = require('nodemailer');
var smtpTransport = require('nodemailer-smtp-transport');
var mail = nodemailer.createTransport(smtpTransport({
	host: 'email-smtp.us-west-2.amazonaws.com',
	port: 465,
	secure: true,
	auth: {
		user: 'AKIAINVAGWNEWMK26ICA',
		pass: 'AgK0kB1iy1e4dO3ddv4Sj3KIFPWMEUm2YZPFs1ltWmap'
	},
	maxConnections: 5,
	maxMessages: 10
}));

function log(level, tag, info){
	var logger = log4js.getLogger(tag);
	info = (typeof info == "string")?info:JSON.stringify(info);

	if (level == "trace") logger.trace(info);
	if (level == "debug") logger.debug(info);
	if (level == "info") logger.info(info);
	if (level == "warn") logger.warn(info);
	if (level == "error") logger.error(info);
	if (level == "fatal"){
		logger.fatal(info);
		var mailOptions = {
		    from: tag  + '  <info@mfilippi.guru>', // sender address
		    to: 'matteo@playbon.us', // list of receivers
		    subject: level, // Subject line
		    text: 'Attiva l\'html', // plaintext body
		    html: info // html body
		};

		// send mail with defined transport object
		mail.sendMail(mailOptions, function(error, info){
			if(error){
				console.log(error);
			}else{
				console.log('Messaggio Inviato: ' + info.response);
			}
		});
	}
}

log4js.configure({
	appenders: [
	{ type: 'console' },
	{ type: 'file', filename: 'all.log', category: '[all]' }
	],
	replaceConsole: true
});

var client = {};

var app = express();
app.use(bodyParser.urlencoded());
app.use(bodyParser.json());
app.post("/send", function (req, res){
	log(req.body.level, req.body.tag, req.body.info);
	res.send("ok");
})

var server = app.listen(3000, function() {
	console.log('Il server di log è disponibile su questa porta %d', server.address().port);
});

var wss = new WebSocketServer({port: 3001});
wss.on('connection', function(ws) {
	log4js.getLogger("WS").info("Nuova Backend Online");
	ws.on('message', function(message) {
		var json = JSON.parse(message);

		if (typeof json.cmd != "undefined"){

			if (json.cmd == "send"){
				log(json.level, json.tag, json.info);
				for(i in client){
					try{
						client[i].send(message);
					}catch(err) {
						log4js.getLogger("WS").info("Impossibile mandare il messaggio " +  err.message);
						delete client[i];
					}

				}
			}

			if (json.cmd == "link"){
				a = Math.random();
				while (typeof client[a] != "undefined"){
					a = Math.random();
				}
				client[a] = ws;
				ws.send("ok");
			}

			return;
		}

		log4js.getLogger("WS").info("Messaggio Mal Formatato");
	});
});