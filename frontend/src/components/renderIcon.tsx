import {
  BarChart,
  Calendar,
  Database,
  Home,
  Inbox,
  Layers,
  MapPin,
  MoveHorizontal,
  Package,
  Search,
  Settings,
  Truck,
} from "lucide-react";

interface RenderIconProps {
  icon: string | undefined | null;
}

export default function RenderIcon({ icon }: RenderIconProps) {
  const renderIcon = (icon: string | undefined | null) => {
    switch (icon?.toLocaleLowerCase()) {
      case "home":
        return <Home />;
      case "calendar":
        return <Calendar />;
      case "inbox":
        return <Inbox />;
      case "search":
        return <Search />;
      case "bar-chart":
        return <BarChart />;
      case "layers":
        return <Layers />;
      case "settings":
        return <Settings />;
      case "database":
        return <Database />;
      case "package":
        return <Package />;
      case "truck":
        return <Truck />;
      case "mappin":
        return <MapPin />;
      case "movehorizontal":
        return <MoveHorizontal />;
      default:
        return null;
    }
  };
  return renderIcon(icon);
}
