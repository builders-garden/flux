import { Prisma } from '@prisma/client';
import { prisma } from "./index"

//Create new Product entry in DB
export async function createProduct(
  name: string,
  description: string,
  imageUrl: string,
  price: number,
  userId: string
) {
  try {
    const newProduct = await prisma.product.create({
      data: {
        name,
        description,
        imageUrl,
        price: new Prisma.Decimal(price),
        userId,
      },
    });
    return newProduct;
  } catch (error) {
    console.error('Error creating product:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

//Update new Product entry in DB
export async function updateProduct(
  id: string,
  data: {
    name?: string;
    description?: string;
    imageUrl?: string;
    price?: number;
    userId?: string;
  }
) {
  try {
    const updatedProduct = await prisma.product.update({
      where: { id },
      data: {
        ...data,
        price: data.price ? new Prisma.Decimal(data.price) : undefined,
      },
    });
    return updatedProduct;
  } catch (error) {
    console.error('Error updating product:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

export async function getProductById(id: string) {
  try {
    const product = await prisma.product.findUnique({
      where: { id },
      include: {
        user: true,
        paymentLinks: true,
      },
    });
    return product;
  } catch (error) {
    console.error('Error fetching product:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

export async function getProductsByUser(userId: string) {
  try {
    const products = await prisma.product.findMany({
      where: { userId },
      include: {
        paymentLinks: true,
      },
    });
    return products;
  } catch (error) {
    console.error('Error fetching products by user:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

export async function getAllProducts(
  page: number = 1,
  pageSize: number = 10,
  orderBy: 'asc' | 'desc' = 'desc'
) {
  try {
    const products = await prisma.product.findMany({
      skip: (page - 1) * pageSize,
      take: pageSize,
      orderBy: {
        createdAt: orderBy,
      },
      include: {
        user: true,
      },
    });
    return products;
  } catch (error) {
    console.error('Error fetching all products:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

export async function searchProducts(searchTerm: string) {
  try {
    const products = await prisma.product.findMany({
      where: {
        OR: [
          { name: { contains: searchTerm, mode: 'insensitive' } },
          { description: { contains: searchTerm, mode: 'insensitive' } },
        ],
      },
      include: {
        user: true,
      },
    });
    return products;
  } catch (error) {
    console.error('Error searching products:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

export async function deleteProduct(id: string) {
  try {
    await prisma.product.delete({
      where: { id },
    });
  } catch (error) {
    console.error('Error deleting product:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}
