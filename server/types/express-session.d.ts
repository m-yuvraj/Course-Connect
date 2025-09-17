import "express-session";

declare module "express-session" {
    interface SessionData {
        userId?: string;  // we are adding this field to session
    }
}
