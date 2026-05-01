const { PrismaPg } = require("@prisma/adapter-pg");
const { PrismaClient } = require("@prisma/client");
const { config } = require("dotenv");
const { Pool } = require("pg");

config({ path: ".env.local" });
config();

const orderId = process.argv[2];

async function main() {
  const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
  });

  const prisma = new PrismaClient({
    adapter: new PrismaPg(pool),
    log: ["error"],
  });

  try {
    const order = orderId
      ? await prisma.order.findUnique({
          where: { id: orderId },
          select: { id: true },
        })
      : await prisma.order.findFirst({
          where: { status: { not: "PAID" } },
          orderBy: { createdAt: "desc" },
          select: { id: true },
        });

    if (!order) {
      throw new Error(
        orderId
          ? `Pedido ${orderId} não encontrado.`
          : 'Nenhum pedido com status diferente de "PAID" encontrado.'
      );
    }

    const updatedOrder = await prisma.order.update({
      where: { id: order.id },
      data: {
        status: "PAID",
        paidAt: new Date(),
      },
      select: { id: true },
    });

    console.log(`orderId: ${updatedOrder.id}`);
    console.log(`url: /checkout/confirmacao/${updatedOrder.id}`);
  } finally {
    await prisma.$disconnect();
    await pool.end();
  }
}

main().catch((error) => {
  console.error(error.message);
  process.exit(1);
});
