import { CanActivate, ExecutionContext, ForbiddenException, Injectable } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { Observable } from "rxjs";
import { ERROR_MESSAGES } from "src/utils/constants/message";
import { ROLES_KEY } from "src/utils/decorators/roles.decorator";

@Injectable()
export class AuthorizationGuard implements CanActivate {
    constructor(private readonly reflection: Reflector) { }
    canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
        try {
            const request = context.switchToHttp().getRequest();
            const requiredRole = this.reflection.get(ROLES_KEY, context.getHandler());
            
            if (requiredRole !== request.user.role) {
                throw new ForbiddenException(ERROR_MESSAGES.PROTECTED_ROUTE);
            }


            return true
        } catch (error) {
            console.log(`error in side the user authorization`, error.message);
            return false;
        }

    }
}