// import { Logger, Module } from '@nestjs/common';
// import { AuthService } from './auth.service';
// import { UserModule } from '../user/user.module';
// import { AdminModule } from '../admin/admin.module';
// import { ResponseService } from '../utils/responses/ResponseService';
// import { AuthController } from './auth.controller';
// import { JwtModule, JwtService } from '@nestjs/jwt';
// import { ConfigService } from '@nestjs/config';
// import { AuthenticationGuard } from './guard/authenticaton.guard';

// @Module({


//   imports: [UserModule, AdminModule,JwtModule.registerAsync({
//     useFactory: async (configService: ConfigService) => {
//       const logger = new Logger('JwtModule'); // Create a Logger instance

//       const secret = configService.get<string>('JWT_SECRET');
//       logger.debug(`JWT Secret: ${secret}`); // Log the JWT secret (for debugging)

//       return {
//         secret,
//       };
//     },
//     inject: [ConfigService],
//   }),],
//   controllers: [AuthController],
//   providers: [AuthService,ResponseService,AuthenticationGuard,JwtService],
//   exports: [AuthenticationGuard]
// })
// export class AuthModule {}
import { Module } from '@nestjs/common';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthenticationGuard } from './guard/authenticaton.guard';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UserModule } from 'src/user/user.module';
import { AdminModule } from 'src/admin/admin.module';
import { UserRepository } from 'src/user/repo/user.repository';
import { AdminRepository } from 'src/admin/repo/admin.repository';
import { ResponseService } from 'src/utils/responses/ResponseService';
import { AuthorizationGuard } from './guard/authorization.guard';

@Module({
  imports: [UserModule,AdminModule,
    ConfigModule.forRoot(), // Ensure ConfigModule is imported
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'),
        signOptions: { expiresIn: '60m' },
      }),
    }),
  ],
  // providers: [AuthService, AuthenticationGuard,UserRepository,AdminRepository],
  providers: [AuthService, ResponseService, AuthenticationGuard, JwtService, AuthorizationGuard],
  controllers: [AuthController],
  exports: [AuthService, AuthenticationGuard, AuthorizationGuard], // Export if needed elsewhere
})
export class AuthModule { }
