import ManualTransactionForm from "@/components/shared/manualTransactionForm/ManualTransactionForm";
import Navbar from "@/components/shared/NavBar";
import React from "react";
import { useRouter } from "next/navigation";

const newTrx = () => {
  const router = useRouter();

  return (
    <>
      <Navbar />
      <ManualTransactionForm />
    </>
  );
};

export default newTrx;
