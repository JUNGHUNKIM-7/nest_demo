import {
    IsNotEmpty,
    IsEmail,
    IsString,
    ValidateNested,
    IsOptional,
} from 'class-validator'
import { Profile } from './profile.dto'
import { Type } from 'class-transformer'
import { Post } from './post.dto'

export class User {
    @IsNotEmpty()
    @IsEmail()
    email: string

    @IsNotEmpty()
    @IsString()
    password?: string

    @IsOptional()
    @ValidateNested()
    @Type(() => Profile)
    profile?: Profile

    @IsOptional()
    @ValidateNested()
    @Type(() => Post)
    posts?: Array<Post>
}
