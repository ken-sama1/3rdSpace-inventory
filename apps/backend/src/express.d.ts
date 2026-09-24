import type { IdSchema, UserRoleSchema } from "@repo/shared";

declare global {
  namespace Express {
    interface Request {
      auth: {
        userId: IdSchema;
        // role: UserRoleSchema;
        // accessToken: string;
      };
    }
  }
}
