import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AdminSignUpDto, LoginDto } from './dto/authDto';
import { ApiResponse } from 'src/utils/responses/api-response.dto';
import { AuthenticationGuard } from './guard/authenticaton.guard';

@Controller({path:'auth',version:'1'})
export class AuthController {
    constructor (private readonly authService:AuthService ){}
// @UseGuards(AuthenticationGuard)
    @Post(`/signup`)
    async adminRegister(@Body() adminUser: AdminSignUpDto): Promise<ApiResponse> {
        return this.authService.adminRegister(adminUser);
    }

    @Post('/login')
    async login(@Body() loginData: LoginDto): Promise<ApiResponse> {
        return this.authService.login(loginData);
    }
}
