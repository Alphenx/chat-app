import { HTTPStatus, HTTPStatusText } from '@/models/http';

describe('Testing configuration set up / MSW should be initialized with default handlers', () => {
  it('a. Should handle all routes not found (404)', async () => {
    const response = await fetch('/404');
    const data = await response.json();

    expect(data).toEqual({ message: HTTPStatusText.NOT_FOUND });
    expect(response.status).toBe(HTTPStatus.NOT_FOUND);
  });

  it('b. Should handle internal server errors (500)', async () => {
    const response = await fetch('/500');
    const data = await response.json();

    expect(data).toEqual({ message: HTTPStatusText.INTERNAL_SERVER_ERROR });
    expect(response.status).toBe(HTTPStatus.INTERNAL_SERVER_ERROR);
  });

  it('c. Should handle generic successful response management (200)', async () => {
    const response = await fetch('/200');
    const data = await response.json();

    expect(data).toEqual({ message: HTTPStatusText.OK });
    expect(response.status).toBe(HTTPStatus.OK);
  });
});
