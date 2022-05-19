import { NextFunction, Request, Response } from 'express';
import ApiError from '../errors/ApiError';
import { User } from '../models';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const generateJwt = (id: number, email: string) => {
    return jwt.sign(
        {id, email},
        String(process.env.SECRET_KEY),
        {expiresIn: '24h'}
    )
}

class UserController {
    async registration(req: Request, res: Response, next: NextFunction) {
        const { username, password } = req.body;
        console.log(username, password);
        if (!username || !password) {
            return next(ApiError.badRequest('Некорректный username или password'))
        }
        const candidate = await User.findOne({where: {username}})

        if (candidate) {
            return next(ApiError.badRequest('Пользователь с таким username уже существует'))
        }
        const hashPassword = await bcrypt.hash(password, 5)
        const user = await User.create({username, password: hashPassword}) as any;
        const token = generateJwt(user.id, user.username)
        return res.json({token})
    }

    async login(req: Request, res: Response, next: NextFunction) {
        const {username, password} = req.body

        const user = await User.findOne({where: {username}}) as any;

        if (!user) {
            return next(ApiError.badRequest('Пользователь не найден'))
        }
        let comparePassword = bcrypt.compareSync(password, user.password)

        if (!comparePassword) {
            return next(ApiError.badRequest('Указан неверный пароль'))
        }
        const token = generateJwt(user.id, user.username)
        return res.json({token})
    }

    async check(req: any, res: Response, next: NextFunction) {
        const token = generateJwt(req.user.id, req.user.username)
        return res.json({token})
    }
}

export default new UserController();
