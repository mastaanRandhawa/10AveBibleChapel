import { Request, Response } from 'express';
export declare const getVoiceRecordings: (req: Request, res: Response) => Promise<void>;
export declare const getVoiceRecording: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const createVoiceRecording: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const updateVoiceRecording: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const deleteVoiceRecording: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
//# sourceMappingURL=voiceRecordingController.d.ts.map