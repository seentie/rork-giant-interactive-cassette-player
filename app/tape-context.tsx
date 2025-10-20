import { useState, useEffect, useCallback, useMemo } from 'react';
import createContextHook from '@nkzw/create-context-hook';
import AsyncStorage from '@react-native-async-storage/async-storage';

export type TapeFont = 'default' | 'handwriting' | 'monospace' | 'serif' | 'bold' | 'sharpie' | 'default-bold' | 'handwriting-bold' | 'monospace-bold' | 'serif-bold' | 'sharpie-bold';

export interface TapeStyle {
  id: string;
  name: string;
  cassetteBody: string[];
  labelStripe: string;
  windowColor: string;
  reelColor: string;
}

export interface CustomTape {
  id: string;
  name: string;
  to: string;
  description: string;
  createdAt: string;
  styleId: string;
  font: TapeFont;
  playlistUrl?: string;
}

export interface TapeLabelSettings {
  font: TapeFont;
}

export const TAPE_STYLES: TapeStyle[] = [
  {
    id: 'classic-red',
    name: 'Classic Red',
    cassetteBody: ['#F5E6D3', '#E8D4B0'],
    labelStripe: '#FF6B6B',
    windowColor: 'rgba(0, 0, 0, 0.8)',
    reelColor: '#1A1A1A',
  },
  {
    id: 'miami-orange',
    name: 'Miami Orange',
    cassetteBody: ['#FFE66D', '#FF9F1C'],
    labelStripe: '#FF006E',
    windowColor: 'rgba(0, 0, 0, 0.8)',
    reelColor: '#240046',
  },
  {
    id: 'neon-cyan',
    name: 'Neon Cyan',
    cassetteBody: ['#00F5FF', '#0080FF'],
    labelStripe: '#FF1493',
    windowColor: 'rgba(0, 0, 0, 0.9)',
    reelColor: '#8B008B',
  },
  {
    id: 'sunset-yellow',
    name: 'Sunset Yellow',
    cassetteBody: ['#FFE082', '#FFCC02'],
    labelStripe: '#FF4081',
    windowColor: 'rgba(0, 0, 0, 0.8)',
    reelColor: '#6A1B9A',
  },
  {
    id: 'purple-haze',
    name: 'Purple Haze',
    cassetteBody: ['#FF00FF', '#CC00CC'],
    labelStripe: '#00FFFF',
    windowColor: 'rgba(0, 0, 0, 0.9)',
    reelColor: '#000033',
  },
  {
    id: 'mint-green',
    name: 'Mint Green',
    cassetteBody: ['#06FFA5', '#00CC88'],
    labelStripe: '#FF6B35',
    windowColor: 'rgba(0, 0, 0, 0.8)',
    reelColor: '#1B263B',
  },
  {
    id: 'hot-pink',
    name: 'Hot Pink',
    cassetteBody: ['#FF69B4', '#FF1493'],
    labelStripe: '#FFD700',
    windowColor: 'rgba(0, 0, 0, 0.8)',
    reelColor: '#4B0082',
  },
  {
    id: 'electric-blue',
    name: 'Electric Blue',
    cassetteBody: ['#4169E1', '#1E90FF'],
    labelStripe: '#FF4500',
    windowColor: 'rgba(0, 0, 0, 0.85)',
    reelColor: '#191970',
  },
  {
    id: 'lime-green',
    name: 'Lime Green',
    cassetteBody: ['#32CD32', '#00FF00'],
    labelStripe: '#FF00FF',
    windowColor: 'rgba(0, 0, 0, 0.8)',
    reelColor: '#006400',
  },
  {
    id: 'golden-hour',
    name: 'Golden Hour',
    cassetteBody: ['#FFD700', '#FFA500'],
    labelStripe: '#DC143C',
    windowColor: 'rgba(0, 0, 0, 0.8)',
    reelColor: '#8B4513',
  },
  {
    id: 'pastel-pink',
    name: 'Pastel Pink',
    cassetteBody: ['#FFD1DC', '#FFC0CB'],
    labelStripe: '#FFB6C1',
    windowColor: 'rgba(0, 0, 0, 0.7)',
    reelColor: '#8B7D82',
  },
  {
    id: 'pastel-blue',
    name: 'Pastel Blue',
    cassetteBody: ['#B0E0E6', '#ADD8E6'],
    labelStripe: '#87CEEB',
    windowColor: 'rgba(0, 0, 0, 0.7)',
    reelColor: '#4682B4',
  },
  {
    id: 'pastel-mint',
    name: 'Pastel Mint',
    cassetteBody: ['#C1FFC1', '#B4EEB4'],
    labelStripe: '#9ACD32',
    windowColor: 'rgba(0, 0, 0, 0.7)',
    reelColor: '#556B2F',
  },
  {
    id: 'pastel-lavender',
    name: 'Pastel Lavender',
    cassetteBody: ['#E6E6FA', '#DDA0DD'],
    labelStripe: '#DA70D6',
    windowColor: 'rgba(0, 0, 0, 0.7)',
    reelColor: '#8B668B',
  },
  {
    id: 'pastel-peach',
    name: 'Pastel Peach',
    cassetteBody: ['#FFDAB9', '#FFE4B5'],
    labelStripe: '#FFA07A',
    windowColor: 'rgba(0, 0, 0, 0.7)',
    reelColor: '#CD853F',
  },
  {
    id: 'pastel-yellow',
    name: 'Pastel Yellow',
    cassetteBody: ['#FFFACD', '#FFEFD5'],
    labelStripe: '#FFD700',
    windowColor: 'rgba(0, 0, 0, 0.7)',
    reelColor: '#DAA520',
  },
  {
    id: 'black-white',
    name: 'Black & White',
    cassetteBody: ['#FFFFFF', '#F5F5F5'],
    labelStripe: '#000000',
    windowColor: 'rgba(0, 0, 0, 0.9)',
    reelColor: '#1A1A1A',
  },
  {
    id: 'charcoal-gray',
    name: 'Charcoal Gray',
    cassetteBody: ['#696969', '#808080'],
    labelStripe: '#2F4F4F',
    windowColor: 'rgba(0, 0, 0, 0.9)',
    reelColor: '#000000',
  },
  {
    id: 'silver-white',
    name: 'Silver White',
    cassetteBody: ['#E8E8E8', '#D3D3D3'],
    labelStripe: '#A9A9A9',
    windowColor: 'rgba(0, 0, 0, 0.8)',
    reelColor: '#696969',
  },
  {
    id: 'smoke-gray',
    name: 'Smoke Gray',
    cassetteBody: ['#C0C0C0', '#A8A8A8'],
    labelStripe: '#708090',
    windowColor: 'rgba(0, 0, 0, 0.85)',
    reelColor: '#2F4F4F',
  },
  {
    id: 'disco',
    name: 'Disco',
    cassetteBody: ['#FF00FF', '#FFD700'],
    labelStripe: '#00FFFF',
    windowColor: 'rgba(0, 0, 0, 0.9)',
    reelColor: '#8B008B',
  },
  {
    id: 'disco-gold',
    name: 'Disco Ball Gold',
    cassetteBody: ['#FFD700', '#FFC700', '#FFB700', '#FFA500', '#FFD700'],
    labelStripe: '#FF00FF',
    windowColor: 'rgba(0, 0, 0, 0.9)',
    reelColor: '#8B4513',
  },
  {
    id: 'disco-silver',
    name: 'Disco Ball Silver',
    cassetteBody: ['#F5F5F5', '#E8E8E8', '#D3D3D3', '#C0C0C0', '#E8E8E8'],
    labelStripe: '#FF1493',
    windowColor: 'rgba(0, 0, 0, 0.9)',
    reelColor: '#696969',
  },
  {
    id: 'christmas-red',
    name: 'Christmas Red',
    cassetteBody: ['#C41E3A', '#A0192C'],
    labelStripe: '#165B33',
    windowColor: 'rgba(0, 0, 0, 0.9)',
    reelColor: '#0F4D21',
  },
  {
    id: 'christmas-green',
    name: 'Christmas Green',
    cassetteBody: ['#165B33', '#0F4D21'],
    labelStripe: '#C41E3A',
    windowColor: 'rgba(0, 0, 0, 0.9)',
    reelColor: '#8B0000',
  },
  {
    id: 'festive-gold',
    name: 'Festive Gold',
    cassetteBody: ['#FFD700', '#B8860B'],
    labelStripe: '#8B0000',
    windowColor: 'rgba(0, 0, 0, 0.85)',
    reelColor: '#2F4F4F',
  },
  {
    id: 'snowflake-white',
    name: 'Snowflake White',
    cassetteBody: ['#FFFAFA', '#F0F8FF'],
    labelStripe: '#4682B4',
    windowColor: 'rgba(0, 0, 0, 0.8)',
    reelColor: '#1A1A1A',
  },
  {
    id: 'hanukkah-blue',
    name: 'Hanukkah Blue',
    cassetteBody: ['#0038A8', '#003399'],
    labelStripe: '#FFFFFF',
    windowColor: 'rgba(0, 0, 0, 0.9)',
    reelColor: '#000033',
  },
  {
    id: 'hanukkah-silver',
    name: 'Hanukkah Silver',
    cassetteBody: ['#C0C0C0', '#A8A8A8'],
    labelStripe: '#0038A8',
    windowColor: 'rgba(0, 0, 0, 0.85)',
    reelColor: '#003399',
  },
];

