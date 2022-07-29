import { Request, Response } from "express";
import User from '../models/userModel';
import IUser from "../interfaces/User";
import { createToken } from "../libs/TokenLibs";
import validateChars from '../services/validateChars';
class signupCtrls {

    async signup(req: Request, res: Response): Promise<Response> {
        const { name, lastname, email, username, password } = req.body;

        if (!validateChars(name)) {
            return res.status(400).json({
                status: 400,
                message: 'Name must be alphanumeric'
            });
        }

        else if (!validateChars(lastname)) {
            return res.status(400).json({
                status: 400,
                message: 'Lastname must be alphanumeric'
            });
        }

        else if (!validateChars(username)) {
            return res.status(400).json({ message: "Username must be alphanumeric" });
        }

        else if (!validateChars(password)) {
            return res.status(400).json({ message: "Password must be alphanumeric" });
        }

        else {
            try {

                //The user has been created with the received data.
                const user: IUser = new User({
                    name,
                    lastname,
                    email,
                    username,
                    password
                });

                const userExists = await User.exists({ username });
                if (userExists) return res.status(203).json({ userExists: true }).end();

                const emailExists = await User.exists({ email });
                if (emailExists) return res.status(203).json({ emailExists: true }).end();

                user.password = await user.encryptPassword(user.password);
                user.name = user.name[0].toUpperCase() + user.name.slice(1);
                user.lastname = user.lastname[0].toUpperCase() + user.lastname.slice(1);
                const savedUser = await user.save();

                const token = createToken(user._id);

                return res.header("auth-token", token).json({ savedUser, token });
            } catch (err) {
                return res.status(500).send(err).end();
            }
        }
    }
}

const signupController = new signupCtrls();

export default signupController;