import mysql from "mysql2/promise";
type PayerRow = {
  chat_id: string;
  customer_phoneNumber: string;
};

export type ReceiverRow = {
  acct_number?: string;
  bank_name?: string;
  receiver_name?: string;
  receiver_phoneNumber?: string;
  is_vendor?: boolean;
};

type TransferRow = {
  crypto: string;
  network: string;
  estimation: string;

  Amount: string;
  receiver_amount: string;
  crypto_sent: string;

  charges?: string;

  Date: string;
  transac_id: string;

  current_rate: string;
  merchant_rate: string;
  profit_rate: string;
};

type SummaryRow = {
  status: string;
  receiver_amount: string;
  current_rate: string;
};

// export async function getOrCreatePayer(
//   paymentDetails: PayerRow,
// ): Promise<number> {
//   const [results]: any = await connection.query(
//     "SELECT id FROM payers WHERE chat_id = ? OR phone = ? LIMIT 1",
//     [paymentDetails.chat_id, paymentDetails.customer_phoneNumber],
//   );

//   if (results.length > 0) {
//     return results[0].id;
//   }

//   const user = {
//     chat_id: paymentDetails.chat_id,
//     phone: paymentDetails.customer_phoneNumber,
//   };

//   const [insertResult]: any = await connection.query(
//     "INSERT INTO payers SET ?",
//     user,
//   );

//   return insertResult.insertId;
// }
export async function getOrCreatePayer(
  conn: mysql.Connection,
  payerRow: PayerRow,
): Promise<number> {
  const [results]: any = await conn.query(
    "SELECT id FROM payers WHERE chat_id = ? OR phone = ? LIMIT 1",
    [payerRow.chat_id, payerRow.customer_phoneNumber],
  );

  if (results.length > 0) {
    return results[0].id;
  }

  const user = {
    chat_id: payerRow.chat_id,
    phone: payerRow.customer_phoneNumber,
  };

  const [insertResult]: any = await conn.query(
    "INSERT INTO payers SET ?",
    user,
  );

  return insertResult.insertId;
}

// ✅ Get or Create RECEIVER
// export async function getOrCreateReceiver(
//   receiverRow: ReceiverRow,
// ): Promise<number | null> {
//   const [results]: any = await connection.query(
//     "SELECT id FROM receivers WHERE bank_account = ? AND bank_name = ? LIMIT 1",
//     [receiverRow.acct_number, receiverRow.bank_name],
//   );

//   if (results.length > 0) {
//     return results[0].id;
//   }

//   if (!receiverRow.acct_number || !receiverRow.bank_name) return null;

//   const user = {
//     bank_name: receiverRow.bank_name,
//     bank_account: receiverRow.acct_number,
//     account_name: receiverRow.receiver_name,
//     phone: receiverRow.receiver_phoneNumber,
//     is_vendor: receiverRow.is_vendor || false,
//   };

//   const [insertResult]: any = await connection.query(
//     "INSERT INTO receivers SET ?",
//     user,
//   );

//   return insertResult.insertId;
// }

export async function getOrCreateReceiver(
  conn: mysql.Connection,
  receiverRow: ReceiverRow,
): Promise<number | null> {
  if (!receiverRow.acct_number || !receiverRow.bank_name) return null;

  const [results]: any = await conn.query(
    "SELECT id FROM receivers WHERE bank_account = ? AND bank_name = ? LIMIT 1",
    [receiverRow.acct_number, receiverRow.bank_name],
  );

  if (results.length > 0) {
    return results[0].id;
  }

  const user = {
    bank_name: receiverRow.bank_name,
    bank_account: receiverRow.acct_number,
    account_name: receiverRow.receiver_name ?? null,
    phone: receiverRow.receiver_phoneNumber ?? null,
    is_vendor: receiverRow.is_vendor ?? false,
  };

  const [insertResult]: any = await conn.query(
    "INSERT INTO receivers SET ?",
    user,
  );

  return insertResult.insertId;
}

