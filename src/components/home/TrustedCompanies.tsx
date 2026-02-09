export function TrustedCompanies() {
    return (
        <section className="py-12 border-y border-gray-100">
            <p className="text-center text-sm font-semibold text-gray-400 mb-8 uppercase tracking-[0.2em]">
                Trusted by world class companies
            </p>
            <div className="flex flex-wrap justify-center items-center gap-12 lg:gap-24 opacity-40 grayscale">
                <span className="text-2xl font-black text-gray-800">GOOGLE</span>
                <span className="text-2xl font-black text-gray-800">MICROSOFT</span>
                <span className="text-2xl font-black text-gray-800">AMAZON</span>
                <span className="text-2xl font-black text-gray-800">NETFLIX</span>
                <span className="text-2xl font-black text-gray-800">STRIPE</span>
            </div>
        </section>
    );
}
