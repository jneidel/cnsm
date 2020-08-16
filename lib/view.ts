// import Media from "./Media";
import readline from "readline-promise";
import chalk from "chalk";
import render from "./render";
import ItemList from "./ItemList";

export default async function view( passedFilter = null ) {
  const mainList = new ItemList();
  await mainList.reloadFromConfig();
  mainList.addFilter( passedFilter );

  let currentView = 0;

  // helper functions
  const draw = () => render( mainList, currentView );
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
  //       await mainList.setFromConfig();
  //       list = mainList.filter( filters );
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

    // let [ command, selected, secondParam ] = [ ...answer.split( " " ) ];
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
        if ( mainList.get().length >= ( currentView + 1 ) * 10 ) {
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
        // Todo: implement writing
        // fs.writeConfig( data );
        process.exit();
      case "w":
      case "write":
        // Todo: implement writing
        // fs.writeConfig( data );
        // previousDataFileModified = await fs.getDataFileModified();
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

  gg         - goto first page of entries
  G          - goto last page of entries

  w,  write  - write changes
  q,  wq     - write changes and quit
      exit   - exit without writing` );
        break;
      case "f":
      case "filter":
        mainList.addFilter( selected );
        currentView = 0;
        draw();
        break;
      case "re":
      case "reset":
        mainList.clearFilters();
        draw();
        break;
      case "o":
      case "open":
        selected = translateSelection( selected );
        // Todo: fix media
        // media = new Media( list[selected] );
        // media.open();
        break;
      case "a":
      case "alt":
        selected = translateSelection( selected );
        // media = new Media( list[selected] );
        // media.altOpen();
        break;
      case "d":
      case "rm":
      case "remove":
      case "delete":
        selected = translateSelection( selected );
        // const removedName = list[selected].name;
        // Todo: implement deletion
        // list.splice( selected, 1 );
        draw();
        // console.log( `Removed ${selected + 1} (${removedName})` );
        console.log( `Removed ${selected + 1} ()` );
        break;
      case "r":
      case "reload":
        await mainList.reloadFromConfig();
        draw();
        console.log( "Reloaded data file" );
        break;
      // case "g":
      // case "prog":
      //   selected = translateSelection( selected );
      //   list[selected].prog = secondParam;
      //   console.log( `Setting progress for ${selected + 1} to ${secondParam}` );
      //   break;
      case "gg":
        currentView = 0;
        draw();
        console.log( "Back to first page" );
        break;
      case "G":
        const lastView = Math.floor( mainList.get().length / 10 );
        currentView = lastView;
        draw();
        console.log( "Switched to last page of entries" );
    }
  }
}
