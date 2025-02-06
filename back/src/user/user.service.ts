
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import * as bcrypt from 'bcrypt';
import { User } from './user.model';

@Injectable()
export class UsersService {
    constructor(private prisma: PrismaService) { }

    async findOne(username: string): Promise<User | null> {
        const userData = await this.prisma.user.findUnique({ where: { username } });
        if (!userData) return null;

        return this.mapToUserModel(userData);
    }

    async create(username: string, password: string): Promise<User> {
        const hashedPassword = await bcrypt.hash(password, 10);
        const createdUser = await this.prisma.user.create({ data: { username, password: hashedPassword } });
        
        return this.mapToUserModel(createdUser);
    }

    private mapToUserModel(data: any): User {
        const user = new User();
        user.id = data.id;
        user.username = data.username;
        user.password = data.password;
        return user;
    }
}
