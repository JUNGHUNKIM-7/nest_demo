import {
    Body,
    Controller,
    Delete,
    Get,
    Post,
    HttpCode,
    HttpStatus,
    Patch,
    Param,
    Query,
} from '@nestjs/common'
import { AppService } from './app.service'
import { AppInterface, Status } from './app/type'
import { User } from './app/dto/user.dto'
import { Post as P } from './app/dto/post.dto'
import { Seasons } from '@prisma/client'

@Controller()
export class AppController implements AppInterface<string, User, P, User | P> {
    constructor(private appService: AppService) {}

    @Get('users')
    getUsers(): Promise<User[]> {
        return this.appService.getUsers()
    }
    @Get('users/:id')
    getSingleUser(@Param('id') id: string): Promise<User> {
        return this.appService.getSingleUser(id)
    }
    @Post('users')
    @HttpCode(HttpStatus.CREATED)
    createUser(@Body() user: User): Promise<Status<User>> {
        return this.appService.createUser(user)
    }
    @Delete('users/:uid')
    deleteUser(@Param('uid') uid: string): Promise<Status<User>> {
        return this.appService.deleteUser(uid)
    }
    @Patch('users/:uid')
    patchUser(
        @Param('uid') uid: string,
        @Body() pw: Pick<User, 'password'>,
    ): Promise<Status<User>> {
        return this.appService.patchUser(uid, pw)
    }
    @Get('posts')
    getPosts(): Promise<P[]> {
        return this.appService.getPosts()
    }
    @Get('posts/:postId')
    getSinglePost(@Param('postId') postId: string): Promise<P> {
        return this.appService.getSinglePost(postId)
    }
    @Get('posts/users/:uid')
    getPostsByUser(@Param('uid') uid: string): Promise<P[]> {
        return this.appService.getPostsByUser(uid)
    }
    @Post('posts/:uid')
    @HttpCode(HttpStatus.CREATED)
    createPost(
        @Body() post: P,
        @Param('uid') uid: string,
        @Query('tags') tagsQuery: string,
    ): Promise<Status<P>> {
        const taglist = this.makeTags(tagsQuery)
        return this.appService.createPost(post, uid, taglist)
    }
    @Patch('posts/:postId')
    patchPost(
        @Body() post: P,
        @Param('postId') postId: string,
    ): Promise<Status<P>> {
        return this.appService.patchPost(post, postId)
    }
    @Delete('posts/:postId')
    deletePost(@Param('postId') postId: string): Promise<Status<P>> {
        return this.appService.deletePost(postId)
    }
    @Patch('tags/:postId')
    patchTagsFromPost(
        @Param('postId') postId: string,
        @Query('tags') tagsQuery: string,
    ): Promise<void> {
        const taglist = this.makeTags(tagsQuery)
        return this.appService.patchTagsFromPost(postId, taglist)
    }
    makeTags(tagsQuery: string) {
        const parseToSeason = (str?: string): Seasons | null => {
            switch (str) {
                case 'spring':
                    return Seasons.SPRING
                case 'summer':
                    return Seasons.SUMMER
                case 'authum':
                    return Seasons.AUTHUM
                case 'winter':
                    return Seasons.WINTER
                default:
                    return null
            }
        }
        const taglist = tagsQuery
            .split('+')
            .map((str) => parseToSeason?.(str.toLowerCase()))

        return taglist
    }
}
