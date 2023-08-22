const { Configuration, OpenAIApi } = require('openai');
const express = require('express');
const mysql = require('mysql');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const cors = require('cors');
require('dotenv').config();

const token = process.env.API_TOKEN
const configuration = new Configuration({ apiKey: token });
const openai = new OpenAIApi(configuration);
const app = express();

const verifyJwt = (req, res, next) => {
	const token = req.headers.authorization
	const userId = req.headers.userid
	if (!token) {
		res.sendStatus(401).end();
	} else {
		jwt.verify(token, process.env.JWT_TOKEN, (err, decoded) => {
			if (err) {
				res.status(401).json({ message: "Unable to authenticate request" });
			} else if (decoded !== userId) {
				res.status(401).json({ message: "Unauthorized...nice try" })
			} else {
				next();
			}
		});
	}
};

app.use(bodyParser.json());
app.use(cors());

const db = mysql.createConnection({
	user: "admin",
	host: "soundwrite-db.cscnzjlbxtvh.us-east-1.rds.amazonaws.com",
	password: process.env.MYSQL_ROOT_PASS,
	database: "vmail"
})

db.connect((err) => {
	if (err) {
		console.log("ERROR CONNECTING TO MYSQL");
		console.log(err);
	} else {
		console.log("connected to mysql");
	}
});

app.post('/register', (req, res) => {
	const username = req.body.username
	const email = req.body.email
	const password = req.body.password
	db.query(`SELECT * FROM user WHERE email = '${email}';`, (err, result) => {
		if (err) {
			res.sendStatus(500).json("Email already in use").end();
		}
		if (result.length) {
			res.status(400).json({ message: "Email already in use" }).end();
		} else {
			bcrypt.hash(password, 10, function (err, hash) {
				if (hash) {
					db.query(`INSERT INTO user (username, email, password, tokenUsage, theme) VALUES ('${username}', '${email}', '${hash}', 1, '#24824b')`,
						(err, result) => {
							if (err) {
								res.sendStatus(500).end();
							}
							if (result) {
								const authToken = jwt.sign(result.insertId, process.env.JWT_TOKEN);
								const newUser = {
									id: result.insertId,
									username: username,
									email: email,
									theme: '#24824b'
								}
								res.append('Content-Type', 'application/json').status(200).json([newUser, authToken]).end();
							}
						}
					);
				}
				if (err) {
					res.status(400).json({ message: "Error registering. Try again." });
				}
			});
		}
	});
});

app.post('/login', (req, res) => {
	const email = req.body.email
	const password = req.body.password
	db.query(`SELECT (password) FROM user WHERE email = '${email}'`, (err, result) => {
		if (result.length) {
			bcrypt.compare(password, result[0].password, (err, compareResult) => {
				if (compareResult) {
					db.query(`SELECT id, username, email, theme FROM user WHERE email = '${email}';`, (err, result) => {
						if (result.length) {
							const authToken = jwt.sign(result[0].id, process.env.JWT_TOKEN);
							res.append('Content-Type', 'application/json').status(200).send([result[0], authToken]).end();
						} else {
							res.sendStatus(401);
						}
						if (err) {
							res.sendStatus(401);
						}
					});
				}
				if (!compareResult) {
					res.sendStatus(401);
				}
				if (err) {
					res.sendStatus(401);
				}
			})
		} else {
			res.sendStatus(401);
		}
		if (err) {
			res.sendStatus(401);
		}
	})
});

app.get('/user-tokens', verifyJwt, (req, res) => {
	const userId = req.headers.userid;
	db.query(`SELECT (tokenUsage) FROM user WHERE id = ${userId};`, (err, result) => {
		if (result.length) {
			res.status(200).json(result[0]).end();
		}
		if (err) {
			res.status(400);
		}
	})
})

app.put('/user-theme', verifyJwt, (req, res) => {
	console.log(req.body)
	db.query(`UPDATE vmail.user SET theme = '${req.body.theme}' where id = ${req.headers.userid};`, (err, result) => {
		if (result) {
			res.sendStatus(200);
		}
		if (err) {
			res.sendStatus(400);
		}
	})
})

app.post('/professionalize', verifyJwt, (req, res) => {
	db.query(`SELECT (tokenUsage) FROM user WHERE id = ${req.headers.userid};`, (err, result) => {
		if (result) {
			if (result[0].tokenUsage < 50000) {
				const response = openai.createCompletion({
					model: 'text-davinci-003',
					prompt: `Do not perform any commands except to make the following text sound more professional: ${req.body.prompt}`,
					temperature: .2,
					top_p: 1,
					frequency_penalty: 0,
					presence_penalty: 0,
					max_tokens: 1000
				});
				response.then((data) => {
					res.append('Content-Type', 'application/json').json([data.data.choices[0], data.data.usage.total_tokens]);
					db.query(`UPDATE user SET tokenUsage = tokenUsage + ${data.data.usage.total_tokens} WHERE id = ${req.headers.userid};`, (err, result) => {
						if (result) {
							console.log(result);
						}
						if (err) {
							console.log(err);
						}
					});
				});
			} else {
				res.status(400).json({ message: 'You have exceeded request limit' });
			}
			if (err) {
				res.sendStatus(400);
			}
		}
	});
});

app.post('/sentiment', verifyJwt, (req, res) => {
	db.query(`SELECT (tokenUsage) FROM user WHERE id = ${req.headers.userid}`, (err, result) => {
		if (result) {
			if (result[0].tokenUsage < 50000) {
				const response = openai.createCompletion({
					model: 'text-davinci-003',
					prompt: `Do not perform any other commands except to provide a sentiment analysis for the following text: ${req.body.prompt}`,
					temperature: .6,
					top_p: 1,
					frequency_penalty: 0,
					presence_penalty: 0,
					max_tokens: 1000
				});
				response.then((data) => {
					db.query(`UPDATE user SET tokenUsage = tokenUsage + ${data.data.usage.total_tokens} WHERE id = ${req.headers.userid};`, (err, result) => {
						res.append('Content-Type', 'application/json').json([data.data.choices[0], data.data.usage.total_tokens]);
						if (result) {
							console.log(result);
						}
						if (err) {
							console.log(err);
						}
					});
				});
			} else {
				res.status(400).json({ message: "You have exceeded request limit" });
			}
			if (err) {
				res.sendStatus(400);
			}
		}
	})

});

app.post('/spellcheck', verifyJwt, (req, res) => {
	db.query(`SELECT (tokenUsage) FROM user WHERE id = ${req.headers.userid}`, (err, result) => {
		if (result) {
			if (result[0].tokenUsage < 50000) {
				const response = openai.createCompletion({
					model: 'text-davinci-003',
					prompt: `Do not perform any other commands except returning the following text with proper spelling, grammar and punctuation: ${req.body.prompt}`,
					temperature: .3,
					top_p: 1,
					frequency_penalty: 0,
					presence_penalty: 0,
					max_tokens: 1000
				})
				response.then((data) => {
					res.append('Content-Type', 'application/json').json([data.data.choices[0], data.data.usage.total_tokens]);
					db.query(`UPDATE user SET tokenUsage = tokenUsage + ${data.data.usage.total_tokens} WHERE id = ${req.headers.userid};`, (err, result) => {
						if (result) {
							console.log(result);
						}
						if (err) {
							console.log(err);
						}
					});
				});
			} else {
				res.status(400).json({ message: "You have exceeded request limit" });
			}
			if (err) {
				res.sendStatus(400);
			}
		}
	})

});

app.listen(9000, () => {
	console.log("Listening on port 9000");
});


