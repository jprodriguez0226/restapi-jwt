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
exports.signinService = exports.signupService = void 0;
const user_1 = __importDefault(require("../models/user"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const signupService = (data) => __awaiter(void 0, void 0, void 0, function* () {
    const user = new user_1.default(data);
    user.password = yield user.encryptPassword(user.password);
    const savedUser = yield user.save();
    const token = jsonwebtoken_1.default.sign({ _id: savedUser._id }, process.env.TOKEN_SECRET || 'tokentest');
    return { user: savedUser, token };
});
exports.signupService = signupService;
const signinService = (email, password) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield user_1.default.findOne({ email });
    if (!user || !(yield user.validatePassword(password))) {
        throw new Error('Invalid credentials');
    }
    const token = jsonwebtoken_1.default.sign({ _id: user._id }, process.env.TOKEN_SECRET || 'tokentest', {
        expiresIn: 60 * 60 * 24,
    });
    return { user, token };
});
exports.signinService = signinService;
//# sourceMappingURL=auth.service.js.map