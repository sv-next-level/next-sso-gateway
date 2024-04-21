import { Module } from "@nestjs/common";

import { RelayService } from ".";

@Module({
  providers: [RelayService],
})
export class RelayModule {}
