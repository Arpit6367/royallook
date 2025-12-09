"use client";

import { useState, useEffect } from "react";
import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function SignInPage() {
  const router = useRouter();
  const { data: session, status } = useSession();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // -------------------------------------------------
  // 1. REDIRECT AUTHENTICATED USERS IMMEDIATELY
  // -------------------------------------------------
  useEffect(() => {
    if (status === "authenticated" && session?.user?.role) {
      const role = session.user.role as string;

      if (role === "admin") {
        router.replace("/admin");
      } else if (role === "coach") {
        router.replace("/coach");
      } else {
        router.replace("/learn");
      }
    }
  }, [status, session, router]);

  // -------------------------------------------------
  // 2. SHOW LOADING OR REDIRECTING SCREEN
  // -------------------------------------------------
  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#769656] to-[#5C1F1C]">
        <div className="bg-white p-8 rounded-lg shadow-2xl">
          <p className="text-xl font-semibold animate-pulse">Loading...</p>
        </div>
      </div>
    );
  }

  if (status === "authenticated") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#769656] to-[#5C1F1C]">
        <div className="bg-white p-8 rounded-lg shadow-2xl">
          <p className="text-xl font-bold animate-pulse">Redirecting...</p>
        </div>
      </div>
    );
  }

  // -------------------------------------------------
  // 3. HANDLE SIGN IN
  // -------------------------------------------------
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const result = await signIn("credentials", {
      email,
      password,
      redirect: false, // Important: we handle redirect manually
    });

    if (result?.error) {
      setError("Invalid email or password");
      setLoading(false);
    }
    // On success → do NOTHING here
    // useEffect will catch the updated session and redirect
  };

  // -------------------------------------------------
  // 4. SIGN-IN FORM (Only shown when unauthenticated)
  // -------------------------------------------------
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#769656] to-[#5C1F1C] py-12 px-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-xl p-8">
        <h1 className="text-3xl font-bold text-center mb-8">Sign In</h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={loading}
            />
          </div>

          <div>
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              disabled={loading}
            />
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
              {error}
            </div>
          )}

          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "Signing in..." : "Sign In"}
          </Button>
        </form>

        <p className="text-center mt-6 text-sm text-gray-600">
          Don’t have an account?{" "}
          <Link href="/auth/signup" className="font-medium text-blue-600 hover:underline">
            Sign Up
          </Link>
        </p>
      </div>
    </div>
  );
}

// "use client";

// import { useState, useEffect } from "react";
// import { signIn, useSession } from "next-auth/react";
// import { useRouter } from "next/navigation";
// import Link from "next/link";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";

// export default function SignInPage() {
//   const router = useRouter();
//   const { data: session, status } = useSession();

//   // States
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [error, setError] = useState("");
//   const [loading, setLoading] = useState(false);

//   // -------------------------------------
//   // ✅ FIXED REDIRECT LOGIC
//   // -------------------------------------
//   useEffect(() => {
//     if (status !== "authenticated") return;
//     if (!session?.user?.role) return; // prevent early redirect

//     const role = session.user.role;

//     if (role === "admin") router.replace("/admin");
//     else if (role === "coach") router.replace("/coach");
//     else router.replace("/learn");
//   }, [session, status, router]);

//   // -------------------------------------
//   // ✅ Proper loading check
//   // -------------------------------------
//   if (status === "loading") {
//     return (
//       <div className="min-h-screen flex items-center justify-center">
//         <p>Loading...</p>
//       </div>
//     );
//   }

//   // -------------------------------------
//   // 🔴 Do NOT block UI on authenticated
//   // (let redirect effect handle it)
//   // -------------------------------------

//   // -------------------------------------
//   // Handle Sign In
//   // -------------------------------------
//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setError("");
//     setLoading(true);

//     const result = await signIn("credentials", {
//       email,
//       password,
//       redirect: false,
//     });

//     if (result?.error) {
//       setError("Invalid email or password");
//     } else {
//       router.refresh();
//     }

//     setLoading(false);
//   };

