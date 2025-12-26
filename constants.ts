import { Spell } from './types';

export const INITIAL_SPELLS: Spell[] = [
  { id: 's1', name: 'Projectile Magique', level: 1, school: 'Évocation', description: '2d4+2 dégâts de force.', damage: '2d4+2' },
  { id: 's2', name: 'Armure de Mage', level: 1, school: 'Abjuration', description: '+4 CA.', damage: '-' },
  { id: 's3', name: 'Boule de Feu', level: 3, school: 'Évocation', description: '1d6 dégâts par niveau.', damage: '1d6/niv' },
  { id: 's4', name: 'Soins Légers', level: 1, school: 'Invocation', description: 'Soigne 1d8+1.', damage: 'Heal 1d8+1' },
  { id: 's5', name: 'Lumière', level: 0, school: 'Évocation', description: 'Illumine un objet.', damage: '-' },
  { id: 's6', name: 'Détection de la Magie', level: 0, school: 'Divination', description: 'Détecte les auras magiques.', damage: '-' },
];

export const SCHOOLS = [
  'Abjuration', 'Invocation', 'Divination', 'Enchantement', 
  'Évocation', 'Illusion', 'Nécromancie', 'Transmutation', 'Universelle'
];

export const DEFAULT_CONSUMABLES = {
  arrows: 20,
  bolts: 10,
  bullets: 10,
  potions: 0
};
