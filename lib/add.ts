import { appendFileSync } from "fs";
import * as fs from "./fs";

const dataBackup = `${fs.configDir}/backup-data.json`;

export default async function add( dataToAdd ) {
  const data = await fs.readData();

  data.push( dataToAdd );

  fs.writeData( data );
  appendFileSync( dataBackup, `${JSON.stringify( dataToAdd, null, 2 )},` );
}
