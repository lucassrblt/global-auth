import express from 'express';
import { getUsers, createUser } from './controller';


const router = express.Router();

router.get('/', (req, res) => {
    res.send('Hello World!')
});

router.get('/user', getUsers);
router.post('/user', createUser);


export default router;