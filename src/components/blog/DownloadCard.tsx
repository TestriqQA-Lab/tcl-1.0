"use client";

export function DownloadCard() {
    return (
        <div className="bg-[#0f766d] rounded-xl p-8 flex flex-col items-center justify-center text-center text-white h-full min-h-[380px]">
            <div className="size-16 bg-white/10 rounded-full flex items-center justify-center mb-6">
                <span className="material-symbols-outlined text-3xl">download</span>
            </div>

            <h3 className="text-2xl font-bold mb-3">Get Hired Faster</h3>
            <p className="text-green-50 mb-8 text-sm leading-relaxed max-w-[80%]">
                Download our free, recruiter-approved ATS-Friendly Resume Template.
            </p>

            <button className="bg-white text-[#0f766d] font-bold px-6 py-3 rounded-lg hover:bg-green-50 transition-colors w-full max-w-[200px]">
                Download Template
            </button>
        </div>
    );
}
