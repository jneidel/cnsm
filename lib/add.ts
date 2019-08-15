import { appendFileSync } from "fs";
import * as fs from "./fs";

const dataBackup = `${fs.configDir}/backup-data.json`;

export default async function add( dataToAdd ) {
  const data = await fs.readConfig();

  data.push( dataToAdd );

  fs.writeConfig( data );
  appendFileSync( dataBackup, `${JSON.stringify( dataToAdd, null, 2 )},` );
}
