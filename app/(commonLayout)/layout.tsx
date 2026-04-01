import Footer from '@/components/layout/Footer'
import { Navbar } from '@/components/layout/Navbar'
import { getUserInfo } from '@/services/auth.services'
import React from 'react'

export default async function RootLayout({ children }: { children: React.ReactNode }) {
	const userInfo = await getUserInfo();

  return (
	<div
	  style={{
	    background: "#d4d0c8",
	    minHeight: "100vh",
	    fontFamily: "'Tahoma','Verdana','Arial',sans-serif",
	    fontSize: "11px",
	  }}
	>
		<Navbar userInfo={userInfo} />
		<main style={{ background: "#d4d0c8" }}>{children}</main>
		<Footer />
	</div>
  )
}
