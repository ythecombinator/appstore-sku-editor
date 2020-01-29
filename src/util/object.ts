export interface Indexed<Type> {
  [index: string]: Type;
}

export type Dictionary = Indexed<string>;
