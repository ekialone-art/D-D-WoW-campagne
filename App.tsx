import React, { useState, useEffect } from 'react';
import { Character, Spell, Tab } from './types';
import { INITIAL_SPELLS, DEFAULT_CONSUMABLES } from './constants';
import HealthBar from './components/HealthBar';
import ConsumablesTracker from './components/ConsumablesTracker';
import SpellManager from './components/SpellManager';
import SkillManager from './components/SkillManager';
import { Users, Shield, Book, Zap, PlusCircle, Trash2 } from 'lucide-react';

const App: React.FC = () => {
  const [characters, setCharacters] = useState<Character[]>([]);
  const [activeCharId, setActiveCharId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<Tab>('status');
  const [globalSpells, setGlobalSpells] = useState<Spell[]>(INITIAL_SPELLS);

  // Load from local storage
  useEffect(() => {
    const savedChars = localStorage.getItem('dnd35_characters');
    const savedSpells = localStorage.getItem('dnd35_spells');
    
    if (savedChars) {
      setCharacters(JSON.parse(savedChars));
    }
    if (savedSpells) {
        // Merge saved custom spells with initial spells, avoiding duplicates based on ID
        const customSpells = JSON.parse(savedSpells);
        const combined = [...INITIAL_SPELLS];
        customSpells.forEach((s: Spell) => {
            if (!combined.find(i => i.id === s.id)) combined.push(s);
        });
        setGlobalSpells(combined);
    }
  }, []);

  // Save to local storage
  useEffect(() => {
    localStorage.setItem('dnd35_characters', JSON.stringify(characters));
  }, [characters]);

  useEffect(() => {
    const customSpells = globalSpells.filter(s => s.isCustom);
    localStorage.setItem('dnd35_spells', JSON.stringify(customSpells));
  }, [globalSpells]);

  const createCharacter = () => {
    const newChar: Character = {
      id: `char-${Date.now()}`,
      name: `Personnage ${characters.length + 1}`,
      class: 'Aventurier',
      level: 1,
      hp: { current: 10, max: 10 },
      consumables: { ...DEFAULT_CONSUMABLES },
      spellSlots: {},
      knownSpells: [],
      skills: []
    };
    setCharacters([...characters, newChar]);
    setActiveCharId(newChar.id);
  };

  const deleteCharacter = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (confirm('Supprimer ce personnage ?')) {
        const newChars = characters.filter(c => c.id !== id);
        setCharacters(newChars);
        if (activeCharId === id) {
            setActiveCharId(newChars.length > 0 ? newChars[0].id : null);
        }
    }
  };

  const updateCharacter = (updated: Character) => {
    setCharacters(characters.map(c => c.id === updated.id ? updated : c));
  };

  const addCustomSpell = (spell: Spell) => {
    setGlobalSpells([...globalSpells, spell]);
  };

  const activeCharacter = characters.find(c => c.id === activeCharId);

  return (
    <div className="min-h-screen bg-[#111215] pb-20">
        {/* Header */}
        <header className="bg-gray-900 border-b border-gray-800 p-4 sticky top-0 z-50">
            <div className="max-w-3xl mx-auto flex justify-between items-center">
                <h1 className="text-xl md:text-2xl font-bold text-gray-100 flex items-center gap-2">
                    <Shield className="text-red-600" /> 
                    <span className="hidden sm:inline">D&D 3.5 Companion</span>
                    <span className="sm:hidden">D&D 3.5</span>
                </h1>
                
                {/* Character Selector */}
                <div className="flex items-center gap-2">
                    <div className="relative group">
                        <button className="flex items-center gap-2 bg-gray-800 hover:bg-gray-700 text-white px-3 py-2 rounded-lg border border-gray-700 transition-colors">
                            <Users size={18} />
                            <span className="max-w-[100px] truncate">
                                {activeCharacter ? activeCharacter.name : 'Sélectionner'}
                            </span>
                        </button>
                        
                        {/* Dropdown */}
                        <div className="absolute right-0 top-full mt-2 w-56 bg-gray-800 rounded-lg shadow-xl border border-gray-700 hidden group-hover:block p-1">
                            {characters.map(char => (
                                <div 
                                    key={char.id}
                                    onClick={() => setActiveCharId(char.id)}
                                    className={`flex justify-between items-center p-2 rounded cursor-pointer hover:bg-gray-700 ${activeCharId === char.id ? 'bg-gray-700 text-blue-400' : 'text-gray-300'}`}
                                >
                                    <span>{char.name}</span>
                                    <button onClick={(e) => deleteCharacter(char.id, e)} className="text-gray-500 hover:text-red-500 p-1"><Trash2 size={14}/></button>
                                </div>
                            ))}
                            <button 
                                onClick={createCharacter}
                                className="w-full text-left p-2 text-green-400 hover:bg-gray-700 rounded flex items-center gap-2 text-sm mt-1 border-t border-gray-700"
                            >
                                <PlusCircle size={14} /> Nouveau Personnage
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </header>

        <main className="max-w-3xl mx-auto p-4">
            {activeCharacter ? (
                <>
                    {/* Character Info Edit */}
                    <div className="mb-6 flex gap-4 items-end">
                        <div className="flex-1">
                            <label className="text-xs text-gray-500 uppercase font-bold tracking-wider">Nom</label>
                            <input 
                                type="text" 
                                value={activeCharacter.name}
                                onChange={(e) => updateCharacter({...activeCharacter, name: e.target.value})}
                                className="w-full bg-transparent border-b border-gray-700 text-2xl font-bold text-white focus:border-blue-500 focus:outline-none py-1"
                            />
                        </div>
                         <div className="w-24">
                            <label className="text-xs text-gray-500 uppercase font-bold tracking-wider">Niveau</label>
                            <input 
                                type="number" 
                                value={activeCharacter.level}
                                onChange={(e) => updateCharacter({...activeCharacter, level: parseInt(e.target.value) || 1})}
                                className="w-full bg-transparent border-b border-gray-700 text-xl font-bold text-white focus:border-blue-500 focus:outline-none py-1 text-center"
                            />
                        </div>
                    </div>

                    {/* Navigation Tabs */}
                    <div className="flex mb-6 bg-gray-900/50 p-1 rounded-lg">
                        <button 
                            onClick={() => setActiveTab('status')}
                            className={`flex-1 py-2 text-sm font-bold rounded-md transition-all ${activeTab === 'status' ? 'bg-gray-700 text-white shadow' : 'text-gray-500 hover:text-gray-300'}`}
                        >
                            Général
                        </button>
                         <button 
                            onClick={() => setActiveTab('spells')}
                            className={`flex-1 py-2 text-sm font-bold rounded-md transition-all ${activeTab === 'spells' ? 'bg-purple-900/50 text-purple-200 shadow' : 'text-gray-500 hover:text-gray-300'}`}
                        >
                            Sorts
                        </button>
                         <button 
                            onClick={() => setActiveTab('skills')}
                            className={`flex-1 py-2 text-sm font-bold rounded-md transition-all ${activeTab === 'skills' ? 'bg-blue-900/50 text-blue-200 shadow' : 'text-gray-500 hover:text-gray-300'}`}
                        >
                            Compétences
                        </button>
                    </div>

                    {/* Content */}
                    <div className="space-y-6 animate-fadeIn">
                        {activeTab === 'status' && (
                            <>
                                <HealthBar 
                                    current={activeCharacter.hp.current} 
                                    max={activeCharacter.hp.max}
                                    onChange={(curr, max) => updateCharacter({
                                        ...activeCharacter,
                                        hp: { current: curr, max: max }
                                    })}
                                />
                                <h3 className="text-lg font-bold text-gray-400 mt-8 mb-4 border-b border-gray-800 pb-2">Consommables</h3>
                                <ConsumablesTracker 
                                    consumables={activeCharacter.consumables}
                                    onChange={(newConsumables) => updateCharacter({
                                        ...activeCharacter,
                                        consumables: newConsumables
                                    })}
                                />
                            </>
                        )}

                        {activeTab === 'spells' && (
                            <SpellManager 
                                character={activeCharacter}
                                allSpells={globalSpells}
                                onUpdateCharacter={updateCharacter}
                                onAddCustomSpell={addCustomSpell}
                            />
                        )}

                        {activeTab === 'skills' && (
                            <SkillManager 
                                character={activeCharacter}
                                onUpdateCharacter={updateCharacter}
                            />
                        )}
                    </div>
                </>
            ) : (
                <div className="flex flex-col items-center justify-center h-[60vh] text-gray-500">
                    <Shield size={64} className="mb-4 text-gray-700" />
                    <h2 className="text-xl font-bold mb-2">Aucun personnage sélectionné</h2>
                    <p className="mb-6 text-center max-w-xs">Créez ou sélectionnez un personnage pour commencer à suivre son aventure.</p>
                    <button 
                        onClick={createCharacter}
                        className="bg-blue-600 hover:bg-blue-500 text-white px-6 py-3 rounded-lg font-bold transition-transform active:scale-95"
                    >
                        Créer un Personnage
                    </button>
                </div>
            )}
        </main>
    </div>
  );
};

export default App;