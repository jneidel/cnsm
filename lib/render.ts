import chalk from "chalk";
import Media from "./Media";

function convertToMedia( obj ) {
  const mediaObj = new Media( obj );
  return mediaObj;
}

export function validateFilters( filterCategory: string | null ) {
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
    case "B":
    case "b":
    case "book":
      return "book";
    case "g":
    case "prog":
      return "prog";
    case "AR":
    case "ar":
    case "art":
      return "art";
    default:
      return null;
  }
}

export default function render( data, range = 0, filterCategory: any = null ) {
  data = data.map( d => convertToMedia( d ) );

  const mediaArr =
    filterCategory === "prog" ?
      data.filter( media => media.prog ) :
      data.filter( media =>
        filterCategory ? media.type === filterCategory : true,
      );

  const start = ( range => range * 10 )( range );
  const end = ( range => ( range + 1 ) * 10 )( range );
  const currentSelection = mediaArr.slice( start, end );

  const endDisplay =
    mediaArr.length < end ?
      mediaArr.length == start + 1 ?
        "" :
        `-${mediaArr.length}` :
      `-${end}`;

  const filterDisplay =
    filterCategory === "prog" ?
      `, ${chalk.green( "Filter:" )} g` :
      filterCategory ?
        `, ${chalk.green( "Filter:" )} ${mediaArr[0].translateType()}` :
        "";

  const output: string = currentSelection
    .map( ( media, index ) => media.toString( index ) )
    .reduce( ( str, cur ) => {
      return `${str}
${cur}`;
    }, `${chalk.green( "Entries:" )} ${start + 1}${endDisplay}${filterDisplay}` );

  console.log( output );
}
