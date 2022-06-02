import {
    ForbiddenException,
    HttpException,
    HttpStatus,
    Injectable,
} from '@nestjs/common'
import { PrismaClientKnownRequestError } from '@prisma/client/runtime'
import { PrismaService } from 'src/prisma/prisma.service'
import { AppInterface, Result, Status } from './app/type'
import { Post } from './app/dto/post.dto'
import { User } from './app/dto/user.dto'
import { Seasons } from '@prisma/client'

@Injectable()
export class AppService
    implements AppInterface<string, User, Post, User | Post>
{
    constructor(private prisma: PrismaService) {}

    async getUsers(): Promise<User[]> {
        return this.prisma.user.findMany({
            select: {
                email: true,
                createdAt: true,
                updatedAt: true,
            },
        })
    }
    async getSingleUser(id: string): Promise<User> {
        return this.prisma.user.findUnique({
            where: {
                id,
            },
            select: {
                email: true,
                createdAt: true,
                updatedAt: true,
            },
        })
    }
    async createUser(user: User): Promise<Status<User>> {
        const { email, password } = user
        try {
            const user = await this.prisma.user.create({
                data: {
                    email,
                    password,
                },
                select: {
                    email: true,
                    createdAt: true,
                    updatedAt: true,
                },
            })
            if (!user)
                throw new HttpException('invalid User', HttpStatus.NOT_FOUND)
            return { status: Result.Ok, result: user }
        } catch (e: any) {
            if (
                e instanceof PrismaClientKnownRequestError &&
                e.code === 'P2002'
            )
                throw new ForbiddenException(
                    `creating user(Prisma): ${e.message}`,
                )
            throw new HttpException(
                'creat user failed',
                HttpStatus.NOT_IMPLEMENTED,
            )
        }
    }
    async getPosts(): Promise<Post[]> {
        return await this.prisma.post.findMany({
            select: {
                user: {
                    select: {
                        email: true,
                    },
                },
                title: true,
                body: true,
            },
        })
    }
    async getPostsByUser(uid: string): Promise<Post[]> {
        return await this.prisma.post.findMany({
            where: {
                userId: uid,
            },
            select: {
                title: true,
                body: true,
            },
        })
    }
    async getSinglePost(postId: string): Promise<Post> {
        return await this.prisma.post.findUnique({
            where: {
                id: postId,
            },
        })
    }
    //todo
    async createPost(
        post: Post,
        uid: string,
        tags: Seasons[],
    ): Promise<Status<Post>> {
        try {
            const newPost = await this.prisma.post.create({
                data: {
                    title: post.title,
                    body: post.body,
                    user: {
                        connect: {
                            id: uid,
                        },
                    },
                    tags: {
                        create: {
                            seasons: 'AUTHUM',
                        },
                    },
                },
            })
            return { status: Result.Ok, result: newPost }
        } catch (e: any) {
            if (
                e instanceof PrismaClientKnownRequestError &&
                e.code === 'P2002'
            )
                throw new ForbiddenException(
                    `creating user(Prisma): ${e.message}`,
                )
            throw new HttpException(
                'creating post failed',
                HttpStatus.NOT_IMPLEMENTED,
            )
        }
    }
    async patchUser(
        uid: string,
        pw: Pick<User, 'password'>,
    ): Promise<Status<User>> {
        const newPassword = pw.password
        try {
            const updatedUser = await this.prisma.user.update({
                where: {
                    id: uid,
                },
                data: {
                    password: {
                        set: newPassword,
                    },
                },
                select: {
                    email: true,
                },
            })
            return { status: Result.Ok, result: updatedUser }
        } catch (e) {
            if (e instanceof PrismaClientKnownRequestError)
                throw new ForbiddenException(e.message)
            throw new HttpException(
                'patch user failed',
                HttpStatus.NOT_MODIFIED,
            )
        }
    }
    async patchPost(post: Post, postId: string): Promise<Status<Post>> {
        const singlePost = await this.prisma.post.findUnique({
            where: {
                id: postId,
            },
        })
        if (!singlePost) throw new ForbiddenException('not found single post')
        try {
            const newPost = await this.prisma.post.update({
                where: {
                    id: postId,
                },
                data: {
                    title: post.title ? post.title : singlePost.title,
                    body: post.body ? post.body : singlePost.body,
                },
            })
            return { status: Result.Ok, result: newPost }
        } catch (e) {
            if (e instanceof PrismaClientKnownRequestError)
                throw new ForbiddenException(e.message)
            throw new HttpException(
                'patch post failed',
                HttpStatus.NOT_MODIFIED,
            )
        }
    }
    async deleteUser(uid: string): Promise<Status<User>> {
        const user = await this.prisma.user.delete({
            where: {
                id: uid,
            },
            select: {
                email: true,
            },
        })
        if (!user) throw new ForbiddenException('not found user')
        return { status: Result.Ok, result: user }
    }
    async deletePost(postId: string): Promise<Status<Post>> {
        const post = await this.prisma.post.delete({
            where: {
                id: postId,
            },
            select: {
                title: true,
            },
        })
        if (!post) throw new ForbiddenException('not found post')
        return { status: Result.Ok, result: post }
    }
    //todo
    async patchTagsFromPost(
        postId: string,
        taglist: Seasons[],
    ): Promise<void> {}
}
