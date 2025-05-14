export type User = {
  id?: string;
  firstName?: string | null;
  lastName?: string | null;
  email: string;
  password?: string | null;
  isActive?: boolean;
  lastLogin?: string | null;
  phoneNumber?: string | null;
  gender?: string | null;
  address?: string | null;
  profilePicture?: string | null;
  dateOfBirth?: Date | null;
  createdAt?: Date | null;
  updatedAt?: Date | null;
  roleId?: string | null;
  menuId?: string | null;
  role?: Role | null;
  menu?: Menu | null;
};
export type Role = {
  id?: string;
  name: string;
  description?: string;
  createdAt?: Date | null;
  updatedAt?: Date | null;
  User?: User[];
};
export type Menu = {
  id?: string;
  name: string;
  description?: string | null;
  createdAt?: Date | null;
  updatedAt?: Date | null;
  sessions?: Session[];
  User?: User[];
};
export type Session = {
  id?: string;
  name: string;
  icon?: string | null;
  path: string;
  parentSessionId?: string | null;
  description?: string | null;
  createdAt?: Date | null;
  updatedAt?: Date | null;
  menus?: Menu[];
  parentSession?: Session | null;
  subSessions?: Session[];
};

export type Product = {
  id?: string;
  name: string;
  standard_price?: number | null;
  qty_available?: number | null;
  virtual_available?: number | null;
  default_code: string;
  list_price?: number | null;
  description?: string | null;
  categ_id?: string | null;
  barcode?: string | null;
  createdAt?: Date | null;
  updatedAt?: Date | null;
};

export type Receipt = {
  id?: string;
  name: string;
  sheduled_date: string | null;
  state: string | null;
  partner_id: string | null;
};
