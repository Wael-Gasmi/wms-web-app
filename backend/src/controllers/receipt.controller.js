import { odooLogin } from "../db/connectToOdoo.js";
import dotenv from "dotenv";
import axios from "axios";

dotenv.config();

const ODOO_URL = process.env.ODOO_URL;
const DB = process.env.ODOO_DATABASE;
const PASSWORD = process.env.ODOO_PASSWORD;

const uid = await odooLogin();
if (!uid) throw new Error("Failed to authenticate with Odoo");

export const getReceipts = async (req, res) => {
  try {
    const receipts = await axios.post(`${process.env.ODOO_URL}/jsonrpc`, {
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
          [[]],
          {
            fields: ["name", "state", "partner_id"],
          },
        ],
      },
      id: 1,
    });

    return res.json(receipts.data.result);
  } catch (err) {
    console.error("Error:", err.message);
    return res.status(500).json({ error: "Something went wrong" });
  }
};

export const getReceiptById = async (req, res) => {
  const receiptName = "WH/IN/00001";

  try {
    const { data: receiptRes } = await axios.post(`${ODOO_URL}/jsonrpc`, {
      jsonrpc: "2.0",
      method: "call",
      params: {
        service: "object",
        method: "execute_kw",
        args: [
          DB,
          uid,
          PASSWORD,
          "stock.picking",
          "search_read",
          [[["name", "=", receiptName]]],
          { fields: ["move_lines", "move_ids_without_package"] },
        ],
      },
      id: 1,
    });

    const receipt = receiptRes.result[0];
    console.log("Receipt:", JSON.stringify(receipt, null, 2));

    if (!receipt) {
      return res.status(404).json({ error: "Receipt not found" });
    }

    const moveLineIds = receipt.move_ids_without_package.length
      ? receipt.move_ids_without_package
      : receipt.move_lines;

    if (!moveLineIds || moveLineIds.length === 0) {
      return res.json([]);
    }

    const { data: moveRes } = await axios.post(`${ODOO_URL}/jsonrpc`, {
      jsonrpc: "2.0",
      method: "call",
      params: {
        service: "object",
        method: "execute_kw",
        args: [
          DB,
          uid,
          PASSWORD,
          "stock.move",
          "read",
          moveLineIds,
          ["product_id", "product_uom_qty", "quantity_done"],
        ],
      },
      id: 2,
    });

    res.json(moveRes.result);
  } catch (err) {
    console.error(err.response?.data || err.message);
    res.status(500).json({ error: "Error fetching receipt products" });
  }
};
