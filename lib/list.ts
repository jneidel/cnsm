import ItemList from "./ItemList";

export default async function list( unvalidatedFilter = null ) {
  const list = new ItemList();
  await list.reloadFromFile();

  list.addFilter( unvalidatedFilter );
  const data = list.get()
    .map( d => {
      let res = d.name;

      if ( d.desc )
        res = `${res}: ${d.desc}`;

      const filtersLen = list.getFilters().length;
      if ( !filtersLen || filtersLen > 1 )
        res = `${res} [${d.medium}]`;

      return res;
    } );

  const dataToPrint = data.reduce( ( acc, cur ) => acc = `${acc}${acc ? "\n" : ""}${cur}`, "" );
  console.log( dataToPrint );
}
