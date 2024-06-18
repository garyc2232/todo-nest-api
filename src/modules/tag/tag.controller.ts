import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { DeleteResult } from 'typeorm';
import { TagDto } from './tag.dto';
import { TagService } from './tag.service';
import { Tag } from './tag.entity';
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Public } from '../../providers/decorators/public.decorator';

@Controller('/tag')
@ApiTags('tag')
export class TagController {
  constructor(private readonly tagService: TagService) {}

  @Get()
  @Public()
  @ApiOperation({ summary: 'Get all tags' })
  @ApiResponse({ status: 200, description: 'successful', type: Tag })
  getAll(): Promise<Tag[]> {
    return this.tagService.getAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get tag by id' })
  @ApiResponse({ status: 200, description: 'successful', type: Tag })
  getOne(@Param('id') id: number): Promise<Tag> {
    return this.tagService.getOne(id);
  }

  @Post()
  @ApiOperation({ summary: 'Create tag' })
  @ApiBody({ type: TagDto, description: 'Tag data' })
  @ApiResponse({
    status: 201,
    description: 'The record has been successfully created.',
    type: Tag,
  })
  create(@Body() payload: TagDto): Promise<Tag> {
    return this.tagService.create(plainToInstance(Tag, payload));
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete tag by id' })
  @ApiResponse({ status: 200, description: 'successful' })
  delete(@Param('id') id: number): Promise<DeleteResult> {
    return this.tagService.delete(id);
  }
}
