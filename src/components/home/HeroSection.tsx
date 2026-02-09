export function HeroSection() {
    return (
        <section className="pt-16 pb-8 lg:pt-24 lg:pb-12">
            {/* Primary Zone: Headline + Search */}
            <div className="max-w-4xl mx-auto text-center space-y-8">
                {/* Headline */}
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-gray-900 leading-tight">
                    Your career.{" "}
                    <span className="text-[#0f766d]">Our commitment.</span>
                </h1>

                {/* Subheading */}
                <p className="text-lg md:text-xl text-gray-500 max-w-2xl mx-auto">
                    Connecting skilled professionals with the world's leading companies for over a decade. Your next opportunity is one search away.
                </p>

                {/* Search Module */}
                <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-2 flex flex-col md:flex-row items-stretch gap-2 max-w-3xl mx-auto">
                    {/* Job Title Input */}
                    <div className="flex-1 flex items-center px-4 gap-3 border-b md:border-b-0 md:border-r border-gray-200">
                        <span className="material-symbols-outlined text-gray-400">search</span>
                        <input
                            type="text"
                            placeholder="Job title or keyword"
                            className="w-full bg-transparent py-4 text-sm font-medium outline-none placeholder:text-gray-400"
                        />
                    </div>

                    {/* Location Input */}
                    <div className="flex-1 flex items-center px-4 gap-3">
                        <span className="material-symbols-outlined text-gray-400">location_on</span>
                        <input
                            type="text"
                            placeholder="City or remote"
                            className="w-full bg-transparent py-4 text-sm font-medium outline-none placeholder:text-gray-400"
                        />
                    </div>

                    {/* Submit Button */}
                    <button className="bg-[#0f766d] text-white font-semibold px-8 py-4 rounded-lg hover:bg-[#0f766d]/90 transition-colors active:scale-[0.98] w-full md:w-auto">
                        Find Jobs
                    </button>
                </div>

                {/* Quick Filters */}
                <div className="flex flex-wrap justify-center gap-3 text-sm">
                    <span className="text-gray-400 font-medium self-center">Popular:</span>
                    <button className="text-gray-600 hover:text-[#0f766d] transition-colors">Remote</button>
                    <span className="text-gray-300">•</span>
                    <button className="text-gray-600 hover:text-[#0f766d] transition-colors">Full-time</button>
                    <span className="text-gray-300">•</span>
                    <button className="text-gray-600 hover:text-[#0f766d] transition-colors">Tech</button>
                    <span className="text-gray-300">•</span>
                    <button className="text-gray-600 hover:text-[#0f766d] transition-colors">Marketing</button>
                </div>
            </div>

            {/* Trust Bar */}
            {/* <div className="mt-16 pt-10 border-t border-gray-100">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto text-center">
                    <div>
                        <p className="text-3xl md:text-4xl font-bold text-gray-800">10+</p>
                        <p className="text-xs md:text-sm text-gray-500 uppercase tracking-wide mt-1">Years of Trust</p>
                    </div>
                    <div>
                        <p className="text-3xl md:text-4xl font-bold text-gray-800">14M+</p>
                        <p className="text-xs md:text-sm text-gray-500 uppercase tracking-wide mt-1">Jobs Filled</p>
                    </div>
                    <div>
                        <p className="text-3xl md:text-4xl font-bold text-gray-800">500K+</p>
                        <p className="text-xs md:text-sm text-gray-500 uppercase tracking-wide mt-1">Companies</p>
                    </div>
                    <div>
                        <p className="text-3xl md:text-4xl font-bold text-gray-800">4.9★</p>
                        <p className="text-xs md:text-sm text-gray-500 uppercase tracking-wide mt-1">User Rating</p>
                    </div>
                </div>
            </div> */}
        </section>
    );
}
