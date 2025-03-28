/* eslint-disable @typescript-eslint/no-empty-object-type */
import { Redis } from '@upstash/redis';

declare global {
  interface Database extends Redis {}
  type Key = string;
  type FieldKey = string;
  type Entity<T = unknown> = Record<string, T> & { id: Key };
}
