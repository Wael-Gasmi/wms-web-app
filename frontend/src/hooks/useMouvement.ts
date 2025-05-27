import { useQuery } from "@tanstack/react-query";
import axios from "axios";

export const useMouvements = () => {
  return useQuery({
    queryKey: ["movements"],
    queryFn: async () => {
      const res = await axios.get("/api/movements");
      return res.data;
    },
  });
};
