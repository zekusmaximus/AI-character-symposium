import { useState, useEffect } from 'react';
import { Character, CharacterFormState } from '../types/character';
import { characterService } from '../services/characterService';

interface UseCharacterResult {
  character: Character | null;
  loading: boolean;
  error: Error | null;
  editForm: CharacterFormState;
  editing: boolean;
  setEditing: (editing: boolean) => void;
  updateFormField: (field: keyof CharacterFormState, value: string) => void;
  saveCharacter: () => Promise<void>;
  resetForm: () => void;
}

export function useCharacter(characterId: string | undefined): UseCharacterResult {
  const [character, setCharacter] = useState<Character | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [editing, setEditing] = useState(false);
  const [editForm, setEditForm] = useState<CharacterFormState>({
    name: '',
    description: '',
    traits: '',
    values: '',
    voicePatterns: ''
  });

  useEffect(() => {
    if (!characterId) {
      setLoading(false);
      return;
    }

    const fetchCharacter = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await characterService.getCharacter(characterId);
        setCharacter(data);
        setEditForm({
          name: data.name,
          description: data.description,
          traits: data.traits,
          values: data.values,
          voicePatterns: data.voicePatterns
        });
      } catch (err) {
        console.error('Error fetching character:', err);
        setError(err instanceof Error ? err : new Error('Failed to fetch character'));
      } finally {
        setLoading(false);
      }
    };

    fetchCharacter();
  }, [characterId]);

  const updateFormField = (field: keyof CharacterFormState, value: string) => {
    setEditForm(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const saveCharacter = async () => {
    if (!character || !characterId) return;
    
    try {
      setLoading(true);
      setError(null);
      const updatedCharacter = await characterService.updateCharacter(characterId, {
        ...character,
        name: editForm.name,
        description: editForm.description,
        traits: editForm.traits,
        values: editForm.values,
        voicePatterns: editForm.voicePatterns
      });
      
      setCharacter(updatedCharacter);
      setEditing(false);
    } catch (err) {
      console.error('Error updating character:', err);
      setError(err instanceof Error ? err : new Error('Failed to update character'));
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    if (!character) return;
    
    setEditForm({
      name: character.name,
      description: character.description,
      traits: character.traits,
      values: character.values,
      voicePatterns: character.voicePatterns
    });
  };

  return {
    character,
    loading,
    error,
    editForm,
    editing,
    setEditing,
    updateFormField,
    saveCharacter,
    resetForm
  };
}