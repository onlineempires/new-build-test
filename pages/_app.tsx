import type { AppProps } from 'next/app'
import '../styles/globals.css'
import { UpgradeProvider } from '../contexts/UpgradeContext'
import { UserRoleProvider } from '../contexts/UserRoleContext'
import { AdminAuthProvider } from '../contexts/AdminAuthContext'
import { CourseAccessProvider } from '../contexts/CourseAccessContext'
import { AffiliateProvider } from '../contexts/AffiliateContext'

export default function App({ Component, pageProps }: AppProps) {
  return (
    <UserRoleProvider>
      <AffiliateProvider>
        <CourseAccessProvider>
          <AdminAuthProvider>
            <UpgradeProvider>
              <Component {...pageProps} />
            </UpgradeProvider>
          </AdminAuthProvider>
        </CourseAccessProvider>
      </AffiliateProvider>
    </UserRoleProvider>
  )
}