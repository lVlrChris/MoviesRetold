import { Slice } from './slice.model';

export interface Movie {
  id: String;
  title: String;
  description: String;
  duration: Number;
  sliceDuration: Number;
  slices: Slice[];
}
