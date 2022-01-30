const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const { api } = require('mma-api');
require('dotenv').config({ path: './.env'});

const app = express();

app.use(cors({
	origin: ['https://woog2roid.github.io', 'https://service.woog2roid.dev', 'https://mma.woog2roid.dev'],
}));

app.use((req, res, next) => {
	if(process.env.NODE_ENV == 'production') {
		morgan('combined')(req, res, next);
	} else {
		morgan('dev')(req, res, next);
	}
});

app.get('/', async(req, res, next) => {
	try {
		if (!req.query.fighter) {
			//URL이 잘못됨: fighter query가 없는 오류
			res.status(400).send({code:'query error'});
			return;
		} else {
			const data = await api(req.query.fighter);
			res.status(200).json(data);
			return;
		}
	} catch(err) {
		next(err);
	}
});

app.use((err, req, res, next) => {
	console.log('[서버 내부 오류 발생], 오류 내용 이하.');
	console.log(err);
	return res.sendStatus(500);
});
	
module.exports = app;
