import { HttpModule } from "@nestjs/axios";
import { Module, forwardRef } from "@nestjs/common";

import { ApiController, ApiService } from ".";
import { AuthModule } from "../auth/auth.module";
import { UserModule } from "../user/user.module";
import { RelayModule } from "../relay/relay.module";

@Module({
  imports: [
    HttpModule,
    forwardRef(() => AuthModule),
    forwardRef(() => RelayModule),
    forwardRef(() => UserModule),
  ],
  controllers: [ApiController],
  providers: [ApiService],
  exports: [ApiService],
})
export class ApiModule {}
