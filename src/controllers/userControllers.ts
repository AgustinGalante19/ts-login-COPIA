import { Request, Response } from "express";
import User from '../models/userModel';

//? implent token?
class UserControllers {

    /* async getUsers(req: Request, res: Response): Promise<Response> {
        const { role } = req.headers;
        try {
            if (role === "admin") {
                const users = await User.find().populate("products");
                return res.json(users);
            } else {
                return res.status(403).send("Forbidden").end();
            }
        } catch (err) {
            return res.json({ error: err });
        }
    } */

    async getUsers(req: Request, res: Response): Promise<Response> {

        const users = await User.find().populate("products");
        return res.json(users);

    }

    async getUserById(req: Request, res: Response): Promise<Response> {
        const { id } = req.params;
        const user = await User.findById({ _id: id }, { password: 0, products: 0, username: 0, _id: 0 });
        return res.json(user);
    }

    async profile(req: Request, res: Response): Promise<Response> {

        try {
            const user = await User.findById(req.userId, { password: 0 });
            if (!user) return res.status(404).json("User not found.");
            return res.json(user);
        } catch (err) {
            return res.status(400).send(false).end();
        }
    }

    async editProfile(req: Request, res: Response): Promise<Response> {

        try {

            const { id } = req.params;
            const { name, lastname, email, description } = req.body;
            await User.findOneAndUpdate({ _id: id }, { name, lastname, email, description }, { new: true });
            return res.status(200).json(true).end();
        } catch (err) {
            console.log("Error on edit profile: ", err);
            return res.status(500).send(false).end();
        }

    }

}

const userController = new UserControllers();
export default userController;