import { apiURL } from "@/constants/constants";
import { TransactionTableData } from "@/types/transaction_types.ts/transaction_dashboard";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";

const useTransactionDashboardData = () => {
  return useQuery<{ transactions: TransactionTableData[] }, Error>({
    queryKey: ["dashboardData"],
    queryFn: () =>
      axios
        .get<{ transactions: TransactionTableData[] }>(
          `${apiURL}/api/fetch_transactions?status=Successful`
        )
        .then((response) => {
          const transactionData = response.data;
          if (!transactionData) {
            throw new Error("No data received");
          }

          return response.data;
        }),
  });
};

export default useTransactionDashboardData;
