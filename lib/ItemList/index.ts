import { readConfig } from "../fs";
import { validateFilter } from "../validateFilter";

type Item = {
  name: string;
  medium: string;
  desc: string | null;
  prog: number | null;
}

function validateItem( i: {
    name: string;
    medium: string;
    desc?: string;
    prog?: number;
  } ) {
  const item: Item = {
    name: i.name,
    medium: i.medium,
    desc: i.desc || null,
    prog: i.prog || null,
  };
  return item;
}

/* Main class for interacting with the data list
 * Most methods will return a adapted version of the main .get() list
 */
export default class ItemList {
  private list: Item[];

  // test use
  constructor( data: any[] = [] ) {
    const res: any = [];
    data.forEach( i => res.push( validateItem( i ) ) ); // weird ts-jest error with reduce
    this.list = res;
  }

  // normal use, can't be run in constructor bc of async
  async setFromConfig(): Promise<void> {
    const list = await readConfig();
    this.list = list;
  }

  get(): Item[] {
    return this.list;
  }

  search( query: string, list: Item[] = this.get() ): Item[] {
    const regex = new RegExp( query, "i" );

    const matches = list.filter( i => {
      let valueToMatch = i.name;

      if ( i.medium == "article" ) {
        valueToMatch = i.desc || i.name;
      }

      return regex.test( valueToMatch )
    } );

    return matches;
  }

  // Todo: add special prog filter
  filter( rawFilters: any[] ): Item[] {
    const filters = rawFilters
      .map( f => validateFilter( f ) )
      .filter( f => f != null );

    return this.get().filter( i => ~[...filters].indexOf( i.medium ) );
  }
}
