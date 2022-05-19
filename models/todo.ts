import sequelize from '../db';
import { DataTypes } from 'sequelize';
import { Category, ICategory } from './category';

export interface ITodo {
    id: string;
    title: string;
    description: string;
    completed: boolean;
    categories: ICategory[]
}

export const Todo = sequelize.define('todo', {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    title: { type: DataTypes.STRING },
    description: { type: DataTypes.STRING },
    completed: { type: DataTypes.BOOLEAN, defaultValue: false },
});

export const TodoCategory = sequelize.define('todo_category', {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
});

Todo.belongsToMany(Category, { through: TodoCategory });
Category.belongsToMany(Todo, { through: TodoCategory })
