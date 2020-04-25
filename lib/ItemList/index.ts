import { readConfig } from "../fs";

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
  constructor( data = [] ) {
    const arr: any = [];
    data.forEach( i => arr.append( validateItem( i ) ) );
    this.list = arr;
  }

  // normal use, can't be run in constructor bc of async
  async setFromConfig(): Promise<void> {
    const list = await readConfig();
    this.list = list;
  }

  get(): Item[] {
    return this.list;
  }

  search(): Item[] {
    return [];
  }
}
