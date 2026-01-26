
import connection from "@/lib/mysql";
export async function getOrCreatePayer(row: any): Promise<number> {
      const [results]: any = await connection.query(
        "SELECT id FROM payers WHERE chat_id = ? OR phone = ? LIMIT 1",
        [row.chat_id, row.customer_phoneNumber]
      );

      if (results.length > 0) {
        return results[0].id;
      }

      const user = {
        chat_id: row.chat_id,
        phone: row.customer_phoneNumber,
      };

      const [insertResult]: any = await connection.query(
        "INSERT INTO payers SET ?",
        user
      );

      return insertResult.insertId;
    }

    // ✅ Get or Create RECEIVER
 export   async function getOrCreateReceiver(row: any): Promise<number | null> {
      const [results]: any = await connection.query(
        "SELECT id FROM receivers WHERE bank_account = ? AND bank_name = ? LIMIT 1",
        [row.acct_number, row.bank_name]
      );

      if (results.length > 0) {
        return results[0].id;
      }

      if (!row.acct_number || !row.bank_name) return null;

      const user = {
        bank_name: row.bank_name,
        bank_account: row.acct_number,
        account_name: row.receiver_name,
        phone: row.receiver_phoneNumber,
        is_vendor: false,
      };

      const [insertResult]: any = await connection.query(
        "INSERT INTO receivers SET ?",
        user
      );

      return insertResult.insertId;
    }

    // ✅ Insert TRANSFER
 export   async function insertTransfer(
      row: any,
      receiverId: number,
      payerId: number
    ): Promise<number> {
      const clean = (val: string) => Number(val?.replace(/[^0-9.]/g, "") || 0);

      const date = new Date(row.Date);

      const amountMatch = row.charges?.match(/\d+(\.\d+)?/);
      const chargeAmount = amountMatch ? Number(amountMatch[0]) : 0;

      const transfer = {
        crypto: row.crypto,
        network: row.network,
        estimate_asset: row.estimation,
        estimate_amount: clean(row.Amount),
        amount_payable: clean(row.receiver_amount),
        charges: chargeAmount,
        crypto_amount: clean(row.crypto_sent),
        date: date,
        receiver_id: receiverId,
        transfer_id: row.transac_id,
        payer_id: payerId,
        current_rate: clean(row.current_rate),
        merchant_rate: clean(row.merchant_rate),
        profit_rate: clean(row.profit_rate),
      };

      const [insertResult]: any = await connection.query(
        "INSERT INTO transfers SET ?",
        transfer
      );

      return insertResult.insertId;
    }

    // ✅ Insert SUMMARY
 export   async function insertSummary(
      row: any,
      transactionId: number,
      transaction_type: string
    ) {
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

      await connection.query("INSERT INTO summaries SET ?", summary);
    }