import { useState } from 'react';
import { Button } from '~/components/ui/Button';
import { Coins } from 'lucide-react';
import CheckoutModal from './CheckoutModal';
import { useLocalize } from '~/hooks';

const BuyTokensButton = () => {
  const [isOpen, setIsOpen] = useState(false);
  const localize = useLocalize();

  return (
    <>
      <Button
        variant="submit"
        className="mb-2 flex w-full items-center justify-center"
        onClick={() => setIsOpen(true)}
      >
        <Coins className="mr-2 h-4 w-4" />
        {localize('com_ui_buy_tokens')}
      </Button>
      <CheckoutModal open={isOpen} onOpenChange={setIsOpen} />
    </>
  );
};

export default BuyTokensButton;
