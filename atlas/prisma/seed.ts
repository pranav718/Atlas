
import { PrismaClient } from '@prisma/client';
import locationsData from '../data/locations.json';

const prisma = new PrismaClient();

type LocationData = {
  id: number;
  name: string;
  coordinates: number[];
  hours: string;
  status: string;
};

async function main() {
  console.log(`Start seeding ...`);

  // ✨ FIX: Clear existing data to prevent duplicate errors on re-seeding
  await prisma.location.deleteMany({});
  console.log('Deleted existing locations.');

  const locations = locationsData as LocationData[];

  for (const l of locations) {
    const location = await prisma.location.create({
      data: {
        locationId: l.id, // ✨ FIX: Map the JSON 'id' to the 'locationId' field
        name: l.name,
        coordinates: l.coordinates,
        hours: l.hours,
        status: l.status,
      },
    });
    console.log(`Created location "${location.name}" with locationId: ${location.locationId}`);
  }
  console.log(`Seeding finished.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });