import { NextResponse } from 'next/server';
import path from 'path';
import { promises as fs } from 'fs';

interface Location {
  id: number;
  name: string;
  coordinates: [number,number];
  hours: string;
  status: string;
}

export async function GET(): Promise<NextResponse<Location[] | {error: string}>>  {
  try{
    const jsonDirectory = path.join(process.cwd(), 'app','data');

    const fileContents = await fs.readFile(jsonDirectory + '/locations.json', 'utf8');

    const locations: Location[] = JSON.parse(fileContents);
    
    return NextResponse.json(locations);
  }
  catch(error){
    
    console.error("failed to read locations.json", error);
    return NextResponse.json(
      {error: "internal server error"},
      {status: 500}
    );

  }

}