import express from 'express';
import { getUsers } from './controller';


const router = express.Router();

router.get('/', (req, res) => {
    res.send('Hello World!')
});

router.get('/users', getUsers);


export default router;