"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const userModel_1 = __importDefault(require("../models/userModel"));
const TokenLibs_1 = require("../libs/TokenLibs");
const validateChars_1 = __importDefault(require("../services/validateChars"));
class signupCtrls {
    signup(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { name, lastname, email, username, password } = req.body;
            if (!(0, validateChars_1.default)(name)) {
                return res.status(400).json({
                    status: 400,
                    message: 'Name must be alphanumeric'
                });
            }
            else if (!(0, validateChars_1.default)(lastname)) {
                return res.status(400).json({
                    status: 400,
                    message: 'Lastname must be alphanumeric'
                });
            }
            else if (!(0, validateChars_1.default)(username)) {
                return res.status(400).json({ message: "Username must be alphanumeric" });
            }
            else if (!(0, validateChars_1.default)(password)) {
                return res.status(400).json({ message: "Password must be alphanumeric" });
            }
            else {
                try {
                    //The user has been created with the received data.
                    const user = new userModel_1.default({
                        name,
                        lastname,
                        email,
                        username,
                        password
                    });
                    const userExists = yield userModel_1.default.exists({ username });
                    if (userExists)
                        return res.status(203).json({ userExists: true }).end();
                    const emailExists = yield userModel_1.default.exists({ email });
                    if (emailExists)
                        return res.status(203).json({ emailExists: true }).end();
                    user.password = yield user.encryptPassword(user.password);
                    user.name = user.name[0].toUpperCase() + user.name.slice(1);
                    user.lastname = user.lastname[0].toUpperCase() + user.lastname.slice(1);
                    const savedUser = yield user.save();
                    const token = (0, TokenLibs_1.createToken)(user._id);
                    return res.header("auth-token", token).json({ savedUser, token });
                }
                catch (err) {
                    return res.status(500).send(err).end();
                }
            }
        });
    }
}
const signupController = new signupCtrls();
exports.default = signupController;