const getStoredTapes = async (): Promise<CustomTape[]> => {
  try {
    const stored = await AsyncStorage.getItem('customTapes');
    
    if (!stored || stored.trim() === '' || stored === 'undefined' || stored === 'null') {
      console.log('No stored tapes found or empty data');
      return [];
    }
    
    let parsed;
    try {
      parsed = JSON.parse(stored);
    } catch (jsonError) {
      console.error('JSON parse error, corrupted data detected:', jsonError);
      console.error('Corrupted data:', stored.substring(0, 100));
      console.log('Clearing corrupted storage');
      try {
        await AsyncStorage.removeItem('customTapes');
      } catch (removeError) {
        console.error('Failed to remove corrupted data:', removeError);
      }
      return [];
    }
    
    if (!Array.isArray(parsed)) {
      console.warn('Stored data is not an array, clearing storage');
      try {
        await AsyncStorage.removeItem('customTapes');
      } catch (removeError) {
        console.error('Failed to remove invalid array data:', removeError);
      }
      return [];
    }
    
    const validTapes = parsed.filter((tape: any) => 
      tape && 
      typeof tape === 'object' && 
      tape.id && 
      tape.name && 
      tape.styleId
    );
    
    console.log(`Loaded ${validTapes.length} valid tapes from storage`);
    return validTapes;
  } catch (error) {
    console.error('Error loading tapes:', error);
    try {
      await AsyncStorage.removeItem('customTapes');
      console.log('Cleared corrupted storage after error');
    } catch (clearError) {
      console.error('Failed to clear storage:', clearError);
    }
    return [];
  }
};

