// import Media from "./Media";
import readline from "readline-promise";
import chalk from "chalk";
import ItemList from "./ItemList";
import { dataTypes } from "./types";

export default async function view( passedFilter = null ) {
  const list = new ItemList();
  await list.reloadFromFile();
  list.addFilter( passedFilter );
  list.drawView(); // initial rendering

  // let previousDataFileModified: number | null = null;
  // ( function reloadOnFileChange() {
  //   setTimeout( async () => {
  //     const currentDataFileModified = await fs.getDataFileModified();

  //     if (
  //       previousDataFileModified &&
  //       previousDataFileModified < currentDataFileModified
  //     ) {
  //       await list.setFromConfig();
  //       list = list.filter( filters );
  //       list.drawView();
  //       process.stdout.write( `Automatic reload (data file changed in background)
// ${chalk.blue( "$ " )}` );
  //     }

  //     previousDataFileModified = currentDataFileModified;
  //     return reloadOnFileChange();
  //   }, 3000 );
  // } )();

  const rlp = readline.createInterface( {
    input   : process.stdin,
    output  : process.stdout,
    terminal: true,
  } );

  // input loop
  while ( true ) {
    const answer = await rlp.questionAsync( `${chalk.blue( "$" )} ` );

    let [ command, selected ] = [ ...answer.split( " " ) ];
    selected = selected === "0" ? 10 : selected;

    switch ( command ) {
      case "list":
      case "ls":
      case "l":
        list.drawView();
        break;
      case "next":
      case "n":
        list.increaseView();
        break;
      case "previous":
      case "prev":
      case "..":
      case "p":
        list.decreaseView();
        break;
      case "exit":
        process.exit();
      case "q":
      case "wq":
        list.write();
        process.exit();
      case "w":
      case "write":
        list.write();
        // previousDataFileModified = await fs.getDataFileModified();
        break;
      case "f":
      case "filter":
        list.addFilter( selected );
        list.resetView();
        break;
      case "re":
      case "reset":
        list.clearFilters();
        list.drawView();
        break;
      case "o":
      case "open":
        list.open( selected );
        break;
      case "a":
      case "alt":
        list.altOpen( selected );
        break;
      case "d":
      case "rm":
      case "remove":
      case "delete":
        list.remove( selected );
        break;
      case "reload":
        await list.reloadFromFile();
        list.drawView();
        console.log( "Reloaded data file" );
        break;
      case "gg":
        list.resetView();
        console.log( "Back to first page" );
        break;
      case "G":
        list.lastView();
        console.log( "Switched to last page of entries" );
        break;
      case "types":
        console.log( "Available data types for filtering:" );
        console.log( dataTypes.sort() );
        break;
      case "help":
        console.log( `${chalk.green( "Available commands:" )}
  ls, list   - list entries

${chalk.blue( "Moving around:" ) }
  n,  next   - view next 10 entries
  p,  prev   - view previous 10 entries
  gg         - goto first page of entries
  G          - goto last page of entries

${chalk.blue( "Filtering:" ) }
  f,  filter - filter by type
               either with the full type, or shorthand
               examples: $ f books; f b; f b,mv
  re, reset  - reset filters

${chalk.blue( "Handler/openers (open with a handler defined by type):" ) }
  o,  open   - open with default handler
               example: manga searches on mangalife.us
  a,  alt    - open with alternative handler
               example: movie searches on imdb.com

${chalk.blue( "Saving/exiting:" ) }
      reload - reload from file (disregarding all changes)
  w,  write  - write changes
  q,  wq     - write changes and quit
      exit   - exit without writing

${chalk.blue( "Help:" ) }
      help   - this menu
      types  - list all available types
` );
        break;
    }
  }
}
