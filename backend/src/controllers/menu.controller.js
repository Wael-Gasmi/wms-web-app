import prisma from "../db/prisma.js";

export const addMenu = async (req, res) => {
  try {
    const { name, description, sessions } = req.body;

    if (!name) {
      return res.status(400).json({ error: "Menu name is required" });
    }

    const menu = await prisma.menu.create({
      data: {
        ...(name !== undefined && { name }),
        ...(description !== undefined && { description }),
        ...(sessions !== undefined && {
          sessions: {
            connect: sessions.map((session) => ({ id: session.id })),
          },
        }),
      },
    });

    return res.status(201).json(menu);
  } catch (error) {
    return res.status(500).json({ error: "Internal Server Error" });
  }
};
export const getMenus = async (req, res) => {
  try {
    const menus = await prisma.menu.findMany();
    return res.status(200).json(menus);
  } catch (error) {
    return res.status(500).json({ error: "Internal Server Error" });
  }
};
export const getMenuById = async (req, res) => {
  try {
    const { id } = req.params;
    const menu = await prisma.menu.findUnique({ where: { id } });

    if (!menu) {
      return res.status(404).json({ error: "Menu not found" });
    }

    return res.status(200).json(menu);
  } catch (error) {
    return res.status(500).json({ error: "Internal Server Error" });
  }
};
export const updateMenu = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, des } = req.body;

    const updatedMenu = await prisma.menu.update({
      where: { id },
      data: {
        name,
        description: des,
      },
    });

    return res.status(200).json(updatedMenu);
  } catch (error) {
    return res.status(500).json({ error: "Internal Server Error" });
  }
};
export const deleteMenu = async (req, res) => {
  try {
    const { id } = req.params;

    await prisma.menu.delete({ where: { id } });
    return res.status(200).json({ message: "Menu deleted successfully" });
  } catch (error) {
    return res.status(500).json({ error: "Internal Server Error" });
  }
};
