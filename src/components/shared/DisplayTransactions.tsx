import { TableRow, TableHead, TableBody, TableCell } from "@mui/material";
import { Table } from "lucide-react";
import React from "react";
import { TableHeader } from "../ui/table";
import useTransactionDashboardData from "@/hooks/useTransactionDashboardData";
import DashboardFilteredTransactions from "./DashboardFilteredTransactions";

const DisplayTransactions = () => {
  const {
    data: filteredTransactions,
    isLoading,
    error,
  } = useTransactionDashboardData();

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="hidden md:table-cell">Date</TableHead>
          <TableHead className="hidden md:table-cell">Tx ID</TableHead>
          <TableHead>Amount</TableHead>
          <TableHead>Crypto</TableHead>
          <TableHead>Status</TableHead>
          <TableHead className="hidden md:table-cell">Charges</TableHead>
          <TableHead>Receiver</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {isLoading ? (
          // <DashboardSkeleton />
          <div>Loading...</div>
        ) : filteredTransactions?.transactions.length || 0 > 0 ? (
          <DashboardFilteredTransactions
            filteredTransactions={filteredTransactions}
            isLoading={isLoading}
            error={error}
          />
        ) : (
          <TableRow>
            <TableCell colSpan={7} className="text-center text-gray-500 py-4">
              No transactions found
            </TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
};

export default DisplayTransactions;
