import { Input } from "./ui/input";
import { Label } from "./ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { Textarea } from "./ui/textarea";
import { Session } from "@/types/types";
import { SubmitHandler, useForm } from "react-hook-form";
import { useCreateSession, useEditSession } from "@/hooks/userCreateSession";
import { useSessions } from "@/hooks/useData";
import { icons } from "./icons";

type FormFields = {
  id?: string;
  name: string;
  icon?: string;
  path: string;
  description?: string;
  parentSessionId?: string;
};

type SessionFormProps = {
  form?: Session;
};

export default function SessionForm({ form }: SessionFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<FormFields>({
    defaultValues: form
      ? {
          id: form?.id || "",
          name: form?.name || "",
          icon: form?.icon || "",
          path: form?.path || "",
          description: form?.description || "",
          parentSessionId: form?.parentSessionId || "",
        }
      : undefined,
  });

  const sessions = useSessions();

  const { mutate: createSession } = useCreateSession();
  const { mutate: editSession } = useEditSession();

  const onSubmit: SubmitHandler<FormFields> = (data) => {
    const path =
      data.name && data.name.trim() !== "" ? "/" + data.name.toLowerCase() : "";
    const updatedData = { ...data, path };

    if (form) {
      editSession(updatedData);
    } else {
      createSession(updatedData);
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
        <Label htmlFor="icon">Icon</Label>
        <Select
          onValueChange={(value: string) => setValue("icon", value)}
          defaultValue={form?.icon || ""}
        >
          <SelectTrigger className="w-full cursor-pointer">
            <SelectValue placeholder="Icon" />
          </SelectTrigger>
          <SelectContent>
            {Array.isArray(icons) &&
              icons.map((icon, index) => (
                <SelectItem key={index} value={icon.label}>
                  {icon.icon}
                </SelectItem>
              ))}
          </SelectContent>
        </Select>
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
        <Label htmlFor="parentSessionId">Parent</Label>
        <Select
          onValueChange={(value: string) => setValue("parentSessionId", value)}
          defaultValue={form?.parentSessionId || ""}
        >
          <SelectTrigger className="w-full cursor-pointer">
            <SelectValue placeholder="Parent" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="null">None</SelectItem>
            {sessions.data?.map((session: Session, index: number) => (
              <SelectItem
                key={index}
                className="cursor-pointer"
                value={session.id || ""}
              >
                {session.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div className="grid w-full max-w-sm items-center gap-1.5 m-auto">
        <Input type="submit" className="cursor-pointer mt-3  " />
      </div>
    </form>
  );
}
