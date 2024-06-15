import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { UserResponseDto } from './user.dto';
import { User } from './user.entity';
import { Observable, map } from 'rxjs';

@Injectable()
export class UserInterceptor implements NestInterceptor {
  // FIXME: find the replacement for any
  intercept(_context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      map((user: User | User[]) => {
        if (Array.isArray(user)) {
          return user.map((u) => this.removeSensitiveFields(u));
        } else {
          return this.removeSensitiveFields(user);
        }
      }),
    );
  }

  private removeSensitiveFields(user: User): UserResponseDto {
    const { password: _p, salt: _s, ...userWithoutSensitiveFields } = user;
    return userWithoutSensitiveFields;
  }
}
