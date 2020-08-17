import { readTypes } from "./fs";

const types = readTypes();

export const dataTypes = types.map( t => t.name );
