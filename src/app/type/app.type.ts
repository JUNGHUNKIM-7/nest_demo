import { Post } from '../dto/post.dto'
import { User } from '../dto/user.dto'

export enum Result {
    Ok = 'success',
    Err = 'failed',
}

export interface Status<T extends User | Post> {
    status: Result
    result: T
}

export interface AppInterface<
    S extends string,
    U extends User,
    P extends Post,
    T extends User | Post,
> {
    getUsers(): Promise<U[]>
    getSingleUser(id: S): Promise<U>
    getPosts(): Promise<P[]>
    getPostsByUser(uid: S): Promise<P[]>
    getSinglePost(postId: S): Promise<P>
    createUser(user: User): Promise<Status<T>>
    // createPost(post: Post, uid: A, tagsQuery: A): Promise<void>
    patchUser(uid: S, pw: Pick<U, 'password'>): Promise<Status<T>>
    patchPost(post: Post, postId: S): Promise<Status<T>>
    // patchTagtoPost(postId: A, tagsQuery: A): Promise<void>
    deletePost(postId: S): Promise<Status<T>>
    deleteUser(uid: S): Promise<Status<T>>
}
