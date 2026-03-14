import { Request, Response } from 'express';
export declare const getPrayerRequests: (req: Request, res: Response) => Promise<void>;
export declare const getPrayerRequest: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const createPrayerRequest: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const updatePrayerRequest: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const deletePrayerRequest: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
//# sourceMappingURL=prayerRequestController.d.ts.map