import Image from "next/image";

export function TrustedCompanies() {
    const logos = [
        { name: "Google", src: "/home_trusted_Logo/Google_Logo.png" },
        { name: "Microsoft", src: "/home_trusted_Logo/Microsoft_Logo.png" },
        { name: "Amazon", src: "/home_trusted_Logo/Amazon_Logo.png" },
        { name: "Netflix", src: "/home_trusted_Logo/Netflix_Logo.png" },
        { name: "Stripe", src: "/home_trusted_Logo/Stripe_Logo.png" },
    ];

    return (
        <section className="py-5 border-y border-gray-100">
            <p className="text-center text-sm font-semibold text-gray-400 mb-8 uppercase tracking-[0.2em]">
                Trusted by world class companies
            </p>
            <div className="flex flex-wrap justify-center items-center gap-8 md:gap-12 lg:gap-16 px-4">
                {logos.map((logo) => (
                    <div key={logo.name} className="relative h-10 md:h-12 w-28 md:w-36">
                        <Image
                            src={logo.src}
                            alt={`${logo.name} logo`}
                            fill
                            className="object-contain"
                        />
                    </div>
                ))}
            </div>
        </section>
    );
}
