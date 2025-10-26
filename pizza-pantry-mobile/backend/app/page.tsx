import Link from 'next/link';

export default function HomePage() {
  const apiEndpoints = [
    {
      method: 'GET',
      path: '/api/health',
      description: 'Health check endpoint',
      auth: false,
    },
    {
      method: 'GET',
      path: '/api/inventory',
      description: 'Get all inventory items',
      auth: true,
    },
    {
      method: 'POST',
      path: '/api/inventory',
      description: 'Create a new inventory item',
      auth: true,
    },
    {
      method: 'GET',
      path: '/api/inventory/[id]',
      description: 'Get a specific inventory item',
      auth: true,
    },
    {
      method: 'PUT',
      path: '/api/inventory/[id]',
      description: 'Update an inventory item',
      auth: true,
    },
    {
      method: 'DELETE',
      path: '/api/inventory/[id]',
      description: 'Delete an inventory item',
      auth: true,
    },
    {
      method: 'POST',
      path: '/api/inventory/[id]/adjust',
      description: 'Adjust item quantity',
      auth: true,
    },
    {
      method: 'GET',
      path: '/api/user/profile',
      description: 'Get user profile',
      auth: true,
    },
  ];

  return (
    <div className="py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Hero Section */}
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 sm:text-5xl md:text-6xl">
            Pizza Pantry{' '}
            <span className="text-orange-600">API</span>
          </h1>
          <p className="mt-3 max-w-md mx-auto text-base text-gray-500 sm:text-lg md:mt-5 md:text-xl md:max-w-3xl">
            Backend API service for the Pizza Pantry Mobile App.
            Manage your pizza restaurant inventory with our robust and secure API.
          </p>
          <div className="mt-5 max-w-md mx-auto sm:flex sm:justify-center md:mt-8">
            <div className="rounded-md shadow">
              <Link
                href="/api/health"
                className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-orange-600 hover:bg-orange-700 md:py-4 md:text-lg md:px-10"
              >
                Check API Health
              </Link>
            </div>
            <div className="mt-3 rounded-md shadow sm:mt-0 sm:ml-3">
              <a
                href="#endpoints"
                className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-orange-600 bg-white hover:bg-gray-50 md:py-4 md:text-lg md:px-10"
              >
                View Endpoints
              </a>
            </div>
          </div>
        </div>

        {/* Stats Section */}
        <div className="mt-16">
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="px-4 py-5 sm:p-6">
                <dt className="text-sm font-medium text-gray-500 truncate">
                  Total Endpoints
                </dt>
                <dd className="mt-1 text-3xl font-semibold text-gray-900">
                  {apiEndpoints.length}
                </dd>
              </div>
            </div>
            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="px-4 py-5 sm:p-6">
                <dt className="text-sm font-medium text-gray-500 truncate">
                  Authentication
                </dt>
                <dd className="mt-1 text-3xl font-semibold text-gray-900">
                  Clerk
                </dd>
              </div>
            </div>
            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="px-4 py-5 sm:p-6">
                <dt className="text-sm font-medium text-gray-500 truncate">
                  Database
                </dt>
                <dd className="mt-1 text-3xl font-semibold text-gray-900">
                  MongoDB
                </dd>
              </div>
            </div>
            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="px-4 py-5 sm:p-6">
                <dt className="text-sm font-medium text-gray-500 truncate">
                  Framework
                </dt>
                <dd className="mt-1 text-3xl font-semibold text-gray-900">
                  Next.js
                </dd>
              </div>
            </div>
          </div>
        </div>

        {/* API Endpoints Section */}
        <div id="endpoints" className="mt-16">
          <h2 className="text-2xl font-bold text-gray-900 mb-8">API Endpoints</h2>
          <div className="bg-white shadow overflow-hidden sm:rounded-md">
            <ul className="divide-y divide-gray-200">
              {apiEndpoints.map((endpoint, index) => (
                <li key={index}>
                  <div className="px-4 py-4 sm:px-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            endpoint.method === 'GET'
                              ? 'bg-green-100 text-green-800'
                              : endpoint.method === 'POST'
                              ? 'bg-blue-100 text-blue-800'
                              : endpoint.method === 'PUT'
                              ? 'bg-yellow-100 text-yellow-800'
                              : 'bg-red-100 text-red-800'
                          }`}
                        >
                          {endpoint.method}
                        </span>
                        <span className="ml-2 font-mono text-sm text-gray-900">
                          {endpoint.path}
                        </span>
                      </div>
                      <div className="flex items-center">
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            endpoint.auth
                              ? 'bg-purple-100 text-purple-800'
                              : 'bg-gray-100 text-gray-800'
                          }`}
                        >
                          {endpoint.auth ? 'Auth Required' : 'Public'}
                        </span>
                      </div>
                    </div>
                    <div className="mt-2">
                      <p className="text-sm text-gray-500">{endpoint.description}</p>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Getting Started Section */}
        <div className="mt-16 bg-orange-50 rounded-lg p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Getting Started</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Authentication</h3>
              <p className="text-gray-600 mb-4">
                All protected endpoints require Clerk authentication. Include the
                Authorization header with your requests.
              </p>
              <div className="bg-gray-900 rounded-lg p-4">
                <code className="text-sm text-green-400">
                  {`Authorization: Bearer <clerk-session-token>`}
                </code>
              </div>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Base URL</h3>
              <p className="text-gray-600 mb-4">
                Use the following base URL for all API requests:
              </p>
              <div className="bg-gray-900 rounded-lg p-4">
                <code className="text-sm text-green-400">
                  {process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/api
                </code>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}