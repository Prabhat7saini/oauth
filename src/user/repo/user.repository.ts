import { Repository } from 'typeorm';
import { User } from '../entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { ERROR_MESSAGES, SUCCESS_MESSAGES } from '../../utils/constants/message';
import { UpdateUserDto } from '../dto/userDto';
import { Logger } from '@nestjs/common';

export class UserRepository extends Repository<User> {
    private  readonly logger = new Logger(UserRepository.name);
    private readonly saltRounds = 10;

    constructor(
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,
    ) {
        super(
            userRepository.target,
            userRepository.manager,
            userRepository.queryRunner,
        );
    }

    /**
     * Finds a user by email or ID.
     * @param params - Object containing optional email and/or id to search for.
     * @returns The user if found, otherwise null.
     * @throws Error if neither email nor id is provided.
     */
    async findUser({ email, id }: { email?: string; id?: string }): Promise<User | null> {
        if (!email && !id) {
            throw new Error(ERROR_MESSAGES.REQUIRED_ID_OR_EMAIL);
        }

        try {
            // Build the query
            const queryBuilder = this.userRepository.createQueryBuilder('user')
                .leftJoinAndSelect('user.role', 'role'); // Join the role table

            // Add conditions based on provided parameters
            if (email) {
                queryBuilder.andWhere('user.email = :email', { email });
            }
            if (id) {
                queryBuilder.andWhere('user.id = :id', { id });
            }

            // Execute the query and return the result
            const user = await queryBuilder.getOne();

            return user || null;
        } catch (error) {
          this.logger.error('Unexpected error while finding user:', error.stack);
            throw new Error(ERROR_MESSAGES.UNEXPECTED_ERROR);
        }
    }

    /**
     * Updates user information based on the provided ID and user data.
     * @param id - ID of the user to be updated.
     * @param userData - Data to update the user with.
     * @returns The updated user.
     * @throws Error if the user is not found or the update fails.
     */
    async updateUser(id: string, userData: UpdateUserDto): Promise<User> {
        if (!id) {
            throw new Error(ERROR_MESSAGES.REQUIRED_ID_OR_EMAIL);
        }

        const user = await this.findUser({ id });
        if (!user) {
            throw new Error(ERROR_MESSAGES.USER_NOT_FOUND);
        }

        try {
            // Update the user
            await this.userRepository.update(id, userData);

            // Retrieve and return the updated user
            const updatedUser = await this.findUser({ id });
            if (!updatedUser) {
                throw new Error(ERROR_MESSAGES.UNEXPECTED_ERROR);
            }
            this.logger.log(`User updated: ${JSON.stringify(updatedUser)}`, 'updateUser');
            return updatedUser;
        } catch (error) {
            this.logger.error('Error while updating user:', error.stack);
            throw new Error(ERROR_MESSAGES.USER_UPDATE_FAILED);
        }
    }

    /**
     * Soft deletes a user by setting the deletedAt field.
     * @param id - ID of the user to be soft deleted.
     * @returns Boolean indicating success or failure of the operation.
     * @throws Error if an unexpected error occurs during the operation.
     */
    async softDeleteUser(id: string): Promise<boolean> {
        try {
            const result = await this.userRepository.createQueryBuilder()
                .update(User)
                .set({ deletedAt: new Date() })
                .where('id = :id AND deletedAt IS NULL', { id })
                .execute();

            // Check if any rows were affected
            if (result.affected === 0) {
                // No rows affected means the user was not found or was already deleted
                this.logger.warn(`User with ID ${id} not found or already deleted.`, 'softDeleteUser');
                return false;
            }

            this.logger.log(`User with ID ${id} successfully soft deleted.`, 'softDeleteUser');
            return true;
        } catch (error) {
            this.logger.error('Error during soft delete operation:', error.stack);
            return false; // Indicate failure due to an unexpected error
        }
    }
}
