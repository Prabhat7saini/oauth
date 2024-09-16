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
    constructor(
        private readonly userRepository: UserRepository,
        private readonly responseService: ResponseService
    ) { }

    /**
     * Updates a user's details.
     * id- The ID of the user to be updated.
     * userData - The new data to update the user with.
     * @returns An ApiResponse indicating the success or failure of the operation.
     */
    async updateUser(id: string, userData: UpdateUserDto): Promise<ApiResponse> {
        try {
            // Attempt to update the user with the provided data
            await this.userRepository.updateUser(id, userData);
            return this.responseService.success(SUCCESS_MESSAGES.USER_UPDATED_SUCCESSFULLY);
        } catch (error) {
            // Log error for debugging
            console.error('Error during user update:', error);
            return this.responseService.error(ERROR_MESSAGES.USER_UPDATE_FAILED, 500);
        }
    }

    /**
     * Soft deletes a user based on the ID obtained from the request object.
     * @returns An ApiResponse indicating the success or failure of the operation.
     */
    async softDeleteUser(@Req() req: CustomRequest): Promise<ApiResponse> {
        try {
            // Extract the user ID from the request object
            const id = req.user.id;

            // Attempt to soft delete the user
            const result = await this.userRepository.softDeleteUser(id);

            // Check if the soft delete operation was successful
            if (!result) {
                return this.responseService.error(ERROR_MESSAGES.USER_DELETION_FAILED, 500);
            }

            return this.responseService.success(SUCCESS_MESSAGES.USER_DELETED_SUCCESSFULLY);
        } catch (error) {
            console.error('Error during soft delete:', error);
            return this.responseService.error(ERROR_MESSAGES.USER_DELETION_FAILED, 500);
        }
    }
}
