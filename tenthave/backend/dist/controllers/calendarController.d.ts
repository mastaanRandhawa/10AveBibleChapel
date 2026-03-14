import { Request, Response } from 'express';
export declare const getCalendarEvents: (req: Request, res: Response) => Promise<void>;
export declare const getCalendarEvent: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const createCalendarEvent: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const updateCalendarEvent: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const deleteCalendarEvent: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
//# sourceMappingURL=calendarController.d.ts.map