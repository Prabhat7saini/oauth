import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { AdminService } from './admin.service';
import { AuthorizationGuard } from '../auth/guard/authorization.guard';
import { AuthenticationGuard } from '../auth/guard/authenticaton.guard';
import { Role } from '../utils/decorators/roles.decorator';
import { ApiResponse } from '../utils/responses/api-response.dto';

@Controller({ path: '/admin', version: '1' })
export class AdminController {
    constructor(private readonly adminService:AdminService){}
    
    @Role('admin')
    @UseGuards(AuthenticationGuard,AuthorizationGuard)
    @Post(`/createRole`)
    async createRoles(@Body() role: {role:string}): Promise<ApiResponse> {
    
        return this.adminService.createRoles(role.role);
    }
}
