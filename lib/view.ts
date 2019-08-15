import Media from "./Media";
import readline from "readline-promise";
import chalk from "chalk";
import * as fs from "./fs";
import render from "./render";

export default async function view() {
  let data = await fs.readConfig();
  render( data ); // initial rendering

  const rlp = readline.createInterface( {
    input   : process.stdin,
    output  : process.stdout,
    terminal: true,
  } );

  let currentView = 0;
  let currentFilter = null;

  const draw = () => render( data, currentView, currentFilter );
  const translateSelection = selected =>
    currentView * 10 + Number( selected ) - 1;

  let previousDataFileModified: number | null = null;
  ( function reloadOnFileChange() {
    setTimeout( async () => {
      const currentDataFileModified = await fs.getDataFileModified();

      if (
        previousDataFileModified &&
        previousDataFileModified < currentDataFileModified
      ) {
        draw();
        process.stdout.write( `Automatic reload (data file changed in background)
${chalk.blue( "$ " )}` );
      }

      previousDataFileModified = currentDataFileModified;
      return reloadOnFileChange();
    }, 3000 );
  } )();

  // input loop
  while ( true ) {
    const answer = await rlp.questionAsync( `${chalk.blue( "$" )} ` );
    let [ command, selected, secondParam ] = [ ...answer.split( " " ) ];
    selected = selected === "0" ? 10 : selected;
    let media;

    switch ( command ) {
      case "list":
      case "ls":
        draw();
        break;
      case "next":
      case "n":
        currentView += 1;
        draw();
        break;
      case "previous":
      case "prev":
      case "p":
        currentView = currentView === 0 ? 0 : currentView - 1;
        draw();
        break;
      case "exit":
        process.exit();
      case "q":
      case "wq":
        fs.writeConfig( data );
        process.exit();
      case "w":
      case "write":
        fs.writeConfig( data );
        break;
      case "help":
        console.log( `${chalk.green( "Available commands:" )}
  ls, list   - list entries
  n,  next   - view next 10 entries
  p,  prev   - view previous 10 entries
  f,  filter - filter by type (usage: $ f C; $ filter manga)
  re, reset  - reset filter
  r,  reload - reload data file

  o,  open   - open with default handler for type (definitions found in lib/Media.ts)
                 example: manga searches for the title on mangalife.us in $BROWSER
  a,  alt    - open with alternative handler (same principle as open)
                 example: movie search for the title on imdb.com in $BROWSER

  g,  prog   - set progress for selected (usage: $ prog 3 65)

  w,  write  - write changes
  q,  wq     - write changes and quit
      exit   - exit without writing` );
        break;
      case "f":
      case "filter":
        currentFilter = selected;
        console.log( currentFilter );
        draw();
        break;
      case "re":
      case "reset":
        currentFilter = null;
        draw();
        break;
      case "o":
      case "open":
        selected = translateSelection( selected );
        media = new Media( data[selected] );
        media.open();
        break;
      case "a":
      case "alt":
        selected = translateSelection( selected );
        media = new Media( data[selected] );
        media.altOpen();
        break;
      case "d":
      case "rm":
      case "remove":
      case "delete":
        selected = translateSelection( selected );
        data.splice( selected, 1 );
        draw();
        console.log( `Removed ${selected + 1}.` );
        break;
      case "r":
      case "reload":
        data = await fs.readConfig();
        draw();
        console.log( "Reloaded data file" );
        break;
      case "g":
      case "prog":
        selected = translateSelection( selected );
        data[selected].prog = secondParam;
        console.log( `Setting progress for ${selected + 1} to ${secondParam}` );
        break;
    }
  }
}
