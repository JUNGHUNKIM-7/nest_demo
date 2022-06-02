import { Type } from 'class-transformer'
import { IsString, IsOptional, ValidateNested } from 'class-validator'
import { Tag } from './tag.dto'

export class Post {
    @IsOptional()
    @IsString()
    title?: string

    @IsOptional()
    @IsString()
    body?: string

    @IsOptional()
    @ValidateNested()
    @Type(() => Tag)
    tag?: Array<Tag>
}
