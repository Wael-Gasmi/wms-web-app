import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Mail,
  Pencil,
  Phone,
  MapPin,
  Calendar,
  User,
  UserRound,
  BadgeCheck,
} from "lucide-react";
import { useAuthStore } from "@/store/authStore";
import { format } from "date-fns";
import { Separator } from "@/components/ui/separator";
import { useState } from "react";
import { Input } from "@/components/ui/input";

export default function Profile() {
  const { data } = useAuthStore();
  const [isEditing, setIsEditing] = useState(false);

  const [formData, setFormData] = useState({
    firstName: data?.firstName || "",
    lastName: data?.lastName || "",
    email: data?.email || "",
    phoneNumber: data?.phoneNumber || "",
    gender: data?.gender || "",
    address: data?.address || "",
    dateOfBirth: data?.dateOfBirth
      ? format(new Date(data.dateOfBirth), "yyyy-MM-dd")
      : "",
  });

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const fields = [
    { icon: User, label: "First Name", field: "firstName" },
    { icon: UserRound, label: "Last Name", field: "lastName" },
    { icon: Mail, label: "Email", field: "email" },
    { icon: Phone, label: "Phone", field: "phoneNumber" },
    { icon: User, label: "Gender", field: "gender" },
    { icon: MapPin, label: "Address", field: "address" },
    { icon: BadgeCheck, label: "Role", field: "role?.name", readOnly: true },
    {
      icon: Calendar,
      label: "Date of Birth",
      field: "dateOfBirth",
      type: "date",
    },
    {
      icon: Calendar,
      label: "Joined",
      value: data?.createdAt ? format(new Date(data.createdAt), "PPP") : "N/A",
      readOnly: true,
    },
  ];

  return (
    <div className="container mx-auto py-10 px-5 ">
      <h1 className="text-2xl font-bold tracking-tighter">Profile</h1>
      <Separator className="my-5" />
      <Card className="m-auto max-w-max p-4 bg-transparent border-0 ">
        <CardContent className="space-y-4 text-sm text-muted-foreground grid grid-cols-2 gap-x-18">
          {fields.map(({ icon: Icon, label, field, value, readOnly, type }) => (
            <div className="flex flex-col gap-1" key={label}>
              <div className="flex items-center gap-2">
                <Icon className="w-4 h-4" />
                <label className="text-sm font-medium">{label}</label>
              </div>
              {isEditing && !readOnly ? (
                <Input
                  type={type || "text"}
                  value={formData[field as keyof typeof formData] ?? ""}
                  onChange={(e) => handleChange(field!, e.target.value)}
                />
              ) : (
                <span className="pl-6">
                  {value ??
                    (field === "dateOfBirth"
                      ? formData.dateOfBirth
                        ? format(new Date(formData.dateOfBirth), "PPP")
                        : "N/A"
                      : formData[field as keyof typeof formData] || "N/A")}
                </span>
              )}
            </div>
          ))}
        </CardContent>

        <Button
          size="icon"
          variant="ghost"
          className="w-full cursor-pointer"
          onClick={() => setIsEditing((prev) => !prev)}
        >
          {isEditing ? "Save" : "Edit"} <Pencil className="w-4 h-4 ml-2" />
        </Button>
      </Card>
    </div>
  );
}
