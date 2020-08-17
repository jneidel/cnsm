#! /usr/bin/env node

import meow from "meow";
import { dataTypes } from "./lib/types";
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

Flags for 'view'
  -f, --filter - filter to directly apply (single or comma-separated list)

Flags for 'list'
  -f, --filter - filter items before returning them, strips type tag of results

Examples:
  $ cnsm list -f 'mv,b'
  #=> lists all movies and books`,
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
      console.log( dataTypes.sort() );
      process.exit();
    }

    if ( args._.length === 0 ) {
      console.log( "A name is required." );
      console.log( "  Try --help for help" );
      process.exit();
    }

    const data: any = {
      name: args._.join( " " ),
      medium: args.type,
    };

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
