import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";

import { AppService } from "@/app.service";
import { AppController } from "@/app.controller";
import { ApiModule } from "@/app/api/api.module";
import configuration, { validate } from "@/config";
import { AuthModule } from "@/app/auth/auth.module";
import { UserModule } from "@/app/user/user.module";
import { RelayModule } from "@/app/relay/relay.module";
import { DatabaseModule } from "@/infra/mongoose/database.module";

@Module({
  imports: [
    ConfigModule.forRoot({
      load: configuration,
      expandVariables: true,
      isGlobal: true,
      cache: true,
      validate,
    }),
    ApiModule,
    AuthModule,
    UserModule,
    RelayModule,
    DatabaseModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
