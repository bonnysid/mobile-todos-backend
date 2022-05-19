import { Router } from 'express';
import userRouter from './user';
import todoRouter from './todo';
import categoryRouter from './category';

const router = Router();

router.use('/user', userRouter)
router.use('/todo', todoRouter)
router.use('/category', categoryRouter)

export default router;
