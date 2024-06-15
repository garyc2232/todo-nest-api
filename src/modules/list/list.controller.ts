import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { DeleteResult } from 'typeorm';
import { ListService } from './list.service';
import { ListDto } from './list.dto';

@Controller('/list')
export class ListController {
  constructor(private readonly listService: ListService) {}

  @Get()
  getAll(): Promise<ListDto[]> {
    return this.listService.getAll();
  }

  @Get(':id')
  getOne(@Param('id') id: number): Promise<ListDto> {
    return this.listService.getOne(id);
  }

  @Post()
  create(@Body() payload: ListDto): Promise<ListDto> {
    return this.listService.create(plainToInstance(ListDto, payload));
  }

  @Delete(':id')
  delete(@Param('id') id: number): Promise<DeleteResult> {
    return this.listService.delete(id);
  }
}
