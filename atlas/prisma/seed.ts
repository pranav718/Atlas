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

  const locations = locationsData as LocationData[];

  for (const l of locations) {
    const location = await prisma.location.create({
      data: {
       
        name: l.name,
        coordinates: l.coordinates,
        hours: l.hours,
        status: l.status,
      },
    });
    console.log(`Created location with id: ${location.id}`);
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
