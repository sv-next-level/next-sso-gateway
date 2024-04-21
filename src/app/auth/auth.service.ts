import { Injectable, Logger } from "@nestjs/common";

@Injectable()
export class AuthService {
  private logger: Logger = new Logger("auth.service");

  constructor() {
    this.logger.debug({
      message: "Entering constructor of auth service",
    });
  }
}
