export class BaseResponseModel<T> {
  message: string;
  data: T;
  statusCode: string;

  constructor(statusCode: string, message: string, data: T) {
    this.statusCode = statusCode;
    this.message = message;
    this.data = data;
  }
}
