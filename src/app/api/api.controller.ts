import {
  Body,
  Controller,
  Inject,
  Logger,
  Post,
  forwardRef,
} from "@nestjs/common";

import {
  CreateTokenDTO,
  LoginDTO,
  PasswordDTO,
  ResendEmailDTO,
  ResendEmailOTPDTO,
  SendEmailDTO,
  SendEmailOTPDTO,
  UserDTO,
  VerifyEmailDTO,
} from "@/dto";
import { ApiService } from ".";
import { AuthService } from "../auth/auth.service";
import { UserService } from "../user/user.service";
import { RelayService } from "../relay/relay.service";
import { EMAIL_TYPE } from "@/constant";
import { SERVICE } from "@/common/server/service";
import { InternalServerError, OK, Unauthorized } from "@/utils";

@Controller("api")
export class ApiController {
  private logger: Logger = new Logger(ApiController.name);

  constructor(
    private readonly apiService: ApiService,
    @Inject(forwardRef(() => AuthService))
    private readonly authService: AuthService,
    @Inject(forwardRef(() => RelayService))
    private readonly relayService: RelayService,
    @Inject(forwardRef(() => UserService))
    private readonly userService: UserService
  ) {
    this.logger.debug({
      message: "Entering constructor of api controller",
    });
  }

  @Post("login")
  async login(@Body() loginDto: LoginDTO): Promise<any> {
    try {
      this.logger.debug({
        message: "Entering login",
        data: loginDto,
      });

      const userDto: UserDTO = {
        email: loginDto.email,
        portal: loginDto.portal,
      };

      const userId: string = await this.userService.getUserId(userDto);

      const passwordDto: PasswordDTO = {
        userId: userId,
        password: loginDto.password,
      };

      const verification: boolean =
        await this.userService.validatePassword(passwordDto);

      if (!verification) {
        this.logger.warn({
          message: "Invalid email or password",
          user_id: passwordDto.userId,
        });
        throw Unauthorized("Invalid email or password");
      }

      this.logger.log({
        message: "user logged in successfully",
        portal: loginDto.portal,
        userId: userId,
      });

      const data = {
        userId: userId,
        portal: loginDto.portal,
        verification: verification,
      };

      return OK(data);
    } catch (error) {
      this.logger.error({
        message: "Error loging user",
        error: error,
      });

      return InternalServerError(error);
    }
  }

  @Post("register")
  async register(@Body() userDto: any): Promise<any> {
    try {
      this.logger.debug({
        message: "Entering register",
        data: userDto,
      });

      const userId: string = await this.userService.setUser(userDto);

      this.logger.log({
        message: "user registered successfully",
        user_id: userId,
        portal: userDto.portal,
      });

      const data = {
        userId: userId,
        portal: userDto.portal,
      };

      return OK(data);
    } catch (error) {
      this.logger.error({
        message: "Error registering new user",
        error: error,
      });

      return InternalServerError(error);
    }
  }

  @Post("forgot")
  async forgot(@Body() userDto: UserDTO): Promise<any> {
    try {
      this.logger.debug({
        message: "Entering forgot",
        data: userDto,
      });

      const userId: string = await this.userService.getUserId(userDto);

      this.logger.log({
        message: "user forgot successfully",
        user_id: userId,
        portal: userDto.portal,
      });

      const data = {
        userId: userId,
        portal: userDto.portal,
      };

      return OK(data);
    } catch (error) {
      this.logger.error({
        message: "Error user forgot password",
        error: error,
      });

      return InternalServerError(error);
    }
  }
  @Post("create")
  async create(@Body() passwordDto: PasswordDTO): Promise<any> {
    try {
      this.logger.debug({
        message: "Entering create",
        data: passwordDto,
      });

      const passwordId: string =
        await this.userService.createPassword(passwordDto);

      this.logger.log({
        message: "user password created successfully",
        user_id: passwordDto.userId,
        password_id: passwordId,
      });

      const data = {
        userId: passwordDto.userId,
        passwordId: passwordId,
      };

      return OK(data);
    } catch (error) {
      this.logger.error({
        message: "Error user forgot password",
        error: error,
      });

      return InternalServerError(error);
    }
  }

