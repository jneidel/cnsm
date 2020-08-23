import chalk from "chalk";
import * as types from "./types";

export default class Media {
  name: string;
  medium: string;
  desc: string;
  isSelected : boolean;

  // constructor( data: MediaData ) {
  constructor( data ) {
    this.name = data.name;
    this.medium = data.medium;

    this.desc = data.desc ? data.desc : "";
    this.isSelected = data.isSelected ? true : false;
  }

  translateType() {
    return types.colorType( this.medium );
  }
  private evalDescriptor() {
    const item = { medium: this.medium, desc: this.desc, name: this.name };
    if ( this.isSelected )
      return chalk.black.bgYellow( types.evalItemName( item ) );
    else
      return types.evalItemName( item );
  }

  toString( index = 0 ) {
    index = index === 9 ? 0 : index + 1;
    return `${chalk.yellow( String( index ) )}: ${this.translateType()} - ${this.evalDescriptor()}`;
  }
}
