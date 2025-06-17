export interface ExampleProps {
  title: string;
  description?: string;
}

export type User = {
  id: number;
  name: string;
  email: string;
};

export type ApiResponse<T> = {
  data: T;
  error?: string;
};
