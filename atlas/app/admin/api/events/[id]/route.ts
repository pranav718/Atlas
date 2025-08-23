// app/admin/api/events/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/authOptions'
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// DELETE event (type-safe fallback)
export async function DELETE(
  request: NextRequest,
  context: { params: { id: string } } | any   // ✅ accepts both strict + loose
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const eventId = context.params?.id;

    if (!eventId) {
      return NextResponse.json({ error: 'Event ID missing' }, { status: 400 });
    }

    await prisma.event.delete({
      where: { id: eventId }
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting event:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
