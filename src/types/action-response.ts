export type ActionResponse<T> =
  | { success: true; data: T }
  | { success: false; error: 'UNAUTHORIZED' | 'FORBIDDEN' | 'DATABASE_ERROR'; message: string };
