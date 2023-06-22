const knex = require("../database/knex");
const { compare } = require("bcryptjs");

const authConfig = require("../configs/auth");
const { sign } = require("jsonwebtoken");

const AppError = require("../utils/appError");

class SessionsControllers {
    async create(request, response) {
        const { email,  password } = request.body;

        const [user] = await knex("users").where({ email});

        const passwordIsCorrect = await compare(password, user.password);

        if(!user) {
            throw new AppError("Email e/ou incorreta", 401);
        };

        if(!passwordIsCorrect) {
            throw new AppError("Email e/ou incorreta", 401);
        };

        const { secret, expiresIn} = authConfig.jwt;
        const token = sign({}, secret, {
            subject: String(user.id),
            expiresIn
        })


        return response.json({ user, token });
    };
}

module.exports = SessionsControllers;