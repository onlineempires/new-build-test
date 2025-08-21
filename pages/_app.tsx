import type { AppProps } from 'next/app'
import '../styles/globals.css'
import { UpgradeProvider } from '../contexts/UpgradeContext'
import { UserRoleProvider } from '../contexts/UserRoleContext'
import { AdminAuthProvider } from '../contexts/AdminAuthContext'
import { CourseAccessProvider } from '../contexts/CourseAccessContext'
import { AffiliateProvider } from '../contexts/AffiliateContext'
import { NotificationProvider } from '../contexts/NotificationContext'
import { UserProvider } from '../contexts/UserContext'

export default function App({ Component, pageProps }: AppProps) {
  return (
    <UserProvider>
      <UserRoleProvider>
        <AffiliateProvider>
          <CourseAccessProvider>
            <AdminAuthProvider>
              <UpgradeProvider>
                <NotificationProvider>
                  <Component {...pageProps} />
                </NotificationProvider>
              </UpgradeProvider>
            </AdminAuthProvider>
          </CourseAccessProvider>
        </AffiliateProvider>
      </UserRoleProvider>
    </UserProvider>
  )
}