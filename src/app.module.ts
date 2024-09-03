import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";

import defaultConfiguration from "@/config";
import nestConfiguration, { validate } from "@/nestjs/config";

import { ApiModule } from "@/app/api/api.module";
import { AuthModule } from "@/app/auth/auth.module";
import { RelayModule } from "@/app/relay/relay.module";
import { UserModule } from "@/app/user/user.module";

import { AppController } from "@/app.controller";
import { AppService } from "@/app.service";

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [...defaultConfiguration, ...nestConfiguration],
      expandVariables: true,
      isGlobal: true,
      cache: true,
      validate,
    }),
    ApiModule,
    AuthModule,
    UserModule,
    RelayModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
