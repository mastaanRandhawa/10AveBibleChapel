import { Request, Response } from 'express';
export declare const getAnnouncements: (req: Request, res: Response) => Promise<void>;
export declare const getAnnouncement: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const createAnnouncement: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const updateAnnouncement: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const deleteAnnouncement: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
//# sourceMappingURL=announcementController.d.ts.map