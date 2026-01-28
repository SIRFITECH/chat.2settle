import pool from "@/lib/mysql";
import { useBankStore } from "stores/bankStore";
import { usePaymentStore } from "stores/paymentStore";
import { useUserStore } from "stores/userStore";
import {
  getOrCreatePayer,
  getOrCreateReceiver,
  insertSummary,
  insertTransfer,
  SummaryRow,
  TransferRow,
} from "../../transactionService";

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
  try {
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

    await connection.commit();
    return transferId;
  } catch (err) {
    await connection.rollback();
    throw err;
  }
};
