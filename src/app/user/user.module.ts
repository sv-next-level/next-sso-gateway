import { Module } from "@nestjs/common";

import { UserService } from ".";

@Module({
  providers: [UserService],
})
export class UserModule {}
