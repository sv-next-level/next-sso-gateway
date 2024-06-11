import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";

import { AppService } from "@/app.service";
import defaultConfiguration from "@/config";
import { AppController } from "@/app.controller";
import { ApiModule } from "@/app/api/api.module";
import { AuthModule } from "@/app/auth/auth.module";
import { UserModule } from "@/app/user/user.module";
import { RelayModule } from "@/app/relay/relay.module";
import nestConfiguration, { validate } from "@/nestjs/config";
import { MongooseDatabaseModule } from "@/nestjs/db/mongo/database.module";
import { MongooseModelsModule } from "@/nestjs/db/mongo/mongoose-models.module";

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
    MongooseModelsModule,
    MongooseDatabaseModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
