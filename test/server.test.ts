describe('Testing configuration set up / MSW should be initialized with default handlers', () => {
  it('a. Should handle all routes not found (404)', async () => {
    const response = await fetch('/404');
    const data = await response.json();

    expect(data).toEqual({ message: 'Not found' });
    expect(response.status).toBe(404);
  });

  it('b. Should handle internal server errors (500)', async () => {
    const response = await fetch('/500');
    const data = await response.json();

    expect(data).toEqual({ message: 'Internal server error' });
    expect(response.status).toBe(500);
  });

  it('c. Should handle generic successful response management (200)', async () => {
    const response = await fetch('/200');
    const data = await response.json();

    expect(data).toEqual({ message: 'Request processed successfully' });
    expect(response.status).toBe(200);
  });
});
