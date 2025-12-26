import React, { useState } from 'react';
import { Spell, SpellSlot, Character } from '../types';
import { SCHOOLS } from '../constants';
import { ChevronDown, ChevronUp, Plus, Trash2, BookOpen, Info, Wand2 } from 'lucide-react';

interface SpellManagerProps {
  character: Character;
  allSpells: Spell[];
  onUpdateCharacter: (char: Character) => void;
  onAddCustomSpell: (spell: Spell) => void;
}

const SpellManager: React.FC<SpellManagerProps> = ({ character, allSpells, onUpdateCharacter, onAddCustomSpell }) => {
  const [selectedLevel, setSelectedLevel] = useState<number>(1);
  const [showAddModal, setShowAddModal] = useState(false);
  const [expandedSpell, setExpandedSpell] = useState<string | null>(null);

  // Custom Spell Form State
  const [newSpell, setNewSpell] = useState<Partial<Spell>>({
    name: '',
    level: 1,
    school: 'Universelle',
    description: '',
    damage: '',
    isCustom: true
  });

  const updateSpellSlot = (level: number, field: keyof SpellSlot, value: number) => {
    const currentSlots = character.spellSlots[level] || { total: 0, used: 0 };
    const updatedSlots = { ...currentSlots, [field]: Math.max(0, value) };
    
    onUpdateCharacter({
      ...character,
      spellSlots: {
        ...character.spellSlots,
        [level]: updatedSlots
      }
    });
  };

  const toggleKnownSpell = (spellId: string) => {
    const isKnown = character.knownSpells.includes(spellId);
    let newKnown = [...character.knownSpells];
    if (isKnown) {
      newKnown = newKnown.filter(id => id !== spellId);
    } else {
      newKnown.push(spellId);
    }
    onUpdateCharacter({ ...character, knownSpells: newKnown });
  };

  const handleCreateSpell = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSpell.name) return;
    
    const spell: Spell = {
      id: `custom-${Date.now()}`,
      name: newSpell.name,
      level: newSpell.level || 0,
      school: newSpell.school || 'Universelle',
      description: newSpell.description || '',
      damage: newSpell.damage || '',
      isCustom: true
    };

    onAddCustomSpell(spell);
    setShowAddModal(false);
    setNewSpell({ name: '', level: 1, school: 'Universelle', description: '', damage: '', isCustom: true });
    // Auto add to known
    toggleKnownSpell(spell.id);
  };

  const filteredSpells = allSpells.filter(s => s.level === selectedLevel);
  const currentSlot = character.spellSlots[selectedLevel] || { total: 0, used: 0 };

  return (
    <div className="space-y-6">
      {/* Level Selection */}
      <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-thin">
        {Array.from({ length: 10 }).map((_, i) => (
          <button
            key={i}
            onClick={() => setSelectedLevel(i)}
            className={`flex-shrink-0 px-4 py-2 rounded-lg font-bold transition-all ${
              selectedLevel === i 
                ? 'bg-purple-600 text-white ring-2 ring-purple-400' 
                : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
            }`}
          >
            Niv {i}
          </button>
        ))}
      </div>

      {/* Slots Manager */}
      <div className="bg-gray-800 p-4 rounded-lg border border-gray-700">
        <h3 className="text-lg font-bold mb-4 text-purple-300 flex items-center gap-2">
            <Wand2 size={20} /> Emplacements de Sorts (Niveau {selectedLevel})
        </h3>
        <div className="flex items-center gap-8 justify-center bg-gray-900 p-4 rounded-lg">
          <div className="text-center">
            <label className="block text-xs text-gray-500 mb-1">DISPONIBLES</label>
            <div className="flex items-center gap-2">
                <button onClick={() => updateSpellSlot(selectedLevel, 'total', currentSlot.total - 1)} className="p-1 bg-gray-700 rounded hover:bg-gray-600"><Minus size={16}/></button>
                <span className="text-2xl font-mono w-8 text-center">{currentSlot.total}</span>
                <button onClick={() => updateSpellSlot(selectedLevel, 'total', currentSlot.total + 1)} className="p-1 bg-gray-700 rounded hover:bg-gray-600"><Plus size={16}/></button>
            </div>
          </div>
          
          <div className="h-10 w-px bg-gray-700"></div>

          <div className="text-center">
            <label className="block text-xs text-gray-500 mb-1">UTILISÉS</label>
             <div className="flex items-center gap-2">
                <button onClick={() => updateSpellSlot(selectedLevel, 'used', currentSlot.used - 1)} className="p-1 bg-gray-700 rounded hover:bg-gray-600"><Minus size={16}/></button>
                <span className={`text-2xl font-mono w-8 text-center ${currentSlot.used >= currentSlot.total && currentSlot.total > 0 ? 'text-red-500' : 'text-blue-400'}`}>
                    {currentSlot.used}
                </span>
                <button onClick={() => updateSpellSlot(selectedLevel, 'used', currentSlot.used + 1)} className="p-1 bg-gray-700 rounded hover:bg-gray-600"><Plus size={16}/></button>
            </div>
          </div>
        </div>
      </div>

      {/* Spell List */}
      <div className="bg-gray-800 rounded-lg border border-gray-700 overflow-hidden">
        <div className="p-4 bg-gray-800 border-b border-gray-700 flex justify-between items-center sticky top-0 z-10">
          <h3 className="text-lg font-bold text-gray-200">Grimoire & Sorts Connus</h3>
          <button 
            onClick={() => setShowAddModal(true)}
            className="text-sm bg-purple-700 hover:bg-purple-600 text-white px-3 py-1.5 rounded flex items-center gap-1 transition-colors"
          >
            <Plus size={16} /> Créer Sort
          </button>
        </div>
        
        <div className="divide-y divide-gray-700 max-h-[500px] overflow-y-auto">
          {filteredSpells.length === 0 && (
            <div className="p-8 text-center text-gray-500 italic">Aucun sort trouvé pour ce niveau.</div>
          )}
          {filteredSpells.map(spell => {
            const isKnown = character.knownSpells.includes(spell.id);
            const isExpanded = expandedSpell === spell.id;
            
            return (
              <div key={spell.id} className={`transition-colors ${isKnown ? 'bg-purple-900/10' : 'bg-transparent'}`}>
                <div className="p-3 flex items-center gap-3">
                  <input 
                    type="checkbox"
                    checked={isKnown}
                    onChange={() => toggleKnownSpell(spell.id)}
                    className="w-5 h-5 rounded border-gray-600 text-purple-600 focus:ring-purple-500 bg-gray-700"
                  />
                  <div 
                    className="flex-1 cursor-pointer"
                    onClick={() => setExpandedSpell(isExpanded ? null : spell.id)}
                  >
                    <div className="flex justify-between items-center">
                        <span className={`font-medium ${isKnown ? 'text-purple-300' : 'text-gray-400'}`}>{spell.name}</span>
                        {isExpanded ? <ChevronUp size={16} className="text-gray-500" /> : <ChevronDown size={16} className="text-gray-500" />}
                    </div>
                  </div>
                </div>
                
                {isExpanded && (
                  <div className="bg-gray-900/50 p-4 pl-11 text-sm space-y-2 border-t border-gray-700/50">
                    <div className="flex gap-4 text-gray-400 text-xs uppercase tracking-wider">
                      <span><span className="text-gray-500">École:</span> {spell.school}</span>
                      <span><span className="text-gray-500">Dégâts:</span> {spell.damage || 'N/A'}</span>
                    </div>
                    <p className="text-gray-300 leading-relaxed">{spell.description}</p>
                    {spell.isCustom && <span className="inline-block text-[10px] bg-gray-700 text-gray-300 px-1 rounded">Custom</span>}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Add Custom Spell Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-800 rounded-xl shadow-2xl max-w-md w-full border border-gray-600 flex flex-col max-h-[90vh]">
            <div className="p-4 border-b border-gray-700">
               <h3 className="text-xl font-bold text-white">Nouveau Sort Maison</h3>
            </div>
           
            <form onSubmit={handleCreateSpell} className="p-4 space-y-4 overflow-y-auto">
              <div>
                <label className="block text-sm text-gray-400 mb-1">Nom du sort</label>
                <input 
                  required
                  type="text" 
                  value={newSpell.name}
                  onChange={e => setNewSpell({...newSpell, name: e.target.value})}
                  className="w-full bg-gray-900 border border-gray-600 rounded p-2 text-white focus:border-purple-500 outline-none"
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                 <div>
                    <label className="block text-sm text-gray-400 mb-1">Niveau</label>
                    <input 
                      type="number" 
                      min="0" max="9"
                      value={newSpell.level}
                      onChange={e => setNewSpell({...newSpell, level: parseInt(e.target.value)})}
                      className="w-full bg-gray-900 border border-gray-600 rounded p-2 text-white focus:border-purple-500 outline-none"
                    />
                 </div>
                 <div>
                    <label className="block text-sm text-gray-400 mb-1">École</label>
                    <select 
                      value={newSpell.school}
                      onChange={e => setNewSpell({...newSpell, school: e.target.value})}
                      className="w-full bg-gray-900 border border-gray-600 rounded p-2 text-white focus:border-purple-500 outline-none"
                    >
                        {SCHOOLS.map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                 </div>
              </div>

              <div>
                <label className="block text-sm text-gray-400 mb-1">Dégâts / Effet (court)</label>
                <input 
                  type="text" 
                  value={newSpell.damage}
                  onChange={e => setNewSpell({...newSpell, damage: e.target.value})}
                  placeholder="ex: 1d6/niv"
                  className="w-full bg-gray-900 border border-gray-600 rounded p-2 text-white focus:border-purple-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-sm text-gray-400 mb-1">Description</label>
                <textarea 
                  rows={3}
                  value={newSpell.description}
                  onChange={e => setNewSpell({...newSpell, description: e.target.value})}
                  className="w-full bg-gray-900 border border-gray-600 rounded p-2 text-white focus:border-purple-500 outline-none resize-none"
                ></textarea>
              </div>

              <div className="flex gap-3 pt-4">
                <button 
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="flex-1 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded transition-colors"
                >
                  Annuler
                </button>
                <button 
                  type="submit"
                  className="flex-1 py-2 bg-purple-700 hover:bg-purple-600 text-white rounded transition-colors"
                >
                  Créer
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

// Helper components for icons
const Minus = ({ size, className }: { size: number, className?: string }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><line x1="5" y1="12" x2="19" y2="12"></line></svg>
);
const Plus = ({ size, className }: { size: number, className?: string }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
);

export default SpellManager;