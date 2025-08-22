import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Role } from '../lib/access';

export interface DevState {
  role: Role;
  pressedNotReady: boolean;
  blueprintDone: boolean;
  purchasedMasterclasses: string[];
  setRole: (role: Role) => void;
  setPressedNotReady: (value: boolean) => void;
  setBlueprintDone: (value: boolean) => void;
  setPurchasedMasterclasses: (masterclasses: string[]) => void;
  resetAll: () => void;
}

const DevContext = createContext<DevState | null>(null);

interface DevProviderProps {
  children: ReactNode;
}

const DEFAULT_STATE: Omit<DevState, 'setRole' | 'setPressedNotReady' | 'setBlueprintDone' | 'setPurchasedMasterclasses' | 'resetAll'> = {
  role: 'free',
  pressedNotReady: false,
  blueprintDone: false,
  purchasedMasterclasses: []
};

export function DevProvider({ children }: DevProviderProps) {
  const [role, setRoleState] = useState<Role>(DEFAULT_STATE.role);
  const [pressedNotReady, setPressedNotReadyState] = useState<boolean>(DEFAULT_STATE.pressedNotReady);
  const [blueprintDone, setBlueprintDoneState] = useState<boolean>(DEFAULT_STATE.blueprintDone);
  const [purchasedMasterclasses, setPurchasedMasterclassesState] = useState<string[]>(DEFAULT_STATE.purchasedMasterclasses);

  // Load state from localStorage on mount
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const savedRole = localStorage.getItem('dev.role') as Role;
    const savedPressedNotReady = localStorage.getItem('flags.pressedNotReady') === 'true';
    const savedBlueprintDone = localStorage.getItem('flags.blueprintDone') === 'true';
    const savedMasterclasses = JSON.parse(localStorage.getItem('purchasedMasterclasses') || '[]');

    if (savedRole) setRoleState(savedRole);
    setPressedNotReadyState(savedPressedNotReady);
    setBlueprintDoneState(savedBlueprintDone);
    setPurchasedMasterclassesState(savedMasterclasses);
  }, []);

  const setRole = (newRole: Role) => {
    setRoleState(newRole);
    if (typeof window !== 'undefined') {
      localStorage.setItem('dev.role', newRole);
      window.dispatchEvent(new CustomEvent('dev:role-changed', { detail: newRole }));
    }
  };

  const setPressedNotReady = (value: boolean) => {
    setPressedNotReadyState(value);
    if (typeof window !== 'undefined') {
      localStorage.setItem('flags.pressedNotReady', value.toString());
      window.dispatchEvent(new CustomEvent('dev:flags-changed', { detail: { pressedNotReady: value } }));
    }
  };

  const setBlueprintDone = (value: boolean) => {
    setBlueprintDoneState(value);
    if (typeof window !== 'undefined') {
      localStorage.setItem('flags.blueprintDone', value.toString());
      window.dispatchEvent(new CustomEvent('dev:flags-changed', { detail: { blueprintDone: value } }));
    }
  };

  const setPurchasedMasterclasses = (masterclasses: string[]) => {
    setPurchasedMasterclassesState(masterclasses);
    if (typeof window !== 'undefined') {
      localStorage.setItem('purchasedMasterclasses', JSON.stringify(masterclasses));
      window.dispatchEvent(new CustomEvent('dev:flags-changed', { detail: { purchasedMasterclasses: masterclasses } }));
    }
  };

  const resetAll = () => {
    if (typeof window === 'undefined') return;

    // Clear all localStorage keys
    const keysToRemove = [
      'dev.role',
      'progress.s1.c1',
      'progress.s1.c2', 
      'progress.s1.c3',
      'flags.pressedNotReady',
      'flags.blueprintDone',
      'purchasedMasterclasses'
    ];

    // Remove progress.s2.* keys
    Object.keys(localStorage).forEach(key => {
      if (key.startsWith('progress.s2.') || key.includes('gating') || key.includes('cache')) {
        keysToRemove.push(key);
      }
    });

    keysToRemove.forEach(key => localStorage.removeItem(key));

    // Reset state to defaults
    setRoleState(DEFAULT_STATE.role);
    setPressedNotReadyState(DEFAULT_STATE.pressedNotReady);
    setBlueprintDoneState(DEFAULT_STATE.blueprintDone);
    setPurchasedMasterclassesState(DEFAULT_STATE.purchasedMasterclasses);

    // Broadcast reset event
    window.dispatchEvent(new CustomEvent('dev:reset'));

    // Refresh the page to re-evaluate everything
    window.location.reload();
  };

  const value: DevState = {
    role,
    pressedNotReady,
    blueprintDone,
    purchasedMasterclasses,
    setRole,
    setPressedNotReady,
    setBlueprintDone,
    setPurchasedMasterclasses,
    resetAll
  };

  return (
    <DevContext.Provider value={value}>
      {children}
    </DevContext.Provider>
  );
}

export function useDevContext(): DevState {
  const context = useContext(DevContext);
  if (!context) {
    throw new Error('useDevContext must be used within a DevProvider');
  }
  return context;
}