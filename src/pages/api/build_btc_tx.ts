import axios from "axios";
import bitcoin from "bitcoinjs-lib";
import { NextApiRequest, NextApiResponse } from "next";

const NETWORK = bitcoin.networks.testnet; // bitcoin.networks.bitcoin;

interface BuildTxRequest {
  senderAddress: string;
  recipient: string;
  amount: number; // amount in satoshi
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") return res.status(405).end();

  const { senderAddress, recipient, amount } = req.body as BuildTxRequest;

  if (!senderAddress || !recipient || !amount) {
    return res.status(400).json({ error: "All fields required" });
  }

  try {
    const { data: utxos } = await axios.get(
      `https://blockstream.info/testnet/api/address/${senderAddress}/utxo`
      //   `https://blockstream.info/api/address/${senderAddress}/utxo`
    );

    const psbt = new bitcoin.Psbt({ network: NETWORK });

    let totalInput = 0;
    for (const utxo of utxos) {
      psbt.addInput({
        hash: utxo.txid,
        index: utxo.vout,
        witnessUtxo: {
          script: bitcoin.address.toOutputScript(senderAddress, NETWORK),
          value: utxo.value,
        },
      });

      totalInput += utxos.value;

      if (totalInput >= amount + 200) break;
    }

    if (totalInput < amount + 200) {
      return res.status(400).json({ error: "Insufficient balance" });
    }

    psbt.addOutput({ address: recipient, value: amount });

    const change = totalInput - amount - 200;

    if (change > 0) {
      psbt.addOutput({ address: senderAddress, value: change });
    }

    return res.status(200).json({ psbt: psbt.toBase64() });
  } catch (error) {
    console.log("error:", error);
    res.status(500).json({ error: "Transaction build failed" });
  }
}
