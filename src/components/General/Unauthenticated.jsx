import Head from 'next/head'
import React from 'react'
export const metadata = {
  title: "UnAuthenticated",
  description: "Page for unauthenticated access",
};

const Unauthenticated = () => {
  return (
     <>
      <div>
        <h1 className="text-white">UnAuthenticated</h1>
      </div>
    </>
  )
}

export default Unauthenticated