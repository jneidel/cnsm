import chalk from "chalk";
import Media from "./Media";

export default function render( data, range = 0, filterCategory: any = null ) {
  data = data.map( d => new Media( d ) );

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
