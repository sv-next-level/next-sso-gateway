import { IsEnum, IsMongoId } from "class-validator";

import { PORTAL } from "@/common/server/portal";

export class CreateTokenDTO {
  @IsMongoId()
  readonly userId: string;

  @IsEnum(PORTAL, { message: "Invalid portal type" })
  readonly portal: PORTAL;
}
