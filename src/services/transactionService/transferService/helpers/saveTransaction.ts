import { useBankStore } from "stores/bankStore";
import { usePaymentStore } from "stores/paymentStore";
import { useUserStore } from "stores/userStore";
import {
  getOrCreatePayer,
  getOrCreateReceiver,
  insertGift,
  insertSummary,
  insertTransfer,
  SummaryRow,
  TransferRow,
} from "../../transactionService";
import pool from "@/lib/mysql";

export const saveTransferTransaction = async (transferObj: TransferRow) => {
  const connection = await pool.getConnection();
  const paymentStore = usePaymentStore.getState();
  const { user } = useUserStore.getState();
  const { bankData } = useBankStore.getState();

  // const transferObj: TransferRow = {};
  const summaryObj: SummaryRow = {};
  // PAYER
  //  customer_phoneNumber
  // chat_id

  await connection.beginTransaction();
  const payerId = await getOrCreatePayer(connection!, {
    customer_phoneNumber: user?.phone || "",
    chat_id: user?.chatId || "",
  });

  // RECEIVER
  // bank name
  // account number
  // account name
  // phone number

  const receiverId = await getOrCreateReceiver(connection!, {
    bank_name: bankData.bank_name,
    acct_number: bankData.acct_number,
    receiver_name: bankData.receiver_name,
    receiver_phoneNumber: user?.phone || "",
  });

  // TRANSFER
  // crypto
  // network
  // estimate_asset
  // amount_payable
  // crypto_amount
  // charges
  // date
  // transfer_id
  // receiver_id
  // payer_id
  // current_rate
  // merchant_rate
  // profit_rate
  // estimate_amount
  // wallet_address
  // status

  const transferId = await insertTransfer(
    connection!,
    transferObj,
    receiverId!,
    payerId,
  );

  await insertSummary(connection!, summaryObj, transferId, "transfer");

  //SUMMARY
  // transaction_type
  //total_dollar
  // transaction_id
  //total_naira
  // effort
  // merchant_id
  // ref_code
  // asset_price
  // status
  try {
    await connection.commit();
    return transferId;
  } catch (err) {
    await connection.rollback();
    throw err;
  }
};

// export const saveGiftTransaction = async () => {
//   // GIFT
//   // gift_id
//   // crypto
//   // network
//   // estimate_asset
//   // estimate_amount
//   // amount_payable
//   // charges
//   // crypto_amount
//   // date
//   // receiver_id
//   // gift_status
//   // payer_id
//   // current_rate
//   // merchant_rate
//   // profit_rate
//   // wallet_address
//   // status
//   const connection = await pool.getConnection();
//   await connection.beginTransaction();

//   try {
//     const payerId = await getOrCreatePayer(connection, payerRow);
//     const receiverId = await getOrCreateReceiver(connection, receiverRow);

//     const giftId = await insertGift(
//       connection,
//       giftDetails,
//       receiverId,
//       payerId,
//     );

//     await insertSummary(
//       connection,
//       {
//         status: giftDetails.status!,
//         receiver_amount: giftDetails.amount_payable!,
//         current_rate: giftDetails.current_rate!,
//       },
//       giftId,
//       "gift",
//     );

//     await connection.commit();
//     return giftId;
//   } catch (err) {
//     await connection.rollback();
//     throw err;
//   }
// };

// // export const saveGiftTransaction = async (
// //   conn: mysql.Connection,
// //   giftDetails: GiftRow,
// //   payerRow: PayerRow,
// //   receiverRow: ReceiverRow,
// // ) => {
// //   await conn.beginTransaction();

// //   try {
// //     const payerId = await getOrCreatePayer(conn, payerRow);
// //     const receiverId = await getOrCreateReceiver(conn, receiverRow);

// //     const giftId = await insertGift(conn, giftDetails, receiverId, payerId);

// //     await insertSummary(
// //       conn,
// //       {
// //         status: giftDetails.status!,
// //         receiver_amount: giftDetails.amount_payable!,
// //         current_rate: giftDetails.current_rate!,
// //       },
// //       giftId,
// //       "gift",
// //     );

// //     await conn.commit();
// //     return giftId;
// //   } catch (err) {
// //     await conn.rollback();
// //     throw err;
// //   }
// // };

// export const saveRequestTransaction = async () => {
//   // REQUEST
//   // request_id
//   // request_status
//   // crypto
//   // network
//   // estimate_asset
//   // estimate_amount
//   // amount_payable
//   // charges
//   // crypto_amount
//   // date
//   // receiver_id
//   // payer_id
//   // current_rate
//   // merchant_rate
//   // profit_rate
//   // wallet_address
//   // status
// };

// export const saveRequestTransaction = async (
//   conn: mysql.Connection,
//   requestDetails: RequestRow,
//   payerRow: PayerRow,
//   receiverRow: ReceiverRow,
// ) => {
//   await conn.beginTransaction();

//   try {
//     const payerId = await getOrCreatePayer(conn, payerRow);
//     const receiverId = await getOrCreateReceiver(conn, receiverRow);

//     const requestId = await insertRequest(
//       conn,
//       requestDetails,
//       receiverId,
//       payerId,
//     );

//     await insertSummary(
//       conn,
//       {
//         status: requestDetails.status!,
//         receiver_amount: requestDetails.amount_payable!,
//         current_rate: requestDetails.current_rate!,
//       },
//       requestId,
//       "request",
//     );

//     await conn.commit();
//     return requestId;
//   } catch (err) {
//     await conn.rollback();
//     throw err;
//   }
// };

// export const updateRequestTransaction = async () => {
//   // TO BE IMPLEMENTED
// };

// export const updateRequestTransaction = async (
//   conn: mysql.Connection,
//   requestId: number,
//   status: string,
// ) => {
//   await conn.beginTransaction();

//   try {
//     await conn.query("UPDATE requests SET status = ? WHERE id = ?", [
//       status,
//       requestId,
//     ]);

//     await conn.query(
//       `UPDATE summaries
//        SET status = ?
//        WHERE transaction_id = ?
//          AND transaction_type = 'request'`,
//       [status, requestId],
//     );

//     await conn.commit();
//   } catch (err) {
//     await conn.rollback();
//     throw err;
//   }
// };
