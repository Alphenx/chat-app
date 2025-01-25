import { http, HttpResponse } from 'msw';
import { setupServer } from 'msw/node';

export const handlers = [
  // Handler for generic successful response management (200)
  http.all('200', () => {
    return HttpResponse.json(
      { message: 'Request processed successfully' },
      { status: 200 }
    );
  }),

  // Handler to handle internal server errors (500)
  http.all('500', () => {
    return HttpResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }),

  // Handler to handle all routes not found (404)
  http.all('*', () => {
    return HttpResponse.json({ message: 'Not found' }, { status: 404 });
  }),
];

export const server = setupServer(...handlers);
