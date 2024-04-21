import { HttpService } from "@nestjs/axios";
import { catchError, lastValueFrom, map } from "rxjs";
import { ForbiddenException, Injectable, Logger } from "@nestjs/common";

@Injectable()
export class ApiService {
  private logger: Logger = new Logger("api.service");

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

    const fact = await lastValueFrom(request);

    return {
      data: {
        fact,
      },
    };
  }
}
