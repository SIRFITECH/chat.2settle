import pool from "@/lib/mysql";
import { useBankStore } from "stores/bankStore";
import { useUserStore } from "stores/userStore";
import {
  getOrCreateReceiver,
  insertRequest,
  RequestRow
} from "../../transactionService";


export const saveRequestTransaction = async (requestObj: RequestRow) => {
  // REQUEST
  // request_id
  // request_status
  // crypto
  // network
  // estimate_asset
  // estimate_amount
  // amount_payable
  // charges
  // crypto_amount
  // date
  // receiver_id
  // payer_id
  // current_rate
  // merchant_rate
  // profit_rate
  // wallet_address
  // status

  // RECEIVER
  // bank name
  // account number
  // account name
  // phone number

  const connection = await pool.getConnection();

  const { user } = useUserStore.getState();
  const { bankData } = useBankStore.getState();
  try {
    await connection.beginTransaction();

    const receiverId = await getOrCreateReceiver(connection!, {
      bank_name: bankData.bank_name,
      acct_number: bankData.acct_number,
      receiver_name: bankData.receiver_name,
      receiver_phoneNumber: user?.phone || "",
    });

    const requestId = await insertRequest(connection!, requestObj, receiverId!);

    // const receiverId = await getOrCreateReceiver(connection, receiverRow);

    await connection.commit();
    return requestId;
  } catch (err) {
    await connection.rollback();
    throw err;
  }
};
