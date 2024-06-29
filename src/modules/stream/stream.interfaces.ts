import { Request } from 'express';

export interface addMagnetRequest extends Request {
  params: {
    magnetUrl: string
  }
}
