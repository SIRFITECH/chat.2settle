import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { MessageType } from "@/types/general_types";
import { Check, Copy } from "lucide-react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

export const CopyableText: React.FC<{
  text: string;
  label: string;
  isWallet?: boolean;
  addChatMessages: (messages: MessageType[]) => void;
  nextStep: (step: string) => void;
  lastAssignedTime?: Date;
}> = ({
  text,
  label,
  isWallet = false,
  addChatMessages,
  nextStep,
  lastAssignedTime,
}) => {
  const [isCopied, setIsCopied] = useState(false);
  const [isExpired, setIsExpired] = useState(false);
  const [timeLeft, setTimeLeft] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [walletCopied, setWalletCopied] = useState(false);
  const [dialogMessage, setDialogMessage] = useState("");
  const buttonRef = useRef<HTMLButtonElement>(null);
  const allowedTime = 5;

  useEffect(() => {
    if (isWallet && lastAssignedTime) {
      const timer = setInterval(() => {
        const now = new Date().getTime();
        const distance =
          new Date(
            lastAssignedTime.getTime() + allowedTime * 60 * 1000
          ).getTime() - now;

        if (distance < 0) {
          clearInterval(timer);
          setTimeLeft("00:00");
          setIsExpired(true);
          if (!walletCopied) {
            setDialogMessage(
              "This wallet is no longer available. Please start a new transaction."
            );
            setIsDialogOpen(true);
          }
        } else {
          const minutes = Math.floor(
            (distance % (1000 * 60 * 60)) / (1000 * 60)
          );
          const seconds = Math.floor((distance % (1000 * 60)) / 1000);
          const timeString = `${minutes.toString().padStart(2, "0")}:${seconds
            .toString()
            .padStart(2, "0")}`;
          setTimeLeft(timeString);

          // Check if time is less than or equal to 2 minutes and popup hasn't been shown
          if (minutes === 2 && seconds === 0 && walletCopied) {
            setDialogMessage("Have you sent the payment?");
            setIsDialogOpen(true);
          }
        }
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [isWallet, lastAssignedTime, walletCopied]);
  const handleCopy = useCallback(() => {
    navigator.clipboard.writeText(text).then(() => {
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 3000);
      if (isWallet) {
        setWalletCopied(true);
      }
    });
  }, [text, isWallet]);

  const handleConfirm = useCallback(() => {
    setIsDialogOpen(false);
    addChatMessages([
      {
        type: "incoming",
        content: (
          <span>
            Thank you for your transaction, <br />
            Wait a little while and check if you have received your funds.
            <br />
            <br />
            1. Start another transaction
            <br />
            2. No, I want to complain
          </span>
        ),
        timestamp: new Date(),
      },
    ]);
    nextStep("paymentProcessing");
  }, []);

  const handleClose = useCallback(() => {
    setIsDialogOpen(false);
    addChatMessages([
      {
        type: "incoming",
        content: (
          <span>
            It appears you did not go through with the transaction again, <br />
            Thanks anyway for your time. Feel free to
            <br />
            <br />
            1. Start another transaction
            <br />
            2. Tell us what went wrong
          </span>
        ),
        timestamp: new Date(),
      },
    ]);
    nextStep("paymentProcessing");
  }, []);

  const truncateText = useMemo(
    () => (text: string) => {
      return text.length > 7 ? `${text.slice(0, 6)}...${text.slice(-4)}` : text;
    },
    []
  );

  const getButtonText = () => {
    if (dialogMessage === "Have you sent the payment?") {
      return "Yes, I've sent the payment";
    } else if (
      dialogMessage ===
      "This wallet is no longer available. Please start a new transaction."
    ) {
      return "Start a new transaction";
    } else {
      return "Okay, I understand";
    }
  };

  return (
    <div className="flex flex-col items-start space-y-2">
      {isWallet ? <span>{truncateText(text)}</span> : ""}

      <Button
        ref={buttonRef}
        onClick={handleCopy}
        variant="outline"
        size="sm"
        disabled={isWallet && isExpired}
      >
        {!isCopied ? (
          <>
            <Copy className="w-4 h-4 mr-2" />
            <span>Copy {label}</span>
          </>
        ) : (
          <>
            <Check className="w-4 h-4 mr-2" />
            <span>{label} Copied</span>
          </>
        )}
      </Button>
      {isWallet && (
        <span
          className={
            timeLeft < "02:01" || isExpired
              ? "text-red-500 animate-pulse font-bold"
              : "text-green-500"
          }
        >
          {isExpired ? "Wallet expired" : timeLeft}
        </span>
      )}
      <Dialog
        open={isDialogOpen}
        onOpenChange={(open) => {
          setIsDialogOpen(open);
          if (!open) {
            buttonRef.current?.focus();
          }
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Transaction Confirmation</DialogTitle>
            <DialogDescription>{dialogMessage}</DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              className="bg-blue-600 text-white font-bold py-2 px-4 rounded-md shadow-lg transition-all duration-300 ease-in-out hover:bg-blue-700"
              onClick={() => {
                if (walletCopied) {
                  handleConfirm();
                } else {
                  handleClose();
                }
              }}
            >
              {getButtonText()}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};