  @Post("token")
  async token(@Body() tokenDTO: CreateTokenDTO): Promise<any> {
    try {
      this.logger.debug({
        message: "Entering token",
        data: tokenDTO,
      });

      const token: string = await this.authService.createToken(tokenDTO);

      this.logger.log({
        message: "user token generated successfully",
        user_id: tokenDTO.userId,
        portal: tokenDTO.portal,
        token_length: token.length,
      });

      const data = {
        userId: tokenDTO.userId,
        portal: tokenDTO.portal,
        token: token,
      };

      return OK(data);
    } catch (error) {
      this.logger.error({
        message: "Error user token generation",
        error: error,
      });

      return InternalServerError(error);
    }
  }

  @Post("otp/send")
  async sendOTP(@Body() sendEmailDto: SendEmailOTPDTO): Promise<any> {
    try {
      this.logger.debug({
        message: "Entering sendOTP",
        data: sendEmailDto,
      });

      const otpDto: SendEmailDTO = {
        to: sendEmailDto.email,
        data: "123456",
        expires_after: 60,
        email_type: EMAIL_TYPE.OTP_2FA,
        requesting_service_type: SERVICE.ACCESS_GATEWAY,
      };

      const sendedEmailData = await this.relayService.sendEmail(otpDto);

      this.logger.log({
        message: "OTP send successfully",
        relay_id: sendedEmailData.relay_id,
        expires_after: sendedEmailData.expires_after,
        email_type: otpDto.email_type,
        expires_after_seconds: otpDto.expires_after,
      });

      const data = {
        email_type: otpDto.email_type,
        relay_id: sendedEmailData.relay_id,
        expires_after: sendedEmailData.expires_after,
      };

      return OK(data);
    } catch (error) {
      this.logger.error({
        message: "Error sending otp",
        error: error,
      });

      return InternalServerError(error);
    }
  }

  @Post("otp/resend")
  async resendOTP(@Body() resendEmailDto: ResendEmailOTPDTO): Promise<any> {
    try {
      this.logger.debug({
        message: "Entering resendOTP",
        relay_id: resendEmailDto.relayId,
      });

      const otpDto: ResendEmailDTO = {
        relayId: resendEmailDto.relayId,
        data: "123456",
        expires_after: 60,
      };

      const resendedEmailData = await this.relayService.resendEmail(otpDto);

      this.logger.log({
        message: "OTP resend successfully",
        old_relay_id: otpDto.relayId,
        new_relay_id: resendedEmailData.relay_id,
        expires_after: resendedEmailData.expires_after,
        expires_after_seconds: otpDto.expires_after,
      });

      const data = {
        relay_id: resendedEmailData.relay_id,
        expires_after: resendedEmailData.expires_after,
      };

      return OK(data);
    } catch (error) {
      this.logger.error({
        message: "Error resending otp",
        relay_id: resendEmailDto.relayId,
        error: error,
      });

      return InternalServerError(error);
    }
  }

  @Post("otp/verify")
  async verifyOTP(@Body() otpDto: VerifyEmailDTO): Promise<any> {
    try {
      this.logger.debug({
        message: "Entering verifyOTP",
        relay_id: otpDto.relayId,
      });

      const verification: boolean = await this.relayService.verifyEmail(otpDto);

      this.logger.log({
        message: "OTP verify successfully",
        relay_id: otpDto.relayId,
        verification: verification,
      });

      const data = {
        relayId: otpDto.relayId,
        verification: verification,
      };

      return OK(data);
    } catch (error) {
      this.logger.error({
        message: "Error verifying otp",
        relay_id: otpDto.relayId,
        error: error,
      });

      return InternalServerError(error);
    }
  }
}
