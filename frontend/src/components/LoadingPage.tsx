import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

export default function LoadingPage() {
  return (
    <div className="flex items-center justify-center h-screen  ">
      <div className="flex flex-col items-center gap-4">
        <Loader2 className={cn("h-10 w-10 animate-spin text-primary")} />
        <p className="text-lg text-foreground">Loading, please wait...</p>
      </div>
    </div>
  );
}
