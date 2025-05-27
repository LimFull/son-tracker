import { Controller, Post, Body } from '@nestjs/common';
import { NotificationService } from './notification.service';

@Controller('notification')
export class NotificationController {
  constructor(private readonly notificationService: NotificationService) {}

  @Post('token')
  async registerToken(@Body() body: { token: string }) {
    return this.notificationService.registerToken(body.token);
  }
} 