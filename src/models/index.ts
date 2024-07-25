export type Character = {
  name: string;
  score: number;
  type: string;
};

export type CharactersResponse = {
  items: Character[];
};
