import { Slice } from './slice.model';
import { User } from '../auth/user.model';

export interface Movie {
  id: String;
  title: String;
  description: String;
  duration: Number;
  sliceDuration: Number;
  slices: Slice[];
  creator: string;
}
