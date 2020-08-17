import * as fs from "fs";
import { promisify } from "util";

const readFile = promisify( fs.readFile );
const stat = promisify( fs.stat );
const mkdir = promisify( fs.mkdir );

export const configDir = `${process.env.HOME}/.config/cnsm`;
const dataFile = `${configDir}/data.json`;
const typesFile = `${configDir}/types.json`;

export async function readData() {
  await mkdir( configDir, { recursive: true } );

  const data = await readFile( dataFile, { encoding: "utf-8" } )
    .then( raw => JSON.parse( raw ) )
    .catch( err => [] ); // file does not exist
  return data;
}

export function writeData( data ) { // exit handler can't handle async
  console.log( `Writing changes to ${dataFile}` );

  data = data.map( item => {
    if ( !item.desc )
      delete item.desc
    if ( !item.prog )
      delete item.prog

    return item;
  } )

  const json = JSON.stringify( data, null, 2 );
  fs.writeFileSync( dataFile, json );
}

export function readTypes() { // sync to read it at the top of types.ts (only called 1x)
  const rawTypes = fs.readFileSync( typesFile, { encoding: "utf-8" } );
  let types: any[];
  try {
    types = JSON.parse( rawTypes );
    if ( !types.length ) { // not an array
      types = [ types ];
      console.error( `Types file (${typesFile}) is not an array` );
    }
  } catch( e ) {
    types = [];
    console.error( `Types file (${typesFile}) is invalid JSON` );
  }
  return types;
}

export function getDataFileModified() {
  return stat( dataFile )
    .then( stats => stats.mtimeMs );
}

