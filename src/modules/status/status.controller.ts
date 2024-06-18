import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { StatusDto } from './status.dto';
import { StatusService } from './status.service';
import { Status } from './status.entity';
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Public } from '../../providers/decorators/public.decorator';

@Controller('/status')
@ApiTags('status')
export class StatusController {
  constructor(private readonly statusService: StatusService) {}

  @Get()
  @Public()
  @ApiOperation({ summary: 'Get all status' })
  @ApiResponse({ status: 200, description: 'successful', type: Status })
  getAll(): Promise<Status[]> {
    return this.statusService.getAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get tag by Status' })
  @ApiResponse({ status: 200, description: 'successful', type: Status })
  getOne(@Param('id') id: number): Promise<Status> {
    return this.statusService.getOne(id);
  }

  @Post()
  @ApiOperation({ summary: 'Create Status' })
  @ApiBody({ type: StatusDto, description: 'Tag Status' })
  @ApiResponse({
    status: 201,
    description: 'The record has been successfully created.',
    type: Status,
  })
  create(@Body() payload: StatusDto): Promise<Status> {
    return this.statusService.create(plainToInstance(Status, payload));
  }
}
