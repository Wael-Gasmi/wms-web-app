import prisma from "../db/prisma.js";
import bcryptjs from "bcryptjs";
import dotenv from "dotenv";
import { odooLogin } from "../db/connectToOdoo.js";
import axios from "axios";

dotenv.config();

const ODOO_URL = process.env.ODOO_URL;
const DB = process.env.ODOO_DATABASE;
const PASSWORD = process.env.ODOO_PASSWORD;

export async function createOdooUser({ email, name }) {
  const uid = await odooLogin();

  const createUser = {
    jsonrpc: "2.0",
    method: "call",
    params: {
      service: "object",
      method: "execute_kw",
      args: [
        DB,
        uid,
        PASSWORD,
        "res.users",
        "create",
        [
          {
            name,
            login: email,
            email,
          },
        ],
      ],
    },
    id: 2,
  };

  const response = await axios.post(`${ODOO_URL}/jsonrpc`, createUser);
  if (response.data.error) throw new Error(response.data.error.message);
  return response.data.result;
}

export const addUser = async (req, res) => {
  const { firstName, lastName, email, password, dateOfBirth, ...rest } =
    req.body;

  let dob = undefined;
  if (dateOfBirth) {
    dob = new Date(dateOfBirth).toISOString();
  }

  if (!firstName || !lastName || !email || !password)
    return res.status(400).json({ error: "Please fill in all fields" });

  try {
    const hashedPassword = await bcryptjs.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        firstName,
        lastName,
        email,
        password: hashedPassword,
        dateOfBirth: dob,
        ...rest,
      },
    });

    const odooUser = await createOdooUser({
      email,
      name: `${firstName} ${lastName}`,
      password,
    });

    console.log("✅ All done:", { user, odooUser });
    res.status(201).json(user);
  } catch (error) {
    console.error("🚨 User creation error:", error);
    res.status(500).json({ error: error.message || "Internal Server Error" });
  }
};

export const resetPassword = async (req, res) => {
  const { id } = req.params;
  const { userData } = req.body;
  const { password } = userData;

  if (!password) {
    return res.status(400).json({ error: "Password is required" });
  }

  try {
    const user = await prisma.user.findUnique({
      where: { id },
    });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const hashedPassword = await bcryptjs.hash(password, 10);

    const updatedUser = await prisma.user.update({
      where: { id },
      data: { password: hashedPassword },
    });

    res.status(200).json(updatedUser);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const getUsers = async (req, res) => {
  try {
    const users = await prisma.user.findMany({
      include: {
        role: true,
        menu: true,
      },
    });
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
};
export const getUserById = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await prisma.user.findUnique({
      where: { id },
      include: {
        role: true,
        menu: true,
      },
    });
    if (!user) return res.status(404).json({ error: "User not found" });
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
};
export const updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      firstName,
      lastName,
      email,
      phoneNumber,
      gender,
      address,
      profilePicture,
      dateOfBirth,
      roleId,
      menuId,
    } = req.body;

    const user = await prisma.user.findUnique({ where: { id } });
    if (!user) return res.status(404).json({ error: "User not found" });

    let dob = undefined;
    if (dateOfBirth) {
      const parsedDate = new Date(dateOfBirth);
      if (!isNaN(parsedDate.getTime())) {
        dob = parsedDate.toISOString();
      } else {
        return res.status(400).json({ error: "Invalid dateOfBirth format" });
      }
    }

    const updateData = {
      ...(firstName !== undefined && { firstName }),
      ...(lastName !== undefined && { lastName }),
      ...(email !== undefined && { email }),
      ...(phoneNumber !== undefined && { phoneNumber }),
      ...(gender !== undefined && { gender }),
      ...(address !== undefined && { address }),
      ...(profilePicture !== undefined && { profilePicture }),
      ...(dob && { dateOfBirth: dob }),
      ...(roleId !== undefined && roleId !== "" && { roleId }),
      ...(menuId !== undefined && menuId !== "" && { menuId }),
    };

    const updatedUser = await prisma.user.update({
      where: { id },
      data: updateData,
    });

    res.status(200).json(updatedUser);
  } catch (error) {
    res.status(500).json({ error: error.message || "Internal Server Error" });
  }
};

export const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await prisma.user.findUnique({ where: { id } });

    if (!user) return res.status(404).json({ error: "User not found" });

    await prisma.user.delete({ where: { id } });
    res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
};
