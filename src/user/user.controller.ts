import { Body, Controller, Delete, Patch, Req, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { ApiResponse } from '../utils/responses/api-response.dto';
import { AuthenticationGuard } from '../auth/guard/authenticaton.guard';
import { CustomRequest } from '../utils/interface/type';
import { UpdateUserDto } from './dto/userDto';

@Controller({ path: 'user', version: '1' })
export class UserController {
    constructor(private readonly userService: UserService) { }

    /**
     * Updates the user information.
     * The request object which includes the authenticated user's information.
     * @returns An ApiResponse indicating the result of the update operation.
     */
    @UseGuards(AuthenticationGuard)
    @Patch('/updateUser')
    async updateUser(@Req() req: CustomRequest, @Body() data: UpdateUserDto): Promise<ApiResponse> {
        const userId = req.user.id;
        return this.userService.updateUser(userId, data);
    }

    /**
     * Soft deletes the user account.
     * @returns An ApiResponse indicating the result of the delete operation.
     */
    @UseGuards(AuthenticationGuard)
    @Delete('/delete')
    async deleteUser(@Req() req: CustomRequest): Promise<ApiResponse> {
        return this.userService.softDeleteUser(req);
    }
}
