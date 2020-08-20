// import Media from "./Media";
import readline from "readline-promise";
import chalk from "chalk";
import render from "./render";
import ItemList from "./ItemList";
import { dataTypes } from "./types";

export default async function view( passedFilter = null ) {
  const list = new ItemList();
  await list.reloadFromFile();
  list.addFilter( passedFilter );

  let currentView = 0;

  // helper functions
  const draw = () => render( list, currentView );
  const translateSelection = selected => currentView * 10 + Number( selected ) - 1;

  draw(); // initial rendering

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
  //       draw();
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
        draw();
        break;
      case "next":
      case "n":
        if ( list.get().length >= ( currentView + 1 ) * 10 ) {
          currentView += 1;
          draw();
        } else
          console.log( "Reached last page of entries" );
        break;
      case "previous":
      case "prev":
      case "..":
      case "p":
        if ( currentView === 0 )
          console.log( "Reached first page of entries" );
        else {
          currentView -= 1;
          draw();
        }
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
      case "help":
        console.log( `${chalk.green( "Available commands:" )}
  ls, list   - list entries

Moving around:
  n,  next   - view next 10 entries
  p,  prev   - view previous 10 entries
  gg         - goto first page of entries
  G          - goto last page of entries

Filtering:
  f,  filter - filter by type
               either with the full type, or shorthand
               examples: $ f books; f b; f b,mv
  re, reset  - reset filters

Handler/openers (open with a handler defined by type):
  o,  open   - open with default handler
               example: manga searches on mangalife.us
  a,  alt    - open with alternative handler
               example: movie searches on imdb.com

Saving/exiting:
      reload - reload from file (disregarding all changes)
  w,  write  - write changes
  q,  wq     - write changes and quit
      exit   - exit without writing

Help:
      help   - this menu
      types  - list all available types
` );
        break;
      case "f":
      case "filter":
        list.addFilter( selected );
        currentView = 0;
        draw();
        break;
      case "re":
      case "reset":
        list.clearFilters();
        draw();
        break;
      case "o":
      case "open":
        selected = translateSelection( selected );
        list.open( selected );
        break;
      case "a":
      case "alt":
        selected = translateSelection( selected );
        list.altOpen( selected );
        break;
      case "d":
      case "rm":
      case "remove":
      case "delete":
        selected = translateSelection( selected );
        const removeEntry = list.remove( selected );
        draw();
        console.log( `Removed ${selected + 1} (${removeEntry.desc ? removeEntry.desc : removeEntry.name})` );
        break;
      case "reload":
        await list.reloadFromFile();
        draw();
        console.log( "Reloaded data file" );
        break;
      case "gg":
        currentView = 0;
        draw();
        console.log( "Back to first page" );
        break;
      case "G":
        const lastView = Math.floor( list.get().length / 10 );
        currentView = lastView;
        draw();
        console.log( "Switched to last page of entries" );
        break;
      case "types":
        console.log( "Available data types for filtering:" );
        console.log( dataTypes.sort() );
        break;
    }
  }
}
