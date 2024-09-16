import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { JwtService } from "@nestjs/jwt";
import { Observable } from "rxjs";
import { ERROR_MESSAGES } from "src/utils/constants/message";
import { ResponseService } from "src/utils/responses/ResponseService";

@Injectable()
export class AuthenticationGuard implements CanActivate {
    constructor(
        private jwtService: JwtService,
        private readonly config: ConfigService,
        private responseService: ResponseService // Make sure to inject ResponseService if used
    ) { }

    canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
        try {

            const JWT_SECRET = this.config.get<string>('JWT_SECRET');
            const request = context.switchToHttp().getRequest();
            const token = request.headers.authorization?.split(' ')[1];
            if (!token) {
                return false;
            }

            const payload = this.jwtService.verify(token, { secret: JWT_SECRET });
            request.user = payload;
            return true;
        } catch (error) {

            return false;
        }
    }
}
