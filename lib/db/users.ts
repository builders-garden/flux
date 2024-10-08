import { prisma } from "./index";
import { deletePaymentLinksByUser } from "./paymentLinks";
import { deleteProductsByUser } from "./products";
import { deleteTransactionsByUserId } from "./transactions";
import { deleteWebhooksByUserId } from "./webhook";

//Create User entry in DB
export async function createUser(
  address: string,
  email: string,
  smartAccountAddress: string
) {
  try {
    const newUser = await prisma.user.create({
      data: {
        address: address.toLowerCase(),
        email,
        smartAccountAddress,
      },
    });
    return newUser;
  } catch (error) {
    console.error("Error creating user:", error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

//Update User entry in DB
export async function updateUser(
  id: string,
  data: {
    address?: string;
    email?: string;
    smartAccountAddress?: string;
    fullName?: string;
    companyName?: string;
    companyUrl?: string;
    companyImage?: string;
    bankAccountNumber?: string;
    bankAccountBic?: string;
    bankAccountCountry?: string;
    bridgeExternalAccountId?: string | null;
    bridgeCustomerId?: string | null;
    bridgeKycLinkId?: string | null;
  }
) {
  try {
    const updatedUser = await prisma.user.update({
      where: { id },
      data,
    });
    return updatedUser;
  } catch (error) {
    console.error("Error updating user:", error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

export async function getUserWithRelations(userId: string) {
  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        products: true,
        paymentLinks: true,
      },
    });
    return user;
  } catch (error) {
    console.error("Error fetching user with relations:", error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

export async function getUserById(id: string) {
  try {
    const user = await prisma.user.findUnique({
      where: { id },
    });
    return user;
  } catch (error) {
    console.error("Error fetching user:", error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

export async function getUserByAddress(address: string) {
  try {
    const user = await prisma.user.findUnique({
      where: { address },
    });
    return user;
  } catch (error) {
    console.error("Error fetching user by email:", error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

export async function getUserByEmail(email: string) {
  try {
    const user = await prisma.user.findUnique({
      where: { email },
    });
    return user;
  } catch (error) {
    console.error("Error fetching user by email:", error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

export async function getAllUsers(
  page: number = 1,
  pageSize: number = 10,
  orderBy: "asc" | "desc" = "desc"
) {
  try {
    const users = await prisma.user.findMany({
      skip: (page - 1) * pageSize,
      take: pageSize,
      orderBy: {
        createdAt: orderBy,
      },
    });
    return users;
  } catch (error) {
    console.error("Error fetching all users:", error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

export async function searchUsers(searchTerm: string) {
  try {
    const users = await prisma.user.findMany({
      where: {
        OR: [
          { email: { contains: searchTerm, mode: "insensitive" } },
          { address: { contains: searchTerm, mode: "insensitive" } },
          {
            smartAccountAddress: { contains: searchTerm, mode: "insensitive" },
          },
        ],
      },
      include: {
        _count: {
          select: {
            products: true,
            paymentLinks: true,
          },
        },
      },
    });
    return users;
  } catch (error) {
    console.error("Error searching users:", error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

export const deleteUser = async (id: string) => {
  try {
    await Promise.all([
      deleteTransactionsByUserId(id),
      deleteWebhooksByUserId(id),
      deleteProductsByUser(id),
      deletePaymentLinksByUser(id),
    ]);
    await prisma.user.delete({
      where: { id },
    });
  } catch (error) {
    console.error("Error deleting user:", error);
    throw error;
  }
};
