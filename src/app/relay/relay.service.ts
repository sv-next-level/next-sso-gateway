import { ConfigService } from "@nestjs/config";
import { Inject, Injectable, Logger, forwardRef } from "@nestjs/common";

import { ApiService } from "../api";
import { METHOD } from "@/constants";
import { InternalServerError } from "@/utils";
import { ResendEmailDTO, SendEmailDTO, VerifyEmailDTO } from "@/dtos";

@Injectable()
export class RelayService {
  private logger: Logger = new Logger(RelayService.name);
  private url: string;

  constructor(
    @Inject(forwardRef(() => ApiService))
    private readonly apiService: ApiService,
    private readonly configService: ConfigService
  ) {
    this.logger.debug({
      message: "Entering constructor of relay service",
    });

    this.url = this.configService.get<string>("RELAY_SERVICE_URL");
  }

  async sendEmail(emailDto: SendEmailDTO): Promise<any> {
    try {
      this.logger.debug({
        message: "Entering sendEmail",
      });

      const url: string = `${this.url}/email/send`;

      const { relay_id: relayId, expires_after: expiresAfter } =
        await this.apiService.call(url, METHOD.POST, emailDto);

      if (!relayId) {
        this.logger.warn({
          message: "Failed to send email",
          email_type: emailDto.email_type,
          expires_after: emailDto.expires_after,
        });
        throw InternalServerError("Failed to send email");
      }

      return { relay_id: relayId, expires_after: expiresAfter };
    } catch (error) {
      this.logger.error({
        message: "Error sending email",
        email_type: emailDto.email_type,
        expires_after: emailDto.expires_after,
        error: error,
      });

      throw error;
    }
  }
  async resendEmail(emailDto: ResendEmailDTO): Promise<any> {
    try {
      this.logger.debug({
        message: "Entering resendEmail",
      });

      const url: string = `${this.url}/email/resend`;

      const { relay_id: relayId, expires_after: expiresAfter } =
        await this.apiService.call(url, METHOD.POST, emailDto);

      if (!relayId) {
        this.logger.warn({
          message: "Failed to resend email",
          relay_id: emailDto.relayId,
          expires_after: emailDto.expires_after,
        });
        throw InternalServerError("Failed to resend email");
      }

      return { relay_id: relayId, expires_after: expiresAfter };
    } catch (error) {
      this.logger.error({
        message: "Error resending email",
        relay_id: emailDto.relayId,
        expires_after: emailDto.expires_after,
        error: error,
      });

      throw error;
    }
  }
  async verifyEmail(emailDto: VerifyEmailDTO): Promise<boolean> {
    try {
      this.logger.debug({
        message: "Entering verifyEmail",
      });

      const url: string = `${this.url}/email/verify`;

      const { result: verification } = await this.apiService.call(
        url,
        METHOD.POST,
        emailDto
      );

      if (typeof verification !== Boolean.name.toLowerCase()) {
        this.logger.warn({
          message: "Failed to verify email",
          relay_id: emailDto.relayId,
        });
        throw InternalServerError("Failed to verify email");
      }

      return verification;
    } catch (error) {
      this.logger.error({
        message: "Error verifying email",
        relay_id: emailDto.relayId,
        error: error,
      });

      throw error;
    }
  }
}
