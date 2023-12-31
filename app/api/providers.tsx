"use client";

import { checkUser, createUser } from "@/lib/api/user";
import { useAuth } from "@clerk/nextjs";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useEffect, useState } from "react";

export default function Providers({ children }: { children: React.ReactNode }) {
  const { isSignedIn, userId } = useAuth();

  const checkingUser = async () => {
    if (isSignedIn) {
      const user = await checkUser(userId);
      console.log(user);
      if(!user){
        const newUser = await createUser(userId);
        console.log(newUser);
      }
    }
  };

  useEffect(() => {
    // checkingUser();
  }, [isSignedIn]);

  const [queryClient] = useState(() => new QueryClient());

  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
}
