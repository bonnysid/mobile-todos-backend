import { Todo } from '../models';
import ApiError from '../errors/ApiError';
import { addCategoriesToTodo, getTodoCategories, updateCategoriesToTodo } from './category';

class TodoService {
    async create(userId: string, title: string, description: string, categories: number[] = []) {
        const todo = await Todo.create({ userId, title, description }, { returning: true });

        // @ts-ignore
        await addCategoriesToTodo(todo.id, categories);
        // @ts-ignore
        const categoriesTodo = await getTodoCategories(todo.id);

        // @ts-ignore
        return { ...todo.dataValues, categories: categoriesTodo };
    }

    async update(id: string, title: string, description: string, categories: number[], completed: boolean) {
        // @ts-ignore
        const candidate = await Todo.findOne({ where: { id }});

        if (!candidate) {
            throw ApiError.badRequest('Todo не найдена')
        }
        await updateCategoriesToTodo(+id, categories);
        await candidate.set({
            title,
            description,
            completed,
        });
        return await candidate.save();
    }

    async delete(id: number, userId: number) {
        // @ts-ignore
        const candidate = await Todo.findOne({ id, userId });

        if (!candidate) {
            throw ApiError.badRequest('Todo не найдена');
        }

        return await candidate.destroy();
    }

    async getOne(id: number, userId: number) {
        if (!id || !userId) {
            throw ApiError.badRequest('Id не задан')
        }
        // @ts-ignore
        const todo = await Todo.findOne({ where: { id, userId  }})
        // @ts-ignore
        const categories = await getTodoCategories(todo.id);

        // @ts-ignore
        return { ...todo.dataValues, categories };
    }

    async getAll(userId: number) {
        // @ts-ignore
        const todos = await Todo.findAll({ where: { userId }});
        const res = [];

        for (let todo of todos) {
            // @ts-ignore
            const categories = await getTodoCategories(todo.id);
            // @ts-ignore
            res.push({ ...todo.dataValues, categories });
        }

        return res;
    }
}

export default new TodoService();
