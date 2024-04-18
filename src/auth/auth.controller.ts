import { LoginDTO, RegisterDTO } from "@/dtos";
import {
  Body,
  Controller,
  Logger,
  Post,
  UnauthorizedException,
} from "@nestjs/common";

@Controller("auth")
export class AuthController {
  private logger: Logger = new Logger("auth.controller");

  constructor() {
    this.logger.debug({
      message: "Entering constructor of auth controller",
    });
  }

  @Post("/login")
  login(@Body() loginDto: LoginDTO): any {
    try {
      // dummy data
      const user = {
        _id: "fake-id",
        email: "sagar@gmail.com",
        password: "123456",
      };

      this.logger.debug({
        message: "Entering login",
        data: loginDto,
      });

      if (
        loginDto.email !== user.email ||
        loginDto.password !== user.password
      ) {
        this.logger.warn({
          message: "Invalid email or password",
          user: user,
        });
        throw new UnauthorizedException("Invalid email or password");
      }

      this.logger.log({
        message: "user loged in",
        user: user,
      });

      // Send user data
      return {
        user: user,
        tokens: {
          access_token: "fake-access-token",
          refresh_token: "fake-refresh-token",
        },
      };
    } catch (error) {
      this.logger.error({
        message: "Error loging user",
        error: error,
      });

      return error;
    }
  }

  @Post("/register")
  register(@Body() registerDto: RegisterDTO): any {
    try {
      this.logger.debug({
        message: "Entering register",
        data: registerDto,
      });

      // Create new
      const user = {
        _id: "fake-id",
        email: registerDto.email,
        password: registerDto.password,
      };

      this.logger.log({
        message: "New user registered",
        user: user,
      });

      // Send new user id
      return {
        user_id: user._id,
      };
    } catch (error) {
      this.logger.error({
        message: "Error registering new user",
        error: error,
      });

      return error;
    }
  }
}
