type UserId = string;

interface BaseUser {
  id: UserId;
  name: string;
  email: string;
  image?: string;
}

interface PrivateUser extends BaseUser {
  password: string;
  emailVerified: boolean;
}

type PublicUser = BaseUser;

interface User extends PublicUser {
  friends: UserId[];
  friendRequests: UserId[];
}

type CreateInternalUserDTO = Omit<PrivateUser, 'id'>;
type CreateExternalUserDTO = Omit<BaseUser, 'id'>;

type CreateUserDTO = CreateInternalUserDTO | CreateExternalUserDTO;

type UpdateUserDTO = Partial<CreateUserDTO>;
