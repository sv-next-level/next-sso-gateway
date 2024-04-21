import { Module } from "@nestjs/common";

import { AuthService } from ".";

@Module({
  providers: [AuthService],
})
export class AuthModule {}
