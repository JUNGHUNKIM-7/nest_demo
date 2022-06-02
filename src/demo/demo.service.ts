import { Injectable } from '@nestjs/common'
import { PrismaService } from 'src/prisma/prisma.service'
import { CreateDemoDto } from './dto/create-demo.dto'
import { UpdateDemoDto } from './dto/update-demo.dto'

@Injectable()
export class DemoService {
    constructor(private p: PrismaService) {}

    create(createDemoDto: CreateDemoDto) {
        const { email, password } = createDemoDto
        return this.p.user.create({
            data: {
                email,
                password,
            },
        })
    }

    findAll() {
        return `This action returns all demo`
    }

    findOne(id: number) {
        return `This action returns a #${id} demo`
    }

    update(id: number, updateDemoDto: UpdateDemoDto) {
        return `This action updates a #${id} demo`
    }

    remove(id: number) {
        return `This action removes a #${id} demo`
    }
}
