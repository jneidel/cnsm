import chalk from "chalk";
import childProcess from "child_process";
import { readTypes, typesFile } from "./fs";

const types = readTypes();
for ( const t in types ) { // check requirements
  if ( !types[t].short ) {
    console.error( `Type ${t} is missing required field 'short'\nEdit your type definitions in ${typesFile}` )
    process.exit();
  }
  if ( !types[t].open ) {
    console.error( `Type ${t} is missing required field 'open'\nEdit your type definitions in ${typesFile}` )
    process.exit();
  }
}

export const dataTypes = Object.keys( types );

function validateType( typeStr: string ): any {
   const typeObj = types[typeStr];
  if ( !typeObj ) {
    console.error( "Using unsupported type:", typeStr );
    process.exit();
  }
  return typeObj;
}

export function colorType( typeStr: string ): string {
  const typeObj = validateType( typeStr );
  const typeStrUpper = typeObj.short.toUpperCase();
  const capitalize = str => str.charAt(0).toUpperCase() + str.slice(1);
  let coloredType: string;

  try {
    if ( typeObj.back && typeObj.front ) {
      coloredType = chalk[typeObj.front][`bg${capitalize( typeObj.back )}`]( typeStrUpper );
    } else if ( typeObj.back ) {
      coloredType = chalk[`bg${capitalize( typeObj.back )}`]( typeStrUpper );
    } else if ( typeObj.front ) {
      coloredType = chalk[typeObj.front]( typeStrUpper );
    } else {
      coloredType = typeStrUpper;
    }
  } catch( e ) {
    console.error( `Invalid colors ('back' or 'front') on type: ${typeStr}\nEdit your type definitions in ${typesFile}` )
    process.exit();
  }

  return coloredType;
}

export function evalItemName( item: any ): string {
  const typeObj = validateType( item.medium );

  if ( !item.desc || item.desc === "" )
    return item.name;

  return typeObj.primary_desc ? item.desc : `${item.name} (${item.desc})`;
}

function openInBrowser( url: string ) {
  childProcess.spawn( String( process.env.BROWSER ), [ url ] );
}

export function open( item: any ): void {
  const typeObj = validateType( item.medium );
  const url = typeObj.open === "name" ? // name is an url, like with all primary_desc items
    item.name :
    typeObj.open.replace( /%s/, encodeURIComponent( item.name ) );

  openInBrowser( url );

  const logMsg = typeObj.open_name ?
    `Opened using in ${typeObj.open_name}` :
    `Opened in browser`;
  console.log( logMsg );
}

export function altOpen( item: any ): void {
  const typeObj = validateType( item.medium );
  if ( !typeObj.alt ) {
    console.log( `Type ${item.medium} has no alternative handler` );
    return;
  }

  const url = typeObj.alt.replace( /%s/, encodeURIComponent( item.name ) );

  openInBrowser( url );

  const logMsg = typeObj.alt_name ?
    `Opened using in ${typeObj.alt_name}` :
    `Opened in browser`;
  console.log( logMsg );
}
