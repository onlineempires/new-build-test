import type { AppProps } from 'next/app'
import '../styles/globals.css'
import { UpgradeProvider } from '../contexts/UpgradeContext'
import { UserRoleProvider } from '../contexts/UserRoleContext'
import { AdminAuthProvider } from '../contexts/AdminAuthContext'

export default function App({ Component, pageProps }: AppProps) {
  return (
    <UserRoleProvider>
      <AdminAuthProvider>
        <UpgradeProvider>
          <Component {...pageProps} />
        </UpgradeProvider>
      </AdminAuthProvider>
    </UserRoleProvider>
  )
}