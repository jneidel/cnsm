import { validateFilter } from "./validateFilter";
import ItemList from "./ItemList";

export default async function list( unvalidatedFilter = null ) {
  const filter = validateFilter( unvalidatedFilter );

  const list = new ItemList();
  await list.reloadFromConfig();

  list.addFilter( filter );
  const data = list.get()
    .map( d => {
      let res = d.name;

      if ( d.desc )
        res = `${res}: ${d.desc}`;

      if ( !filter )
        res = `${res} [${d.medium}]`;

      return res;
    } );

  const dataToPrint = data.reduce( ( acc, cur ) => acc = `${acc}\n${cur}`, "" );
  console.log( dataToPrint );
}
