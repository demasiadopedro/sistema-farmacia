import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Role, usuario } from '@prisma/client';
import { Request } from 'express';

interface RequestWithUser extends Request {
	user: usuario;
}

@Injectable()
export class RoleGuard implements CanActivate {
	constructor(private readonly reflector: Reflector) {}
	canActivate(context: ExecutionContext): boolean {
		const requiredRoles = this.reflector.get<Role[]>(
			'roles',
			context.getHandler(),
		);
		if (!requiredRoles) return true;
		const request: RequestWithUser = context.switchToHttp().getRequest();
		const user: usuario = request.user;

		if (!user || !requiredRoles.includes(user.role)) return false;

		return true;
	}
}
