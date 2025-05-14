import { Menu, Session } from "@/types/types";
import { Textarea } from "./ui/textarea";
import { SubmitHandler, useForm } from "react-hook-form";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { useCreateMenu, useEditMenu } from "@/hooks/useCreateMenu";
import { ScrollArea } from "./ui/scroll-area";
import { Separator } from "./ui/separator";
import { useSessions } from "@/hooks/useData";
import { Checkbox } from "./ui/checkbox";
import { useEffect, useState } from "react";

type FormFields = {
  id?: string;
  name: string;
  description?: string;
  createdAt?: Date;
  updatedAt?: Date;
};

type MenuFormProps = {
  form?: Menu;
};

export default function MenuForm({ form }: MenuFormProps) {
  const { data: sessions } = useSessions();
  const { mutate: createMenu } = useCreateMenu();
  const { mutate: editMenu } = useEditMenu();
  const [selectedSessions, setSelectedSessions] = useState<Session[]>([]);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormFields>({
    defaultValues: {
      id: form?.id || "",
      name: form?.name || "",
      description: form?.description || "",
    },
  });

  useEffect(() => {
    console.log(selectedSessions);
  }, [selectedSessions]);

  const toggleSession = (session: Session, isChecked: boolean) => {
    setSelectedSessions((prev) => {
      const updated = isChecked
        ? [...prev, session]
        : prev.filter((s) => s.id !== session.id);
      console.log(updated); // Debugging selectedSessions
      return updated;
    });
  };

  const onSubmit: SubmitHandler<FormFields> = (data) => {
    if (form) {
      editMenu({ ...data, sessions: selectedSessions });
    } else {
      createMenu({ ...data, sessions: selectedSessions });
    }
  };

  const isChecked = (session: Session) => {
    console.log("Checking session:", session.name); // Debugging session check
    return selectedSessions.some((s) => s.id === session.id);
  };

  return (
    <form
      className="flex flex-col gap-2 pt-3"
      onSubmit={handleSubmit(onSubmit)}
    >
      <div className="grid w-full max-w-sm items-center gap-1.5 m-auto">
        <Label htmlFor="title">Title</Label>
        <Input
          id="title"
          placeholder="Title"
          {...register("name", { required: "Title is required" })}
        />
        {errors.name && <p className="text-red-500">{errors.name.message}</p>}
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
        <ScrollArea className="h-40 overflow-auto rounded-md border">
          <div className="p-4">
            {sessions?.map((s: Session) => (
              <div key={s.id}>
                <div className="flex gap-4 items-center">
                  <Checkbox
                    checked={isChecked(s)}
                    onCheckedChange={(checked: boolean | "indeterminate") =>
                      toggleSession(s, checked === true)
                    }
                  />
                  <Label className="text-sm">{s.name}</Label>
                </div>
                <Separator className="my-2" />
              </div>
            ))}
          </div>
        </ScrollArea>
      </div>

      <div className="grid w-full max-w-sm items-center gap-1.5 m-auto">
        <Input type="submit" className="cursor-pointer mt-3" />
      </div>
    </form>
  );
}
