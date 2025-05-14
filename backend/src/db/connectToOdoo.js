import dotenv from "dotenv";
import axios from "axios";

dotenv.config();

const ODOO_URL = process.env.ODOO_URL;
const DB = process.env.ODOO_DATABASE;
const USER = process.env.ODOO_USERNAME;
const PASSWORD = process.env.ODOO_PASSWORD;

export async function odooLogin() {
  try {
    const response = await axios.post(`${ODOO_URL}/jsonrpc`, {
      jsonrpc: "2.0",
      method: "call",
      params: {
        service: "common",
        method: "login",
        args: [DB, USER, PASSWORD],
      },
      id: 1,
    });

    return response.data.result;
  } catch (error) {
    console.error("Error logging in to Odoo:", error.message);
    throw new Error("Odoo login failed");
  }
}
