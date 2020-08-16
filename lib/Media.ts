import chalk from "chalk";
import childProcess from "child_process";

export const dataTypes = [ "article", "series", "video", "movie", "manga", "comic", "anime", "file", "book", "art" ];
// interface MediaData {
//   name: string;
//   // medium: "article" | "series" | "video" | "movie" | "manga" | "comic" | "anime" | "file" | "book" | "art";
//   medium: string;
//   desc?: string;
//   prog?: number;
// }

export default class Media {
  name: string;
  medium: string;
  desc = "";
  prog = 0;

  // constructor( data: MediaData ) {
  constructor( data ) {
    this.name = data.name;
    this.medium = data.medium;

    this.desc = data.desc ? data.desc : this.desc;
    this.prog = data.prog ? data.prog : this.prog;
  }

  // @ts-ignore
  translateType() {
    switch ( this.medium ) {
      case "article":
        return chalk.black.bgYellowBright( "AT" );
      case "series":
        return chalk.black.bgBlue( "S" );
      case "video":
        return chalk.black.bgGreen( "V" );
      case "movie":
        return chalk.bgBlue( "MV" );
      case "manga":
        return chalk.bgRed( "MA" );
      case "comic":
        return chalk.black.bgRed( "C" );
      case "anime":
        return chalk.black.bgCyan( "AN" );
      case "file":
        return chalk.black.bgMagenta( "F" );
      case "book":
        return chalk.red.bgYellow( "B" );
      case "art":
        return chalk.green.bgRed( "AR" );
    }
  }
  private evalDescriptor() {
    // depending on type, display name or description
    const { medium } = this;
    const description = this.desc;
    const { name } = this;

    if ( !description || description === "" )
      return name;

    switch ( medium ) { // description exists
      case "article":
      case "video":
      case "file":
      case "art":
        return description;
      case "series":
      case "movie":
      case "manga":
      case "comic":
      case "anime":
      case "book":
        return `${name} (${description})`;
      default:
        return
    }
  }

  toString( index = 0 ) {
    index = index === 9 ? 0 : index + 1;
    return `${chalk.yellow( String( index ) )}: ${this.translateType()} - ${this.evalDescriptor()}${this.prog ? chalk.cyan( ` ${this.prog}%` ) : ""}`;
  }

  private openInBrowser( url: string ) {
    childProcess.spawn( String( process.env.BROWSER ), [ url ] );
  }

  // handle open command depending on type
  open() {
    switch ( this.medium ) {
      case "article":
      case "art":
      case "video":
        this.openInBrowser( this.name );
        console.log( "Opened url in browser" );
        break;
      case "comic":
        this.openInBrowser( `https://getcomics.info/?s=${encodeURIComponent( this.name )}` );
        console.log( "Opened in getcomics" );
        break;
      case "manga":
        this.openInBrowser( `https://mangalife.us/search/?keyword=${encodeURIComponent( this.name )}` );
        console.log( "Opened in mangalife" );
        break;
      case "series":
      case "movie":
        this.openInBrowser( `https://www.everybabes.com/search.php?q=${encodeURIComponent( this.name )}&page=0&orderby=99` );
        console.log( "Opened in tpb" );
        break;
      case "anime":
        this.openInBrowser( `https://nyaa.si/?f=0&s=seeders&o=desc&c=1_2&q=${encodeURIComponent( this.name )}` );
        console.log( "Opened in nyaa" );
        break;
      case "file":
        console.log( `Path is: ${this.name}` );
        break;
      case "book":
        this.openInBrowser( `http://www.libgen.io/foreignfiction/index.php?s=${encodeURIComponent( this.name )}&f_lang=English&f_ext=epub` );
        console.log( "Opened in libgen" );
        break;
    }
  }
  altOpen() {
    switch ( this.medium ) {
      case "series":
      case "anime":
      case "movie":
        this.openInBrowser( `https://www.imdb.com/find?s=all&q=${encodeURIComponent( this.name )}` );
        console.log( "Opened in imdb" );
        break;
      case "manga":
        this.openInBrowser( `https://www.mangareader.net/search/?w=${encodeURIComponent( this.name )}&rd=0&status=0&order=0&genre=&p=0` );
        console.log( "Opened in mangareader" );
        break;
      case "book":
        this.openInBrowser( `https://www.goodreads.com/search?q=${encodeURIComponent( this.name )}` );
        console.log( "Opened in goodreads" );
        break;
      case "article":
      case "video":
      case "comic":
      case "file":
        console.log( "No alternative handler available" );
        break;
    }
  }
}

