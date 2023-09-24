import type { Config } from "unique-names-generator";
import {
  adjectives,
  animals,
  NumberDictionary,
  uniqueNamesGenerator,
} from "unique-names-generator";

const numberDictionary = NumberDictionary.generate({
  min: 100,
  max: 999,
});

const config: Config = {
  dictionaries: [adjectives, animals, numberDictionary],
  length: 3,
  separator: "",
  style: "capital",
};

export const randomUsername = uniqueNamesGenerator(config);
