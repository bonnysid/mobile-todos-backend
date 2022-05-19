import { Router } from 'express';
import { AuthMiddleware } from '../middlewares';
import C from '../controllers';

const router = Router();

router.get('/', AuthMiddleware, C.TodoController.getAll);
router.get('/:id', AuthMiddleware, C.TodoController.getOne);
router.post('/', AuthMiddleware, C.TodoController.create);
router.delete('/:id', AuthMiddleware, C.TodoController.delete);
router.put('/:id', AuthMiddleware, C.TodoController.update);

export default router;
