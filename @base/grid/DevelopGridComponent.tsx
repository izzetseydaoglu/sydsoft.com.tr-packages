import React, { useState } from 'react';

const DevelopGridComponent: React.FC = () => {
    const [currentBreakpoint, setCurrentBreakpoint] = useState('');

    // Breakpoint detector
    React.useEffect(() => {
        const updateBreakpoint = () => {
            const width = window.innerWidth;
            let breakpoint = '';
            if (width <= 576) breakpoint = 'XS (≤576px)';
            else if (width <= 768) breakpoint = 'SM (577-768px)';
            else if (width <= 992) breakpoint = 'MD (769-992px)';
            else if (width <= 1200) breakpoint = 'LG (993-1200px)';
            else if (width <= 1400) breakpoint = 'XL (1201-1400px)';
            else breakpoint = 'XXL (≥1401px)';
            setCurrentBreakpoint(breakpoint);
        };

        updateBreakpoint();
        window.addEventListener('resize', updateBreakpoint);
        return () => window.removeEventListener('resize', updateBreakpoint);
    }, []);

    return (
        <div
            style={{
                position: 'fixed',
                bottom: '10px',
                right: '10px',
                background: '#333',
                color: 'white',
                padding: '10px',
                borderRadius: '4px',
                zIndex: 9999999
            }}
        >
            Current: {currentBreakpoint}
        </div>
    );
};

export default DevelopGridComponent;
