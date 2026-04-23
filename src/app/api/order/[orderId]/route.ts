import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ orderId: string }> }
) {
  try {
    const { orderId } = await params;

    if (!orderId) {
      return NextResponse.json(
        { message: "ID do pedido não fornecido" },
        { status: 400 }
      );
    }

    // Busca apenas os dados mínimos e não-sensíveis exigidos para o Polling
    const order = await prisma.order.findUnique({
      where: { id: orderId },
      select: {
        status: true,
        paidAt: true,
        offerSource: true,
      },
    });

    if (!order) {
      return NextResponse.json(
        { message: "Pedido não encontrado" },
        { status: 404 }
      );
    }

    return NextResponse.json(order, { status: 200 });
    
  } catch (error) {
    console.error("[Order API] Erro ao consultar pedido:", error);
    return NextResponse.json(
      { message: "Erro interno do servidor." },
      { status: 500 }
    );
  }
}
