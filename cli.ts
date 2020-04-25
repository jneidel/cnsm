#! /usr/bin/env node

import meow from "meow";
import { dataTypes } from "./lib/Media";
import view from "./lib/view";
import add from "./lib/add";
import list from "./lib/list";

async function main() {
  const cli = meow(
    `$ cnsm

Usage
  cnsm             - view list (try 'help' for usage)
  cnsm add <name>  - add to list
  cnsm list        - list all items

Flags for 'add'
  -t, --type  - type of media to add
  -d, --desc  - alternative name or description if name is an url
  --nf        - indicating that it is available on netflix

Flags for 'view'
  -f, --filter - filter to directly apply

Flags for 'list'
  -f, --filter - filter items before returning them, strips type tag of results`,
    {
      description: "",
      flags      : {
        type: {
          alias: "t",
          type : "string",
        },
        desc: {
          alias  : "d",
          type   : "string",
          default: null,
        },
        nf: {
          type   : "boolean",
          default: false,
        },
        filter: {
          alias  : "f",
          type   : "string",
          default: null,
        },
      },
    },
  );

  const args = cli.flags;
  args._ = cli.input;

  if ( args._.length === 0 ) {
    view( args.filter );
  } else if ( args._[0] === "add" ) {
    args._.shift();

    if ( !args.type || !dataTypes.includes( args.type ) ) {
      console.log( "A media type is required." );
      console.log( "Available:" );
      console.log( dataTypes );
      process.exit();
    }

    if ( args._.length === 0 ) {
      console.log( "A name is required." );
      console.log( "  Try --help for help" );
    }

    const data: any = {
      name: args._.join( " " ),
      type: args.type,
    };

    if ( args.nf ) data.nf = args.nf;
    if ( args.desc ) data.desc = args.desc;

    add( data );
  } else if ( args._[0] === "list" ) {
    list( args.filter )
  } else {
    console.log( "Unknown command" );
    console.log( "  Try --help for help" );
  }

}

main();
