
import {
    Body,
    Controller,
    Get,
    HttpCode,
    HttpStatus,
    Post,
    Request,
    UseGuards,
    BadRequestException,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBody, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { AuthGuard } from './auth.guard';
import { AuthService } from './auth.service';
import { Public } from './public.decorator';
import { UsersService } from '../user/user.service';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService, private usersService: UsersService) { }

    @ApiOperation({ summary: 'Enregistrer nouvel utilisateur' })
    @Public()
    @ApiBody({
        schema: {
            type: 'object',
            properties: {
                username: { type: 'string', example: 'john' },
                password: { type: 'string', example: 'Test123' },
            },
        },
    })
    @ApiResponse({ status: 201, description: 'Utilisateur enregistré avec succès' })
    @ApiResponse({ status: 400, description: 'Utilisateur existe déjà' })
    @Post('register')
    async register(@Body() registerDto: { username: string; password: string }) {
        const existingUser = await this.usersService.findOne(registerDto.username);
        if (existingUser) {
            throw new BadRequestException('Utilisateur existe déjà.');
        }

        const newUser = await this.usersService.create(registerDto.username, registerDto.password);
        return { message: 'Utilisateur enregistré avec succès', userId: newUser.id };
    }

    @ApiOperation({ summary: 'Connexion utilisateur' })
    @Public()
    @ApiBody({
        schema: {
            type: 'object',
            properties: {
                username: { type: 'string', example: 'john' },
                password: { type: 'string', example: 'Test123' },
            },
        },
    })
    @ApiResponse({ status: 200, description: 'Connexion réussie' })
    @ApiResponse({ status: 401, description: 'Échec authentification' })
    @HttpCode(HttpStatus.OK)
    @Post('login')
    signIn(@Body() signInDto: Record<string, any>) {
        return this.authService.signIn(signInDto.username, signInDto.password);
    }

    @ApiOperation({ summary: 'Obtenir le profil utilisateur' })
    @ApiBearerAuth()
    @ApiResponse({ status: 200, description: 'Profil utilisateur' })
    @UseGuards(AuthGuard)
    @Get('profile')
    getProfile(@Request() req) {
        return req.user;
    }
}
