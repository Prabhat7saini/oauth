import { Repository } from 'typeorm';
import { User } from '../../user/entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcryptjs';
import { ERROR_MESSAGES, SUCCESS_MESSAGES } from '../../utils/constants/message';
import { AdminSignUpDto } from 'src/auth/dto/authDto';
import { Role } from '../../user/entities/role.entity';
import { BadRequestException, InternalServerErrorException } from '@nestjs/common';

export class AdminRepository {
    private readonly saltRounds = 10;

    constructor(
        @InjectRepository(User)
        private readonly adminRepository: Repository<User>,
        @InjectRepository(Role)
        private readonly roleRepository: Repository<Role>,
    ) { }

    async createAdmin(adminData: AdminSignUpDto): Promise<User> {
        try {
            const roleName: string = "admin";
            const roleEntity = await this.roleRepository.findOne({ where: { roleName } });

            if (!roleEntity) {
                // return 
                throw new BadRequestException('Role does not exist');
            }

            const hashedPassword = await bcrypt.hash(adminData.password, this.saltRounds);

            const user = this.adminRepository.create({
                ...adminData,
                password: hashedPassword,
                roles: roleEntity, // Single role assigned
            });

            const dbUser = await this.adminRepository.save(user);

            console.log(SUCCESS_MESSAGES.USER_CREATED_SUCCESSFULLY);
            return dbUser;

        } catch (error) {
            if (error.code === '23505') { // Unique constraint violation
                throw new BadRequestException(ERROR_MESSAGES.USER_ALREADY_EXISTS);
            } else {
                console.error('An unexpected error occurred:', error.message);
                throw new InternalServerErrorException("Inside the create Admin " + ERROR_MESSAGES.USER_CREATION_FAILED);
            }
        }
    }


    async createROles(role: string): Promise<void> {
        try {
            console.log(role,"roles")

            const existingRole = await this.roleRepository.findOne({ where: { roleName: role } });
            if (existingRole) {

                throw new Error(ERROR_MESSAGES.ROLE_ALREADY_EXISTS);
            }
            const newRole = this.roleRepository.create({roleName: role});
            console.log(newRole);
            await this.roleRepository.save(newRole);
        } catch (error) {
            console.error('An unexpected error occurred:', error.message);
            throw new InternalServerErrorException(error.message);
        }
    }
}
