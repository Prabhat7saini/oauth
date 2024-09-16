import { Injectable, Req } from '@nestjs/common';
import { UserRepository } from './repo/user.repository';
import { UpdateUserDto } from './dto/userDto';
import { ApiResponse } from 'src/utils/responses/api-response.dto';
import { ResponseService } from 'src/utils/responses/ResponseService';
import { Request } from 'express';
import { CustomRequest } from 'src/utils/interface/type';
import { ERROR_MESSAGES, SUCCESS_MESSAGES } from 'src/utils/constants/message';

@Injectable()
export class UserService {
    constructor(private readonly userRepository: UserRepository, private readonly responseService: ResponseService) { }

    async updateUser(id: string, userDate: UpdateUserDto): Promise<ApiResponse> {
        console.log(id, `update`)
        await this.userRepository.updateUser(id, userDate);

        return this.responseService.success('User updated successfully');
    }
    async softDeleteUser(@Req() req: CustomRequest): Promise<ApiResponse> {
        try {
            const id = req.user.id;
            const result = await this.userRepository.softDeleteUser(id);
            if (!result) {
                return this.responseService.error(ERROR_MESSAGES.USER_DELETION_FAILED, 500)
            }
            return this.responseService.success(SUCCESS_MESSAGES.USER_DELETED_SUCCESSFULLY);
        } catch (error) {
            console.error('Error during soft delete:', error);
            return this.responseService.error(ERROR_MESSAGES.USER_DELETION_FAILED, 500);
        }
    }
}
