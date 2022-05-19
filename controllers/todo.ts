import { NextFunction, Request, Response } from 'express';
import ApiError from '../errors/ApiError';
import S from '../services';

class TodoController {
    async create(req: Request, res: Response, next: NextFunction) {
        const { title, description, categories } = req.body;
        const user = (req as any).user;

        if (!title || !description) {
            next(ApiError.badRequest('Title или description отсутствуют'))
        }

        return res.json(await S.TodoService.create(user.id, title, description, categories));
    }

    async update(req: Request, res: Response, next: NextFunction) {
        try {
            const { id, title, description, categories, completed } = req.body;
            return res.json(await S.TodoService.update(id, title, description, categories, completed));
        } catch (e) {
            next(e)
        }
    }

    async delete(req: Request, res: Response, next: NextFunction) {
        try {
            const { id } = req.params;
            const user = (req as any).user;

            if (!user) {
                next(ApiError.forbidden('Not authorized'));
            }

            return res.json(await S.TodoService.delete(+id, user.id));
        } catch (e) {

        }
    }

    async getOne(req: Request, res: Response, next: NextFunction) {
        try {
            const id = req.params.id;
            // @ts-ignore
            const userId = req.user?.id;
            return res.json(await S.TodoService.getOne(+id, userId))
        } catch (e) {
            next(e);
        }
    }

    async getAll(req: Request, res: Response, next: NextFunction) {
        try {
            // @ts-ignore
            const userId = req.user?.id;
            return res.json(await S.TodoService.getAll(userId));
        } catch (e) {
            next(e)
        }
    }
}

export default new TodoController();
