const knex = require("../database/knex");
const DiskStorage = require("../providers/DiskStorage");

class UsersAvatarControllers {
    async update(request, response) {
        const user_id = request.user.id;
        const avatarFileName = request.file.filename;

        const [user] = await knex("users").where({ id: user_id});

        if(!user) {
            throw new AppError("Somente usuário autenticado pode mudar a foto.");
        }

        const diskStorage = new DiskStorage();

        if(user.avatar){
            await diskStorage.deleteFile(user.avatar);
        }

        const filename = await diskStorage.saveFile(avatarFileName);
        user.avatar = filename;
        
        await knex("users").update(user).where({ id: user.id});

        return response.json(user);
    }
}

module.exports = UsersAvatarControllers;