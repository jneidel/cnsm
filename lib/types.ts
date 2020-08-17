// import chalk from "chalk";
import { readTypes } from "./fs";

const types = readTypes();

export const dataTypes = Object.keys( types );

