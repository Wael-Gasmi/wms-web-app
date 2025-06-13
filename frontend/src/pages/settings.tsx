"use client";

import { useEffect, useState } from "react";
import { Separator } from "@/components/ui/separator";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function Settings() {
  const [theme, setTheme] = useState("");
  const [sidebarSide, setSidebarSide] = useState("");
  const [sidebarVariant, setSidebarVariant] = useState("");
  const [sidebarCollapsible, setSidebarCollapsible] = useState("");

  useEffect(() => {
    setTheme(localStorage.getItem("theme") || "");
    setSidebarSide(localStorage.getItem("sidebarSide") || "");
    setSidebarVariant(localStorage.getItem("sidebarVariant") || "");
    setSidebarCollapsible(localStorage.getItem("sidebarCollapsible") || "");
  }, []);

  const handleSelectChange = (key: string, value: string) => {
    localStorage.setItem(key, value);
    switch (key) {
      case "theme":
        setTheme(value);
        break;
      case "sidebarSide":
        setSidebarSide(value);
        break;
      case "sidebarVariant":
        setSidebarVariant(value);
        break;
      case "sidebarCollapsible":
        setSidebarCollapsible(value);
        break;
    }
    window.location.reload();
  };

  return (
    <div className="container mx-auto py-10 px-5 space-y-6">
      <h1 className="text-2xl font-bold tracking-tighter">Settings</h1>
      <Separator className="my-5" />

      <div className="space-y-2">
        <Label className="text-base font-medium">Theme</Label>
        <Select
          value={theme}
          onValueChange={(value) => handleSelectChange("theme", value)}
        >
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="Select theme" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="light">Light</SelectItem>
            <SelectItem value="dark">Dark</SelectItem>
            <SelectItem value="system">System</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label className="text-base font-medium">Sidebar</Label>
        <Select
          value={sidebarSide}
          onValueChange={(value) => handleSelectChange("sidebarSide", value)}
        >
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="Select side" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="left">Left</SelectItem>
            <SelectItem value="right">Right</SelectItem>
          </SelectContent>
        </Select>

        <Select
          value={sidebarVariant}
          onValueChange={(value) => handleSelectChange("sidebarVariant", value)}
        >
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="Select variant" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="sidebar">Sidebar</SelectItem>
            <SelectItem value="floating">Floating</SelectItem>
            <SelectItem value="inset">Inset</SelectItem>
          </SelectContent>
        </Select>

        <Select
          value={sidebarCollapsible}
          onValueChange={(value) =>
            handleSelectChange("sidebarCollapsible", value)
          }
        >
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="Select collapsible" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="offcanvas">Offcanvas</SelectItem>
            <SelectItem value="icon">Icon</SelectItem>
            <SelectItem value="none">None</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
