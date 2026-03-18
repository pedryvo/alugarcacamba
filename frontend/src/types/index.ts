export interface User {
  id: number;
  email: string;
  name?: string | null;
}

export interface Dumpster {
  id: number;
  serialNumber: string;
  color: string;
  isRented: boolean | null;
  createdAt: string;
  updatedAt: string;
  rentals?: Rental[];
}

export interface Rental {
  id: number;
  dumpsterId: number;
  startDate: string;
  endDate?: string | null;
  cep: string;
  street: string;
  neighborhood: string;
  city: string;
  state: string;
  dumpster?: Dumpster;
}

export interface AuthResponse {
  access_token: string;
}
