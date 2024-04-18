import { EMAIL_BLACKLISTED_CHARS } from "@/const/error.const";
import { emailBlacklistedCharsRegex } from "@/const/regexp.const";
import { ValidationArguments } from "class-validator";

export const getEmailErrorMessage = (
  validationArguments: ValidationArguments
): string => {
  const email: string = validationArguments.value;
  const blacklisted_chars_array: string[] = EMAIL_BLACKLISTED_CHARS.split("");

  const is_blacklisted_chars_exists = emailBlacklistedCharsRegex.test(email);
  if (is_blacklisted_chars_exists) {
    return `Email with ${blacklisted_chars_array} char are not allowed`;
  } else {
    return "Invalid email address";
  }
};
