import ItemList from "./ItemList";

export default async function list( unvalidatedFilter = null ) {
  const list = new ItemList();
  await list.reloadFromConfig();

  list.addFilter( unvalidatedFilter );
  const data = list.get()
    .map( d => {
      let res = d.name;

      if ( d.desc )
        res = `${res}: ${d.desc}`;

      if ( list.getFilters().length )
        res = `${res} [${d.medium}]`;

      return res;
    } );

  const dataToPrint = data.reduce( ( acc, cur ) => acc = `${acc}${acc ? "\n" : ""}${cur}`, "" );
  console.log( dataToPrint );
}
