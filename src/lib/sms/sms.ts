/**
 * SMS sender utility using Fast2SMS API (free tier).
 * No npm package needed — uses native fetch.
 * Uses the "q" (quick transactional) route which works without DLT verification.
 */

export async function sendOtpSms(
    phone: string,
    otp: string
): Promise<{ success: boolean; error?: string }> {
    const apiKey = process.env.FAST2SMS_API_KEY;

    if (!apiKey) {
        console.error("FAST2SMS_API_KEY is not configured in .env.local");
        return { success: false, error: "SMS service not configured" };
    }

    // In development, log OTP to console as a fallback
    const isDev = process.env.NODE_ENV === "development";
    if (isDev) {
        console.log(`\n========================================`);
        console.log(`  📱 OTP for +91 ${phone}: ${otp}`);
        console.log(`========================================\n`);
    }

    try {
        const message = `Your TopCareerLive verification code is ${otp}. Valid for 10 minutes. Do not share with anyone.`;
        const url = `https://www.fast2sms.com/dev/bulkV2?authorization=${apiKey}&route=q&message=${encodeURIComponent(message)}&flash=0&numbers=${phone}`;

        const response = await fetch(url, { method: "GET" });
        const data = await response.json();

        if (data.return === true) {
            return { success: true };
        }

        const errorMsg = data.message?.[0] || data.message || "Failed to send OTP SMS";
        console.error("Fast2SMS error:", data);

        // In dev mode, still return success so the flow can be tested
        if (isDev) {
            console.warn("⚠️  SMS send failed, but DEV MODE is active. Check console for OTP.");
            return { success: true };
        }

        return { success: false, error: String(errorMsg) };
    } catch (error) {
        console.error("SMS send error:", error);

        if (isDev) {
            console.warn("⚠️  SMS send failed (network error), but DEV MODE is active. Check console for OTP.");
            return { success: true };
        }

        return { success: false, error: "Failed to send SMS. Please try again." };
    }
}
