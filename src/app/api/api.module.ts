import { HttpModule } from "@nestjs/axios";
import { forwardRef, Module } from "@nestjs/common";

import { ApiController, ApiService } from ".";
import { AuthModule } from "../auth/auth.module";
import { RelayModule } from "../relay/relay.module";
import { UserModule } from "../user/user.module";

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
