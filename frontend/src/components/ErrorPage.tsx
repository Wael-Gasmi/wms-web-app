import { AlertTriangle } from "lucide-react";
import { cn } from "@/lib/utils";

export default function ErrorPage() {
  return (
    <div className="flex items-center justify-center h-screen">
      <div className="flex flex-col items-center gap-4">
        <AlertTriangle className={cn("h-10 w-10 text-destructive")} />
        <p className="text-lg text-foreground">Oops! Something went wrong.</p>
      </div>
    </div>
  );
}
