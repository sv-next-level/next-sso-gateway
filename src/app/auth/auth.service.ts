import {
  Inject,
  Injectable,
  InternalServerErrorException,
  Logger,
  forwardRef,
} from "@nestjs/common";
import { ConfigService } from "@nestjs/config";

import { ApiService } from "../api";
import { METHOD } from "@/constants";
import { CreateTokenDTO } from "@/dtos";

@Injectable()
export class AuthService {
  private logger: Logger = new Logger(AuthService.name);
  private url: string;

  constructor(
    @Inject(forwardRef(() => ApiService))
    private readonly apiService: ApiService,
    private readonly configService: ConfigService
  ) {
    this.logger.debug({
      message: "Entering constructor of auth service",
    });

    this.url = this.configService.get<string>("AUTH_SERVICE_URL");
  }

  async createToken(tokenDto: CreateTokenDTO) {
    try {
      this.logger.debug({
        message: "Entering createToken",
      });

      const url: string = `${this.url}/tokens/create`;

      const { token } = await this.apiService.call(url, METHOD.POST, tokenDto);

      if (!token) {
        this.logger.warn({
          message: "Failed create new token",
          user_id: tokenDto.userId,
          portal: tokenDto.portal,
        });
        throw new InternalServerErrorException(
          "Failed create new token"
        ).getResponse();
      }

      return token;
    } catch (error) {
      this.logger.error({
        message: "Error creating token",
        user_id: tokenDto.userId,
        portal: tokenDto.portal,
        error: error,
      });

      throw error;
    }
  }
}
