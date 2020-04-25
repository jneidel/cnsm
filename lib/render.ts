import chalk from "chalk";
import Media from "./Media";

export default function render( data, filters, range = 0 ) {
  data = data.map( d => new Media( d ) );

  const start = ( range => range * 10 )( range );
  const end = ( range => ( range + 1 ) * 10 )( range );
  const currentSelection = data.slice( start, end );

  const endDisplay =
    data.length < end ?
      data.length == start + 1 ?
        "" :
        `-${data.length}` :
      `-${end}`;

  const filterDisplay = filters.length ? `, ${chalk.green( "Filter:" )} ${filters}` : "";

  const output: string = currentSelection
    .map( ( media, index ) => media.toString( index ) )
    .reduce( ( str, cur ) => {
      return `${str}
${cur}`;
    }, `${chalk.green( "Entries:" )} ${start + 1}${endDisplay}${filterDisplay}` );

  console.log( output );
}
