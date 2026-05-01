import { useQuery } from "@tanstack/react-query";
import { danhMucsApi } from "../lib/api";

export function useAccountingAccountTree() {
  return useQuery({
    queryKey: ["accountingAccountTree"],
    queryFn: async () => {
      try {
        const data = await danhMucsApi.getAccountingAccountTree();
        return data || [];
      } catch (error) {
        return [];
      }
    },
    staleTime: 5 * 60 * 1000,
    placeholderData: [],
  });
}
