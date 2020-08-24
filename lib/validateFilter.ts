export function validateFilter( filterCategory: string | null ) {
  if ( filterCategory === null )
    return null;

  switch ( filterCategory.toLowerCase() ) {
    case "s":
    case "series":
      return "series";
    case "v":
    case "video":
      return "video";
    case "mv":
    case "movie":
      return "movie";
    case "ma":
    case "manga":
      return "manga";
    case "c":
    case "comic":
      return "comic";
    case "at":
    case "article":
      return "article";
    case "an":
    case "anime":
      return "anime";
    case "f":
    case "file":
      return "file";
    case "b":
    case "book":
      return "book";
    case "ar":
    case "art":
      return "art";
    default:
      return null;
  }
}
