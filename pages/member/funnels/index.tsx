import useAuth from '@/utils/useAuth';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import {
  Plus,
  Edit3,
  Eye,
  Trash2,
  Copy,
  ExternalLink,
  Calendar,
  MoreVertical,
  Loader2,
} from 'lucide-react';
import type { MemberFunnelWithAnalytics } from '@/types/funnel';

export default function MemberFunnels() {
  const { user, isPending } = useAuth();
  const router = useRouter();
  const [funnels, setFunnels] = useState<MemberFunnelWithAnalytics[]>([]);
  const [loading, setLoading] = useState(true);
  const [noFunnels, setNoFunnels] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<number | null>(null);
  const [duplicatingFunnel, setDuplicatingFunnel] = useState<number | null>(null);

  useEffect(() => {
    if (!isPending && !user) {
      router.push('/');
    }
  }, [user, isPending, router]);

  useEffect(() => {
    console.log('noFunnels', noFunnels);
    if (user && !noFunnels) {
      fetchFunnels();
    }
  }, [user]);

  const fetchFunnels = async () => {
    try {
      console.log('Fetching funnels, member funnels');
      const response = await fetch('/member/funnels');
      if (response.ok) {
        const data = await response.json();
        setFunnels(data);
        setNoFunnels(true);
      }
    } catch (error) {
      console.error('Failed to fetch funnels:', error);
    } finally {
      setLoading(false);
    }
  };
  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this funnel?')) return;

    try {
      const response = await fetch(`/member/funnels/${id}`, {
        method: 'DELETE',
      });
      if (response.ok) {
        setFunnels(funnels.filter((f) => f.id !== id));
      }
    } catch (error) {
      console.error('Failed to delete funnel:', error);
    }
  };

  const handlePublish = async (id: number) => {
    try {
      const response = await fetch(`/member/funnels/${id}/publish`, {
        method: 'POST',
      });
      if (response.ok) {
        setFunnels(funnels.map((f) => (f.id === id ? { ...f, is_published: 1 } : f)));
      }
    } catch (error) {
      console.error('Failed to publish funnel:', error);
    }
  };

  const copyFunnelUrl = (slug: string) => {
    const url = `${window.location.origin}/funnel/${slug}`;
    navigator.clipboard.writeText(url);
    // Show success feedback
    const button = document.querySelector(`[data-funnel-slug="${slug}"]`);
    if (button) {
      const originalText = button.textContent;
      button.textContent = 'Copied!';
      setTimeout(() => {
        button.textContent = originalText;
      }, 2000);
    }
  };

  const handleDuplicate = async (id: number) => {
    setDuplicatingFunnel(id);
    try {
      const response = await fetch(`/member/funnels/${id}/duplicate`, {
        method: 'POST',
      });

      if (response.ok) {
        const duplicatedFunnel = await response.json();
        // Refresh the funnels list to show the new duplicate
        await fetchFunnels();
        // Navigate to edit the duplicated funnel
        router.push(`/member/funnels/${duplicatedFunnel.id}/edit`);
      } else {
        const errorData = await response.json();
        alert(`Failed to duplicate funnel: ${errorData.error || 'Unknown error'}`);
      }
    } catch (error) {
      console.error('Failed to duplicate funnel:', error);
      alert('Failed to duplicate funnel. Please try again.');
    } finally {
      setDuplicatingFunnel(null);
    }
  };

  const toggleDropdown = (funnelId: number) => {
    setActiveDropdown(activeDropdown === funnelId ? null : funnelId);
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = () => setActiveDropdown(null);
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  if (isPending || !user) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center">
        <div className="animate-spin">
          <div className="h-10 w-10 rounded-full border-4 border-blue-600 border-t-transparent"></div>
        </div>
      </div>
    );
  }

  // Simple admin check
  const isAdmin =
    user.email?.includes('@admin') ||
    user.email === 'admin@example.com' ||
    user.email?.includes('@onlineempires.com');

  return (
    <>
      {/* Mobile Layout */}
      <div className="min-h-screen bg-gray-50 lg:hidden">
        {/* Mobile Header */}
        <div className="border-b bg-white px-4 py-4">
          <div className="mb-4 flex items-center justify-between">
            <h1 className="text-xl font-semibold text-gray-900">My Funnels</h1>
            <Link
              href="/member/funnels/new"
              className="flex items-center space-x-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
            >
              <div className="flex items-center space-x-2">
                <Plus className="h-4 w-4" />
                <span>Add</span>
              </div>
            </Link>
          </div>

          {/* Mobile Stats */}
          <div className="grid grid-cols-3 gap-3">
            <div className="text-center">
              <div className="text-lg font-bold text-gray-900">{funnels.length}</div>
              <div className="text-xs text-gray-500">Total</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-bold text-green-600">
                {funnels.filter((f) => f.is_published).length}
              </div>
              <div className="text-xs text-gray-500">Published</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-bold text-orange-600">
                {funnels.filter((f) => !f.is_published).length}
              </div>
              <div className="text-xs text-gray-500">Drafts</div>
            </div>
          </div>
        </div>

        {/* Mobile Content */}
        <div className="p-4">
          {loading ? (
            <div className="py-8 text-center">
              <div className="mx-auto h-8 w-8 animate-spin rounded-full border-4 border-blue-600 border-t-transparent"></div>
              <p className="mt-4 text-gray-500">Loading funnels...</p>
            </div>
          ) : funnels.length === 0 ? (
            <div className="py-12 text-center">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gray-100">
                <Plus className="h-8 w-8 text-gray-400" />
              </div>
              <h3 className="mb-2 text-lg font-semibold text-gray-900">No funnels yet</h3>
              <p className="mb-6 text-sm text-gray-600">
                Create your first funnel to start converting visitors
              </p>
              <Link
                href="/member/funnels/new"
                className="inline-flex items-center space-x-2 rounded-lg bg-blue-600 px-6 py-3 font-medium text-white hover:bg-blue-700"
              >
                <div className="flex items-center space-x-2">
                  <Plus className="h-5 w-5" />
                  <span>Create Your First Funnel</span>
                </div>
              </Link>
            </div>
          ) : (
            <div className="space-y-3">
              {funnels.map((funnel) => (
                <div key={funnel.id} className="rounded-lg border border-gray-200 bg-white p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex flex-1 items-start space-x-3">
                      <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-blue-500">
                        <svg
                          className="h-5 w-5 text-white"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M13 10V3L4 14h7v7l9-11h-7z"
                          />
                        </svg>
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="mb-1 flex items-center space-x-2">
                          <h3 className="truncate text-sm font-medium text-gray-900">
                            {funnel.funnel_name || 'Untitled Funnel'}
                          </h3>
                          <span
                            className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${
                              funnel.is_published
                                ? 'bg-green-100 text-green-800'
                                : 'bg-orange-100 text-orange-800'
                            }`}
                          >
                            {funnel.is_published ? 'Published' : 'Draft'}
                          </span>
                        </div>

                        <div className="mb-2 flex items-center text-xs text-gray-500">
                          <Calendar className="mr-1 h-3 w-3" />
                          <span>{new Date(funnel.created_at).toLocaleDateString()}</span>
                        </div>

                        {/* Analytics Summary */}
                        <div className="mb-2 grid grid-cols-2 gap-2 text-xs">
                          <div className="rounded bg-blue-50 px-2 py-1">
                            <span className="font-medium text-blue-600">
                              {funnel.total_views || 0}
                            </span>
                            <span className="ml-1 text-blue-500">views</span>
                          </div>
                          <div className="rounded bg-green-50 px-2 py-1">
                            <span className="font-medium text-green-600">
                              {funnel.lead_count || 0}
                            </span>
                            <span className="ml-1 text-green-500">leads</span>
                          </div>
                        </div>

                        <div className="text-xs text-gray-500">
                          Updated: {new Date(funnel.updated_at).toLocaleDateString()}
                        </div>
                      </div>
                    </div>

                    <div className="relative">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleDropdown(funnel.id);
                        }}
                        className="rounded-lg p-2 text-gray-400 hover:text-gray-600"
                      >
                        <MoreVertical className="h-5 w-5" />
                      </button>

                      {activeDropdown === funnel.id && (
                        <div className="absolute right-0 top-full z-10 mt-1 w-48 rounded-lg border border-gray-200 bg-white shadow-lg">
                          <div className="py-1">
                            <Link
                              href={`/member/funnels/${funnel.id}/edit`}
                              className="flex items-center px-4 py-3 text-sm text-gray-700 hover:bg-gray-50"
                              onClick={() => setActiveDropdown(null)}
                            >
                              <Edit3 className="mr-3 h-4 w-4" />
                              Edit Funnel
                            </Link>

                            <button
                              onClick={() => {
                                handleDuplicate(funnel.id);
                                setActiveDropdown(null);
                              }}
                              disabled={duplicatingFunnel === funnel.id}
                              className="flex w-full items-center px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 disabled:opacity-50"
                            >
                              {duplicatingFunnel === funnel.id ? (
                                <Loader2 className="mr-3 h-4 w-4 animate-spin" />
                              ) : (
                                <Copy className="mr-3 h-4 w-4" />
                              )}
                              <span>
                                {duplicatingFunnel === funnel.id
                                  ? 'Duplicating...'
                                  : 'Duplicate Funnel'}
                              </span>
                            </button>

                            {funnel.is_published && funnel.slug ? (
                              <>
                                <Link
                                  href={`/funnel/${funnel.slug}`}
                                  target="_blank"
                                  className="flex items-center px-4 py-3 text-sm text-gray-700 hover:bg-gray-50"
                                  onClick={() => setActiveDropdown(null)}
                                >
                                  <ExternalLink className="mr-3 h-4 w-4" />
                                  View Live
                                </Link>
                                <button
                                  onClick={() => {
                                    copyFunnelUrl(funnel.slug!);
                                    setActiveDropdown(null);
                                  }}
                                  className="flex w-full items-center px-4 py-3 text-sm text-gray-700 hover:bg-gray-50"
                                  data-funnel-slug={funnel.slug}
                                >
                                  <Copy className="mr-3 h-4 w-4" />
                                  Copy URL
                                </button>
                              </>
                            ) : null}

                            {!funnel.is_published ? (
                              <button
                                onClick={() => {
                                  handlePublish(funnel.id);
                                  setActiveDropdown(null);
                                }}
                                className="flex w-full items-center px-4 py-3 text-sm text-blue-600 hover:bg-blue-50"
                              >
                                <Eye className="mr-3 h-4 w-4" />
                                Publish Funnel
                              </button>
                            ) : null}

                            <button
                              onClick={() => {
                                handleDelete(funnel.id);
                                setActiveDropdown(null);
                              }}
                              className="flex w-full items-center px-4 py-3 text-sm text-red-600 hover:bg-red-50"
                            >
                              <Trash2 className="mr-3 h-4 w-4" />
                              Delete Funnel
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Desktop Layout */}
      <div className="hidden min-h-screen bg-gray-50 p-8 lg:block">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900">My Funnels</h1>
          <p className="mt-1 text-gray-600">Create and manage your affiliate marketing funnels</p>
          <div className="mt-4">
            <Link
              href="/member/funnels/new"
              className="inline-flex items-center space-x-2 rounded-lg bg-blue-600 px-6 py-2.5 text-sm font-medium text-white shadow-sm transition-colors hover:bg-blue-700"
            >
              <div className="flex items-center space-x-2">
                <Plus className="h-4 w-4" />
                <span>Create Funnel</span>
              </div>
            </Link>
          </div>
        </div>

        {/* Stats */}
        <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div className="rounded-xl border border-gray-100 bg-white p-6 text-center shadow-sm">
            <div className="mb-1 text-3xl font-bold text-gray-900">{funnels.length}</div>
            <div className="text-sm font-medium text-gray-600">Total Funnels</div>
          </div>
          <div className="rounded-xl border border-gray-100 bg-white p-6 text-center shadow-sm">
            <div className="mb-1 text-3xl font-bold text-green-600">
              {funnels.filter((f) => f.is_published).length}
            </div>
            <div className="text-sm font-medium text-gray-600">Published</div>
          </div>
          <div className="rounded-xl border border-gray-100 bg-white p-6 text-center shadow-sm">
            <div className="mb-1 text-3xl font-bold text-orange-600">
              {funnels.filter((f) => !f.is_published).length}
            </div>
            <div className="text-sm font-medium text-gray-600">Drafts</div>
          </div>
        </div>

        {/* Funnels Table */}
        <div className="overflow-hidden rounded-xl border border-gray-200 bg-white">
          {loading ? (
            <div className="p-8 text-center">
              <div className="mx-auto h-8 w-8 animate-spin rounded-full border-4 border-blue-600 border-t-transparent"></div>
              <p className="mt-4 text-gray-500">Loading funnels...</p>
            </div>
          ) : funnels.length === 0 ? (
            <div className="p-12 text-center">
              <div className="mx-auto mb-4 flex h-24 w-24 items-center justify-center rounded-full bg-gray-100">
                <Plus className="h-12 w-12 text-gray-400" />
              </div>
              <h3 className="mb-2 text-xl font-semibold text-gray-900">No funnels yet</h3>
              <p className="mb-6 text-gray-600">
                Create your first funnel to start converting visitors into customers
              </p>
              <Link
                href="/member/funnels/new"
                className="inline-flex items-center space-x-2 rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 px-6 py-3 font-medium text-white transition-all duration-200 hover:from-blue-700 hover:to-purple-700"
              >
                <div className="flex items-center space-x-2">
                  <Plus className="h-5 w-5" />
                  <span>Create Your First Funnel</span>
                </div>
              </Link>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="border-b border-gray-200 bg-gray-50">
                  <tr>
                    <th className="px-6 py-4 text-left font-semibold text-gray-900">Title</th>
                    <th className="px-6 py-4 text-left font-semibold text-gray-900">Status</th>
                    <th className="px-6 py-4 text-left font-semibold text-gray-900">Analytics</th>
                    <th className="px-6 py-4 text-left font-semibold text-gray-900">Created</th>
                    <th className="px-6 py-4 text-right font-semibold text-gray-900">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {funnels.map((funnel) => (
                    <tr key={funnel.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <div>
                          <h3 className="font-semibold text-gray-900">
                            {funnel.funnel_name || 'Untitled Funnel'}
                          </h3>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                            funnel.is_published
                              ? 'bg-green-100 text-green-800'
                              : 'bg-yellow-100 text-yellow-800'
                          }`}
                        >
                          {funnel.is_published ? 'Published' : 'Draft'}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex space-x-4 text-sm">
                          <div className="text-center">
                            <div className="font-medium text-gray-900">
                              {funnel.total_views || 0}
                            </div>
                            <div className="text-xs text-gray-500">Views</div>
                          </div>
                          <div className="text-center">
                            <div className="font-medium text-gray-900">
                              {funnel.unique_views || 0}
                            </div>
                            <div className="text-xs text-gray-500">Unique</div>
                          </div>
                          <div className="text-center">
                            <div className="font-medium text-gray-900">
                              {funnel.lead_count || 0}
                            </div>
                            <div className="text-xs text-gray-500">Leads</div>
                          </div>
                          <div className="text-center">
                            <div className="font-medium text-gray-900">
                              {funnel.conversions || 0}
                            </div>
                            <div className="text-xs text-gray-500">Conversions</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        {new Date(funnel.created_at).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-end space-x-2">
                          <Link
                            href={`/member/funnels/${funnel.id}/edit`}
                            className="rounded-lg p-2 text-gray-600 transition-colors hover:bg-blue-50 hover:text-blue-600"
                            title="Edit"
                          >
                            <Edit3 className="h-4 w-4" />
                          </Link>

                          <button
                            onClick={() => handleDuplicate(funnel.id)}
                            disabled={duplicatingFunnel === funnel.id}
                            className="rounded-lg p-2 text-gray-600 transition-colors hover:bg-purple-50 hover:text-purple-600 disabled:opacity-50"
                            title={duplicatingFunnel === funnel.id ? 'Duplicating...' : 'Duplicate'}
                          >
                            {duplicatingFunnel === funnel.id ? (
                              <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                              <Copy className="h-4 w-4" />
                            )}
                          </button>

                          {funnel.is_published && funnel.slug ? (
                            <>
                              <Link
                                href={`/funnel/${funnel.slug}`}
                                target="_blank"
                                className="rounded-lg p-2 text-gray-600 transition-colors hover:bg-green-50 hover:text-green-600"
                                title="View"
                              >
                                <Eye className="h-4 w-4" />
                              </Link>
                              <button
                                onClick={() => copyFunnelUrl(funnel.slug!)}
                                className="rounded-lg p-2 text-gray-600 transition-colors hover:bg-orange-50 hover:text-orange-600"
                                title="Copy URL"
                                data-funnel-slug={funnel.slug}
                              >
                                <ExternalLink className="h-4 w-4" />
                              </button>
                            </>
                          ) : null}

                          {!funnel.is_published ? (
                            <button
                              onClick={() => handlePublish(funnel.id)}
                              className="rounded-lg bg-blue-600 px-3 py-1 text-sm text-white transition-colors hover:bg-blue-700"
                            >
                              Publish
                            </button>
                          ) : null}

                          <button
                            onClick={() => handleDelete(funnel.id)}
                            className="rounded-lg p-2 text-gray-600 transition-colors hover:bg-red-50 hover:text-red-600"
                            title="Delete"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
