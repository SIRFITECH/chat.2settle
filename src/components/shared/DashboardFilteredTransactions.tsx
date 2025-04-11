import React from 'react'
import { TableCell, TableRow } from "@/components/ui/table";
import Loader from "./Loader";
import { TransactionTableData } from '@/types/transaction_types.ts/transaction_dashboard';

interface Props {
  isLoading: boolean;
  error: Error | null;
  filteredTransactions:
    | {
        transactions: TransactionTableData[];
      }
    | undefined;
}

const DashboardFilteredTransactions = ({
  isLoading,
  error,
  filteredTransactions,
}: Props) => {


  console.log("filteredTransactions:", filteredTransactions);
  if (isLoading) return <Loader />;
  if (error) return <div>An error occured while fetching transactions</div>;

  return filteredTransactions?.transactions
    .slice(0, 5)
    .map((transaction, index) => (
      <TableRow key={index} className="text-black">
        <TableCell className="hidden md:table-cell">
          {transaction.Date || "N/A"}
        </TableCell>
        <TableCell className="hidden md:table-cell">
          {transaction.transac_id || "N/A"}
        </TableCell>
        <TableCell>{transaction.Amount || "N/A"}</TableCell>
        <TableCell>{transaction.crypto || "N/A"}</TableCell>
        {/* <TableCell>
        <Select
          onValueChange={(value) =>
            handleStatusChange(transaction.transac_id!, value)
          }
        >
          <SelectTrigger
            className={`w-[120px] ${
              transaction..status === "Successful"
                ? "bg-green-100 text-green-800"
                : transaction.status === "Processing"
                ? "bg-amber-100  text-amber-800"
                : transaction.status === "Cancel"
                ? "bg-red-100 text-red-800"
                : transaction.status === "Uncompleted"
                ? "bg-gray-100  text-gray-800"
                : transaction.status === "UnSuccessful"
                ? "bg-orange-100  text-orange-800"
                : ""
            }`}
          >
            <SelectValue placeholder={transaction.status} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Successful">Successful</SelectItem>
            <SelectItem value="Uncompleted">Uncompleted</SelectItem>
            <SelectItem value="Cancel">Cancel</SelectItem>
            <SelectItem value="UnSuccessful">Unsuccessful</SelectItem>
          </SelectContent>
        </Select>
      </TableCell> */}
        <TableCell className="hidden md:table-cell">
          {transaction.charges || "N/A"}
        </TableCell>
        {/* <TableCell>{transaction.receiver_name || "N/A"}</TableCell> */}
      </TableRow>
    ));
}

export default DashboardFilteredTransactions
