// role.guard.ts
import "reflect-metadata";
import { ROLES_KEY } from "../decorators/role.decorator";

export function checkRoles(
  context: { user?: { tipo: string } },
  handler: Function
): boolean {
  const roles = Reflect.getMetadata(ROLES_KEY, handler);
  if (!roles) return true;
  if (!context.user) return false;
  return roles.includes(context.user.tipo);
}
