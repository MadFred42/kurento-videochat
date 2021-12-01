const userModel = require("../models/userModel");
const bcrypt = require('bcryptjs');

class UserController {
    async registration (req, res) {
        try {
            const { username, password } = req.body;
            const hashPassword = await bcrypt.hash(password, 5);
            const user = await userModel.findOne({ username });

            if (user) {
                return res.status(400).json({ message : `User '${username}' already exist` });
            }

            const createUser = await userModel.create({ username, password: hashPassword });

            return res.json(createUser.toDto());
        } catch (e) {
            console.log(e);
        }
    };

    async login (req, res) {
        try {
            const { username, password } = req.body;
            const user = await userModel.findOne({ username });

            if (!user) {
                return res.status(400).json({ message: `User '${username}' does not exist` });
            }

            return res.json(user.toDto());
        } catch (e) {
            console.log(e);
        }
    };

    async getUsers (req, res) {
        try {
            const users = await userModel.find();

            return res.json({users: users});
        } catch (error) {
            console.log(e);
        }
    };
};

module.exports = new UserController();