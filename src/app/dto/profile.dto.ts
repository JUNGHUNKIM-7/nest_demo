import { IsOptional, IsString } from 'class-validator'

export class Profile {
    @IsOptional()
    @IsString()
    firstName?: string

    @IsOptional()
    @IsString()
    lastName?: string
}
