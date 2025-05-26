import { odooLogin } from "../db/connectToOdoo.js";
import dotenv from "dotenv";
import axios from "axios";
import fs from "fs";

dotenv.config();

const ODOO_URL = process.env.ODOO_URL;
const DB = process.env.ODOO_DATABASE;
const PASSWORD = process.env.ODOO_PASSWORD;

const uid = await odooLogin();
if (!uid) throw new Error("Failed to authenticate with Odoo");

export const getReceipts = async (req, res) => {
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
          [[["picking_type_code", "=", "incoming"]]],
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

export const getReceiptById = async (req, res) => {
  try {
    const { id } = req.params;
    const receiptId = parseInt(id, 10);

    if (isNaN(receiptId)) {
      return res.status(400).json({ error: "Invalid receipt ID" });
    }

    const uid = await odooLogin();
    if (!uid) {
      return res.status(500).json({ error: "Failed to login to Odoo" });
    }

    const { data } = await axios.post(`${process.env.ODOO_URL}/jsonrpc`, {
      jsonrpc: "2.0",
      method: "call",
      params: {
        service: "object",
        method: "execute_kw",
        args: [
          process.env.ODOO_DATABASE,
          uid,
          process.env.ODOO_PASSWORD,
          "stock.move",
          "search_read",
          [[["picking_id", "=", receiptId]]],
          {
            fields: ["product_id", "product_uom_qty"],
          },
        ],
      },
      id: 1,
    });

    const result = data?.result;

    if (!result || result.length === 0) {
      return res.status(404).json({ error: "Receipt not found" });
    }

    return res.status(200).json(result);
  } catch (error) {
    console.error("Error fetching receipt:", error);

    const status = error?.response?.status || 500;
    const message =
      error?.response?.data?.error || error?.message || "Internal server error";

    return res.status(status).json({ error: message });
  }
};

export const downloadReceiptPdf = async (req, res) => {
  const { id } = req.params;

  try {
    const pdfResponse = await axios.post(
      `${process.env.ODOO_URL}/report/pdf/stock.report_picking/${id}`,
      {},
      {
        auth: {
          username: process.env.ODOO_USERNAME,
          password: process.env.ODOO_PASSWORD,
        },
        responseType: "arraybuffer",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/pdf",
        },
      }
    );

    fs.writeFileSync(`./receipt_${id}.pdf`, Buffer.from(pdfResponse.data));

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename=receipt_${id}.pdf`
    );
    res.setHeader("Content-Transfer-Encoding", "binary");
    res.end(Buffer.from(pdfResponse.data), "binary");
  } catch (err) {
    console.error("PDF Download Error:", err.message);
    res.status(500).json({ error: "Failed to download PDF" });
  }
};
