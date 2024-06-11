import { EMAIL as EMAIL_BLACKLISTED_CHARS } from "@/common/util/blacklist";
import { PORTAL } from "@/common/server/portal";

import {
  IsEmail,
  IsEnum,
  IsString,
  Length,
  ValidationArguments,
} from "class-validator";
import { getEmailErrorMessage } from "@/dto/functions";

export class RegisterDTO {
  @IsEmail(
    {
      blacklisted_chars: EMAIL_BLACKLISTED_CHARS,
    },
    {
      message(validationArguments: ValidationArguments) {
        const error: string = getEmailErrorMessage(validationArguments);
        return error;
      },
    }
  )
  readonly email: string;

  @IsEnum(PORTAL, { message: "Invalid portal type" })
  readonly portal: PORTAL;

  @IsString({ message: "Password should be string only" })
  @Length(6, 64, { message: "Invalid length of password" })
  readonly password: string;
}
