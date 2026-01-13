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
} from '@/components/ui/alert-dialog';
import * as React from 'react';

type ConfirmDialogProps = {
    /** element that opens the dialog (button, link, icon, etc.) */
    trigger: React.ReactNode;

    title: string;
    description?: string;

    /** called when user confirms */
    onConfirm: () => void;

    /** optional labels */
    confirmText?: string;
    cancelText?: string;

    /** disable confirm button */
    confirmDisabled?: boolean;

    /** use destructive styling for confirm button (recommended for delete) */
    confirmVariant?: 'default' | 'destructive';
};

export function ConfirmDialog({
    trigger,
    title,
    description,
    onConfirm,
    confirmText = 'Confirm',
    cancelText = 'Cancel',
    confirmDisabled = false,
    confirmVariant = 'destructive',
}: ConfirmDialogProps) {
    const [open, setOpen] = React.useState(false);

    return (
        <AlertDialog open={open} onOpenChange={setOpen}>
            <AlertDialogTrigger asChild>{trigger}</AlertDialogTrigger>

            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>{title}</AlertDialogTitle>
                    {description ? (
                        <AlertDialogDescription>
                            {description}
                        </AlertDialogDescription>
                    ) : null}
                </AlertDialogHeader>

                <AlertDialogFooter>
                    <AlertDialogCancel>{cancelText}</AlertDialogCancel>

                    <AlertDialogAction
                        // shadcn supports "destructive" variant via className in some setups;
                        // if your AlertDialogAction already supports variant prop, keep it.
                        className={
                            confirmVariant === 'destructive'
                                ? 'bg-destructive text-destructive-foreground hover:bg-destructive/90'
                                : undefined
                        }
                        disabled={confirmDisabled}
                        onClick={() => {
                            onConfirm();
                            setOpen(false);
                        }}
                    >
                        {confirmText}
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
}
