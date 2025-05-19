// import React, { ReactNode, useEffect, useRef } from "react";
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
//   description: ReactNode;
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
//   console.log("Dialog fired");
//   // Use a ref to track if we've already handled this dialog session
//   const hasConfirmedRef = useRef(false);

//   // Reset the ref when dialog closes
//   useEffect(() => {
//     if (!isOpen) {
//       hasConfirmedRef.current = false;
//     }
//   }, [isOpen]);
//   const handleConfirm = () => {
//     // Only proceed if we haven't already confirmed in this dialog session
//     if (!hasConfirmedRef.current) {
//       hasConfirmedRef.current = true;
//       onConfirm();
//     }
//   };
//   return (
//     <Dialog open={isOpen} onOpenChange={onClose}>
//       <DialogContent>
//         <DialogHeader>
//           <DialogTitle>{title}</DialogTitle>
//           <DialogDescription>
//             <span>{description}</span>
//           </DialogDescription>
//         </DialogHeader>
//         <DialogFooter>
//           <Button variant="outline" onClick={onClose}>
//             Cancel
//           </Button>
//           <Button
//             className="bg-blue-600 text-white font-bold py-2 px-4 rounded-md shadow-lg transition-all duration-300 ease-in-out hover:bg-blue-700"
//             onClick={handleConfirm}
//           >
//             Okay
//           </Button>
//         </DialogFooter>
//       </DialogContent>
//     </Dialog>
//   );
// };

// export default ConfirmDialog;


"use client";

import type React from "react";
import { useRef, useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface Props {
  isOpen: boolean;
  title: string;
  description: React.ReactNode;
  onClose: () => void;
  onConfirm: () => void;
}

// Create a module-level variable to track if a dialog is currently open
// This will prevent multiple dialogs from opening simultaneously
let isAnyDialogOpen = false;

const ConfirmDialog = ({
  isOpen,
  title,
  description,
  onClose,
  onConfirm,
}: Props) => {
  // Local state to track if this specific dialog should be shown
  const [shouldShow, setShouldShow] = useState(false);
  const hasConfirmedRef = useRef(false);
  const dialogIdRef = useRef(
    `dialog-${Math.random().toString(36).substring(2, 9)}`
  );

  console.log(
    `Dialog ${dialogIdRef.current} - isOpen: ${isOpen}, shouldShow: ${shouldShow}, isAnyDialogOpen: ${isAnyDialogOpen}`
  );

  // Effect to manage the global dialog state
  useEffect(() => {
    if (isOpen && !isAnyDialogOpen) {
      // Only show this dialog if no other dialog is open
      isAnyDialogOpen = true;
      setShouldShow(true);
      console.log(
        `Dialog ${dialogIdRef.current} - Opening dialog, setting isAnyDialogOpen to true`
      );
    } else if (!isOpen && shouldShow) {
      // When closing, reset the global state
      setShouldShow(false);
      isAnyDialogOpen = false;
      console.log(
        `Dialog ${dialogIdRef.current} - Closing dialog, setting isAnyDialogOpen to false`
      );
    }

    // Cleanup function to ensure we reset the global state if component unmounts while open
    return () => {
      if (shouldShow) {
        isAnyDialogOpen = false;
        console.log(
          `Dialog ${dialogIdRef.current} - Unmounting while open, resetting isAnyDialogOpen`
        );
      }
    };
  }, [isOpen, shouldShow]);

  // Reset confirmation state when dialog closes
  useEffect(() => {
    if (!shouldShow) {
      hasConfirmedRef.current = false;
    }
  }, [shouldShow]);

  const handleConfirm = () => {
    // Only proceed if we haven't already confirmed in this dialog session
    if (!hasConfirmedRef.current) {
      console.log(`Dialog ${dialogIdRef.current} - Confirming dialog`);
      hasConfirmedRef.current = true;
      onConfirm();

      // Immediately close the dialog and reset global state
      setShouldShow(false);
      isAnyDialogOpen = false;
    }
  };

  const handleClose = () => {
    console.log(
      `Dialog ${dialogIdRef.current} - Closing dialog via cancel button`
    );
    setShouldShow(false);
    isAnyDialogOpen = false;
    onClose();
  };

  // Only render the dialog if shouldShow is true
  return (
    <Dialog open={shouldShow} onOpenChange={handleClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>
            <span>{description}</span>
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline" onClick={handleClose}>
            Cancel
          </Button>
          <Button
            className="bg-blue-600 text-white font-bold py-2 px-4 rounded-md shadow-lg transition-all duration-300 ease-in-out hover:bg-blue-700"
            onClick={handleConfirm}
          >
            Okay
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ConfirmDialog;

