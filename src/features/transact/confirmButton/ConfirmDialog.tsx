// "use client";

// import type React from "react";
// import { useRef, useState } from "react";
// import {
//   Dialog,
//   DialogContent,
//   DialogDescription,
//   DialogFooter,
//   DialogHeader,
//   DialogTitle,
// } from "@/components/ui/dialog";
// import { Button } from "@/components/ui/button";

// interface Props {
//   isOpen: boolean;
//   title: string;
//   description: React.ReactNode;
//   onClose: () => void;
//   onConfirm: () => void;
// }

// const ConfirmDialog = ({
//   isOpen,
//   title,
//   description,
//   onClose,
//   onConfirm,
// }: Props) => {
//   const [isConfirming, setIsConfirming] = useState(false);
//   const hasConfirmedRef = useRef(false);

//   const handleConfirm = async () => {
//     if (hasConfirmedRef.current || isConfirming) {
//       return;
//     }

//     try {
//       setIsConfirming(true);
//       hasConfirmedRef.current = true;

//       await onConfirm();

//       // Close dialog after successful confirmation
//       onClose();
//     } catch (error) {
//       console.error("Error in confirmation:", error);
//       // Reset on error so user can try again
//       hasConfirmedRef.current = false;
//     } finally {
//       setIsConfirming(false);
//     }
//   };

//   const handleClose = () => {
//     if (isConfirming) return; // Prevent closing while confirming

//     hasConfirmedRef.current = false;
//     onClose();
//   };

//   const handleOpenChange = (open: boolean) => {
//     if (!open) {
//       handleClose();
//     }
//   };

//   return (
//     <Dialog open={isOpen} onOpenChange={handleOpenChange}>
//       <DialogContent>
//         <DialogHeader>
//           <DialogTitle>{title}</DialogTitle>
//           <DialogDescription>
//             <span>{description}</span>
//           </DialogDescription>
//         </DialogHeader>
//         <DialogFooter>
//           <Button
//             variant="outline"
//             onClick={handleClose}
//             disabled={isConfirming}
//           >
//             Cancel
//           </Button>
//           <Button
//             className="bg-blue-600 text-white font-bold py-2 px-4 rounded-md shadow-lg transition-all duration-300 ease-in-out hover:bg-blue-700"
//             onClick={handleConfirm}
//             disabled={isConfirming}
//           >
//             {isConfirming ? "Processing..." : "Okay"}
//           </Button>
//         </DialogFooter>
//       </DialogContent>
//     </Dialog>
//   );
// };

// export default ConfirmDialog;

"use client";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useConfirmDialogStore } from "stores/useConfirmDialogStore";

const ConfirmDialog = () => {
  const { isOpen, title, description, isConfirming, close, confirm } =
    useConfirmDialogStore();

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && close()}>
      <DialogContent className="bg-white/10 backdrop-blur-lg border border-white/20 shadow-[0_0_30px_rgba(255,255,255,0.15)]">
        <DialogHeader>
          <DialogTitle className="text-gray-300">{title}</DialogTitle>
          <DialogDescription className="text-gray-100">
            {description}
          </DialogDescription>
        </DialogHeader>

        <DialogFooter>
          <Button
            className="py-2 px-4 "
            variant="outline"
            onClick={close}
            disabled={isConfirming}
          >
            Cancel
          </Button>

          <Button
            className="bg-blue-600 text-white font-bold py-2 px-4 rounded-md shadow-lg transition-all duration-300 ease-in-out hover:bg-blue-700"
            onClick={confirm}
            disabled={isConfirming}
          >
            {isConfirming ? "Processing..." : "Okay"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ConfirmDialog;
