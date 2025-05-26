import { odooLogin } from "../db/connectToOdoo.js";
import dotenv from "dotenv";
import axios from "axios";

dotenv.config();

const ODOO_URL = process.env.ODOO_URL;
const DB = process.env.ODOO_DATABASE;
const PASSWORD = process.env.ODOO_PASSWORD;

const uid = await odooLogin();
if (!uid) throw new Error("Failed to authenticate with Odoo");

export const getLocations = async (req, res) => {
  try {
    const response = await axios.post(`${ODOO_URL}/jsonrpc`, {
      jsonrpc: "2.0",
      method: "call",
      params: {
        service: "object",
        method: "execute_kw",
        args: [
          DB,
          uid,
          PASSWORD,
          "stock.location",
          "search_read",
          [[]],  
          { fields: ["id", "name", "complete_name"] },
        ],
      },
      id: 1,
    });

    const locations = response.data.result || [];
    const locationsUnderWH = locations.filter((loc) =>
      loc.complete_name.startsWith("WH/")
    );

    return res.json(locationsUnderWH);
  } catch (error) {
    console.error("Error fetching all locations:", error);
    return res.status(500).json({ error: "Failed to fetch locations" });
  }
};

export const getLocationById = async (req, res) => {
  try {
    const uid = await odooLogin();
    if (!uid) throw new Error("Failed to authenticate with Odoo");

    const locationId = parseInt(req.params.id, 10);
    if (isNaN(locationId)) {
      return res.status(400).json({ error: "Invalid location ID" });
    }

    const { data } = await axios.post(`${ODOO_URL}/jsonrpc`, {
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
          [[["location_id", "=", locationId]]],
          {
            fields: [
              "id",
              "product_id",
              "product_uom_qty",
              "state",
              "location_id",
            ],
          },
        ],
      },
      id: new Date().getTime(),
    });

    if (!data.result) {
      return res.status(404).json({ error: "No products found in location" });
    }

    return res.json(data.result);
  } catch (error) {
    console.error("Error fetching location by ID:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};
