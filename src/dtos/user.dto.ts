import {
  IsEmail,
  IsEnum,
  IsMongoId,
  IsNotEmpty,
  IsString,
  Length,
} from "class-validator";

import { PORTAL } from "@/constants";

export class UserDTO {
  @IsEmail()
  readonly email: string;

  @IsEnum(PORTAL, { message: "Invalid portal type" })
  readonly portal: PORTAL;
}

export class PasswordDTO {
  @IsMongoId()
  readonly userId: string;

  @IsString()
  @IsNotEmpty()
  @Length(6, 64, { message: "Invalid length of password" })
  readonly password: string;
}
