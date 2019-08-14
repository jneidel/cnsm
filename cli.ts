import meow from "meow";
import { dataTypes } from "./lib/Media";
import view from "./lib/view";
import add from "./lib/add";

async function main() {
  const cli = meow(
    `$ cnsm

Usage
  cnsm             - view list (try 'help' for usage)
  cnsm add <name>  - add to list

Flags for 'add'
  -t, --type  - type of media to add
  -d, --desc  - alternative name or description if name is an url
  --nf        - indicating that it is available on netflix`,
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
      },
    },
  );

  const args = cli.flags;
  args._ = cli.input;

  // view
  if ( args._.length === 0 ) {
    await view();
    return;
  }

  // add
  if ( args._[0] === "add" ) {
    args._.shift()

    if ( !args.type || !dataTypes.includes( args.type ) ) {
      console.log( "A media type is required." );
      console.log( "Available:" );
      console.log( dataTypes )
      process.exit()
    }

    if ( args._.length < 1 ) {
      console.log( "A name is required." )
      console.log( "  Try --help for help" )
    }

    const data: any = {
      name: args._.join( " " ),
      type: args.type,
    }

    if ( args.nf )
      data.nf = args.nf
    if ( args.desc )
      data.desc = args.desc

    await add( data )
  } else {
    console.log( "Unknown command" )
    console.log( "  Try --help for help" )
  }
}

main();
