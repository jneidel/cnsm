import mkdir from "make-dir";
import * as fs from "fs";
import { promisify } from "util";

const readFile = promisify( fs.readFile );

export const configDir = `${process.env.HOME}/.config/cnsm`;
const dataFile = `${configDir}/data.json`;

export async function readConfig() {
  await mkdir( configDir );

  const data = await readFile( dataFile, { encoding: "utf-8" } )
    .then( raw => JSON.parse( raw ) )
    .catch( err => { // file does not exist
      return [];
    } );
  return data;
}

export function writeConfig( data ) { // exit handler can't handle async
  console.log( `Writing changes to ${dataFile}` );

  const json = JSON.stringify( data, null, 2 );
  fs.writeFileSync( dataFile, json );
}

