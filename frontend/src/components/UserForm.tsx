/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";

import { cn } from "@/lib/utils";
import { useMenus, useRoles } from "@/hooks/useData";

import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Button } from "./ui/button";
import { Calendar } from "./ui/calendar";
import { RadioGroup, RadioGroupItem } from "./ui/radio-group";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { useCreateUser, useEditUser } from "@/hooks/useCreateUser";

type FormFields = {
  id?: string;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  roleId?: string;
  menuId?: string;
  phoneNumber?: string;
  gender?: string;
  address?: string;
  profilePicture?: string;
  dateOfBirth?: Date;
  isActive?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
};

type UserFormProps = {
  form?: any;
};

export default function UserForm({ form }: UserFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm<FormFields>({
    defaultValues: form
      ? {
          id: form?.id || "",
          firstName: form?.firstName || "",
          lastName: form?.lastName || "",
          email: form?.email || "",
          password: form?.password || "",
          roleId: form?.role?.id || "",
          menuId: form?.menu?.id || "",
          phoneNumber: form?.phoneNumber || "",
          gender: form?.gender || "",
          address: form?.address || "",
          profilePicture: form?.profilePicture || "",
          dateOfBirth: form?.dateOfBirth || "",
        }
      : undefined,
  });
  const gender = watch("gender");

  const [date, setDate] = useState<Date>(
    form?.dateOfBirth ? new Date(form.dateOfBirth) : new Date()
  );
  const menus = useMenus();
  const roles = useRoles();
  const { mutate: createUser } = useCreateUser();
  const { mutate: editUser } = useEditUser();

  const onSubmit: SubmitHandler<FormFields> = (data) => {
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
    >
      <div className="flex justify-between gap-4">
        <div className="grid w-full max-w-sm gap-1.5 m-auto">
          <Label htmlFor="firstName">First Name</Label>
          <Input
            type="text"
            id="firstName"
            placeholder="First Name"
            {...register("firstName", { required: true })}
          />
          {errors.firstName && (
            <p className="text-red-500">{String(errors.firstName.message)}</p>
          )}
        </div>
        <div className="grid w-full max-w-sm gap-1.5 m-auto">
          <Label htmlFor="lastName">Last Name</Label>
          <Input
            type="text"
            id="lastName"
            placeholder="Last Name"
            {...register("lastName", { required: true })}
          />
          {errors.lastName && (
            <p className="text-red-500">{String(errors.lastName.message)}</p>
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
            {...register("email", { required: true })}
          />
          {errors.email && (
            <p className="text-red-500">{String(errors.email.message)}</p>
          )}
        </div>
        {form ? (
          <></>
        ) : (
          <div className="grid w-full max-w-sm gap-1.5 m-auto">
            <Label htmlFor="password">Password</Label>
            <Input
              type="password"
              id="password"
              placeholder="Password"
              {...register("password", { required: true })}
            />
            {errors.password && (
              <p className="text-red-500">{String(errors.password.message)}</p>
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
            <p className="text-red-500">{String(errors.phoneNumber.message)}</p>
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
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant={"outline"}
                className={cn(
                  "w-full justify-start text-left font-normal",
                  !date && "text-muted-foreground"
                )}
              >
                <CalendarIcon />
                {date ? format(date, "PPP") : <span>Pick a date</span>}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={date}
                onSelect={(day) => {
                  const selectedDate = day || new Date();
                  setDate(selectedDate);
                  setValue("dateOfBirth", selectedDate);
                }}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </div>
      </div>

      <div className="flex justify-center gap-4">
        <div className="grid w-full max-w-sm gap-1.5 m-auto">
          <Label htmlFor="role">Role</Label>
          <Select
            onValueChange={(value: string) => setValue("roleId", value)}
            defaultValue={form?.roleId || ""}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder={form?.role?.name || "Role"} />
            </SelectTrigger>
            <SelectContent>
              {roles.data?.map((role: any) => (
                <SelectItem key={role.id} value={role.id}>
                  {role.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="grid w-full max-w-sm gap-1.5 m-auto">
          <Label htmlFor="menu">Menu</Label>
          <Select
            onValueChange={(value: string) => setValue("menuId", value)}
            defaultValue={form?.menuId || ""}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder={form?.menu?.name || "Menu"} />
            </SelectTrigger>
            <SelectContent>
              {menus.data?.map((menu: any) => (
                <SelectItem key={menu.id} value={menu.id}>
                  {menu.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid w-full m-auto">
        <Input type="submit" className="cursor-pointer mt-3" />
      </div>
    </form>
  );
}
