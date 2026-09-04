import { PrismaClient, Role } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

const products = [
  ["iPhone 17 Pro Max", "Apple", 2850000, "iphone-17-pro-max", "iPhone", "The latest Pro Max iPhone with premium performance.", 5, true],
  ["iPhone 16 Pro Max", "Apple", 2350000, "iphone-16-pro-max", "iPhone", "A premium Pro Max iPhone for power users.", 8, true],
  ["iPhone 15 Pro Max", "Apple", 2050000, "iphone-15-pro-max", "iPhone", "Titanium Pro Max with excellent cameras.", 6, false],
  ["Samsung Galaxy S25 Ultra", "Samsung", 1890000, "samsung-s25-ultra", "Samsung", "Flagship Galaxy Ultra smartphone.", 7, true],
  ["Samsung Galaxy S24 Ultra", "Samsung", 1590000, "samsung-s24-ultra", "Samsung", "Powerful Galaxy Ultra with S Pen.", 9, false],
  ["Google Pixel 9 Pro XL", "Google", 1250000, "pixel-9-pro-xl", "Google Pixel", "Google flagship with advanced AI features.", 6, true],
  ["Google Pixel 9 Pro", "Google", 1120000, "pixel-9-pro", "Google Pixel", "Compact Pixel Pro flagship.", 5, false],
  ["iPad Pro M4", "Apple", 1750000, "ipad-pro-m4", "iPad", "Professional iPad powered by Apple silicon.", 4, true]
] as const;

async function main() {
  const adminEmail = process.env.ADMIN_EMAIL || "admin@paultechstore.com";
  const adminPassword = process.env.ADMIN_PASSWORD || "ChangeMeImmediately123!";
  const hash = await bcrypt.hash(adminPassword, 12);

  const admin = await prisma.user.upsert({
    where: { email: adminEmail },
    update: { passwordHash: hash, role: Role.ADMIN },
    create: { name: "PaulTech Admin", email: adminEmail, passwordHash: hash, role: Role.ADMIN }
  });

  const categoryNames = ["iPhone", "Samsung", "Google Pixel", "iPad"];
  const categoryMap: Record<string, string> = {};

  for (const name of categoryNames) {
    const category = await prisma.category.upsert({
      where: { slug: name.toLowerCase().replaceAll(" ", "-") },
      update: {},
      create: { name, slug: name.toLowerCase().replaceAll(" ", "-") }
    });
    categoryMap[name] = category.id;
  }

  for (const [name, brand, price, slug, category, description, stock, featured] of products) {
    await prisma.product.upsert({
      where: { slug },
      update: { price, stock, featured },
      create: {
        name, brand, price, slug, description, stock, featured,
        categoryId: categoryMap[category],
        images: JSON.stringify([`https://images.unsplash.com/photo-1592286927505-2fd3f2a4f4e8?auto=format&fit=crop&w=900&q=80`])
      }
    });
  }

  console.log(`Seeded admin ${admin.email} and ${products.length} products.`);
}

main().finally(() => prisma.$disconnect());
