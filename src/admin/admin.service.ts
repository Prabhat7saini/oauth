import { Injectable } from '@nestjs/common';
import { AdminRepository } from './repo/admin.repository';
import { ApiResponse } from 'src/utils/responses/api-response.dto';
import { ResponseService } from 'src/utils/responses/ResponseService';
import { ERROR_MESSAGES, SUCCESS_MESSAGES } from 'src/utils/constants/message';

@Injectable()
export class AdminService {

    constructor(private readonly adminRepository: AdminRepository, private readonly responseService: ResponseService) { }

    async createRoles(role: string): Promise<ApiResponse> {
        if (!role) {
            return this.responseService.error(ERROR_MESSAGES.ROLE_REQUIRED);
        }

        await this.adminRepository.createROles(role);



        return this.responseService.success(SUCCESS_MESSAGES.ROLE_CREATED_SUCCESSFULLY,201)
    }



}
