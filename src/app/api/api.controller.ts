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
  ForgotDTO,
  LoginDTO,
  PasswordDTO,
  RegisterDTO,
  ResendEmailDTO,
  SendEmailDTO,
  UserDTO,
  VerifyEmailDTO,
} from "@/dtos";
import { ApiService } from ".";
import { OK, Unauthorized } from "@/utils";
import { AuthService } from "../auth/auth.service";
import { UserService } from "../user/user.service";
import { RelayService } from "../relay/relay.service";
import { EMAIL_TYPE, SERVICE_TYPE } from "@/constants";

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

      const isValid: boolean =
        await this.userService.validatePassword(passwordDto);

      if (!isValid) {
        this.logger.warn({
          message: "Invalid emaail or password",
          user_id: passwordDto.userId,
        });
        return Unauthorized("Invalid emaail or password");
      }

      this.logger.log({
        message: "user logged in successfully",
        portal: loginDto.portal,
        userId: userId,
      });

      const data = {
        userId: userId,
        portal: loginDto.portal,
        passwordValidation: isValid,
      };

      return OK(data);
    } catch (error) {
      this.logger.error({
        message: "Error loging user",
        error: error,
      });

      return error;
    }
  }

  @Post("register")
  async register(@Body() registerDto: RegisterDTO): Promise<any> {
    try {
      this.logger.debug({
        message: "Entering register",
        data: registerDto,
      });

      const userDto: UserDTO = {
        email: registerDto.email,
        portal: registerDto.portal,
      };

      const userId: string = await this.userService.setUser(userDto);

      const passwordDto: PasswordDTO = {
        userId: userId,
        password: registerDto.password,
      };

      const passwordId: string =
        await this.userService.setPassword(passwordDto);

      this.logger.log({
        message: "user registered successfully",
        user_id: userId,
        password_id: passwordId,
        portal: registerDto.portal,
      });

      const data = {
        userId: userId,
        passwordId: passwordId,
        portal: registerDto.portal,
      };

      return OK(data);
    } catch (error) {
      this.logger.error({
        message: "Error registering new user",
        error: error,
      });

      return error;
    }
  }

  @Post("forgot")
  async forgot(@Body() forgotDto: ForgotDTO): Promise<any> {
    try {
      this.logger.debug({
        message: "Entering forgot",
        data: forgotDto,
      });

      const userDto: UserDTO = {
        email: forgotDto.email,
        portal: forgotDto.portal,
      };

      const userId: string = await this.userService.getUserId(userDto);

      const otpDto: SendEmailDTO = {
        to: forgotDto.email,
        data: "123456",
        expires_after: 60,
        email_type: EMAIL_TYPE.OTP_2FA,
        requesting_service_type: SERVICE_TYPE.AUTH,
      };

      const relayId: string = await this.relayService.sendEmail(otpDto);

      this.logger.log({
        message: "OTP send successfully",
        relay_id: relayId,
        user_id: userId,
        email_type: otpDto.email_type,
        expires_after: otpDto.expires_after,
      });

      const data = {
        relayId: relayId,
        userId: userId,
        expiresAfter: otpDto.expires_after,
      };

      return OK(data);
    } catch (error) {
      this.logger.error({
        message: "Error user forgot password",
        error: error,
      });

      return error;
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
        await this.userService.setPassword(passwordDto);

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

      return error;
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

      return error;
    }
  }

  @Post("otp/send")
  async sendOTP(@Body() otpDto: SendEmailDTO): Promise<any> {
    try {
      this.logger.debug({
        message: "Entering sendOTP",
        email_type: otpDto.email_type,
        expires_after: otpDto.expires_after,
      });

      const relayId: string = await this.relayService.sendEmail(otpDto);

      this.logger.log({
        message: "OTP send successfully",
        relay_id: relayId,
        email_type: otpDto.email_type,
        expires_after: otpDto.expires_after,
      });

      const data = {
        relayId: relayId,
        emailType: otpDto.email_type,
        expiresAfter: otpDto.expires_after,
      };

      return OK(data);
    } catch (error) {
      this.logger.error({
        message: "Error sending otp",
        expires_after: otpDto.expires_after,
        email_type: otpDto.email_type,
        error: error,
      });

      return error;
    }
  }

  @Post("otp/resend")
  async resendOTP(@Body() otpDto: ResendEmailDTO): Promise<any> {
    try {
      this.logger.debug({
        message: "Entering resendOTP",
        relay_id: otpDto.relayId,
        expires_after: otpDto.expires_after,
      });

      const relayId: string = await this.relayService.resendEmail(otpDto);

      this.logger.log({
        message: "OTP resend successfully",
        new_relay_id: relayId,
        old_relay_id: otpDto.relayId,
        expires_after: otpDto.expires_after,
      });

      const data = {
        relayId: relayId,
        expiresAfter: otpDto.expires_after,
      };

      return OK(data);
    } catch (error) {
      this.logger.error({
        message: "Error resending otp",
        relay_id: otpDto.relayId,
        error: error,
      });

      return error;
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

      return error;
    }
  }
}
