import * as moment from 'moment-timezone';

export class UserResponseDto {
  id: number;
  email: string;
  createdAt: string;
  updatedAt: string;

  constructor(user: any) {
    this.id = user.id;
    this.email = user.email;
    this.createdAt = moment(user.createdAt).tz('America/Bogota').format('YYYY-MM-DD HH:mm:ss')
    this.updatedAt = moment(user.updatedAt).tz('America/Bogota').format('YYYY-MM-DD HH:mm:ss')
  }
}
