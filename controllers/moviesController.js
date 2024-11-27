import fs from 'node:fs';

const getAllMovies = (req, res) => {
	fs.readFile('movies.json', 'utf8', (err, data) => {
		if (err) {
			console.error(err);
			return;
		}

		const cleanData = JSON.parse(data);

		res.status(200).json({ movies: cleanData });
	});
};

const getOneById = (req, res) => {
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
};

const createOne = (req, res) => {
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
};

const patchOneById = (req, res) => {
	res.json({ message: 'Je suis une route patch de movies' });
};

const deleteOneById = (req, res) => {
	res.json({ message: 'Je suis une route delete de movies' });
};

export { getAllMovies, getOneById, createOne, patchOneById, deleteOneById };
