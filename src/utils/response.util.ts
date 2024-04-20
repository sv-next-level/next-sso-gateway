interface IApiResponse {
  data?: any;
  error?: any;
  statusCode: number;
}

export const OK = (data: unknown): IApiResponse => {
  return {
    statusCode: 200,
    data: data,
  };
};

export const Created = (data: unknown): IApiResponse => {
  return {
    statusCode: 201,
    data: data,
  };
};

export const MovedPermanently = (data: unknown): IApiResponse => {
  return {
    statusCode: 301,
    data: data,
  };
};

export const PermanentRedirect = (data: unknown): IApiResponse => {
  return {
    statusCode: 308,
    data: data,
  };
};

export const BadRequest = (error: unknown): IApiResponse => {
  return {
    statusCode: 400,
    error: error,
  };
};

export const Unauthorized = (error: unknown): IApiResponse => {
  return {
    statusCode: 401,
    error: error,
  };
};

export const InternalServerError = (error: unknown): IApiResponse => {
  return {
    statusCode: 500,
    error: error,
  };
};
