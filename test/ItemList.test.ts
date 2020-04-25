import ItemList from "../lib/ItemList";

// search
test( "search by fixed string", () => {
  const list = new ItemList( [
    { medium: "movie", name: "The Revenant" },
    { medium: "movie", name: "LA Originals" },
  ] );
  const expected = [ list.get()[0] ];

  expect( list.search( "revenant" ) ).toEqual( expected );
} );

test( "search by regex", () => {
  const list = new ItemList( [
    { medium: "movie", name: "Cars" },
    { medium: "movie", name: "Battlefield" },
  ] );
  const expected = [ list.get()[1] ];

  expect( list.search( "battle.*" ) ).toEqual( expected );
} );

test( "searches only in desc for articles", () => {
  const list = new ItemList( [
    { medium: "article", name: "https://query.com", desc: "something else" },
    { medium: "article", name: "https://example.com", desc: "query" }
  ] );
  const expected = [ list.get()[1] ];

  expect( list.search( "query" ) ).toEqual( expected );
} );

test( "search with passed along list", () => {
  const itemList = new ItemList( [] );
  const list = [
    { medium: "movie", name: "Breakfast Club", desc: null, prog: null },
    { medium: "movie", name: "Ferris Bueller's Day Off", desc: null, prog: null },
  ];
  const expected = [ list[1] ];

  expect( itemList.search( "Off", list ) ).toEqual( expected );
} );

// filter
test( "filters for single medium", () => {
  const list = new ItemList( [
    { medium: "series", name: "Bojack Horseman" },
    { medium: "movie", name: "Madeo" },
  ] );
  const expected = [ list.get()[0] ];
  const filters = [ "series" ];

  expect( list.filter( filters ) ).toEqual( expected );
} );

test( "filters for multiple mediums", () => {
  const list = new ItemList( [
    { medium: "series", name: "Community" },
    { medium: "movie", name: "Pumping Iron" },
    { medium: "book", name: "Atomic Habits" },
  ] );
  const expected = [ list.get()[1], list.get()[2] ];
  const filters = [ "MV", "b" ];

  expect( list.filter( filters ) ).toEqual( expected );
} );

