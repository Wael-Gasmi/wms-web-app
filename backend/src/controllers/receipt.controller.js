import { odooLogin } from "../db/connectToOdoo.js";
import dotenv from "dotenv";
import axios from "axios";
import fs from "fs";

dotenv.config();

const ODOO_URL = process.env.ODOO_URL;
const DB = process.env.ODOO_DATABASE;
const PASSWORD = process.env.ODOO_PASSWORD;
const USERNAME = process.env.ODOO_USERNAME;

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
  try {
    const { id } = req.params;
    const receiptId = parseInt(id, 10);
    if (isNaN(receiptId))
      return res.status(400).json({ error: "Invalid receipt ID" });

    const uid = await odooLogin();
    if (!uid) return res.status(500).json({ error: "Failed to login to Odoo" });

    // First authenticate via JSON-RPC to get session cookie
    const authResponse = await axios.post(
      `${ODOO_URL}/web/session/authenticate`,
      {
        jsonrpc: "2.0",
        method: "call",
        params: {
          db: DB,
          login: USERNAME,
          password: PASSWORD,
        },
      },
      { withCredentials: true }
    );

    // Extract session cookie for the PDF download
    const cookies = authResponse.headers["set-cookie"];
    if (!cookies) throw new Error("Authentication cookies not received");
    const sessionCookie = cookies.find((c) => c.startsWith("session_id="));
    if (!sessionCookie) throw new Error("Session cookie not found");

    // Use the official Odoo report route to get PDF
    // Replace 'stock.report_picking' with your actual report name if needed
    const pdfResponse = await axios.get(
      `${ODOO_URL}/report/pdf/stock.report_picking/${receiptId}`,
      {
        headers: {
          Cookie: sessionCookie.split(";")[0],
          Accept: "application/pdf",
        },
        responseType: "arraybuffer",
      }
    );

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename=receipt_${receiptId}.pdf`
    );
    return res.send(Buffer.from(pdfResponse.data));
  } catch (error) {
    console.error("Download Receipt PDF Error:", error.message);
    return res.status(500).json({ error: error.message });
  }
};


export const validateReceipt = async (req, res) => {
  const { id } = req.params;
  const receiptId = parseInt(id, 10);

  if (isNaN(receiptId)) {
    return res.status(400).json({ error: "Invalid receipt ID" });
  }

  try {
    const uid = await odooLogin();
    if (!uid) {
      return res.status(500).json({ error: "Failed to login to Odoo" });
    }

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
          "button_validate",
          [[receiptId]],
        ],
      },
      id: 1,
    });

    return res.status(200).json({
      message: "Receipt validated successfully",
      result: response.data.result,
    });
  } catch (error) {
    console.error("Validation Error:", error.message);

    const status = error?.response?.status || 500;
    const message =
      error?.response?.data?.error || error?.message || "Internal server error";

    return res.status(status).json({ error: message });
  }
};
