import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { Observable } from "rxjs";
import { ROLES_KEY } from "src/utils/decorators/roles.decorator";

@Injectable()
export class AuthorizationGuard implements CanActivate {
    constructor(private readonly reflection: Reflector) { }
    canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
        try {
            console.log(` inside the authorizationGuard `)
            const request = context.switchToHttp().getRequest();
            console.log(`request: ${request.user.role}`)
            const requiredRole = this.reflection.get(ROLES_KEY, context.getHandler());
            console.log(`this is a required role ${requiredRole}`);
            console.log(`this is the user role ${request.user.role}`)


            // if()
            return true
        } catch (error) {
            console.log(`error in side the user authorization`, error.message);
            return false;
        }

    }
}