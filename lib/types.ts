import chalk from "chalk";
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

export function colorType( typeStr: string ): string {
  const typeObj = types[typeStr];
  if ( !typeObj ) {
    console.error( "Using unsupported type:", typeStr );
    process.exit();
  }
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
   const typeObj = types[item.medium];
  if ( !typeObj ) {
    console.error( "Using unsupported type:", item.medium );
    process.exit();
  }

  if ( !item.desc || item.desc === "" )
    return item.name;

  return typeObj.primary_desc ? item.desc : `${item.name} (${item.desc})`;
}
