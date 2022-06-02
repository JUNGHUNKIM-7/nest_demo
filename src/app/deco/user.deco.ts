import { createParamDecorator, ExecutionContext } from '@nestjs/common'
import { User } from '../dto/user.dto'

export const UserDeco = createParamDecorator(
    (id: string, ctx: ExecutionContext): User => {
        const request = ctx.switchToHttp().getRequest()
        return request.user
    },
)
