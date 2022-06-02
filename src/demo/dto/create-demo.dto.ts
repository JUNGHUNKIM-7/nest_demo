import { IsEmail, IsNumberString, IsString } from 'class-validator'

export class CreateDemoDto {
    @IsString()
    @IsEmail()
    email: string

    @IsNumberString()
    password: string
}
