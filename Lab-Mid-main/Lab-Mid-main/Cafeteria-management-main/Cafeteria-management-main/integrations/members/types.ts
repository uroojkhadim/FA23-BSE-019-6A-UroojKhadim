export interface Member {
  _id?: string;
  loginEmail?: string;
  loginEmailVerified?: boolean;
  contact?: {
    firstName?: string;
    lastName?: string;
    phones?: string[];
  };
  profile?: {
    nickname?: string;
    title?: string;
    photo?: {
      url?: string;
    };
  };
  _createdDate?: Date | string;
  _updatedDate?: Date | string;
}
