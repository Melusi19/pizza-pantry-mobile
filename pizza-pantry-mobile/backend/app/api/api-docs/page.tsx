export default function ApiDocsPage() {
  return (
    <div className="py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="prose prose-orange max-w-none">
          <h1>Pizza Pantry API Documentation</h1>
          
          <h2>Introduction</h2>
          <p>
            The Pizza Pantry API provides a complete backend solution for managing
            restaurant inventory. This documentation will help you integrate with
            our API effectively.
          </p>

          <h2>Authentication</h2>
          <p>
            Most endpoints require authentication using Clerk. Include the session
            token in the Authorization header:
          </p>
          <pre className="bg-gray-900 text-green-400 p-4 rounded-lg">
{`Authorization: Bearer <clerk-session-token>`}
          </pre>

          <h2>Error Handling</h2>
          <p>
            The API uses conventional HTTP response codes to indicate success or
            failure. Errors return a JSON response with an error message:
          </p>
          <pre className="bg-gray-900 text-green-400 p-4 rounded-lg">
{`{
  "success": false,
  "error": "Error message",
  "timestamp": "2023-12-07T10:30:00.000Z"
}`}
          </pre>

          <h2>Common Response Format</h2>
          <p>Successful responses follow this format:</p>
          <pre className="bg-gray-900 text-green-400 p-4 rounded-lg">
{`{
  "success": true,
  "data": { ... },
  "message": "Success message",
  "timestamp": "2023-12-07T10:30:00.000Z"
}`}
          </pre>

          <h2>Rate Limiting</h2>
          <p>
            The API implements rate limiting to ensure fair usage. Current limits:
          </p>
          <ul>
            <li>100 requests per minute for authenticated users</li>
            <li>10 requests per minute for unauthenticated requests</li>
          </ul>

          <h2>Inventory Item Schema</h2>
          <pre className="bg-gray-900 text-green-400 p-4 rounded-lg">
{`{
  "id": "string",
  "name": "string",
  "category": "string",
  "quantity": "number",
  "minStock": "number",
  "unit": "string",
  "price": "number",
  "supplier": "string",
  "lastUpdated": "ISO Date",
  "createdAt": "ISO Date"
}`}
          </pre>

          <h2>Support</h2>
          <p>
            For API support, please contact our development team or create an issue
            in our GitHub repository.
          </p>
        </div>
      </div>
    </div>
  );
}