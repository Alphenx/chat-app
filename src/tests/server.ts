import { HTTPStatus, HTTPStatusText } from '@/models/http';
import { http, HttpResponse } from 'msw';
import { setupServer } from 'msw/node';

export const handlers = [
  // Handler for generic successful response management (200)
  http.all('200', () => {
    return HttpResponse.json(
      { message: HTTPStatusText.OK },
      { status: HTTPStatus.OK }
    );
  }),

  // Handler to handle internal server errors (500)
  http.all('500', () => {
    return HttpResponse.json(
      { message: HTTPStatusText.INTERNAL_SERVER_ERROR },
      { status: HTTPStatus.INTERNAL_SERVER_ERROR }
    );
  }),

  // Handler to handle all routes not found (404)
  http.all('*', () => {
    return HttpResponse.json(
      { message: HTTPStatusText.NOT_FOUND },
      { status: HTTPStatus.NOT_FOUND }
    );
  }),
];

export const server = setupServer(...handlers);
