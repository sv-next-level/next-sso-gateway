import { ConfigService } from "@nestjs/config";
import { Inject, Injectable, Logger, forwardRef } from "@nestjs/common";

import { ApiService } from "../api";
import { METHOD } from "@/common/api/method";
import { InternalServerError } from "@/utils";
import { PasswordDTO, UserDTO } from "@/dto";

@Injectable()
export class UserService {
  private logger: Logger = new Logger(UserService.name);
  private url: string;

  constructor(
    @Inject(forwardRef(() => ApiService))
    private readonly apiService: ApiService,
    private readonly configService: ConfigService
  ) {
    this.logger.debug({
      message: "Entering constructor of user service",
    });

    this.url = this.configService.get<string>("USER_SERVICE_URL");
  }

  async getUserId(userDto: UserDTO): Promise<string> {
    try {
      this.logger.debug({
        message: "Entering getUserId",
      });

      const url: string = `${this.url}/users/get`;

      const { user_id: userId } = await this.apiService.call(
        url,
        METHOD.POST,
        userDto
      );

      if (!userId) {
        this.logger.warn({
          message: "Failed to get user id",
          portal: userDto.portal,
        });
        throw InternalServerError("Failed to get user id");
      }

      return userId;
    } catch (error) {
      this.logger.error({
        message: "Error getting user id",
        portal: userDto.portal,
        error: error,
      });

      throw error;
    }
  }

  async setUser(userDto: UserDTO): Promise<string> {
    try {
      this.logger.debug({
        message: "Entering setUser",
      });

      const url: string = `${this.url}/users/set`;

      const { user_id: userId } = await this.apiService.call(
        url,
        METHOD.POST,
        userDto
      );

      if (!userId) {
        this.logger.warn({
          message: "Failed to set user id",
          portal: userDto.portal,
        });
        throw InternalServerError("Failed to set user id");
      }

      return userId;
    } catch (error) {
      this.logger.error({
        message: "Error setting user id",
        portal: userDto.portal,
        error: error,
      });

      throw error;
    }
  }

  async validatePassword(passwordDto: PasswordDTO): Promise<boolean> {
    try {
      this.logger.debug({
        message: "Entering validatePassword",
        user_id: passwordDto.userId,
      });

      const url: string = `${this.url}/passwords/validate`;

      const { result: isValid } = await this.apiService.call(
        url,
        METHOD.POST,
        passwordDto
      );

      if (typeof isValid !== Boolean.name.toLowerCase()) {
        this.logger.warn({
          message: "Failed to get validate password",
          user_id: passwordDto.userId,
        });
        throw InternalServerError("Failed to validate user password");
      }

      return isValid;
    } catch (error) {
      this.logger.error({
        message: "Error validating user password",
        user_id: passwordDto.userId,
        error: error,
      });

      throw error;
    }
  }

  async createPassword(passwordDto: PasswordDTO): Promise<string> {
    try {
      this.logger.debug({
        message: "Entering createPassword",
        user_id: passwordDto.userId,
      });

      const url: string = `${this.url}/passwords/create`;

      const { password_id: passwordId } = await this.apiService.call(
        url,
        METHOD.POST,
        passwordDto
      );

      if (!passwordId) {
        this.logger.warn({
          message: "Failed to create password",
          user_id: passwordDto.userId,
        });
        throw InternalServerError("Failed to create password");
      }

      return passwordId;
    } catch (error) {
      this.logger.error({
        message: "Error creating password",
        user_id: passwordDto.userId,
        error: error,
      });

      throw error;
    }
  }
}
