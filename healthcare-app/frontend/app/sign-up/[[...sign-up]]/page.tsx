import { SignUp } from '@clerk/nextjs';

export default function SignUpPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/10 via-white to-teal-50/50 py-12 px-4 sm:px-6 lg:px-8">
      <SignUp 
        routing="path"
        path="/sign-up"
        signInUrl="/sign-in"
        appearance={{
          elements: {
            rootBox: "mx-auto",
            card: "shadow-2xl border-0",
          }
        }}
      />
    </div>
  );
}
