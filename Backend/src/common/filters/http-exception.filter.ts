import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Response } from 'express';

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(HttpExceptionFilter.name);

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const isHttp = exception instanceof HttpException;
    const status = isHttp ? exception.getStatus() : HttpStatus.INTERNAL_SERVER_ERROR;
    const payload = isHttp ? exception.getResponse() : null;
    const message =
      typeof payload === 'string'
        ? payload
        : (payload as { message?: string | string[] })?.message ?? 'Internal server error';

    if (!isHttp) {
      this.logger.error(exception instanceof Error ? exception.stack || exception.message : exception);
    }

    response.status(status).json({
      success: false,
      message: Array.isArray(message) ? message[0] : message,
      errorCode:
        (payload as { error?: string })?.error ??
        (status === 401 ? 'UNAUTHORIZED' : status === 404 ? 'NOT_FOUND' : 'REQUEST_FAILED'),
    });
  }
}
