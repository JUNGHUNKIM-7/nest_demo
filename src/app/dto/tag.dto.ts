import { Type } from 'class-transformer'
import {
    IsNotEmpty,
    IsOptional,
    IsString,
    ValidateNested,
} from 'class-validator'
import { Post } from './post.dto'

export class Tag {
    @IsNotEmpty()
    @IsString()
    tag: string

    @IsOptional()
    @ValidateNested()
    @Type(() => Post)
    posts?: Post[]
}
