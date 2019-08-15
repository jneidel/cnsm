import chalk from "chalk";
import Media from "./Media";

function convertToMedia( obj ) {
  const mediaObj = new Media( obj );
  return mediaObj;
}

export function validateFilters( filterCategory ) {
  switch ( filterCategory ) {
    case "S":
    case "s":
    case "series":
      return "series";
    case "V":
    case "v":
    case "video":
      return "video";
    case "MV":
    case "mv":
    case "movie":
      return "movie";
    case "MA":
    case "ma":
    case "manga":
      return "manga";
    case "C":
    case "c":
    case "comic":
      return "comic";
    case "AT":
    case "at":
    case "article":
      return "article";
    case "AN":
    case "an":
    case "anime":
      return "anime";
    case "F":
    case "f":
    case "file":
      return "file";
    default:
      return null;
  }
}

export default function render( data, range = 0, filterCategory: any = null ) {
  filterCategory = validateFilters( filterCategory );

  const mediaArr = data
    .map( d => convertToMedia( d ) )
    .filter( media => filterCategory ? media.type === filterCategory : true );

  const start = ( range => range * 10 )( range );
  const end = ( range => ( range + 1 ) * 10 )( range );
  const currentSelection = mediaArr.slice( start, end );

  const output: string = currentSelection
    .map( ( media, index ) => media.toString( index ) )
    .reduce( ( str, cur ) => {
      return `${str}
${cur}`;
    }, `${chalk.green( "Entries:" )} ${start + 1} - ${end}${filterCategory ? `, ${chalk.green( "Filter:" )} ${mediaArr[0].translateType()}` : ""}` );

  console.log( output );
}
