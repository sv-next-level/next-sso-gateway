import { HttpService } from "@nestjs/axios";
import { catchError, lastValueFrom, map } from "rxjs";
import { ForbiddenException, Injectable, Logger } from "@nestjs/common";

@Injectable()
export class ApiService {
  private logger: Logger = new Logger(ApiService.name);

  constructor(private readonly httpService: HttpService) {
    this.logger.debug({
      message: "Entering constructor of api service",
    });
  }
  async getCatFacts() {
    const request = this.httpService
      .get("https://catfact.ninja/fact")
      .pipe(map((res) => res.data?.fact))
      .pipe(
        catchError(() => {
          throw new ForbiddenException("API not available");
        })
      );

    const res = await lastValueFrom(request);

    return {
      ...res,
    };
  }

  async call(url: string, method: string, data?: any, headers?: any) {
    const request = this.httpService
      .request({
        url: url,
        method: method,
        data: data,
        headers: headers,
      })
      .pipe(map((res) => res.data))
      .pipe(
        catchError(() => {
          throw new ForbiddenException("API not available").getResponse();
        })
      );

    const res = await lastValueFrom(request);

    return res;
  }
}
