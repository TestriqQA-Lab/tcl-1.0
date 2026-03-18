const interviews = [
    {
        name: "Priya Sharma",
        time: "Today, 3:00 PM • Video Call",
        dotColor: "bg-[#0f766d]",
    },
    {
        name: "Amit Patel",
        time: "Tomorrow, 11:00 AM • In Person",
        dotColor: "bg-[#2563EB]",
    },
    {
        name: "Neha Gupta",
        time: "Mar 5, 2:30 PM • Phone",
        dotColor: "bg-[#F59E0B]",
    },
];

export function UpcomingInterviewsCard() {
    return (
        <div className="hidden lg:flex flex-col bg-white rounded-xl border border-[#E2E8F0] p-5 gap-3.5">
            <h3 className="text-[15px] font-bold text-[#0e1b1a]">
                Upcoming Interviews
            </h3>
            {interviews.map((intv, i) => (
                <div key={i} className="flex items-center gap-3">
                    <div
                        className={`size-2 rounded-full shrink-0 ${intv.dotColor}`}
                    />
                    <div className="flex flex-col gap-0.5">
                        <span className="text-[13px] font-semibold text-[#0e1b1a]">
                            {intv.name}
                        </span>
                        <span className="text-xs text-[#64748B]">{intv.time}</span>
                    </div>
                </div>
            ))}
        </div>
    );
}
