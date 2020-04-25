import { validateFilter } from "../lib/validateFilter";

test( "validate filters", () => {
  const mappings = [
    [ "mv", "movie" ],
    [ "ar", "art" ],
    [ "S", "series" ],
    [ null, null ],
    [ "uff", null ],
    [ "movi", null ],
  ];

  mappings.forEach( mapping => {
    expect( validateFilter( mapping[0] ) ).toBe( mapping[1] );
  } );
} );
