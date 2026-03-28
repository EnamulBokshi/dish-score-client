"use client";

import { useState } from "react";
import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { deleteMyAccount } from "@/services/auth.services";

interface DeleteAccountSectionProps {
  userId: string;
}

export default function DeleteAccountSection({ userId }: DeleteAccountSectionProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [confirmationText, setConfirmationText] = useState("");
  const isConfirmationMatched = confirmationText.trim().toUpperCase() === "DELETE";

  const handleDelete = () => {
    startTransition(async () => {
      const result = await deleteMyAccount(userId);

      if (!result.success) {
        toast.error(result.message || "Failed to delete account");
        return;
      }

      setConfirmationText("");
      toast.success(result.message || "Account deleted successfully");
      router.replace("/login");
      router.refresh();
    });
  };

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="destructive" disabled={isPending}>
          {isPending ? "Deleting..." : "Delete My Account"}
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete your account?</AlertDialogTitle>
          <AlertDialogDescription>
            This action will remove your account access. This cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <div className="space-y-2">
          <Label htmlFor="delete-confirmation-input">
            Type <span className="font-semibold">DELETE</span> to confirm
          </Label>
          <Input
            id="delete-confirmation-input"
            value={confirmationText}
            onChange={(event) => setConfirmationText(event.target.value)}
            placeholder="DELETE"
            autoComplete="off"
            disabled={isPending}
          />
        </div>
        <AlertDialogFooter>
          <AlertDialogCancel
            disabled={isPending}
            onClick={() => {
              setConfirmationText("");
            }}
          >
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={handleDelete}
            disabled={isPending || !isConfirmationMatched}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
          >
            Confirm Delete
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
