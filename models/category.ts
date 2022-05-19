import sequelize from '../db';
import { DataTypes } from 'sequelize';

export interface ICategory {
    id: string;
    label: string;
    value: string;
    userId: string;
}

export const Category = sequelize.define('category', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    label: { type: DataTypes.STRING },
    value: { type: DataTypes.STRING },
});
