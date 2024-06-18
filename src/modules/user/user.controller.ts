import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
} from '@nestjs/common';
import { UserService } from './user.service';
import { User } from './user.entity';
import { UserDto } from './user.dto';
import { ListService } from '../list/list.service';
import { List } from '../list/list.entity';
import { DeleteResult } from 'typeorm';
import { ApiTags } from '@nestjs/swagger';
import { Public } from '../../providers/decorators/public.decorator';

@ApiTags('user')
@Controller('/user')
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly listService: ListService,
  ) {}

  @Get()
  getAll(): Promise<User[]> {
    return this.userService.getAll();
  }

  @Get(':id')
  getOne(@Param('id') id: number): Promise<User> {
    return this.userService.getOneByIdOrName({ id: id });
  }

  @Post()
  @Public()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() payload: UserDto): Promise<void> {
    await this.userService.create(payload);
  }

  @Get(':id/list')
  getListByUserId(@Param('id') id: number): Promise<List[]> {
    return this.listService.findByOwnerId(id);
  }

  @Delete(':id')
  delete(@Param('id') id: number): Promise<DeleteResult> {
    return this.userService.delete(id);
  }
}
