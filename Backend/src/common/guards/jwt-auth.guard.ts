import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthGuard } from '@nestjs/passport';
import { lastValueFrom, type Observable } from 'rxjs';
import { IS_PUBLIC_KEY } from '../decorators/public.decorator';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') implements CanActivate {
  constructor(private reflector: Reflector) {
    super();
  }

  async canActivate(context: ExecutionContext) {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    try {
      const result = super.canActivate(context);
      const allowed =
        typeof result === 'boolean'
          ? result
          : result instanceof Promise
            ? await result
            : await lastValueFrom(result as Observable<boolean>);
      if (allowed) return true;
    } catch (e) {
      if (isPublic) return true;
      throw e;
    }
    if (isPublic) return true;
    return false;
  }
}
