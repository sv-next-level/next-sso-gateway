import { Module, forwardRef } from "@nestjs/common";

import { UserService } from ".";
import { ApiModule } from "../api/api.module";

@Module({
  imports: [forwardRef(() => ApiModule)],
  providers: [UserService],
  exports: [UserService],
})
export class UserModule {}
