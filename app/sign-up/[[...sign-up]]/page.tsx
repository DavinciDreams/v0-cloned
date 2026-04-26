import { SignUp } from "@clerk/nextjs";

export default function SignUpPage() {
  return (
    <div className="flex min-h-full items-center justify-center px-4 py-12">
      {/* Glass container behind the Clerk widget */}
      <div className="relative w-full max-w-md">
        {/* Decorative glow orbs */}
        <div
          className="absolute -top-20 -right-20 w-64 h-64 rounded-full pointer-events-none"
          style={{
            background: "oklch(0.55 0.28 285 / 0.20)",
            filter: "blur(60px)",
          }}
        />
        <div
          className="absolute -bottom-20 -left-20 w-64 h-64 rounded-full pointer-events-none"
          style={{
            background: "oklch(0.50 0.24 200 / 0.15)",
            filter: "blur(60px)",
          }}
        />

        {/* Clerk sign-up widget with glass backdrop */}
        <div className="relative">
          <SignUp
            afterSignInUrl="/canvas"
            afterSignUpUrl="/canvas"
            appearance={{
              elements: {
                rootBox: "w-full",
                card: "rounded-2xl shadow-2xl",
                cardBox: "rounded-2xl overflow-hidden",
              },
              variables: {
                colorBackground: "#130f26",
                colorText: "#F0EDF8",
                colorTextSecondary: "#8884a8",
                colorInputBackground: "rgba(255, 255, 255, 0.06)",
                colorInputText: "#F0EDF8",
                colorPrimary: "#7C3AED",
                borderRadius: "0.75rem",
              },
            }}
          />
        </div>
      </div>
    </div>
  );
}
