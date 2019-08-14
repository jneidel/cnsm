import Media from "./Media";
import readline from "readline-promise";
import chalk from "chalk";
import * as fs from "./fs";
import render from "./render";

export default async function view() {
  const data = await fs.readConfig();
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
    ( selected - 1 ) * ( currentView * 10 + 1 );

  // input loop
  while ( true ) {
    const answer = await rlp.questionAsync( `${chalk.blue( "$" )} ` );
    const command = answer.split( " " )[0];
    let selected = answer.split( " " )[1];
    selected = selected === "0" ? 10 : Number( selected );
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
  f,  filter - filter by type (example: $ f C; $ filter manga)
      reset  - reset filter

  o,  open   - open with default handler for type (definitions found in lib/Media.ts)
                 example: manga searches for the title on mangalife.us in $BROWSER
  a,  alt    - open with alternative handler (same principle as open)
                 example: movie search for the title on imdb.com in $BROWSER

  w,  write  - write changes
  q,  wq     - write changes and quit
      exit   - exit without writing` );
        break;
      case "f":
      case "filter":
        currentFilter = selected;
        draw();
        break;
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
      case "delete":
        selected = translateSelection( selected );
        data.splice( selected, 1 );
        console.log( `Removed ${selected + 1}.` );
        break;
    }
  }
}
