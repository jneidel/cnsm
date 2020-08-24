import chalk from "chalk";
import { readData, writeData } from "../fs";
import { validateFilter } from "../validateFilter";
import { dataTypes, open, altOpen } from "../types";
import Media from "../Media";

type Item = {
  name: string;
  medium: string;
  desc: string | null;
}

function validateItem( i: {
    name: string;
    medium: string;
    desc?: string;
  } ) {
  if ( ~dataTypes.indexOf( i.medium ) ) {
    const item: Item = {
      name: i.name,
      medium: i.medium,
      desc: i.desc || null,
    };
    return item;
  } else
    return null;
}

/* Main class for interacting with the data list
 * Most methods will return a adapted version of the main .get() list
 */
export default class ItemList {
  private list: Item[];

  /* list */
  // test use
  constructor( data: any[] = [] ) {
    const res: any = data
      .map( i => validateItem( i ) )
      .filter( i => i != null );
    this.list = res;
  }

  // normal use, can't be run in constructor bc of async
  public async reloadFromFile(): Promise<void> {
    const json = await readData();

    const res: any = json
      .map( i => validateItem( i ) )
      .filter( i => i != null );
    this.list = res;
  }

  get(): Item[] {
    return this.filterList();
  }

  /* filters */
  private filters: string[] = [];

  private filterList(): Item[] {
    if ( this.hasFilters() ) {
      return this.list
        .filter( i => ~this.filters.indexOf( i.medium ) );
    } else {
      return this.list;
    }
  }

  addFilter( filter: string|null ): void {
    if ( String( filter ).match( /,/ ) ) { // passed -f "filter,filter,etc."
      String( filter )
        .split(",")
        .map( s => s.trim() )
        .map( s => validateFilter( s ) )
        .forEach( f => {
          if ( f )
            this.filters.push( f )
        } );
    } else {
      filter = validateFilter( filter );
      if ( filter )
        this.filters.push( filter );
    }
  }
  clearFilters(): void {
    this.filters = [];
  }
  hasFilters(): boolean {
    return !!this.filters.length;
  }
  getFilters(): string[] {
    return this.filters;
  }

  /* remove */
  remove( inputIndex: number ) {
    const index = this.translateIndexToView( inputIndex );
    if ( index === null ) {
      console.error( "Invalid index passed, no such item available" );
    } else {
      const removeObj = this.get()[index];

      const mainIndex = this.list.indexOf( removeObj );
      this.list.splice( mainIndex, 1 );

      this.drawView();
      console.log( `Removed ${inputIndex + 1} (${removeObj.desc ? removeObj.desc : removeObj.name})` );
    }
  }

  /* fs */
  write(): void {
    writeData( this.list );
  }

  private opener( inputIndex: number, func ) {
    const index = this.translateIndexToView( inputIndex );
    if ( index === null ) {
      console.error( "Invalid index passed, no such item available" );
    } else {
      const item = this.get()[index];
      func( item );
    }
  }
  open( index: number ): void {
    this.opener( index, open );
  }
  altOpen( index: number ): void {
    this.opener( index, altOpen );
  }

  /* search */
  search( query: string ): Item[] {
    const regex = new RegExp( query, "i" );

    const matches = this.get().filter( i => {
      let valueToMatch = i.name;

      if ( i.medium == "article" ) {
        valueToMatch = i.desc || i.name;
      }

      return regex.test( valueToMatch )
    } );

    return matches;
  }

  /* random */
  randomEntry() {
    this.drawView( { isRandom: true } );
  }
  private genRandomIndex( list: Item[] ): number {
    const n = Math.floor( Math.random() * list.length );

    this.view = Math.floor( n / this.VIEW_RANGE );

    return n;
  }

  /* views */
  private view: number = 0;
  VIEW_RANGE: number = 10;

  drawView( options: any = {} ) {
    const list: any = this.get();

    let randomIndex;
    if ( options.isRandom ) {
      randomIndex = this.genRandomIndex( list );
      list[randomIndex].isSelected = true;
    }

    const start = ( range => range * this.VIEW_RANGE )( this.view );
    const end = ( range => ( range + 1 ) * this.VIEW_RANGE )( this.view );
    const currentView = list
      .slice( start, end )
      .map( d => new Media( d ) );

    const viewStart = start + 1;
    const viewEnd =
      currentView.length < 10 ?
        currentView.length == 1 ?
          "" : // 1 item
          `-${list.length}` : // < 10 items
        `-${end}`; // 10 items

    const filters = this.getFilters();
    const viewFilters = filters.length ? `, ${chalk.green( "Filter:" )} ${filters}` : "";

    const viewOutput: string = currentView
      .map( ( media, index ) => media.toString( index ) )
      .reduce(
        ( str, cur ) => `${str}\n  ${cur}`,
        `${chalk.green( "Entries:" )} ${viewStart}${viewEnd}${viewFilters}` );
    console.log( viewOutput );

    if ( options.isRandom )
      delete list[randomIndex].isSelected;
  }
  increaseView(): void {
    if ( this.get().length > ( this.view + 1 ) * this.VIEW_RANGE ) {
      this.view++;
      this.drawView();
    } else {
      console.log( "Reached last page of entries" );
    }
  }
  decreaseView(): void {
    if ( this.view !== 0 ) {
      this.view--;
      this.drawView();
    } else {
      console.log( "Reached first page of entries" );
    }
  }
  resetView(): void {
    this.view = 0;
    this.drawView();
  }
  lastView(): void {
    this.view = Math.floor( this.get().length / this.VIEW_RANGE );
    this.drawView();
  }
  private translateIndexToView( input: number ): number|null {
    if ( input > 10 || input < 1 )
      return null;

    const index = this.view * this.VIEW_RANGE + Number( input ) - 1;
    if ( index >= this.get().length )
      return null;
    else
      return index;
  }
}
