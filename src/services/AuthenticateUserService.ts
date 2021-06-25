import {getCustomRepository} from "typeorm";

import {compare} from "bcryptjs";
import {sign} from "jsonwebtoken";

import {UsersRepositories} from "../repositories/UsersRepositories";

interface IAuthenticateRequest {
  email: string;
  password: string;
}

class AuthenticateUserService {

  async execute({email, password}: IAuthenticateRequest) {
    const usersRepositories = getCustomRepository(UsersRepositories);

    const user = await usersRepositories.findOne({email});

    if (!user) {
      throw new Error("Email/Password incorrect");
    }

    const isPasswordCorrect = await compare(password, user.password);

    if (!isPasswordCorrect) {
      throw new Error("Email/Password incorrect");
    }

    const token = sign({
      email: user.email
    }, "faf3997a817fefdd77596ebef24a632f", {
      subject: user.id,
      expiresIn: "1d"
    });

    return token;

  }
}

export {AuthenticateUserService};