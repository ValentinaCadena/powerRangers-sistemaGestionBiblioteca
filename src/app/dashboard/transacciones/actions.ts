// app/transacciones/actions.ts (CORREGIDO)
'use server'

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
// Importamos Prisma y PrismaClient
import { PrismaClient, Prisma } from '@prisma/client';

const prisma = new PrismaClient();

interface MovementData {
  maestroId: string;
  tipo: 'ENTRADA' | 'SALIDA';
  cantidad: number;
}

export async function createMovementAction(data: MovementData) {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return { error: "No autorizado" };
  }

  const { maestroId, tipo, cantidad } = data;

  if (cantidad <= 0) {
    return { error: "La cantidad debe ser un número positivo." };
  }

  try {
    // Usamos una transacción de Prisma para asegurar la integridad de los datos
    // Le aplicamos el tipo a 'tx'
    await prisma.$transaction(async (tx: Prisma.TransactionClient) => {
      // 1. Opcional pero recomendado: Verificar que el saldo no quede negativo
      if (tipo === 'SALIDA') {
        const maestro = await tx.maestro.findUnique({
          where: { id: maestroId },
          select: { saldo: true }
        });

        if (!maestro || maestro.saldo < cantidad) {
          // Lanzar un error aquí detendrá la transacción automáticamente
          throw new Error("Saldo insuficiente para realizar la salida.");
        }
      }
      
      // 2. Crear el movimiento
      await tx.movimiento.create({
        data: {
          maestroId,
          tipo,
          cantidad,
          userId: user.id,
        },
      });

      // 3. Actualizar el saldo del maestro
      const amountToUpdate = tipo === 'ENTRADA' ? cantidad : -cantidad;
      await tx.maestro.update({
        where: { id: maestroId },
        data: {
          saldo: {
            increment: amountToUpdate,
          },
        },
      });
    });

    revalidatePath("/transacciones");
    revalidatePath("/maestros");

    return { success: true };

  } catch (error: any) {
    console.error("Transaction failed:", error);
    // Devolvemos el mensaje específico del error si lo lanzamos nosotros
    return { error: error.message || "La operación falló. El saldo no fue actualizado." };
  }
}