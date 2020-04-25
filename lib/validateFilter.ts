export function validateFilter( filterCategory: string | null ) {
  switch ( filterCategory ) {
    case "S":
    case "s":
    case "series":
      return "series";
    case "V":
    case "v":
    case "video":
      return "video";
    case "MV":
    case "mv":
    case "movie":
      return "movie";
    case "MA":
    case "ma":
    case "manga":
      return "manga";
    case "C":
    case "c":
    case "comic":
      return "comic";
    case "AT":
    case "at":
    case "article":
      return "article";
    case "AN":
    case "an":
    case "anime":
      return "anime";
    case "F":
    case "f":
    case "file":
      return "file";
    case "B":
    case "b":
    case "book":
      return "book";
    case "g":
    case "prog":
      return "prog";
    case "AR":
    case "ar":
    case "art":
      return "art";
    default:
      return null;
  }
}
