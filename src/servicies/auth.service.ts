import User, { IUser } from '../models/user';
import jwt from 'jsonwebtoken';

export const signupService = async (data: IUser) => {
  const user = new User(data);
  user.password = await user.encryptPassword(user.password);
  const savedUser = await user.save();
  const token = jwt.sign({ _id: savedUser._id }, process.env.TOKEN_SECRET || 'tokentest');
  return { user: savedUser, token };
};

export const signinService = async (email: string, password: string) => {
  const user = await User.findOne({ email });
  if (!user || !(await user.validatePassword(password))) {
    throw new Error('Invalid credentials');
  }
  const token = jwt.sign({ _id: user._id }, process.env.TOKEN_SECRET || 'tokentest', {
    expiresIn: 60 * 60 * 24,
  });
  return { user, token };
};