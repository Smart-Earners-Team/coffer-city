import { FC, useState } from 'react';

interface EarnersDropdownProps {
    className?: string;
    optionClassName?: string;
    options: string[];
    actionHandlers?: { [key: string]: () => void };
}

const EarnersDropdown: FC<EarnersDropdownProps> = ({ className, optionClassName, options, actionHandlers }) => {
    const [selected, setSelected] = useState<string>(options[0]);
    const [isOpen, setIsOpen] = useState<boolean>(false);

    const handleClick = (value: string) => {
        setSelected(value);
        setIsOpen(false);

        if (actionHandlers && typeof actionHandlers[value] === 'function') {
            actionHandlers[value]();
        }
    };

    return (
        <div className={`relative`}>
            <div
                className={`relative appearance-none px-4 py-2 pr-8 rounded shadow leading-tight focus:outline-none focus:shadow-outline cursor-pointer ${className}`}
                onClick={() => setIsOpen(!isOpen)}
            >
                {selected}
                <div
                    className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700"
                >
                    <svg
                        className="fill-current h-4 w-4"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 20 20"
                    >
                        <path d="M10 12l-6-5h12l-6 5z" />
                    </svg>
                </div>
            </div>

            {isOpen && (
                <div className="absolute z-10 w-fit rounded shadow bg-white my-1">
                    {options.map((option, index) =>
                        <div
                            key={index}
                            onClick={() => handleClick(option)}
                            className={`cursor-pointer w-full px-4 py-2 hover:bg-gray-200 ${optionClassName}`}
                        >
                            {option}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default EarnersDropdown;
