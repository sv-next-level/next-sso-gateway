import { Module, forwardRef } from "@nestjs/common";

import { RelayService } from ".";
import { ApiModule } from "../api/api.module";

@Module({
  imports: [forwardRef(() => ApiModule)],
  providers: [RelayService],
  exports: [RelayService],
})
export class RelayModule {}
