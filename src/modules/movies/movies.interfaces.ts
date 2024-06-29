import { Request } from 'express';

export interface SearchRequest extends Request {
  query: {
    nm: string;
  };
}
