import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  HttpException,
} from '@nestjs/common';
import { Observable, map } from 'rxjs';
import { BaseResponseModel } from '../models/response-model';
import { ResponseStatus } from '../enums/response-status.enum';

@Injectable()
export class TransformInterceptor<T>
  implements NestInterceptor<T, BaseResponseModel<T>>
{
  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<BaseResponseModel<T>> {
    let response: any;

    const ctx = context.switchToHttp();
    const request = ctx.getRequest();
    const httpResponse = ctx.getResponse();

    return next.handle().pipe(
      map((incomingResponse: any) => {
        if (request.method == 'POST') {
          return incomingResponse;
        }

        if (incomingResponse instanceof BaseResponseModel) {
          response = incomingResponse;
        } else if (incomingResponse instanceof Error) {
          response = {
            statusCode: ResponseStatus.FAILED,
            message: 'An Error occurred',
            data: null,
          };
        } else if (incomingResponse instanceof HttpException) {
          response = {
            statusCode: ResponseStatus.FAILED,
            message: 'An Error occurred',
            data: null,
          };
        } else if (
          (incomingResponse &&
            incomingResponse.stack &&
            incomingResponse.message) ||
          (incomingResponse?.statusCode &&
            incomingResponse?.statusCode !== '00')
        ) {
          response = {
            statusCode: '99',
            message: 'An Error occurred',
            data: incomingResponse.data || incomingResponse.message,
          };
        } else if (!incomingResponse) {
          response = {
            statusCode: '99',
            message: 'An Error occurred',
            data: null,
          };
        } else {
          response = {
            statusCode: '00',
            message: 'Operation successful',
            data: incomingResponse,
          };
        }

        if (
          incomingResponse instanceof BaseResponseModel &&
          !(response.statusCode === '00' || response.statusCode === '03')
        ) {
          httpResponse.status(400);
          response.message = incomingResponse?.message;
        }

        return response;
      }),
    );
  }
}
