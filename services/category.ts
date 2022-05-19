import { Category, TodoCategory } from '../models';
import ApiError from '../errors/ApiError';

export const addCategoriesToTodo = async (todoId: number, categories: number[]) => {
    const res = [];
    for (let categoryId of categories) {
        res.push(await TodoCategory.create({ categoryId, todoId }));
    }
    return res;
}

export const updateCategoriesToTodo = async (todoId: number, categories: number[]) => {
    const currentTodoCategories = await TodoCategory.findAll({ where: { todoId } });
    const currentCategories: any[] = [];
    for (let categoryTodo of currentTodoCategories) {
        // @ts-ignore
        const catTodo = await Category.findOne({ where: { id: categoryTodo.categoryId }});
        currentCategories.push(catTodo);
    }

    const removedCategories = currentCategories.filter(it => !categories.includes(it.id)).map(it => it.id);
    const newCategories = categories.filter(it => !currentCategories.map(it => it.id).includes(it));
    for (let categoryId of removedCategories) {
        const catTodo = await TodoCategory.findOne({ where: { categoryId, todoId }});
        await catTodo?.destroy();
    }
    for (let categoryId of newCategories) {
        await TodoCategory.create({ categoryId, todoId })
    }
}

export const getTodoCategories = async (todoId: number) => {
    // @ts-ignore
    const categoriesIds = await TodoCategory.findAll({ where: { todoId } });
    const res = [];
    for (let todoCategory of categoriesIds) {
        // @ts-ignore
        res.push(await Category.findOne({ where: { id: todoCategory.categoryId }}));
    }
    return res;
}

class CategoryService {
    async create(userId: string, label: string, value: string) {
        const category = await Category.create({ userId, label, value });
        return category;
    }

    async update(id: string, value: string, label: string) {
        if (!id || (!value && !label)) {
            throw ApiError.badRequest('Категория не найдена или не протзошло никаких изменений');
        }

        // @ts-ignore
        const candidate = await Category.findOne({ id });

        if (!candidate) {
            throw ApiError.badRequest('Категория не найдена')
        }

        await candidate.set({
            value,
            label,
        });
        return await candidate.save();
    }

    async delete(id: number, userId: number) {
        // @ts-ignore
        const candidate = await Category.findOne({ id, userId });

        if (!candidate) {
            throw ApiError.badRequest('Категория не найдена');
        }

        return await candidate.destroy();
    }

    async getOne(id: number, userId: number) {
        if (!id || !userId) {
            throw ApiError.badRequest('Id не задан')
        }
        // @ts-ignore
        return await Category.findOne({ where: { id, userId }})
    }

    async getAll(userId: number) {
        // @ts-ignore
        return await Category.findAll({ where: { userId }});
    }

}

export default new CategoryService();
