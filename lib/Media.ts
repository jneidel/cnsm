import chalk from "chalk";
import * as types from "./types";

export default class Media {
  name: string;
  medium: string;
  desc = "";

  // constructor( data: MediaData ) {
  constructor( data ) {
    this.name = data.name;
    this.medium = data.medium;

    this.desc = data.desc ? data.desc : this.desc;
  }

  translateType() {
    return types.colorType( this.medium );
  }
  private evalDescriptor() {
    const item = { medium: this.medium, desc: this.desc, name: this.name };
    return types.evalItemName( item );
  }

  toString( index = 0 ) {
    index = index === 9 ? 0 : index + 1;
    return `${chalk.yellow( String( index ) )}: ${this.translateType()} - ${this.evalDescriptor()}`;
  }

  // handle open command depending on type
      // case "comic":
      //   this.openInBrowser( `https://getcomics.info/?s=${encodeURIComponent( this.name )}` );
      //   console.log( "Opened in getcomics" );
      //   break;
      // case "manga":
      //   this.openInBrowser( `https://mangalife.us/search/?keyword=${encodeURIComponent( this.name )}` );
      //   console.log( "Opened in mangalife" );
      //   break;
      // case "series":
      // case "movie":
      //   this.openInBrowser( `https://www.everybabes.com/search.php?q=${encodeURIComponent( this.name )}&page=0&orderby=99` );
      //   console.log( "Opened in tpb" );
      //   break;
      // case "anime":
      //   this.openInBrowser( `https://nyaa.si/?f=0&s=seeders&o=desc&c=1_2&q=${encodeURIComponent( this.name )}` );
      //   console.log( "Opened in nyaa" );
      //   break;
      // case "file":
      //   console.log( `Path is: ${this.name}` );
      //   break;
      // case "book":
      //   this.openInBrowser( `http://www.libgen.io/foreignfiction/index.php?s=${encodeURIComponent( this.name )}&f_lang=English&f_ext=epub` );
      //   console.log( "Opened in libgen" );
      //   break;
    // }
      // case "series":
      // case "anime":
      // case "movie":
      //   this.openInBrowser( `https://www.imdb.com/find?s=all&q=${encodeURIComponent( this.name )}` );
      //   console.log( "Opened in imdb" );
      //   break;
      // case "manga":
      //   this.openInBrowser( `https://www.mangareader.net/search/?w=${encodeURIComponent( this.name )}&rd=0&status=0&order=0&genre=&p=0` );
      //   console.log( "Opened in mangareader" );
      //   break;
      // case "book":
      //   this.openInBrowser( `https://www.goodreads.com/search?q=${encodeURIComponent( this.name )}` );
      //   console.log( "Opened in goodreads" );
      //   break;
      // case "article":
      // case "video":
      // case "comic":
      // case "file":
      //   console.log( "No alternative handler available" );
      //   break;
}

