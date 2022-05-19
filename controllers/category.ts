import { NextFunction, Request, Response } from 'express';
import ApiError from '../errors/ApiError';
import S from '../services';
import { Category } from '../models';

class CategoryController {
    async create(req: Request, res: Response, next: NextFunction) {
        const { label, value } = req.body;
        const { id } = (req as any).user;

        if (!label || !value) {
            next(ApiError.badRequest('Label или value отсутствуют'))
        }

        const options = { userId: (req as any).user.id, value }

        // @ts-ignore
        const candidate = await Category.findOne({ where: options });

        if (candidate) {
            next(ApiError.badRequest('Категория с таким value уже существует'))
        }

        return res.json(await S.CategoryService.create(id, label, value));
    }

    async update(req: Request, res: Response, next: NextFunction) {
        try {
            const { id, value, label } = req.body;
            return res.json(await S.CategoryService.update(id, value, label));
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

            return res.json(await S.CategoryService.delete(+id, user.id));
        } catch (e) {
            next(e);
        }
    }

    async getOne(req: Request, res: Response, next: NextFunction) {
        try {
            const id = req.params.id;
            // @ts-ignore
            const userId = req.user?.id;
            return res.json(await S.CategoryService.getOne(+id, userId))
        } catch (e) {
            next(e);
        }
    }

    async getAll(req: Request, res: Response, next: NextFunction) {
        try {
            // @ts-ignore
            const userId = req.user?.id;
            return res.json(await S.CategoryService.getAll(userId));
        } catch (e) {
            next(e)
        }
    }
}

export default new CategoryController();
