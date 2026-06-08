import "express";


declare global {
    namespace Express {
        interface Request {
            user?: {
                id: string;
                role: string;
            };
            cookies: {
                obichatToken?: string;
                [key: string]: any
            }
        }
    }
}