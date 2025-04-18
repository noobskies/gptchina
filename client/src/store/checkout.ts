import { atom } from 'recoil';

// Define the interface for the checkout state
export interface CheckoutState {
  isOpen: boolean;
  reason: 'insufficient_funds' | 'manual' | null;
  details: {
    balance?: number;
    requiredTokens?: number;
    cost?: number;
  } | null;
}

// Create atom with the new interface
export const checkoutStateAtom = atom<CheckoutState>({
  key: 'checkoutState',
  default: {
    isOpen: false,
    reason: null,
    details: null,
  },
});

// For backward compatibility
export const isCheckoutModalOpenAtom = atom<boolean>({
  key: 'isCheckoutModalOpen',
  default: false,
});

export default {
  checkoutState: checkoutStateAtom,
  isCheckoutModalOpen: isCheckoutModalOpenAtom,
};
