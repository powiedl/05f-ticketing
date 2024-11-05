import express, { Request, Response } from 'express';
import { body } from 'express-validator';
import {
  BadRequestError,
  validateRequest,
} from '@powidl2024/common__powidl2024';
import { User, UserModel } from '../models/users';
import jwt from 'jsonwebtoken';

const router = express.Router();

router.post(
  '/api/users/signup',
  [
    body('email').isEmail().withMessage('Email must be valid'),
    body('password')
      .trim()
      .isLength({ min: 4, max: 20 })
      .withMessage('Password must be between 4 and 20 characters'),
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    const { email, password } = req.body;

    // new User({email, password});
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      console.log('email in use');
      throw new BadRequestError('Email already in use');
    }

    const user = User.build({ email, password });
    await user.save();

    // generate jwt
    const userJwt = jwt.sign(
      {
        id: user.id,
        email: user.email,
      },
      process.env.JWT_KEY! // mit diesem ! garantieren wir Typescript, dass es eine ENV-Variable mit dem Namen JWT_KEY gibt (weil wir es beim Startup schon geprüft haben)
    );

    // store it on session object
    req.session = {
      jwt: userJwt,
    };

    res.status(201).send(user);
  }
);

export { router as signupRouter };
