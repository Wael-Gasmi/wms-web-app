import prisma from "../db/prisma.js";

export const addRole = async (req, res) => {
  try {
    const { name } = req.body;

    if (!name) {
      return res.status(400).json({ error: "Role name is required" });
    }

    const role = await prisma.role.create({
      data: {
        name,
      },
    });

    return res.status(201).json(role);
  } catch (error) {
    return res.status(500).json({ error: "Internal Server Error" });
  }
};
export const getRoles = async (req, res) => {
  try {
    const roles = await prisma.role.findMany();
    return res.status(200).json(roles);
  } catch (error) {
    return res.status(500).json({ error: "Internal Server Error" });
  }
};
export const getRoleById = async (req, res) => {
  try {
    const { id } = req.params;

    const role = await prisma.role.findUnique({
      where: { id },
    });

    if (!role) {
      return res.status(404).json({ error: "Role not found" });
    }

    return res.status(200).json(role);
  } catch (error) {
    return res.status(500).json({ error: "Internal Server Error" });
  }
};
export const updateRole = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description } = req.body;

    if (!name) {
      return res.status(400).json({ error: "Role name is required" });
    }

    const updatedRole = await prisma.role.update({
      where: { id },
      data: {
        ...(name != undefined && { name }),
        ...(description != undefined && { description }),
      },
    });

    return res.status(200).json(updatedRole);
  } catch (error) {
    return res.status(500).json({ error: "Internal Server Error" });
  }
};
export const deleteRole = async (req, res) => {
  try {
    const { id } = req.params;

    const role = await prisma.role.findUnique({
      where: { id },
    });

    if (!role) {
      return res.status(404).json({ error: "Role not found" });
    }

    await prisma.role.delete({
      where: { id },
    });

    return res.status(200).json({ message: "Role deleted successfully" });
  } catch (error) {
    return res.status(500).json({ error: "Internal Server Error" });
  }
};
