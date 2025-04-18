import React from 'react';
import { useRecoilState } from 'recoil';
import { Button } from '~/components/ui/Button';
import { Coins } from 'lucide-react';
import CheckoutModal from './CheckoutModal';
import { useLocalize } from '~/hooks';
import store from '~/store';

const BuyTokensButton: React.FC = () => {
  const [checkoutState, setCheckoutState] = useRecoilState(store.checkoutState);
  const localize = useLocalize();

  const handleOpenModal = () => {
    setCheckoutState({
      isOpen: true,
      reason: 'manual',
      details: null,
    });
  };

  const handleCloseModal = (isOpen: boolean) => {
    setCheckoutState({
      isOpen,
      reason: null,
      details: null,
    });
  };

  return (
    <>
      <Button
        variant="submit"
        className="mb-2 flex w-full items-center justify-center bg-blue-600 hover:bg-blue-700"
        onClick={handleOpenModal}
      >
        <Coins className="mr-2 h-4 w-4" />
        {localize('com_ui_buy_tokens')}
      </Button>
      <CheckoutModal
        open={checkoutState.isOpen}
        onOpenChange={handleCloseModal}
        reason={checkoutState.reason}
        details={checkoutState.details}
      />
    </>
  );
};

export default BuyTokensButton;
