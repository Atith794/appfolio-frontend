import React from 'react'
import Link from 'next/link'

function Logo() {
  return (
    <Link href="/dashboard" className="flex items-center gap-3 cursor-pointer">
      <div className="flex items-center gap-3">
        <div className="size-8 bg-primary rounded-lg flex items-center justify-center text-white font-mono">
          APF
        </div>
        <h2 className="text-black text-lg font-black tracking-tight font-serif">AppFolio</h2>
      </div>
    </Link>
  )
}

export default Logo