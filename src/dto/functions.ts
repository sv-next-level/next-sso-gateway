import { EMAIL as EMAIL_BLACKLISTED_CHARS } from "@/common/util/blacklist";
import { emailBlacklistedChars } from "@/common/util/regex";
import { ValidationArguments } from "class-validator";

export const getEmailErrorMessage = (
  validationArguments: ValidationArguments
): string => {
  const email: string = validationArguments.value;
  const blacklisted_chars_array: string[] = EMAIL_BLACKLISTED_CHARS.split("");

  const is_blacklisted_chars_exists = emailBlacklistedChars.test(email);
  if (is_blacklisted_chars_exists) {
    return `Email with ${blacklisted_chars_array} char are not allowed`;
  } else {
    return "Invalid email address";
  }
};