const saveStoredTapes = async (tapes: CustomTape[]): Promise<void> => {
  try {
    
    const validTapes = tapes.filter(tape => 
      tape && 
      typeof tape === 'object' && 
      tape.id && 
      tape.name && 
      tape.styleId
    );
    
    if (validTapes.length !== tapes.length) {
      console.warn('Filtered out invalid tapes:', tapes.length - validTapes.length);
    }
    
    let data;
    try {
      data = JSON.stringify(validTapes);
    } catch (stringifyError) {
      console.error('JSON stringify error:', stringifyError);
      throw new Error('Failed to serialize tapes');
    }
    
    if (!data || data === 'null' || data === 'undefined') {
      console.error('Invalid data to save:', data);
      return;
    }
    
    console.log('Saving to AsyncStorage, data length:', data.length, 'tapes count:', validTapes.length);
    
    await AsyncStorage.setItem('customTapes', data);
    console.log('Successfully saved tapes to storage');
    
    const verification = await AsyncStorage.getItem('customTapes');
    if (verification) {
      try {
        const verifiedTapes = JSON.parse(verification);
        console.log('Verification after save - stored tapes count:', verifiedTapes.length);
        
        if (verifiedTapes.length !== validTapes.length) {
          console.error('ERROR: Tape count mismatch! Expected:', validTapes.length, 'Got:', verifiedTapes.length);
        }
      } catch (verifyError) {
        console.error('Verification parse error:', verifyError);
      }
    }
  } catch (error) {
    console.error('Error saving tapes:', error);
    throw error;
  }
};

const getTapeLabelSettings = async (): Promise<TapeLabelSettings> => {
  try {
    const stored = await AsyncStorage.getItem('tapeLabelSettings');
    if (stored && stored !== 'undefined' && stored !== 'null') {
      try {
        return JSON.parse(stored);
      } catch (parseError) {
        console.log('Failed to parse tape label settings, using defaults', parseError);
        try {
          await AsyncStorage.removeItem('tapeLabelSettings');
        } catch (removeError) {
          console.error('Failed to remove corrupted settings:', removeError);
        }
      }
    }
  } catch (error) {
    console.log('Could not load tape label settings:', error);
  }
  return { font: 'default' };
};

const saveTapeLabelSettings = async (settings: TapeLabelSettings): Promise<void> => {
  try {
    const data = JSON.stringify(settings);
    await AsyncStorage.setItem('tapeLabelSettings', data);
    console.log('Tape label settings saved');
  } catch (error) {
    console.log('Could not save tape label settings:', error);
  }
};

