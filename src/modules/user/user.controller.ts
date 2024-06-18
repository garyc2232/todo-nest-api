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
import { ApiParam, ApiTags } from '@nestjs/swagger';
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

  @Get(':userId')
  @ApiParam({ name: 'userId' })
  getOne(@Param('userId') id: number): Promise<User> {
    return this.userService.getOneByIdOrName({ id: id });
  }

  @Post()
  @Public()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() payload: UserDto): Promise<void> {
    await this.userService.create(payload);
  }

  @Get(':userId/list')
  @ApiParam({ name: 'userId' })
  getListByUserId(@Param('userId') id: number): Promise<List[]> {
    return this.listService.findByOwnerId(id);
  }

  @Delete(':userId')
  @ApiParam({ name: 'userId' })
  delete(@Param('userId') id: number): Promise<DeleteResult> {
    return this.userService.delete(id);
  }
}
