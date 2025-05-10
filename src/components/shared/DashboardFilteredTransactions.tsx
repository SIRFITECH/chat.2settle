import React from "react";
import { TableCell, TableRow } from "@/components/ui/table";
import { TransactionTableData } from "@/types/transaction_types.ts/transaction_dashboard";
import { formatCurrency } from "@/helpers/format_currency";

interface Props {
  filteredTransactions:
    | {
        transactions: TransactionTableData[];
      }
    | undefined;
}

const DashboardFilteredTransactions = ({ filteredTransactions }: Props) => {
  return filteredTransactions?.transactions
    .slice(0, 20)
    .map((transaction, index) => (
      <TableRow key={index} className="text-black">
        <TableCell >
          {transaction.Date || "N/A"}
        </TableCell>
        <TableCell className="hidden md:table-cell">
          {transaction.transac_id || "N/A"}
        </TableCell>
        <TableCell >
          {transaction.receiver_amount || "N/A"}
          {/* {formatCurrency(transaction.receiver_amount || "0", "NGN", "en-NG") ||
            "N/A"} */}
        </TableCell>
        <TableCell>{transaction.crypto_sent || "N/A"}</TableCell>
        <TableCell className="hidden md:table-cell" >{transaction.current_rate || "N/A"}</TableCell>
        <TableCell className="hidden md:table-cell">
          {transaction.charges || "N/A"}
        </TableCell>
      </TableRow>
    ));
};

export default DashboardFilteredTransactions;
