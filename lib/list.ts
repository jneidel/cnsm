import { validateFilters } from "./render";
import { readConfig } from "./fs";

export default async function list( unvalidatedFilter = null ) {
  const filter = validateFilters( unvalidatedFilter );

  const data = await readConfig()
    .then( d => filter ?  d.filter( d => d.type === filter ) : d )
    .then( d => d.map( d => {
      let res = d.name;

      if ( d.desc )
        res = `${res}: ${d.desc}`;

      if ( !filter )
        res = `${res} [${d.type}]`;

      return res;
    } )
  )

  const dataToPrint = data.reduce( ( acc, cur ) => acc = `${acc}\n${cur}`, "" );
  console.log( dataToPrint );
}
