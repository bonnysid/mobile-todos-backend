import { Router } from 'express';
import C from '../controllers';
import {AuthMiddleware} from '../middlewares';

const router = Router();

router.post('/registration', C.UserController.registration)
router.post('/login', C.UserController.login)
router.get('/auth', AuthMiddleware, C.UserController.check)

export default router;
