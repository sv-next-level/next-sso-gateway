import { registerAs } from "@nestjs/config";

import { DATABASE_CONNECTION_NAME, ENVIRONMENT } from "@/constants";

export const ACCESS_GATEWAY_DB_CONFIG = registerAs(
  DATABASE_CONNECTION_NAME.ACCESS_GATEWAY_DB,
  () => {
    return {
      MONGODB_URI: process.env["ACCESS_GATEWAY_MONGODB_URI"],
      DATABASE_NAME: process.env["ACCESS_GATEWAY_DATABASE_NAME"],
      MONGODB_CONFIG: process.env["ACCESS_GATEWAY_MONGODB_CONFIG"],
      MONGODB_LOCAL_URI: "mongodb://localhost:27017",

      isLocal() {
        return process.env["NODE_ENV"] === ENVIRONMENT.LOCAL;
      },

      getDbUri() {
        return this.isLocal() ? this.MONGODB_LOCAL_URI : this.MONGODB_URI;
      },

      get dbUri() {
        return `${this.getDbUri()}/${this.DATABASE_NAME}?${this.MONGODB_CONFIG}`;
      },
    };
  }
);
