export interface Spell {
  id: string;
  name: string;
  level: number;
  school: string;
  description: string;
  damage?: string;
  isCustom?: boolean;
}

export interface Skill {
  id: string;
  name: string;
  ranks: number;
}

export interface Consumables {
  arrows: number;
  bolts: number;
  bullets: number;
  potions: number;
}

export interface SpellSlot {
  total: number;
  used: number;
}

export interface Character {
  id: string;
  name: string;
  class: string;
  level: number;
  hp: {
    current: number;
    max: number;
  };
  consumables: Consumables;
  spellSlots: Record<number, SpellSlot>; // Level 0-9
  knownSpells: string[]; // IDs of known spells
  skills: Skill[];
}

export type Tab = 'status' | 'spells' | 'skills';
