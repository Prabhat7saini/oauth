import { Injectable } from '@nestjs/common';
import { UserRepository } from './repo/user.repository';
import { UpdateUserDto } from './dto/userDto';
import { ApiResponse } from 'src/utils/responses/api-response.dto';
import { ResponseService } from 'src/utils/responses/ResponseService';
import { Request } from 'express';

@Injectable()
export class UserService {
    constructor(private readonly userRepository: UserRepository, private readonly responseService: ResponseService) { }

    async updateUser(id: string, userDate: UpdateUserDto): Promise<ApiResponse> {
        console.log(id, `update`)
        await this.userRepository.updateUser(id, userDate);

        return this.responseService.success('User updated successfully');
    }
}