// ✅ Insert TRANSFER
// export async function insertTransfer(
//   transferDetails: TransferRow,
//   receiverId: number,
//   payerId: number,
// ): Promise<number> {
//   const clean = (val: string) => Number(val?.replace(/[^0-9.]/g, "") || 0);

//   const date = new Date(transferDetails.Date);

//   const amountMatch = transferDetails.charges?.match(/\d+(\.\d+)?/);
//   const chargeAmount = amountMatch ? Number(amountMatch[0]) : 0;

//   const transfer = {
//     crypto: transferDetails.crypto,
//     network: transferDetails.network,
//     estimate_asset: transferDetails.estimation,
//     estimate_amount: clean(transferDetails.Amount),
//     amount_payable: clean(transferDetails.receiver_amount),
//     charges: chargeAmount,
//     crypto_amount: clean(transferDetails.crypto_sent),
//     date: date,
//     receiver_id: receiverId,
//     transfer_id: transferDetails.transac_id,
//     payer_id: payerId,
//     current_rate: clean(transferDetails.current_rate),
//     merchant_rate: clean(transferDetails.merchant_rate),
//     profit_rate: clean(transferDetails.profit_rate),
//   };

//   const [insertResult]: any = await connection.query(
//     "INSERT INTO transfers SET ?",
//     transfer,
//   );

//   return insertResult.insertId;
// }
export async function insertTransfer(
  conn: mysql.Connection,
  transferDetails: TransferRow,
  receiverId: number,
  payerId: number,
): Promise<number> {
  const clean = (val: string) => Number(val?.replace(/[^0-9.]/g, "") || 0);

  const date = new Date(transferDetails.Date);

  const amountMatch = transferDetails.charges?.match(/\d+(\.\d+)?/);
  const chargeAmount = amountMatch ? Number(amountMatch[0]) : 0;

  const transfer = {
    crypto: transferDetails.crypto,
    network: transferDetails.network,
    estimate_asset: transferDetails.estimation,
    estimate_amount: clean(transferDetails.Amount),
    amount_payable: clean(transferDetails.receiver_amount),
    charges: chargeAmount,
    crypto_amount: clean(transferDetails.crypto_sent),
    date,
    receiver_id: receiverId,
    transfer_id: transferDetails.transac_id,
    payer_id: payerId,
    current_rate: clean(transferDetails.current_rate),
    merchant_rate: clean(transferDetails.merchant_rate),
    profit_rate: clean(transferDetails.profit_rate),
  };

  const [insertResult]: any = await conn.query(
    "INSERT INTO transfers SET ?",
    transfer,
  );

  return insertResult.insertId;
}

// ✅ Insert SUMMARY
// export async function insertSummary(
//   row: SummaryRow,
//   transactionId: number,
//   transaction_type: string,
// ) {
//   const clean = (val: string) => Number(val?.replace(/[^0-9.]/g, "") || 0);

//   const naira = clean(row.receiver_amount);
//   const rate = clean(row.current_rate);
//   const dollarAmount = rate ? naira / rate : 0;

//   const summary = {
//     status: row.status,
//     transaction_type,
//     total_dollar: dollarAmount,
//     total_naira: naira,
//     transaction_id: transactionId,
//   };

//   await connection.query("INSERT INTO summaries SET ?", summary);
// }
export async function insertSummary(
  conn: mysql.Connection,
  row: SummaryRow,
  transactionId: number,
  transaction_type: string,
): Promise<void> {
  const clean = (val: string) => Number(val?.replace(/[^0-9.]/g, "") || 0);

  const naira = clean(row.receiver_amount);
  const rate = clean(row.current_rate);
  const dollarAmount = rate ? naira / rate : 0;

  const summary = {
    status: row.status,
    transaction_type,
    total_dollar: dollarAmount,
    total_naira: naira,
    transaction_id: transactionId,
  };

  await conn.query("INSERT INTO summaries SET ?", summary);
}
