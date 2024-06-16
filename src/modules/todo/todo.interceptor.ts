import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable, map } from 'rxjs';
import { Todo } from './todo.entity';
import { TodoResponseDto } from './todo.dto';

@Injectable()
export class TodoInterceptor implements NestInterceptor {
  intercept(
    _context: ExecutionContext,
    next: CallHandler,
  ): Observable<TodoResponseDto | TodoResponseDto[]> {
    return next.handle().pipe(
      map((todo: Todo | Todo[]) => {
        if (Array.isArray(todo)) {
          return todo.map((u) => this.trim(u));
        } else {
          return this.trim(todo);
        }
      }),
    );
  }

  private trim(todo: Todo): TodoResponseDto {
    const { tags, status, ...rest } = todo;

    return {
      ...rest,
      tags: tags.map((t) => t.name),
      status: status.name,
    };
  }
}
