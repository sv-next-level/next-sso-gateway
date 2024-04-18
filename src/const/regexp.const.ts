import { EMAIL_BLACKLISTED_CHARS } from "@/const/error.const";

export const numbersOnlyRegex: RegExp = RegExp(/[^\d]/);
export const emailBlacklistedCharsRegex: RegExp = RegExp(
  `[${EMAIL_BLACKLISTED_CHARS}]`
);
