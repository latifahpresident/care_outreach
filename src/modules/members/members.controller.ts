import {
  BadRequestException,
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
  Get,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { MembersService } from './members.service';

@Controller('members')
export class MembersController {
  constructor(private readonly members: MembersService) {}

  @Post('import')
  @UseInterceptors(FileInterceptor('file'))
  async importCsv(@UploadedFile() file: Express.Multer.File) {
    if (!file?.buffer)
      throw new BadRequestException('CSV file required (field: "file")');
    return this.members.importCsv(file.buffer);
  }

  @Get()
  list() {
    return this.members.findAll();
  }
}
