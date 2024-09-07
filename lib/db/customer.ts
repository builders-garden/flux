import { prisma } from "./index"

interface PaginationInput {
  limit?: number;
  offset?: number;
}

export async function createCustomer(address: string, userId: string) {
  try {
    const newCustomer = await prisma.customer.create({
      data: {
        address: address.toLowerCase(),
        userId,
      },
    });
    return newCustomer;
  } catch (error) {
    console.error("Error creating customer:", error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

export async function getCustomersByUserId(userId: string, { limit = 10, offset = 0 }: PaginationInput = {}) {
  try {
    const customers = await prisma.customer.findMany({
      where: { userId },
      include: { transactions: true },
      skip: offset,
      take: limit,
    });
    const totalCount = await prisma.customer.count({ where: { userId } });
    return { customers, totalCount };
  } catch (error) {
    console.error("Error fetching customers:", error);
    throw error;
  }
}

export async function getRecentCustomers(userId: string, { limit = 10, offset = 0 }: PaginationInput = {}) {
  try {
    const customers = await prisma.customer.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      skip: offset,
      take: limit,
    });
    const totalCount = await prisma.customer.count({ where: { userId } });
    return { customers, totalCount };
  } catch (error) {
    console.error('Error fetching recent customers:', error);
    throw error;
  }
}

export async function getFirstTimeCustomers(userId: string, { limit = 10, offset = 0 }: PaginationInput = {}) {
  try {
    const customers = await prisma.customer.findMany({
      where: {
        userId,
        transactions: {
          some: {},
          every: { id: { equals: prisma.transaction.fields.id } }
        }
      },
      include: { transactions: true },
      skip: offset,
      take: limit,
    });
    const totalCount = await prisma.customer.count({
      where: {
        userId,
        transactions: {
          some: {},
          every: { id: { equals: prisma.transaction.fields.id } }
        }
      }
    });
    return { customers, totalCount };
  } catch (error) {
    console.error('Error fetching first-time customers:', error);
    throw error;
  }
}

export async function getTopCustomers(userId: string, { limit = 10, offset = 0 }: PaginationInput = {}) {
  try {
    const customers = await prisma.customer.findMany({
      where: { userId },
      include: {
        transactions: true,
        _count: {
          select: { transactions: true }
        }
      },
      orderBy: {
        transactions: {
          _count: 'desc'
        }
      },
      skip: offset,
      take: limit,
    });
    const totalCount = await prisma.customer.count({ where: { userId } });
    return { customers, totalCount };
  } catch (error) {
    console.error('Error fetching top customers:', error);
    throw error;
  }
}

export async function getCustomerByAddress(address: string) {
    try {
      const customer = await prisma.customer.findUnique({
        where: { address: address.toLowerCase() },
      });
      return customer;
    } catch (error) {
      console.error("Error fetching customer:", error);
      throw error;
    }
  }