import { forwardRef, Module } from "@nestjs/common";

import { AuthService } from ".";
import { ApiModule } from "../api/api.module";

@Module({
  imports: [forwardRef(() => ApiModule)],
  providers: [AuthService],
  exports: [AuthService],
})
export class AuthModule {}
