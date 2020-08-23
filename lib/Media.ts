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
}
