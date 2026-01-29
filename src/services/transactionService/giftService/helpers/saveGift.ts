import pool from "@/lib/mysql";
import { useUserStore } from "stores/userStore";
import {
  getOrCreatePayer,
  GiftRow,
  insertGift,
  insertSummary,
} from "../../transactionService";
import { generateTransactionId } from "@/utils/utilities";

export const saveGiftTransaction = async (giftObj: GiftRow) => {
  // GIFT
  // gift_id
  // crypto
  // network
  // estimate_asset
  // estimate_amount
  // amount_payable
  // charges
  // crypto_amount
  // date
  // receiver_id
  // gift_status
  // payer_id
  // current_rate
  // merchant_rate
  // profit_rate
  // wallet_address
  // status

  const { payer, summary } = giftObj;

  if (!payer) {
    throw new Error("Payer is required");
  }

  const connection = await pool.getConnection();
  await connection.beginTransaction();

  try {
    const payerId = await getOrCreatePayer(connection!, payer);

    if (!payerId) {
      throw new Error("Invalid payer details");
    }

    const giftId = await insertGift(connection, giftObj, payerId);
    const transactionId = generateTransactionId();

    await insertSummary(connection, summary!, transactionId, "gift");

    await connection.commit();
    return giftId;
  } catch (err) {
    await connection.rollback();
    throw err;
  }
};

// export const saveTransferTransaction = async (transferObj: TransferRow) => {
//   const connection = await pool.getConnection();

//   const { payer, receiver, summary } = transferObj;

//   if (!payer) {
//     throw new Error("Payer is required");
//   }

//   if (!receiver) {
//     throw new Error("Receiver is required");
//   }

//   try {
//     await connection.beginTransaction();

//     const payerId = await getOrCreatePayer(connection, payer);

//     const receiverId = await getOrCreateReceiver(connection, receiver);

//     if (!receiverId) {
//       throw new Error("Invalid receiver details");
//     }
//     // TRANSFER
//     // crypto
//     // network
//     // estimate_asset
//     // amount_payable
//     // crypto_amount
//     // charges
//     // date
//     // transfer_id
//     // receiver_id
//     // payer_id
//     // current_rate
//     // merchant_rate
//     // profit_rate
//     // estimate_amount
//     // wallet_address
//     // status

//     const transferId = await insertTransfer(
//       connection!,
//       transferObj,
//       receiverId!,
//       payerId,
//     );

//     await insertSummary(connection!, summary!, transferId, "transfer");

//     //SUMMARY
//     // transaction_type
//     //total_dollar
//     // transaction_id
//     //total_naira
//     // effort
//     // merchant_id
//     // ref_code
//     // asset_price

//     await connection.commit();
//     return transferId;
//   } catch (err) {
//     await connection.rollback();
//     throw err;
//   }
// };
