import express from 'express';
import path from 'node:path';

import geoip from 'geoip-lite';

import fs from 'node:fs';
import { nextTick } from 'node:process';

const app = express();

let totalRequest = 0;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

const authMiddleware = (req, res, next) => {
	const email = req.body.email;
	const password = req.body.password;

	if (email !== 'blabla@email.com' || password !== '1234') {
		res.status(401).json({ error: true, message: 'bad auth' });
	} else {
		next();
	}
};

app.use((req, res, next) => {
	console.log('je suis un middleware');
	totalRequest++;
	console.log(totalRequest);
	next();
});

app.get('/', (request, response) => {
	response.status(200).json({ message: 'Vous nous avez contacté :)' });
});

app.get('/hello-world', (request, response) => {
	response.status(200).json({ message: 'Hello :)' });
});

app.get('/geo', (request, response) => {
	console.log(request);

	var ip = '78.192.31.18'; //request.headers['x-forwarded-for'] || request.socket.remoteAddress

	const localisation = geoip.lookup(ip);
	response.json({ ip, localisation });
});

app.get('/superheroes/random', (req, res) => {
	fs.readFile('superheroes.json', 'utf8', (err, data) => {
		if (err) {
			console.error(err);
			return;
		}

		const cleanData = JSON.parse(data);

		const length = cleanData.length;

		const random = Math.round(Math.random() * length);

		const randomSuperHeroes = cleanData[random];

		console.log(length, random, randomSuperHeroes);
		res.status(200).json({ hero: randomSuperHeroes });
	});
});

app.get('/movies', authMiddleware, (req, res) => {
	fs.readFile('movies.json', 'utf8', (err, data) => {
		if (err) {
			console.error(err);
			return;
		}

		const cleanData = JSON.parse(data);

		res.status(200).json({ movies: cleanData });
	});
});

app.get('/movies/:id/', (req, res) => {
	const targetId = Number(req.params.id);

	if (isNaN(targetId)) {
		res.json({
			error: true,
			message: "Cet id n'est pas valide",
		});
	} else {
		fs.readFile('movies.json', 'utf8', (err, data) => {
			if (err) {
				console.error(err);
				return;
			}

			const cleanData = JSON.parse(data);

			const movie = cleanData.filter((oneMovie) => {
				if (oneMovie.id === targetId) {
					return oneMovie;
				}
			})[0];

			if (!movie) {
				res.status(404).json({
					error: true,
					message: 'Pas de film avec cet ID',
				});
			} else {
				res.status(200).json({ movie });
			}
		});
	}
});

app.post('/movies', authMiddleware, (req, res) => {
	fs.readFile('movies.json', 'utf8', (err, data) => {
		if (err) {
			console.error(err);
			return;
		}

		const cleanData = JSON.parse(data);

		const length = cleanData.length;

		const lastElement = cleanData[length - 1];

		const lastId = lastElement.id;

		const newId = lastId + 1;

		const newMovie = { ...req.body.movie, id: newId };

		const allMovies = [...cleanData, newMovie];

		fs.writeFile('movies.json', JSON.stringify(allMovies), (err) => {
			if (err) {
				res.status(500).json({
					error: true,
					message: "Le serveur n'a pas réussi a sauvegarder ce film ",
				});
			}
			res.status(201).json(newMovie);
		});
	});
});
app.put('/hello', (req, res) => {
	res.send('Je suis une réponse à une requête PUT');
});

app.patch('/hello', (req, res) => {
	res.send('Je suis une réponse à une requête PATCH');
});

app.delete('/hello', (req, res) => {
	res.send('Je suis une réponse à une requête DELETE');
});

app.use((req, res) => {
	res.json({ error: true, message: 404 });
});

app.listen(3000, () => {
	console.log('server running : port 3000');
});
