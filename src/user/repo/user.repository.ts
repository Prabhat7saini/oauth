import { Repository } from 'typeorm';
import { User } from '../entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { ERROR_MESSAGES, SUCCESS_MESSAGES } from '../../utils/constants/message';
import { UpdateUserDto } from '../dto/userDto';


export class UserRepository extends Repository<User> {
    private readonly saltRounds = 10;

    constructor(
        @InjectRepository(User)
        private userRepository: Repository<User>,
    ) {
        super(
            userRepository.target,
            userRepository.manager,
            userRepository.queryRunner,
        );
    }

    async findUser({ email, id }: { email?: string, id?: string }): Promise<User | null> {
        if (!email && !id) {

            throw new Error(ERROR_MESSAGES.REQUIRED_ID_OR_EMAIL);
        }
        const query: { where: { email?: string; id?: string }, relations: string[] } = { where: {}, relations: ['roles'] };

        if (email) {
            query.where.email = email;
        }
        if (id) {
            query.where.id = id;
        }

        try {
            const user = await this.userRepository.findOne(query);
            console.log(user, "find user")

            return user || null;
        } catch (error) {
            if (error.code) {
                console.error('Database error:', error);
                throw new Error(ERROR_MESSAGES.DATABASE_ERROR);
            } else {
                console.error('Unexpected error:', error);
                throw new Error(ERROR_MESSAGES.UNEXPECTED_ERROR);
            }
        }
    }


    async updateUser(id: string, userData: UpdateUserDto): Promise<User> {

        if (!id) {
            throw new Error(ERROR_MESSAGES.REQUIRED_ID_OR_EMAIL);
        }
        const user = await this.findUser({ id });
        if (!user) {
            throw new Error(ERROR_MESSAGES.USER_NOT_FOUND);
        }

        try {
            await this.userRepository.update(id, userData);

            const updatedUser = await this.findUser({ id });
            if (!updatedUser) {
                throw new Error(ERROR_MESSAGES.UNEXPECTED_ERROR);
            }
            return updatedUser;
        } catch (error) {
            throw new Error(ERROR_MESSAGES.USER_UPDATE_FAILED);
        }
    }
   
    

    async softDeleteUser(id: string): Promise<Boolean> {
        try {
            const result = await this.userRepository.createQueryBuilder()
                .update(User)
                .set({ deletedAt: new Date() })
                .where('id = :id AND deletedAt IS NULL', { id })
                .execute();

            if (result.affected === 0) {
                // No rows affected means the user was not found or was already deleted
                console.warn(`User with ID ${id} not found or already deleted.`);
                return false;
            }

            return true;
        } catch (error) {
            // Log the error for debugging purposes
            console.error('Error during soft delete operation:', error);

            // Optionally, you can handle different error cases and throw custom errors or handle them as needed
            // throw new Error('Failed to delete user due to an unexpected error');

            return false; // Indicate failure due to an unexpected error
        }
    }
}
