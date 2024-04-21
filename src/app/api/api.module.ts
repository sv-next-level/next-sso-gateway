import { Module } from "@nestjs/common";
import { HttpModule } from "@nestjs/axios";

import { ApiController, ApiService } from ".";

@Module({
  imports: [HttpModule],
  providers: [ApiService],
  controllers: [ApiController],
})
export class ApiModule {}
