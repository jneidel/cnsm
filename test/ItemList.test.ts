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
  const list = new ItemList( [
    { medium: "movie", name: "Breakfast Club", desc: null, prog: null },
    { medium: "movie", name: "Ferris Bueller's Day Off", desc: null, prog: null },
  ] );
  const expected = [ list.get()[1] ];

  expect( list.search( "Off" ) ).toEqual( expected );
} );

// filter
test( "filters for single medium", () => {
  const list = new ItemList( [
    { medium: "series", name: "Bojack Horseman" },
    { medium: "movie", name: "Madeo" },
  ] );
  const expected = [ list.get()[0] ];
  list.addFilter( "series" );

  expect( list.get() ).toEqual( expected );
} );

test( "filters for multiple mediums", () => {
  const list = new ItemList( [
    { medium: "series", name: "Community" },
    { medium: "movie", name: "Pumping Iron" },
    { medium: "book", name: "Atomic Habits" },
  ] );
  const expected = [ list.get()[1], list.get()[2] ];
  list.addFilter( "MV" );
  list.addFilter( "b" );

  expect( list.get() ).toEqual( expected );
} );

// view
const movieArr = [
  { medium: "movie", name: "The Dark Knight" },
  { medium: "movie", name: "Interstellar" },
  { medium: "movie", name: "Forrest Gump" },
  { medium: "movie", name: "Fantastic Mr Fox" },
  { medium: "movie", name: "Enders Game" },
  { medium: "movie", name: "The Matrix" },
  { medium: "movie", name: "Clockwork Orange" },
  { medium: "movie", name: "Fight Club" },
  { medium: "movie", name: "Seven" },
  { medium: "movie", name: "Gran Torino" },
  { medium: "movie", name: "Hot Fuzz" },
  { medium: "movie", name: "8 Mile" },
  { medium: "movie", name: "Memento" },
  { medium: "movie", name: "Lala Land" },
  { medium: "movie", name: "The Revenant" },
  { medium: "movie", name: "Shutter Island" },
  { medium: "movie", name: "Kill Bill" },
  { medium: "movie", name: "Pulp Fiction" },
  { medium: "movie", name: "Death Proof" },
  { medium: "movie", name: "Blade Runner" },
  { medium: "movie", name: "The Big Short" },
  { medium: "movie", name: "Citizenfour" },
  { medium: "movie", name: "Death at a Funeral" },
  { medium: "movie", name: "Tekkonkinkreet" },
  { medium: "movie", name: "Sucker Punch" },
  { medium: "movie", name: "Source Code" },
];

test( "default view returns correct list", () => {
  const list = new ItemList( movieArr );
  const expected = list.get().slice( 0, list.VIEW_RANGE );


  expect( list.getView() ).toEqual( expected );
} );

test( "view=1 returns correct list", () => {
  const list = new ItemList( movieArr );
  const expected = list.get().slice( list.VIEW_RANGE, list.VIEW_RANGE *2 );

  list.increaseView();

  expect( list.getView() ).toEqual( expected );
} );

test( "increaseView not increasing over len of list", () => {
  const list = new ItemList( movieArr.slice( 0, 4 ) );
  const expected = list.get();

  list.increaseView();

  expect( list.getView() ).toEqual( expected );
} );

test( "decreaseView not decreaseing below 0", () => {
  const list = new ItemList( movieArr.slice( 0, 4 ) );
  const expected = list.get();

  list.decreaseView();

  expect( list.getView() ).toEqual( expected );
} );

test( "resetView", () => {
  const list = new ItemList( movieArr );
  const expected = list.get().slice( 0, list.VIEW_RANGE );

  list.increaseView();
  list.resetView();

  expect( list.getView() ).toEqual( expected );
} );
