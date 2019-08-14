import chalk from "chalk";
import childProcess from "child_process";

export const dataTypes = [ "article" , "series" , "video" , "movie" , "manga" , "comic" , "anime" , "file" ]
interface MediaData {
  name: string;
  type: "article" | "series" | "video" | "movie" | "manga" | "comic" | "anime" | "file";
  desc?: string;
  nf?: boolean;
}

export default class Media {
  name;
  type;
  desc = "";
  nf = false;
  length = 0;

  constructor( data: MediaData ) {
    this.name = data.name;
    this.type = data.type;

    this.nf = data.nf ? data.nf : this.nf;
    this.desc = data.desc ? data.desc : this.desc;
  }

  // @ts-ignore
  translateType() {
    switch ( this.type ) {
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
    }
  }
  private evalDescriptor() {
    // depending on type, display name or description
    const { type } = this;
    const description = this.desc;
    const { name } = this;

    if ( !description || description === "" )
      return name;

    switch ( type ) { // description exists
      case "article":
      case "video":
      case "file":
        return description;
      case "series":
      case "movie":
      case "manga":
      case "comic":
      case "anime":
        return `${name} (${description})`;
    }
  }

  toString( index = 0 ) {
    index = index === 9 ? 0 : index + 1;
    return `${chalk.yellow( String( index ) )}: ${this.translateType()} - ${this.evalDescriptor()}`;
  }

  private openInBrowser( url ) {
    childProcess.spawn( String( process.env.BROWSER ), [ url ] );
  }

  // handle open command depending on type
  open() {
    if ( this.nf ) {
      this.openInBrowser( `www.netflix.com/search?q=${encodeURIComponent( this.name )}` );
      console.log( "Opened in netflix" );
      return;
    }

    switch ( this.type ) {
      case "article":
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
        this.openInBrowser( `https://cruzing.xyz/search/${encodeURIComponent( this.name )}/0/0/0` );
        console.log( "Opened in tpb" );
        break;
      case "anime":
        this.openInBrowser( `https://nyaa.si/?f=0&s=seeders&o=desc&c=1_2&q=${encodeURIComponent( this.name )}` );
        console.log( "Opened in nyaa" );
        break;
      case "file":
        console.log( `Path is: ${this.name}` );
        break;
    }
  }
  altOpen() {
    switch ( this.type ) {
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
      case "article":
      case "video":
      case "comic":
      case "file":
        console.log( "No alternative handler available" );
        break;
    }
  }
}

