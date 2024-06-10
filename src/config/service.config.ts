export const SERVICE_CONFIG = () => {
  return {
    AUTH: process.env["ACCESS_SERVICE_URL"],
    USER: process.env["USER_SERVICE_URL"],
    RELAY: process.env["RELAY_SERVICE_URL"],
  };
};
