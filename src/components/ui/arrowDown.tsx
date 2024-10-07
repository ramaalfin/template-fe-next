import React from 'react';

interface ArrowDownProps {
    className?: string;
    onClick?: () => void;
}

const ArrowDown: React.FC<ArrowDownProps> = ({ className, onClick }) => {
    return (
        <svg className={className} onClick={onClick} xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24">
            <path fill="currentColor" d="m10 2l-.15.005A2 2 0 0 0 8 4v6.999L5.414 11A2 2 0 0 0 4 14.414L10.586 21a2 2 0 0 0 2.828 0L20 14.414a2 2 0 0 0 .434-2.18l-.068-.145A2 2 0 0 0 18.586 11L16 10.999V4a2 2 0 0 0-2-2z"></path>
        </svg>
    );
};

export default ArrowDown;