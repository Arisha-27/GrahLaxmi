"use client";
import React from 'react'
import { signIn, useSession,signOut} from "next-auth/react"

const login = () => {
   
  const session=useSession();
  console.log(session);
  return(
    <div>
      <button onClick={()=> signIn("google")}> Login with google</button>
    </div>
  )
}

export default login
