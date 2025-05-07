export interface Member {
  _id: string;
  name: string;
  role: string;
  email: string;
  contact: string;
  imageUrl: string;
  createdAt: string;
}

export interface ApiError {
  message: string;
}