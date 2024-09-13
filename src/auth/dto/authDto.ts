import { IsEmail, IsNotEmpty, IsNumberString, IsString } from "class-validator";
import { IsPasswordComplex } from "../../utils/decorators/is-password-complex.decorator";

export class AdminSignUpDto {

    @IsEmail({}, { message: 'Email must be a valid email' })
    @IsNotEmpty({ message: 'Email is required' })
    email: string;

    @IsString({ message: 'name  must be a string' })
    @IsNotEmpty({ message: 'name is required' })
    name: string;

    @IsNotEmpty({ message: 'Age is required' })
    @IsNumberString({}, { message: 'Age must be a number' })
    age: string



    @IsString({ message: 'name  must be a string' })
    address: string

    @IsString({ message: 'Password must be a string' })
    @IsNotEmpty({ message: 'Password is required' })
    @IsPasswordComplex({ message: 'Password must contain at least one uppercase letter, one lowercase letter, one number, one special character, and be at least 8 characters long' })
    password: string;
}



export class LoginDto{
    @IsEmail({}, { message: 'Email must be a valid email' })
    @IsNotEmpty({ message: 'Email is required' })
    email: string;

    @IsString({ message: 'Password must be a string' })
    @IsNotEmpty({ message: 'Password is required' })
    @IsPasswordComplex({ message: 'Password must contain at least one uppercase letter, one lowercase letter, one number, one special character, and be at least 8 characters long' })
    password: string;
}