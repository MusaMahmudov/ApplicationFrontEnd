export interface getAppUserForDriver {
  email: string;
  fullname: string;
  id: string;
  lastVisit: string;
  userName: string;
}
export interface getAllAppUser {
  email: string;
  fullname: string;
  id: string;
  lastVisit: string;
  userName: string;
  roles: string[];
}
export interface getUserById {
  email: string;
  fullname: string;
  id: string;
  lastVisit: string;
  userName: string;
  roles: string[];
}
export interface getAppUserForDriverActions {
  id: string;
  userName: string;
}
export interface createAppUser {
  userName: string;
  fullname: string;
  email: string;
  password: string;
  confirmPassword: string;
  roles: string[];
}
export interface updateAppUser {
  userName: string | null;
  fullname: string | null;
  email: string | null;
  password: string | null;
  confirmPassword: string | null;
  rolesId: string[] | null;
}
export interface getRoleForAppUserActions {
  name: string;
  id: string;
}
export interface getUsersForChat {
  userName: string;
  id: string;
  isReadLastMessage: boolean;
  senderId: string;
  lastVisit: string;
  isOnline: boolean;
  lastMessage: string | null;
}
