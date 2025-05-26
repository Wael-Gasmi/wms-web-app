import { odooLogin } from "../db/connectToOdoo.js";
import dotenv from "dotenv";
import axios from "axios";

dotenv.config();

const ODOO_URL = process.env.ODOO_URL;
const DB = process.env.ODOO_DATABASE;
const PASSWORD = process.env.ODOO_PASSWORD;

const uid = await odooLogin();
if (!uid) throw new Error("Failed to authenticate with Odoo");

export const getDeliveries = async (req, res) => {
  try {
    const response = await axios.post(`${process.env.ODOO_URL}/jsonrpc`, {
      jsonrpc: "2.0",
      method: "call",
      params: {
        service: "object",
        method: "execute_kw",
        args: [
          process.env.ODOO_DATABASE,
          uid,
          process.env.ODOO_PASSWORD,
          "stock.picking",
          "search_read",
          [[["picking_type_code", "=", "outgoing"]]],
          {
            fields: ["id", "name", "state", "partner_id", "scheduled_date"],
          },
        ],
      },
      id: 1,
    });

    const receipts = response.data.result.map((receipt) => {
      const [partnerId, partnerName] = receipt.partner_id || [];
      return {
        ...receipt,
        partner_id: partnerId ? { id: partnerId, name: partnerName } : null,
      };
    });

    return res.json(receipts);
  } catch (err) {
    console.error("Error:", err.message);
    return res.status(500).json({ error: "Something went wrong" });
  }
};