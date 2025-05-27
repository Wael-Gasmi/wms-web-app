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
  dateOfBirth: string | Date;
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
  name: string | null;
  standard_price?: number | null;
  default_code: string | null;
  qty_available?: number | null;
  list_price?: number | null;
  barcode?: string | null;
  createdAt?: Date | null;
  updatedAt?: Date | null;
};

export type Receipt = {
  id?: string;
  name: string | null;
  sheduled_date: string | null;
  state: string | null;
  partner_id: string | null;
};

export type Delivery = {
  id?: string;
  name: string | null;
  sheduled_date: string | null;
  state: string | null;
  partner_id: string | null;
};

export type Location = {
  id: string;
  name: string;
  complete_name?: string;
  scheduled_date?: string;
  state?: string;
};

export type Movement = {
  id: number;
  name: string;
  product_id: [number, string];
  location_id: [number, string];
  location_dest_id: [number, string];
  date: string;
  product_uom_qty: number;
};
