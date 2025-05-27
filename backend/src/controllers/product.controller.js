import { odooLogin } from "../db/connectToOdoo.js";
import dotenv from "dotenv";
import axios from "axios";

dotenv.config();

const ODOO_URL = process.env.ODOO_URL;
const DB = process.env.ODOO_DATABASE;
const PASSWORD = process.env.ODOO_PASSWORD;

const uid = await odooLogin();
if (!uid) throw new Error("Failed to authenticate with Odoo");

export const addProduct = async (req, res) => {
  const { name, list_price, default_code, standard_price, barcode } = req.body;

  if (!name || list_price == null || standard_price == null) {
    return res.status(400).json({ error: "Missing required product fields." });
  }

  try {
    const productData = {
      name,
      list_price,
      standard_price,
      default_code: default_code || null,
      barcode: barcode || null,
    };

    const product = await axios.post(`${process.env.ODOO_URL}/jsonrpc`, {
      jsonrpc: "2.0",
      method: "call",
      params: {
        service: "object",
        method: "execute_kw",
        args: [
          process.env.ODOO_DATABASE,
          uid,
          process.env.ODOO_PASSWORD,
          "product.template",
          "create",
          [productData],
        ],
      },
      id: 2,
    });

    return res.status(201).json({ id: product.data.result });
  } catch (err) {
    console.error("Odoo Error:", err.message);
    return res.status(500).json({ error: "Something went wrong with Odoo." });
  }
};

export const getProducts = async (req, res) => {
  try {
    const products = await axios.post(`${process.env.ODOO_URL}/jsonrpc`, {
      jsonrpc: "2.0",
      method: "call",
      params: {
        service: "object",
        method: "execute_kw",
        args: [
          process.env.ODOO_DATABASE,
          uid,
          process.env.ODOO_PASSWORD,
          "product.product",
          "search_read",
          [[]],
          {
            fields: [
              "name",
              "list_price",
              "default_code",
              "standard_price",
              "qty_available",
              "virtual_available",
              "barcode",
              "location_id",
            ],
          },
        ],
      },
      id: 1,
    });

    return res.json(products.data.result);
  } catch (err) {
    console.error("Error:", err.message);
    return res.status(500).json({ error: "Something went wrong" });
  }
};

export const getProductById = async (req, res) => {
  const { id } = req.params;

  try {
    const product = await axios.post(`${process.env.ODOO_URL}/jsonrpc`, {
      jsonrpc: "2.0",
      method: "call",
      params: {
        service: "object",
        method: "execute_kw",
        args: [
          process.env.ODOO_DATABASE,
          uid,
          process.env.ODOO_PASSWORD,
          "product.product",
          "search_read",
          [[["id", "=", id]]],
          {
            fields: [
              "name",
              "list_price",
              "default_code",
              "standard_price",
              "qty_available",
              "virtual_available",
            ],
          },
        ],
      },
      id: 1,
    });

    if (product.data.result.length === 0) {
      return res.status(404).json({ error: "Product not found" });
    }

    return res.json(product.data.result[0]);
  } catch (err) {
    console.error("Error:", err.message);
    return res.status(500).json({ error: "Something went wrong" });
  }
};
