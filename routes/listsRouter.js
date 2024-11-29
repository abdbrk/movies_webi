import express from 'express';
import authMiddleware from '../middlewares/authMiddleware.js';
import {
    getAllLists,
    getUserAllList,
    getListById,
    createList
}
from "../controllers/listsController.js"
const router = express.Router();

router.get('/', getAllLists);

router.get('/user/:idOwner', getUserAllList);

router.get('/:id', getListById);

router.post('/', createList);

/*

router.delete('/:id', deleteList);

router.put('/:id', modifyList);

router.post('/:id/movies', addFilmToList);

router.delete('/:id/movies/:idMovie', deleteFilmFromList);
*/

export default router;