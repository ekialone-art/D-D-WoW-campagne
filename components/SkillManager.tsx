import React, { useState } from 'react';
import { Character, Skill } from '../types';
import { Plus, X } from 'lucide-react';

interface SkillManagerProps {
  character: Character;
  onUpdateCharacter: (char: Character) => void;
}

const SkillManager: React.FC<SkillManagerProps> = ({ character, onUpdateCharacter }) => {
  const [newSkillName, setNewSkillName] = useState('');

  const addSkill = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSkillName.trim()) return;

    const newSkill: Skill = {
      id: Date.now().toString(),
      name: newSkillName,
      ranks: 0
    };

    onUpdateCharacter({
      ...character,
      skills: [...character.skills, newSkill]
    });
    setNewSkillName('');
  };

  const removeSkill = (id: string) => {
    onUpdateCharacter({
      ...character,
      skills: character.skills.filter(s => s.id !== id)
    });
  };

  const updateSkillRank = (id: string, rank: number) => {
    onUpdateCharacter({
      ...character,
      skills: character.skills.map(s => s.id === id ? { ...s, ranks: rank } : s)
    });
  };

  return (
    <div className="bg-gray-800 rounded-lg border border-gray-700 p-4">
      <h3 className="text-xl font-bold mb-4 flex items-center gap-2">Compétences</h3>
      
      <form onSubmit={addSkill} className="mb-6 flex gap-2">
        <input 
          type="text"
          value={newSkillName}
          onChange={(e) => setNewSkillName(e.target.value)}
          placeholder="Nouvelle compétence..."
          className="flex-1 bg-gray-900 border border-gray-600 rounded px-3 py-2 text-white focus:outline-none focus:border-blue-500"
        />
        <button 
          type="submit"
          className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded transition-colors"
        >
          <Plus size={20} />
        </button>
      </form>

      <div className="space-y-2">
        {character.skills.length === 0 && (
            <p className="text-gray-500 text-center py-4">Aucune compétence ajoutée.</p>
        )}
        {character.skills.map(skill => (
          <div key={skill.id} className="flex items-center justify-between bg-gray-900/50 p-3 rounded hover:bg-gray-900 transition-colors group">
            <span className="font-medium text-gray-200">{skill.name}</span>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 bg-gray-800 rounded px-2">
                 <span className="text-xs text-gray-500 uppercase">Rangs</span>
                 <input 
                    type="number"
                    value={skill.ranks}
                    onChange={(e) => updateSkillRank(skill.id, parseInt(e.target.value) || 0)}
                    className="w-12 bg-transparent text-right font-mono text-white focus:outline-none"
                 />
              </div>
              <button 
                onClick={() => removeSkill(skill.id)}
                className="text-gray-600 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <X size={18} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SkillManager;