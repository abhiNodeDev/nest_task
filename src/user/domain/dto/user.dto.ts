export type UserDTO = {
  id: string;
  email: string;
  password: string;
  createdAt?: Date;
  updatedAt?: Date;
};

export type loginRegisterUserDTO = {
  email: string;
  password: string;
};