//   // -------------------------------------
//   // UI
//   // -------------------------------------
//   return (
//     <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#769656] to-[#5C1F1C] py-12 px-4">
//       <div className="max-w-md w-full bg-white rounded-lg shadow-xl p-8">
//         <h1 className="text-3xl font-bold text-center">Sign In</h1>

//         <form onSubmit={handleSubmit} className="space-y-6 mt-8">
//           <div>
//             <Label htmlFor="email">Email</Label>
//             <Input
//               id="email"
//               type="email"
//               value={email}
//               onChange={(e) => setEmail(e.target.value)}
//               required
//             />
//           </div>

//           <div>
//             <Label htmlFor="password">Password</Label>
//             <Input
//               id="password"
//               type="password"
//               value={password}
//               onChange={(e) => setPassword(e.target.value)}
//               required
//             />
//           </div>

//           {error && (
//             <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
//               {error}
//             </div>
//           )}

//           <Button type="submit" className="w-full" disabled={loading}>
//             {loading ? "Signing in..." : "Sign In"}
//           </Button>
//         </form>

//         <p className="text-center mt-6 text-sm">
//           Don’t have an account? <Link href="/auth/signup">Sign Up</Link>
//         </p>
//       </div>
//     </div>
//   );
// }

// "use client";

// import { useState, useEffect } from "react";
// import { signIn, useSession } from "next-auth/react";
// import { useRouter } from "next/navigation";
// import Link from "next/link";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";

// export default function SignInPage() {
//   const router = useRouter();
//   const { data: session, status } = useSession();

//   // States
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [error, setError] = useState("");
//   const [loading, setLoading] = useState(false);

//   // -------------------------------------
//   // ✅ FIXED REDIRECT LOGIC
//   // -------------------------------------
//   useEffect(() => {
//     if (status !== "authenticated") return;
//     if (!session?.user?.role) return; // prevent early redirect

//     const role = session.user.role;

//     if (role === "admin") router.replace("/admin");
//     else if (role === "coach") router.replace("/coach");
//     else router.replace("/learn");
//   }, [session, status, router]);

//   // -------------------------------------
//   // ✅ Proper loading check
//   // -------------------------------------
//   if (status === "loading") {
//     return (
//       <div className="min-h-screen flex items-center justify-center">
//         <p>Loading...</p>
//       </div>
//     );
//   }

//   // -------------------------------------
//   // 🔴 Do NOT block UI on authenticated
//   // (let redirect effect handle it)
//   // -------------------------------------

//   // -------------------------------------
//   // Handle Sign In
//   // -------------------------------------
//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setError("");
//     setLoading(true);

//     const result = await signIn("credentials", {
//       email,
//       password,
//       redirect: false,
//     });

//     if (result?.error) {
//       setError("Invalid email or password");
//     } else {
//       router.refresh();
//     }

//     setLoading(false);
//   };

//   // -------------------------------------
//   // UI
//   // -------------------------------------
//   return (
//     <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#769656] to-[#5C1F1C] py-12 px-4">
//       <div className="max-w-md w-full bg-white rounded-lg shadow-xl p-8">
//         <h1 className="text-3xl font-bold text-center">Sign In</h1>

//         <form onSubmit={handleSubmit} className="space-y-6 mt-8">
//           <div>
//             <Label htmlFor="email">Email</Label>
//             <Input
//               id="email"
//               type="email"
//               value={email}
//               onChange={(e) => setEmail(e.target.value)}
//               required
//             />
//           </div>

//           <div>
//             <Label htmlFor="password">Password</Label>
//             <Input
//               id="password"
//               type="password"
//               value={password}
//               onChange={(e) => setPassword(e.target.value)}
//               required
//             />
//           </div>

//           {error && (
//             <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
//               {error}
//             </div>
//           )}

//           <Button type="submit" className="w-full" disabled={loading}>
//             {loading ? "Signing in..." : "Sign In"}
//           </Button>
//         </form>

//         <p className="text-center mt-6 text-sm">
//           Don’t have an account? <Link href="/auth/signup">Sign Up</Link>
//         </p>
//       </div>
//     </div>
//   );
// }