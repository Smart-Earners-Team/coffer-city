// LinkTabs.tsx
import React, { useState } from 'react';

interface TabData {
    id: string;
    title: string;
    content: React.ReactNode;
    image?: React.ReactNode;
}

interface LinkTabsProps {
    contentClassName?: string | undefined,
    tabClassName?: string | undefined,
    className?: string | undefined,
    tabs: TabData[];
}

const LinkTabs: React.FC<LinkTabsProps> = ({ tabs, className, contentClassName, tabClassName }) => {
    const [activeTab, setActiveTab] = useState(tabs[0].id);

    return (
        <div className={`grid gap-2 ${className}`}>
            <div className={`flex flex-wrap gap-2 my-2 ${tabClassName}`}>
                {tabs.map((tab) => (
                    <div
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`cursor-pointer mr-6 font-medium text-lg rounded-md px-4 py-2 transition-colors duration-200 
                ${activeTab === tab.id
                            ? 'bg-[#87ceeb] text-[#232323]'
                            : 'bg-[#ffd700] text-[#232323]/75 hover:bg-[#87ceeb] hover:text-[#232323]/50'
                            }`
                        }
                    >
                        {tab.title}
                    </div>
                ))}
            </div>
            {tabs
                .filter((tab) => tab.id === activeTab)
                .map((tab, index) => (
                    <div key={tab.id} className={`text-sm grid gap-5 ${index % 2 === 0 ? 'grid-cols-1 md:grid-cols-3' : 'text-right'} ${contentClassName}`}>
                        <div className={`md:col-span-2 my-auto`}>
                            <p>{tab.content}</p>
                        </div>
                        <div className='md:col-span-1 -mt-12 md:-mt-32'>
                            {tab.image}
                        </div>
                    </div>
                ))}
        </div>
    );
};

export default LinkTabs;
