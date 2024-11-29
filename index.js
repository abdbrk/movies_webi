import express from 'express';
import path from 'node:path';

import geoip from 'geoip-lite';

import fs from 'node:fs';
import { nextTick } from 'node:process';

import moviesRouter from './routes/moviesRouter.js';
import listsRouter from './routes/listsRouter.js';


const port = 3001;

const app = express();

let totalRequest = 0;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

app.use((req, res, next) => {
	console.log('je suis un middleware');
	totalRequest++;
	console.log(totalRequest);
	next();
});

app.use('/movies', moviesRouter);

app.use('/lists', listsRouter)

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
	res.status(404).json({ error: true, message: 404 });
});

app.listen(port, () => {
	console.log(`server running : ${port}`);
});
