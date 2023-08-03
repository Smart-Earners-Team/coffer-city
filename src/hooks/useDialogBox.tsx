import React, { useState, useCallback } from 'react';

type DialogProps = {
    title: string;
    subtitle?: string;
    children?: React.ReactNode;
    classNames?: string;
};

const SimpleDialog: React.FC<DialogProps & { isOpen: boolean; onClose: () => void; }> = ({
    title,
    subtitle,
    children,
    classNames,
    isOpen,
    onClose,
}) => {
    return (
        <>
            {isOpen && (
                <div
                    className={`fixed top-0 left-0 w-full h-full flex justify-center items-center bg-black bg-opacity-50 ${classNames}`}
                >
                    <div className="bg-white p-6 rounded-2xl sm:max-w-[425px] m-2">
                        <div className="flex justify-between items-center">
                            <div className="text-lg font-bold select-none">{title}</div>
                            <button className="text-sm select-none" onClick={onClose}>
                                Close
                            </button>
                        </div>
                        {subtitle && <p className="text-sm mb-4">{subtitle}</p>}
                        <div>{children}</div>
                    </div>
                </div>
            )}
        </>
    );
};

export function useDialogBox(dialogProps: DialogProps) {
    const [isOpen, setIsOpen] = useState(false);

    const toggleDialog = useCallback(() => {
        setIsOpen(!isOpen);
    }, [isOpen]);

    const DialogComponent = (
        <SimpleDialog
            {...dialogProps}
            isOpen={isOpen}
            onClose={toggleDialog}
        />
    );

    return [DialogComponent, toggleDialog] as const;
}
