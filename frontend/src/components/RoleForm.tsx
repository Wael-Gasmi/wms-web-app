import { Role } from "@/types/types";
import { Textarea } from "./ui/textarea";
import { SubmitHandler, useForm } from "react-hook-form";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { useCreateRole, useEditRole } from "@/hooks/useCreateRole";

type FormFields = {
  id?: string;
  name: string;
  description?: string;
  createdAt?: Date;
  updatedAt?: Date;
};

type RoleFormProps = {
  form?: Role;
};

export default function RoleForm({ form }: RoleFormProps) {
  const { mutate: createRole } = useCreateRole();
  const { mutate: editRole } = useEditRole();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormFields>({
    defaultValues: form
      ? {
          id: form?.id || "",
          name: form?.name || "",
          description: form?.description || "",
        }
      : undefined,
  });

  const onSubmit: SubmitHandler<FormFields> = (data) => {
    if (form) {
      editRole(data);
    } else {
      createRole(data);
    }
  };

  return (
    <form
      className="flex flex-col gap-2 pt-3"
      onSubmit={handleSubmit(onSubmit)}
    >
      <div className="grid w-full max-w-sm items-center gap-1.5 m-auto">
        <Label htmlFor="title">Title</Label>
        <Input
          type="title"
          id="title"
          placeholder="Title"
          {...register("name", { required: true })}
        />
        {errors.name && (
          <p className="text-red-500">{String(errors.name.message)}</p>
        )}
      </div>

      <div className="grid w-full max-w-sm items-center gap-1.5 m-auto">
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          placeholder="Description"
          {...register("description")}
        />
      </div>

      <div className="grid w-full max-w-sm items-center gap-1.5 m-auto">
        <Input type="submit" className="cursor-pointer mt-3  " />
      </div>
    </form>
  );
}
