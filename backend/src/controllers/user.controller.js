import prisma from "../db/prisma.js";
import bcryptjs from "bcryptjs";

export const addUser = async (req, res) => {
  const { firstName, lastName, email, password, ...rest } = req.body;
  if (!firstName || !lastName || !email || !password)
    return res.status(400).json({ error: "Please fill in all fields" });

  try {
    const hashedPassword = await bcryptjs.hash(password, 10);
    const user = await prisma.user.create({
      data: { firstName, lastName, email, password: hashedPassword, ...rest },
    });
    res.status(201).json(user);
  } catch {
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const getUsers = async (req, res) => {
  try {
    const users = await prisma.user.findMany({
      include: {
        role: true,
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
    } = req.body;

    if (!firstName || !lastName || !email) {
      return res.status(400).json({ error: "Please fill in all fields" });
    }

    const user = await prisma.user.findUnique({ where: { id } });

    if (!user) return res.status(404).json({ error: "User not found" });

    const salt = await bcryptjs.genSalt(10);
    const hashedPassword = await bcryptjs.hash(password, salt);

    const updatedUser = await prisma.user.update({
      where: { id },
      data: {
        ...(firstName != undefined && { firstName }),
        ...(lastName != undefined && { lastName }),
        ...(email != undefined && { email }),
        ...(phoneNumber != undefined && { phoneNumber }),
        ...(gender != undefined && { gender }),
        ...(address != undefined && { address }),
        ...(profilePicture != undefined && { profilePicture }),
        ...(dateOfBirth != undefined && { dateOfBirth }),
        ...(roleId != undefined && { roleId }),
      },
    });
    res.status(200).json(updatedUser);
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
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
