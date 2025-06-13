/* eslint-disable @typescript-eslint/no-explicit-any */
import { useForm, SubmitHandler } from "react-hook-form";

import { useMenus, useRoles } from "@/hooks/useData";
import { useCreateUser, useEditUser } from "@/hooks/useUser";

import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Button } from "./ui/button";
import { RadioGroup, RadioGroupItem } from "./ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";

type Role = {
  id: string;
  name: string;
};

type Menu = {
  id: string;
  name: string;
};

type FormFields = {
  id?: string;
  firstName: string;
  lastName: string;
  email: string;
  password?: string;
  roleId?: string;
  menuId?: string;
  phoneNumber?: string;
  gender?: string;
  address?: string;
  profilePicture?: string;
  dateOfBirth?: string; // using string in "YYYY-MM-DD" format for input type="date"
  isActive?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
};

type UserFormProps = {
  form?: Partial<FormFields> & {
    role?: Role;
    menu?: Menu;
  };
};

export default function UserForm({ form }: UserFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setValue,
    clearErrors,
    watch,
    setError,
  } = useForm<FormFields>({
    defaultValues: form
      ? {
          id: form?.id || "",
          firstName: form?.firstName || "",
          lastName: form?.lastName || "",
          email: form?.email || "",
          password: "",
          roleId: form?.role?.id || form?.roleId || "",
          menuId: form?.menu?.id || form?.menuId || "",
          phoneNumber: form?.phoneNumber || "",
          gender: form?.gender || "",
          address: form?.address || "",
          profilePicture: form?.profilePicture || "",
          dateOfBirth: form?.dateOfBirth ? form.dateOfBirth.slice(0, 10) : "",
        }
      : undefined,
  });

  const gender = watch("gender");
  const roleId = watch("roleId") || "";
  const menuId = watch("menuId") || "";

  const menus = useMenus();
  const roles = useRoles();
  const { mutate: createUser } = useCreateUser();
  const { mutate: editUser } = useEditUser();

  const onSubmit: SubmitHandler<FormFields> = (data) => {
    if (!data.roleId) {
      setError("roleId", { type: "manual", message: "Role is required" });
      return;
    }

    if (!data.menuId) {
      setError("menuId", { type: "manual", message: "Menu is required" });
      return;
    }

    if (form) {
      editUser(data);
    } else {
      createUser(data);
    }
  };

  return (
    <form
      className="flex flex-col gap-4 pt-3"
      onSubmit={handleSubmit(onSubmit)}
      noValidate
    >
      <div className="flex justify-between gap-4">
        <div className="grid w-full max-w-sm gap-1.5 m-auto">
          <Label htmlFor="firstName">First Name</Label>
          <Input
            type="text"
            id="firstName"
            placeholder="First Name"
            {...register("firstName", { required: "First name is required" })}
          />
          {errors.firstName && (
            <p className="text-red-500">{errors.firstName.message}</p>
          )}
        </div>
        <div className="grid w-full max-w-sm gap-1.5 m-auto">
          <Label htmlFor="lastName">Last Name</Label>
          <Input
            type="text"
            id="lastName"
            placeholder="Last Name"
            {...register("lastName", { required: "Last name is required" })}
          />
          {errors.lastName && (
            <p className="text-red-500">{errors.lastName.message}</p>
          )}
        </div>
      </div>

      <div className="flex justify-between gap-4">
        <div className="grid w-full max-w-sm gap-1.5 m-auto">
          <Label htmlFor="email">Email</Label>
          <Input
            type="email"
            id="email"
            placeholder="Email"
            {...register("email", {
              required: "Email is required",
              pattern: {
                value: /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/,
                message: "Invalid email address",
              },
            })}
          />
          {errors.email && (
            <p className="text-red-500">{errors.email.message}</p>
          )}
        </div>
        {!form && (
          <div className="grid w-full max-w-sm gap-1.5 m-auto">
            <Label htmlFor="password">Password</Label>
            <Input
              type="password"
              id="password"
              placeholder="Password"
              {...register("password", { required: "Password is required" })}
            />
            {errors.password && (
              <p className="text-red-500">{errors.password.message}</p>
            )}
          </div>
        )}
      </div>

      <div className="flex justify-between gap-4">
        <div className="grid w-full max-w-sm gap-1.5 m-auto">
          <Label htmlFor="phoneNumber">Phone Number</Label>
          <Input
            type="text"
            id="phoneNumber"
            placeholder="Phone Number"
            {...register("phoneNumber")}
          />
          {errors.phoneNumber && (
            <p className="text-red-500">{errors.phoneNumber.message}</p>
          )}
        </div>
        <div className="grid w-full max-w-sm gap-1.5 m-auto">
          <Label htmlFor="address">Address</Label>
          <Input
            type="text"
            id="address"
            placeholder="Address"
            {...register("address")}
          />
        </div>
      </div>

      <div className="flex justify-center gap-4">
        <div className="grid w-full max-w-sm gap-1.5 m-auto">
          <Label htmlFor="gender">Gender</Label>
          <RadioGroup
            value={gender}
            onValueChange={(value: string) => setValue("gender", value)}
            className="flex"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="male" id="male" />
              <Label htmlFor="male">Male</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="female" id="female" />
              <Label htmlFor="female">Female</Label>
            </div>
          </RadioGroup>
        </div>
        <div className="grid w-full max-w-sm gap-1.5 m-auto">
          <Label htmlFor="dateOfBirth">Birth Date</Label>
          <Input
            id="dateOfBirth"
            type="date"
            {...register("dateOfBirth")}
            max={new Date().toISOString().split("T")[0]}
          />
        </div>
      </div>

      <div className="flex justify-center gap-4">
        <div className="grid w-full max-w-sm gap-1.5 m-auto">
          <Label htmlFor="role">Role</Label>
          <Select
            value={roleId}
            onValueChange={(value: string) => {
              setValue("roleId", value);
              clearErrors("roleId");
            }}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select Role" />
            </SelectTrigger>
            <SelectContent>
              {roles.data?.map((role: Role) => (
                <SelectItem key={role.id} value={role.id}>
                  {role.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.roleId && (
            <p className="text-red-500 text-sm">{errors.roleId.message}</p>
          )}
        </div>
        <div className="grid w-full max-w-sm gap-1.5 m-auto">
          <Label htmlFor="menu">Menu</Label>
          <Select
            value={menuId}
            onValueChange={(value: string) => {
              setValue("menuId", value);
              clearErrors("menuId");
            }}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select Menu" />
            </SelectTrigger>
            <SelectContent>
              {menus.data?.map((menu: Menu) => (
                <SelectItem key={menu.id} value={menu.id}>
                  {menu.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.menuId && (
            <p className="text-red-500 text-sm">{errors.menuId.message}</p>
          )}
        </div>
      </div>

      <div className="grid w-full m-auto">
        <Button type="submit" className="mt-3" disabled={isSubmitting}>
          {form ? "Update User" : "Create User"}
        </Button>
      </div>
    </form>
  );
}
