import { Injectable, Logger } from '@nestjs/common';
import { AdminRepository } from 'src/admin/repo/admin.repository';
import { UserRepository } from 'src/user/repo/user.repository';
import { AdminSignUpDto, LoginDto } from './dto/authDto';
import { ResponseService } from '../utils/responses/ResponseService';  // Corrected import path
import { ERROR_MESSAGES, SUCCESS_MESSAGES } from '../utils/constants/message';
import { ApiResponse } from '../utils/responses/api-response.dto';  // Corrected spelling
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from "bcryptjs"

@Injectable()
export class AuthService {
    private readonly logger = new Logger(AuthService.name);  // Initialize Logger

    constructor(
        private readonly userRepository: UserRepository,
        private readonly adminRepository: AdminRepository,
        private readonly responseService: ResponseService,
        private readonly jwt: JwtService,
        private readonly config: ConfigService,
    ) { }

    async adminRegister(adminUser: AdminSignUpDto): Promise<ApiResponse> {
        try {
            const { email } = adminUser;

            // Check if the user already exists
            const existingUser = await this.userRepository.findUser({ email });

            if (existingUser) {
                return this.responseService.error(ERROR_MESSAGES.USER_ALREADY_EXISTS, 409);
            }

            // Register the new admin user
            const user = await this.adminRepository.createAdmin(adminUser);

            return this.responseService.success('Admin registered successfully', 201, user);
        } catch (error) {
            // Log the error using Logger
            this.logger.error('Error registering admin', error.message);

            // Return a generic error response
            return this.responseService.error(ERROR_MESSAGES.UNEXPECTED_ERROR, 500);
        }
    }

    async login(loginData: LoginDto): Promise<ApiResponse> {

        try {
            const { email, password } = loginData;
            const existingUser = await this.userRepository.findUser({ email });

            if (!existingUser) {
                return this.responseService.error(ERROR_MESSAGES.USER_NOT_FOUND, 404);
            }

            if(!existingUser.isActive){
                return this.responseService.error(ERROR_MESSAGES.USER_INACTIVE, 400)
            }

            const isPasswordValid = await bcrypt.compare(password, existingUser.password);
            if (!isPasswordValid) {
                return this.responseService.error(ERROR_MESSAGES.INVALID_CREDENTIALS);
            }


            delete existingUser.isActive
            delete existingUser.deletedAt;
            delete existingUser.password;
            delete existingUser.refreshToken;
            const role: string = existingUser.roles[0].roleName;

            const payload = {
                id: existingUser.id,
                role
            }

            const accessToken = await this.generateToken(payload, '60m');
            const ResoData = {
                existingUser,
                accessToken,
            }
            return this.responseService.success(SUCCESS_MESSAGES.USER_LOGIN_SUCCESSFULLY, 200, ResoData);
        } catch (error) {
            this.logger.error('Login error:', error.message);

            return this.responseService.error(ERROR_MESSAGES.UNEXPECTED_ERROR, 500)
        }
    }


    async generateToken(payload: any, expiresIn: string): Promise<string> {
        try {
            return await this.jwt.signAsync(payload, {
                secret: this.config.get<string>('JWT_SECRET'),
                expiresIn: expiresIn,
            });
        } catch (error) {

            console.error('Token generation error:', error.message);
            throw new Error('Failed to generate token');
        }
    }
}
