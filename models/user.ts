import sequelize from '../db';
import { DataTypes } from 'sequelize';
import { Category } from './category';
import { Todo } from './todo';

export interface IUser {
    id: string;
    username: string;
    password: string;
}

export const User = sequelize.define('user', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    username: { type: DataTypes.STRING, unique: true },
    password: { type: DataTypes.STRING },
});

User.hasMany(Category);
Category.belongsTo(User);

User.hasMany(Todo);
Todo.belongsTo(User);
