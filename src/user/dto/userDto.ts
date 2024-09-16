import { IsNumberString, IsOptional, IsPositive, IsString } from "class-validator";

export class UpdateUserDto {
    @IsOptional()
    @IsString({ message: 'Name must be a string' })
    name?: string;

    @IsOptional()
    @IsString({ message: 'Last name must be a string' })
    address?: string;

    @IsOptional()
    @IsNumberString({}, { message: 'Age must be a number' })
    @IsPositive({ message: 'Age must be a non-negative number' })
    age?: string;
}