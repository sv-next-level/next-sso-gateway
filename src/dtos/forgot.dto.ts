import { EMAIL_BLACKLISTED_CHARS, PORTAL } from "@/constants";
import { IsEmail, IsEnum, ValidationArguments } from "class-validator";
import { getEmailErrorMessage } from "@/dtos/functions";

export class ForgotDTO {
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
}
