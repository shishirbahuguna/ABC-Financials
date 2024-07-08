import React, { ReactNode, useState } from 'react';

interface PopoverProps {
    content: ReactNode;
    children: ReactNode;
}

const Popover: React.FC<PopoverProps> = ({ content, children }) => {
    const [isHovered, setIsHovered] = useState(false);

    const handleMouseEnter = () => {
        setIsHovered(true);
    };

    const handleMouseLeave = () => {
        setIsHovered(false);
    };

    return (
        <div
            className="relative inline-block"
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
        >
            {children}
            {isHovered && (
                <div className="absolute z-10 mt-2 w-48 bg-white p-4 rounded shadow-lg">
                    {content}
                </div>
            )}
        </div>
    );
};

export default Popover;
