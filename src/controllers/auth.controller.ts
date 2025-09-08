import { Request, Response } from "express";
import { signupService, signinService } from '../servicies/auth.service';


export const signup = async (req: Request, res: Response) => {
  try {
    const { user } = await signupService(req.body);
    res.json({
      username: user.username,
      role: user.role
    });
  } catch (error) {
    res.status(500).json({ message: 'Signup failed', error });
  }
};

export const signin = async (req: Request, res: Response) => {
  try {
    const { token } = await signinService(req.body.email, req.body.password);
    res.json({"auth-token":token});
  } catch (error:string | any) {
    res.status(400).json({ message: error.message });
  }
};

