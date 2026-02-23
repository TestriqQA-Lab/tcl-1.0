import Link from "next/link";

export function EmployerFooter() {
    return (
        <footer className="bg-white dark:bg-[#112120] border-t border-slate-200 dark:border-slate-800 pt-20 pb-10 font-sans">
            <div className="max-w-[1240px] mx-auto px-6">
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-12 mb-16">
                    <div className="col-span-2">
                        <div className="flex items-center gap-2 mb-6">
                            <div className="size-6 bg-[#0f766d] rounded flex items-center justify-center text-white">
                                <span className="material-symbols-outlined text-sm">rocket_launch</span>
                            </div>
                            <h2 className="text-lg font-bold font-sora text-[#0e1b1a] dark:text-white">TopCareerLive</h2>
                        </div>
                        <p className="text-slate-500 text-sm max-w-xs leading-relaxed mb-6">
                            The ultimate destination for modern recruitment. We connect exceptional talent with world-class employers.
                        </p>
                        <div className="flex items-center gap-4 text-slate-400">
                            <a className="hover:text-[#0f766d] transition-colors" href="#">
                                <svg className="size-5" fill="currentColor" viewBox="0 0 24 24"><path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"></path></svg>
                            </a>
                            <a className="hover:text-[#0f766d] transition-colors" href="#">
                                <svg className="size-5" fill="currentColor" viewBox="0 0 24 24"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"></path></svg>
                            </a>
                        </div>
                    </div>
                    <div>
                        <h4 className="font-bold mb-6 text-sm uppercase tracking-widest text-[#0e1b1a] dark:text-white">Platform</h4>
                        <ul className="flex flex-col gap-4 text-sm text-slate-500">
                            <li><Link className="hover:text-[#0f766d] transition-colors" href="#">For Job Seekers</Link></li>
                            <li><Link className="hover:text-[#0f766d] transition-colors" href="#">For Employers</Link></li>
                            <li><Link className="hover:text-[#0f766d] transition-colors" href="#">Job Board</Link></li>
                            <li><Link className="hover:text-[#0f766d] transition-colors" href="#">Pricing Plans</Link></li>
                        </ul>
                    </div>
                    <div>
                        <h4 className="font-bold mb-6 text-sm uppercase tracking-widest text-[#0e1b1a] dark:text-white">Company</h4>
                        <ul className="flex flex-col gap-4 text-sm text-slate-500">
                            <li><Link className="hover:text-[#0f766d] transition-colors" href="#">About Us</Link></li>
                            <li><Link className="hover:text-[#0f766d] transition-colors" href="#">Success Stories</Link></li>
                            <li><Link className="hover:text-[#0f766d] transition-colors" href="#">Contact Support</Link></li>
                            <li><Link className="hover:text-[#0f766d] transition-colors" href="#">Careers</Link></li>
                        </ul>
                    </div>
                    <div>
                        <h4 className="font-bold mb-6 text-sm uppercase tracking-widest text-[#0e1b1a] dark:text-white">Legal</h4>
                        <ul className="flex flex-col gap-4 text-sm text-slate-500">
                            <li><Link className="hover:text-[#0f766d] transition-colors" href="#">Privacy Policy</Link></li>
                            <li><Link className="hover:text-[#0f766d] transition-colors" href="#">Terms of Service</Link></li>
                            <li><Link className="hover:text-[#0f766d] transition-colors" href="#">Cookie Policy</Link></li>
                        </ul>
                    </div>
                </div>
                <div className="border-t border-slate-100 dark:border-slate-800 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
                    <p className="text-xs text-slate-400">© 2024 TopCareerLive Inc. All rights reserved.</p>
                    <div className="flex items-center gap-2 bg-slate-50 dark:bg-slate-900 px-3 py-1.5 rounded-full border border-slate-200 dark:border-slate-800">
                        <span className="material-symbols-outlined text-xs text-[#0f766d]">verified</span>
                        <span className="text-[10px] font-bold text-slate-500 uppercase tracking-tighter">Company details provided by employer</span>
                    </div>
                </div>
            </div>
        </footer>
    );
}
