import { Request } from 'express';

export interface addMagnetRequest extends Request {
  params: {
    magnetUrl: string;
  };
}

export interface StreamRequest extends Request {
  params: {
    magnetLink: string;
    fileName: string;
  };
  headers: {
    range: string;
  };
}

export interface ErrorWithStatus extends Error {
  status: number;
}
