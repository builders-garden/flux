import { prisma } from "./index"

interface PaginationInput {
  limit?: number;
  offset?: number;
}

export async function createCustomer(address: string, userId: string, ens?: string, avatar?: string ) {
  try {
    const newCustomer = await prisma.customer.create({
      data: {
        address: address.toLowerCase(),
        userId,
        ens,
        avatar,
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
    console.error('Error fetching customers:', error);
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
          },
        },
        include: { 
          transactions: {
            take: 2  // Take 2 to check if there's more than 1
          }
        },
        orderBy: { createdAt: 'desc' },
        skip: offset,
        take: limit,
      });

      const firstTimeCustomers = customers.filter(c => c.transactions.length === 1);
      const totalCount = firstTimeCustomers.length;

      return { customers: firstTimeCustomers, totalCount };
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

export async function getCustomerByEns(ens: string) {
    try {
      const customer = await prisma.customer.findUnique({
        where: { ens: ens.toLowerCase() },
      });
      return customer;
    } catch (error) {
      console.error("Error fetching customer:", error);
      throw error;
    }
}