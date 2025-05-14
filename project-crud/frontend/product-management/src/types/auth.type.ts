/* eslint-disable @typescript-eslint/no-explicit-any */
// src/types/auth.type.ts
export type AuthFormType = {
  username: string;
  password: string;
};

export type AuthStateType = {
  user: any | null;
  token: string | null;
  loading: boolean;
  error: any | null;
  message: string | null;
  status: string | null;
};
