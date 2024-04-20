export * from "@/config/env.validation";
import { ENV_CONFIG } from "@/config/env.config";
import { SERVICE_CONFIG } from "@/config/service.config";
import { AUTH_GATEWAY_DB_CONFIG } from "@/config/database.config";

export default [ENV_CONFIG, SERVICE_CONFIG, AUTH_GATEWAY_DB_CONFIG];
