import { odooLogin } from "../db/connectToOdoo.js";
import dotenv from "dotenv";
import axios from "axios";

dotenv.config();

const ODOO_URL = process.env.ODOO_URL;
const DB = process.env.ODOO_DATABASE;
const PASSWORD = process.env.ODOO_PASSWORD;

const uid = await odooLogin();
if (!uid) throw new Error("Failed to authenticate with Odoo");

export const getMovements = async (req, res) => {
  try {
    const movements = await axios.post(`${ODOO_URL}/jsonrpc`, {
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
          "search_read",
          [[]],
          {
            fields: [
              "id",
              "name",
              "product_id",
              "location_id",
              "location_dest_id",
              "date",
              "product_uom_qty",
            ],
          },
        ],
      },
      id: 1,
    });

    return res.json(movements.data.result);
  } catch (err) {
    console.error("Error:", err.message);
    return res.status(500).json({ error: "Something went wrong" });
  }
};
