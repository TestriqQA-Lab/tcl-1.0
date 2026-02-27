import React from 'react';


interface UserProfileLayoutProps {
    header?: React.ReactNode;
    sidebar: React.ReactNode;
    content: React.ReactNode;
}

const UserProfileLayout: React.FC<UserProfileLayoutProps> = ({
    header,
    sidebar,
    content,
}) => {
    return (
        <div className="bg-[#f3f4f6] min-h-screen pb-24 lg:pb-10 font-sans">
            <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-6">
                {header && <div className="mb-6">{header}</div>}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                    {/* Left Sidebar - 3 cols (25%) */}
                    <div className="hidden lg:block lg:col-span-3">
                        <div className="sticky top-24 z-30">
                            {sidebar}
                        </div>
                    </div>

                    {/* Main Content - 9 cols (75%) */}
                    <div className="col-span-1 lg:col-span-9 space-y-6">
                        {content}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default UserProfileLayout;
