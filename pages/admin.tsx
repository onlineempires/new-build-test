import { useState, useEffect } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import AppLayout from '../components/layout/AppLayout';
import AdminRouteGuard from '../components/admin/AdminRouteGuard';
import { useUserRole, UserRole, ROLE_DETAILS } from '../contexts/UserRoleContext';
import { useAdminAuth, withAdminAuth } from '../contexts/AdminAuthContext';

interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  joinDate: string;
  lastActive: string;
  totalSpent: number;
}

interface Payment {
  id: string;
  userId: string;
  userName: string;
  amount: number;
  type: 'role_upgrade' | 'course_purchase' | 'subscription';
  status: 'completed' | 'pending' | 'failed';
  date: string;
}

interface Course {
  id: string;
  title: string;
  description: string;
  lessonCount: number;
  isPublished: boolean;
  enrollmentCount: number;
  revenue: number;
}

function AdminDashboard() {
  const router = useRouter();
  const { currentRole, hasPermission, setUserRole } = useUserRole();
  const { adminUser, logout: adminLogout, checkSession } = useAdminAuth();
  const [activeTab, setActiveTab] = useState<'overview' | 'users' | 'courses' | 'payments' | 'funnels' | 'calendar'>('overview');
  
  // Mock data - in real app, this would come from API
  const [users] = useState<User[]>([
    {
      id: '1',
      name: 'John Doe',
      email: 'john@example.com',
      role: 'monthly',
      joinDate: '2025-01-15',
      lastActive: '2025-08-16',
      totalSpent: 297
    },
    {
      id: '2', 
      name: 'Jane Smith',
      email: 'jane@example.com',
      role: 'annual',
      joinDate: '2025-02-01',
      lastActive: '2025-08-15',
      totalSpent: 799
    },
    {
      id: '3',
      name: 'Bob Johnson',
      email: 'bob@example.com', 
      role: 'downsell',
      joinDate: '2025-08-10',
      lastActive: '2025-08-16',
      totalSpent: 37
    }
  ]);

  const [payments] = useState<Payment[]>([
    {
      id: 'pay_1',
      userId: '1',
      userName: 'John Doe',
      amount: 99,
      type: 'role_upgrade',
      status: 'completed',
      date: '2025-08-16'
    },
    {
      id: 'pay_2',
      userId: '2', 
      userName: 'Jane Smith',
      amount: 799,
      type: 'role_upgrade',
      status: 'completed',
      date: '2025-08-15'
    }
  ]);

  const [courses] = useState<Course[]>([
    {
      id: 'business-blueprint',
      title: 'The Business Blueprint',
      description: 'Master the fundamentals of building your online empire',
      lessonCount: 45,
      isPublished: true,
      enrollmentCount: 156,
      revenue: 2340
    },
    {
      id: 'email-marketing-secrets',
      title: 'Email Marketing Secrets',
      description: 'Build profitable email sequences and automated funnels',
      lessonCount: 16,
      isPublished: true,
      enrollmentCount: 23,
      revenue: 1127
    }
  ]);

  // Set admin role when accessing admin dashboard
  useEffect(() => {
    if (adminUser && currentRole !== 'admin') {
      setUserRole('admin');
    }
  }, [adminUser, currentRole, setUserRole]);

  // Periodic session validation
  useEffect(() => {
    const validateSession = () => {
      if (!checkSession()) {
        adminLogout();
      }
    };

    // Check session every 30 seconds when admin panel is active
    const interval = setInterval(validateSession, 30000);
    return () => clearInterval(interval);
  }, [checkSession, adminLogout]);

  const handleAdminLogout = () => {
    adminLogout();
    // Also clear user role
    setUserRole('free');
  };

  const stats = {
    totalUsers: users.length,
    totalRevenue: payments.reduce((sum, payment) => sum + payment.amount, 0),
    activeCourses: courses.filter(c => c.isPublished).length,
    monthlyRecurring: users.filter(u => u.role === 'monthly').length * 99
  };

  const renderOverview = () => (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mr-4">
              <i className="fas fa-users text-blue-600 text-xl"></i>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Total Users</p>
              <p className="text-2xl font-bold text-gray-900">{stats.totalUsers}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mr-4">
              <i className="fas fa-dollar-sign text-green-600 text-xl"></i>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Total Revenue</p>
              <p className="text-2xl font-bold text-gray-900">${stats.totalRevenue.toLocaleString()}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mr-4">
              <i className="fas fa-book text-purple-600 text-xl"></i>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Active Courses</p>
              <p className="text-2xl font-bold text-gray-900">{stats.activeCourses}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center mr-4">
              <i className="fas fa-refresh text-yellow-600 text-xl"></i>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Monthly Recurring</p>
              <p className="text-2xl font-bold text-gray-900">${stats.monthlyRecurring.toLocaleString()}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
        <div className="space-y-3">
          {payments.slice(0, 5).map((payment) => (
            <div key={payment.id} className="flex items-center justify-between py-3 border-b border-gray-100 last:border-0">
              <div className="flex items-center">
                <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center mr-3">
                  <i className="fas fa-check text-green-600 text-sm"></i>
                </div>
                <div>
                  <p className="font-medium text-gray-900">{payment.userName}</p>
                  <p className="text-sm text-gray-500">{payment.type.replace('_', ' ')}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-medium text-gray-900">${payment.amount}</p>
                <p className="text-sm text-gray-500">{payment.date}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderUsers = () => (
    <div className="bg-white rounded-lg shadow-sm">
      <div className="px-6 py-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900">User Management</h3>
          <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
            <i className="fas fa-plus mr-2"></i>Add User
          </button>
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Join Date</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total Spent</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {users.map((user) => (
              <tr key={user.id}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div>
                    <div className="text-sm font-medium text-gray-900">{user.name}</div>
                    <div className="text-sm text-gray-500">{user.email}</div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                    user.role === 'annual' ? 'bg-purple-100 text-purple-800' :
                    user.role === 'monthly' ? 'bg-blue-100 text-blue-800' :
                    user.role === 'downsell' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {ROLE_DETAILS[user.role].name}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{user.joinDate}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">${user.totalSpent}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <button className="text-blue-600 hover:text-blue-900 mr-4">Edit</button>
                  <button className="text-red-600 hover:text-red-900">Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  const renderCourses = () => (
    <div className="bg-white rounded-lg shadow-sm">
      <div className="px-6 py-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900">Course Management</h3>
          <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
            <i className="fas fa-plus mr-2"></i>Add Course
          </button>
        </div>
      </div>
      <div className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {courses.map((course) => (
            <div key={course.id} className="border border-gray-200 rounded-lg p-4">
              <div className="flex items-center justify-between mb-3">
                <h4 className="font-semibold text-gray-900">{course.title}</h4>
                <div className="flex items-center space-x-2">
                  <span className={`w-3 h-3 rounded-full ${course.isPublished ? 'bg-green-500' : 'bg-gray-300'}`}></span>
                  <span className="text-xs text-gray-500">{course.isPublished ? 'Live' : 'Draft'}</span>
                </div>
              </div>
              <p className="text-sm text-gray-600 mb-3">{course.description}</p>
              <div className="text-sm text-gray-500 space-y-1">
                <div>Lessons: {course.lessonCount}</div>
                <div>Enrollments: {course.enrollmentCount}</div>
                <div>Revenue: ${course.revenue}</div>
              </div>
              <div className="mt-4 flex space-x-2">
                <button className="text-blue-600 hover:text-blue-900 text-sm">Edit</button>
                <button className="text-green-600 hover:text-green-900 text-sm">Analytics</button>
                <button className="text-red-600 hover:text-red-900 text-sm">Archive</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderPayments = () => (
    <div className="bg-white rounded-lg shadow-sm">
      <div className="px-6 py-4 border-b border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900">Payment Tracking</h3>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Transaction ID</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {payments.map((payment) => (
              <tr key={payment.id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-mono text-gray-900">{payment.id}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{payment.userName}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{payment.type.replace('_', ' ')}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">${payment.amount}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                    payment.status === 'completed' ? 'bg-green-100 text-green-800' :
                    payment.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-red-100 text-red-800'
                  }`}>
                    {payment.status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{payment.date}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  const tabs = [
    { id: 'overview', name: 'Overview', icon: 'fas fa-chart-line' },
    { id: 'users', name: 'Users', icon: 'fas fa-users' },
    { id: 'courses', name: 'Courses', icon: 'fas fa-book' },
    { id: 'payments', name: 'Payments', icon: 'fas fa-credit-card' },
    { id: 'funnels', name: 'Funnels', icon: 'fas fa-share-alt' },
    { id: 'calendar', name: 'Calendar', icon: 'fas fa-calendar' }
  ];

  return (
    <>
      <Head>
        <title>Admin Dashboard - Digital Era</title>
        <meta name="description" content="Admin dashboard for platform management" />
      </Head>
      
      <AdminRouteGuard>
        <AppLayout 
          user={{ id: 0, name: adminUser?.username || 'Admin', avatarUrl: '' }}
          title="Admin Dashboard"
        >
        <div className="min-h-screen bg-gray-50">
          {/* Header */}
          <div className="bg-white border-b border-gray-200 px-6 py-4">
            <div className="flex items-center justify-between">
              <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
              <div className="flex items-center space-x-4">
                <div className="text-sm text-gray-600">
                  Logged in as: <span className="font-medium text-blue-600">{adminUser?.username}</span>
                </div>
                <div className="text-sm text-gray-600">
                  Role: <span className="font-medium text-purple-600">{ROLE_DETAILS[currentRole].name}</span>
                </div>
                <button
                  onClick={handleAdminLogout}
                  className="inline-flex items-center px-3 py-2 bg-red-600 text-white text-sm font-medium rounded-lg hover:bg-red-700 transition-colors"
                >
                  <i className="fas fa-sign-out-alt mr-2"></i>
                  Admin Logout
                </button>
              </div>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="bg-white border-b border-gray-200">
            <nav className="px-6">
              <div className="flex space-x-8">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as any)}
                    className={`py-4 px-1 border-b-2 font-medium text-sm ${
                      activeTab === tab.id
                        ? 'border-blue-500 text-blue-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    <i className={`${tab.icon} mr-2`}></i>
                    {tab.name}
                  </button>
                ))}
              </div>
            </nav>
          </div>

          {/* Content */}
          <div className="px-6 py-8">
            {activeTab === 'overview' && renderOverview()}
            {activeTab === 'users' && renderUsers()}
            {activeTab === 'courses' && renderCourses()}
            {activeTab === 'payments' && renderPayments()}
            {activeTab === 'funnels' && (
              <div className="bg-white rounded-lg shadow-sm p-8 text-center">
                <i className="fas fa-share-alt text-4xl text-gray-400 mb-4"></i>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Funnel Builder</h3>
                <p className="text-gray-600 mb-4">Create and manage marketing funnels</p>
                <button className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                  Create Funnel
                </button>
              </div>
            )}
            {activeTab === 'calendar' && (
              <div className="bg-white rounded-lg shadow-sm p-8 text-center">
                <i className="fas fa-calendar text-4xl text-gray-400 mb-4"></i>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Calendar Management</h3>
                <p className="text-gray-600 mb-4">Manage calendar links and appointments</p>
                <button className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                  Calendar Settings
                </button>
              </div>
            )}
          </div>
        </div>
        </AppLayout>
      </AdminRouteGuard>
    </>
  );
}

// Export the protected component
export default withAdminAuth(AdminDashboard);