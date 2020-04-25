import ItemList from "../lib/ItemList";

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

