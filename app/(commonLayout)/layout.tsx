import Footer from '@/components/layout/Footer'
import { Navbar } from '@/components/layout/Navbar'
import { getUserInfo } from '@/services/auth.services'
import React from 'react'

export default async function RootLayout({ children }: { children: React.ReactNode }) {
	const userInfo = await getUserInfo();

  return (
	<div>
		<Navbar userInfo={userInfo} />
		<main>{children}</main>
		<Footer />
	</div>
  )
}
