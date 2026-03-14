import { Request, Response } from 'express';
export declare const getSermons: (req: Request, res: Response) => Promise<void>;
export declare const getSermon: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const getSermonsBySeries: (req: Request, res: Response) => Promise<void>;
export declare const createSermon: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const updateSermon: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const deleteSermon: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
//# sourceMappingURL=sermonController.d.ts.map