export const [TapeProvider, useTapes] = createContextHook(() => {
  const [tapes, setTapes] = useState<CustomTape[]>([]);
  const [currentTapeId, setCurrentTapeId] = useState<string | null>(null);
  const [tapeLabelSettings, setTapeLabelSettings] = useState<TapeLabelSettings>({ font: 'default' });
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    let mounted = true;
    
    const loadData = async () => {
      try {
        console.log('Loading tapes from storage...');
        const [loadedTapes, settings] = await Promise.all([
          getStoredTapes(),
          getTapeLabelSettings(),
        ]);
        
        console.log('Loaded tapes count:', loadedTapes.length);
        console.log('Loaded tapes:', JSON.stringify(loadedTapes.map(t => ({ id: t.id, name: t.name }))));
        
        if (mounted) {
          console.log('Setting tapes in state:', loadedTapes.length);
          setTapes(loadedTapes);
          setTapeLabelSettings(settings);
          setIsLoaded(true);
        }
      } catch (error) {
        console.error('Error loading data:', error);
        if (mounted) {
          setIsLoaded(true);
        }
      }
    };
    
    loadData();
    
    return () => {
      mounted = false;
    };
  }, []);

  useEffect(() => {
    if (isLoaded) {
      console.log('Tapes changed, persisting to storage. Count:', tapes.length);
      saveStoredTapes(tapes).catch(error => {
        console.error('Failed to persist tapes on change:', error);
      });
    }
  }, [tapes, isLoaded]);

  const createTape = useCallback(async (
    name: string,
    to: string,
    description: string,
    styleId: string,
    font: TapeFont,
    playlistUrl?: string
  ) => {
    if (tapes.length >= 50) {
      throw new Error('Maximum of 50 tapes reached');
    }
    
    const newTape: CustomTape = {
      id: `tape-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
      name,
      to,
      description,
      createdAt: new Date().toISOString(),
      styleId,
      font,
      playlistUrl,
    };
    
    const updatedTapes = [...tapes, newTape];
    console.log('Creating tape with id:', newTape.id, 'Total tapes after:', updatedTapes.length);
    console.log('Tape data:', { name, to, description, styleId, font });
    
    setTapes(updatedTapes);
    console.log('Tape created, will be auto-saved by useEffect');
    
    return newTape;
  }, [tapes]);

  const updateTape = useCallback(async (id: string, updates: Partial<CustomTape>) => {
    const updatedTapes = tapes.map(tape => 
      tape.id === id ? { ...tape, ...updates } : tape
    );
    console.log('Updating tape:', id);
    setTapes(updatedTapes);
    console.log('Tape updated, will be auto-saved by useEffect');
  }, [tapes]);

  const deleteTape = useCallback(async (id: string) => {
    const updatedTapes = tapes.filter(tape => tape.id !== id);
    console.log('Deleting tape. Remaining:', updatedTapes.length);
    setTapes(updatedTapes);
    console.log('Tape deleted, will be auto-saved by useEffect');
    
    if (currentTapeId === id) {
      setCurrentTapeId(null);
    }
  }, [tapes, currentTapeId]);

  const selectTape = useCallback((id: string | null) => {
    setCurrentTapeId(id);
  }, []);

  const getTapeById = useCallback((id: string): CustomTape | undefined => {
    return tapes.find(tape => tape.id === id);
  }, [tapes]);

  const getTapeStyle = useCallback((styleId: string): TapeStyle => {
    return TAPE_STYLES.find(style => style.id === styleId) || TAPE_STYLES[0];
  }, []);

  const updateTapeLabelFont = useCallback(async (font: TapeFont) => {
    const newSettings = { font };
    setTapeLabelSettings(newSettings);
    await saveTapeLabelSettings(newSettings);
  }, []);

  const currentTape = useMemo(() => {
    return currentTapeId ? getTapeById(currentTapeId) : null;
  }, [currentTapeId, getTapeById]);

  return useMemo(() => ({
    tapes,
    currentTape,
    currentTapeId,
    tapeLabelSettings,
    isLoaded,
    createTape,
    updateTape,
    deleteTape,
    selectTape,
    getTapeById,
    getTapeStyle,
    updateTapeLabelFont,
  }), [
    tapes,
    currentTape,
    currentTapeId,
    tapeLabelSettings,
    isLoaded,
    createTape,
    updateTape,
    deleteTape,
    selectTape,
    getTapeById,
    getTapeStyle,
    updateTapeLabelFont,
  ]);
});
