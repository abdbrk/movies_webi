import express from 'express';
import authMiddleware from '../middlewares/authMiddleware.js';
import {
	createOne,
	deleteOneById,
	getAllMovies,
	getOneById,
	patchOneById,
} from '../controllers/moviesController.js';

const router = express.Router();

router.get('/', getAllMovies);

router.get('/:id/', getOneById);

router.post('/', authMiddleware, createOne);

router.patch('/', patchOneById);

router.delete('/', deleteOneById);

export default router;
