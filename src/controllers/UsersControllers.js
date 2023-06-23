const { hash, compare } = require("bcryptjs");
const AppError = require("../utils/appError");
const sqliteConnection = require("../database/sqlite");

class UsersController {
    async create(request, response) {
        const { name, email, password } = request.body;

        const database = await sqliteConnection();

        const checkUserExists = await database.get("SELECT * FROM users WHERE email = (?)",[email]);

        if(checkUserExists) {
            throw new AppError("E-mail em uso");
        };

        const hashedPassword = await hash(password, 8);

        database.run("INSERT INTO users (name, email, password) VALUES (?, ?, ?)",
            [name, email, hashedPassword]
        );
        response.status(201).json();
    };

    async update(request, response) {
        const { name, email, password, newPassword } = request.body;
        const user_id = request.user.id;

        const database = await sqliteConnection();

        const user = await database.get("SELECT * FROM users WHERE id = (?)", [user_id]);

        if(!user) {
            throw new AppError("Usuário não encontrado.");
        };
        
        const checkNewEmailInUse = await database.get("SELECT * FROM users WHERE email = (?)", [email]);

        if(checkNewEmailInUse && checkNewEmailInUse.id !== user.id) {
            throw new AppError("E-mail já cadastrado");
        };

        user.name = name ?? user.name;
        user.email = email ?? user.email;

        if (password && newPassword) {
            const checkOldPassword = await compare(password, user.password);

            if (!checkOldPassword) {
                throw new AppError("Senha antiga incorreta");
            };

            user.password = await hash(newPassword, 8);
        };

        if (!password && newPassword) {
            throw new AppError("Você precisa digitar a senha antiga");
        };


        await database.run(`
        UPDATE users SET
        name = ?,
        email = ?,
        password = ?,
        updated_at = DATETIME('now')
        WHERE id = ?`, [user.name, user.email, user.password, user_id]
        );

        response.status(200).json();
    };
};

module.exports = UsersController;