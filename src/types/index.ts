export interface ExampleProps {
  title: string;
  description?: string;
}

export type User = {
  id: string;
  name: string;
  email: string;
  role: 'candidate' | 'church' | 'admin';
};

export type ApiResponse<T> = {
  data: T;
  error?: string;
};

export interface Church {
  id: string;
  name: string;
  email: string;
  phone: string;
  website?: string;
  address: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
  };
}

export interface JobPosting {
  id: string;
  churchId: string;
  churchName: string;
  title: string;
  position: string;
  employmentType: 'Part Time' | 'Full Time with Benefits' | 'Internship';
  location: {
    city: string;
    state: string;
  };
  jobUrl: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}
