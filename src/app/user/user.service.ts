import {
  Inject,
  Injectable,
  InternalServerErrorException,
  Logger,
  forwardRef,
} from "@nestjs/common";
import { ConfigService } from "@nestjs/config";

import { PasswordDTO, UserDTO } from "@/dtos";
import { ApiService } from "../api";
import { METHOD } from "@/constants";
import { InternalServerError } from "@/utils";

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

      const userId: string = await this.apiService.call(
        url,
        METHOD.POST,
        userDto
      );

      if (!userId) {
        this.logger.warn({
          message: "Failed to get user id",
          portal: userDto.portal,
        });
        throw new InternalServerErrorException(
          "Failed to get user id"
        ).getResponse();
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

      const userId: string = await this.apiService.call(
        url,
        METHOD.POST,
        userDto
      );

      if (!userId) {
        this.logger.warn({
          message: "Failed to set user id",
          portal: userDto.portal,
        });
        throw new InternalServerErrorException(
          "Failed to set user id"
        ).getResponse();
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

      const isValid: boolean = await this.apiService.call(
        url,
        METHOD.POST,
        passwordDto
      );

      if (typeof isValid !== Boolean.name.toLowerCase()) {
        this.logger.warn({
          message: "Failed to get velidate password",
          user_id: passwordDto.userId,
        });
        throw InternalServerError("Failed to velidate user password");
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

  async setPassword(passwordDto: PasswordDTO): Promise<string> {
    try {
      this.logger.debug({
        message: "Entering setPassword",
        user_id: passwordDto.userId,
      });

      const url: string = `${this.url}/passwords/set`;

      const passwordId: string = await this.apiService.call(
        url,
        METHOD.POST,
        passwordDto
      );

      if (!passwordId) {
        this.logger.warn({
          message: "Failed to set password",
          user_id: passwordDto.userId,
        });
        throw new InternalServerErrorException(
          "Failed to set password"
        ).getResponse();
      }

      return passwordId;
    } catch (error) {
      this.logger.error({
        message: "Error setting password",
        user_id: passwordDto.userId,
        error: error,
      });
      throw error;
    }
  }
}
