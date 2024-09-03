import {
  IsEmail,
  IsEnum,
  IsMongoId,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  ValidationArguments,
} from "class-validator";

import { getEmailErrorMessage } from "@/dto/functions";

import { PORTAL } from "@/common/server/portal";
import { SERVICE } from "@/common/server/service";
import { EMAIL as EMAIL_BLACKLISTED_CHARS } from "@/common/util/blacklist";

import { EMAIL_TYPE } from "@/constant";

export class SendEmailOTPDTO {
  @IsEmail(
    {
      blacklisted_chars: EMAIL_BLACKLISTED_CHARS,
    },
    {
      message(validationArguments: ValidationArguments) {
        const error: string = getEmailErrorMessage(validationArguments);
        return error;
      },
    },
  )
  readonly email: string;

  @IsEnum(PORTAL, { message: "Invalid portal type" })
  readonly portal: PORTAL;
}

export class ResendEmailOTPDTO {
  @IsMongoId()
  readonly relayId: string;
}

export class SendEmailDTO {
  @IsString()
  @IsNotEmpty()
  readonly to: string;

  @IsNotEmpty()
  @IsString()
  readonly data: string;

  @IsNotEmpty()
  @IsNumber()
  readonly expires_after: number;

  @IsNotEmpty()
  @IsString()
  @IsEnum(EMAIL_TYPE, { message: "Invalid email type!" })
  readonly email_type: EMAIL_TYPE;

  @IsNotEmpty()
  @IsString()
  @IsEnum(SERVICE, { message: "Invalid service request!" })
  readonly requesting_service_type: SERVICE;
}

export class VerifyEmailDTO {
  @IsNotEmpty()
  @IsMongoId()
  readonly relayId: string;

  @IsOptional()
  @IsString()
  readonly data?: string;
}

export class ResendEmailDTO {
  @IsMongoId()
  readonly relayId: string;

  @IsNotEmpty()
  @IsString()
  readonly data: string;

  @IsNotEmpty()
  @IsNumber()
  readonly expires_after: number;
}
