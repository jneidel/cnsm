import { readData, writeData } from "../fs";
import { validateFilter } from "../validateFilter";
import { dataTypes, open, altOpen } from "../types";

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
  remove( index: number ): Item {
    // refactor: translate index yourself once view has been implemented
    const removeObj = this.get()[index];

    const mainIndex = this.list.indexOf( removeObj );
    this.list.splice( mainIndex, 1 );

    return removeObj;
  }

  /* fs */
  write(): void {
    writeData( this.list );
  }

  open( index: number ): void {
    const item = this.get()[index];
    open( item );
  }
  altOpen( index: number ): void {
    const item = this.get()[index];
    altOpen( item );
  }

  /* random */
  randomIndex(): number {
    return Math.floor( Math.random() * this.get().length );
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

  /* views */
  private view: number = 0;
  VIEW_RANGE: number = 10;

  drawView(): Item[] {
    const start = ( range => range * this.VIEW_RANGE )( this.view );
    const end = ( range => ( range + 1 ) * this.VIEW_RANGE )( this.view );
    return this.get().slice( start, end );
  }
  increaseView(): void {
    if ( this.get().length > ( this.view + 1 ) * this.VIEW_RANGE ) {
      this.view++;
    }
    // Todo: send feedback to user
  }
  decreaseView(): void {
    if ( this.view !== 0 ) {
      this.view--;
    }
  }
  resetView(): void {
    this.view = 0;
  }
}
