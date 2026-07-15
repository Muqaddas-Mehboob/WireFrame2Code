"use client"
import { auth } from '@/configs/firebaseConfig';
import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { useRouter } from 'next/navigation';
import React from 'react'

interface AuthenticationProps {
    children: React.ReactNode;
    redirectTo?: string;
}

function Authentication({ children, redirectTo }: AuthenticationProps) {
    const router = useRouter();
    const provider = new GoogleAuthProvider();

    const onButtonPress = () => {
        signInWithPopup(auth, provider)
            .then((result) => {
                const user = result.user;
                console.log(user);
                if (redirectTo) {
                    router.replace(redirectTo);
                }
            }).catch((error) => {
                console.error(error);
            });
    }
    return (
        <div>
            <div onClick={onButtonPress} className="cursor-pointer">
                {children}
            </div>
        </div>
    )
}

export default Authentication

// "use client";

// import { auth } from "@/configs/firebaseConfig";
// import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";

// export default function Authentication({
//   children,
// }: {
//   children: React.ReactNode;
// }) {
//   const provider = new GoogleAuthProvider();

//   const login = async () => {
//     try {
//       const result = await signInWithPopup(auth, provider);

//       console.log(result.user);
//     } catch (err) {
//       console.error(err);
//     }
//   };

//   return (
//     <div
//       onClick={login}
//       className="cursor-pointer"
//     >
//       {children}
//     </div>
//   );
// }