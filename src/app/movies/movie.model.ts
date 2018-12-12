import { Slice } from './slice.model';
import { User } from '../auth/user.model';

export interface Movie {
  id: string;
  title: string;
  description: string;
  duration: number;
  sliceDuration: number;
  slices: Slice[];
  creator: string;
}
