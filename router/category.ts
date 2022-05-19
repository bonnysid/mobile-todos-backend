import { Router } from 'express';
import { AuthMiddleware } from '../middlewares';
import C from '../controllers';

const router = Router();

router.get('/', AuthMiddleware, C.CategoryController.getAll);
router.get('/:id', AuthMiddleware, C.CategoryController.getOne);
router.post('/', AuthMiddleware, C.CategoryController.create);
router.delete('/:id', AuthMiddleware, C.CategoryController.delete);
router.put('/:id', AuthMiddleware, C.CategoryController.update);

export default router;
