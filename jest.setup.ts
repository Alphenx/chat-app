import '@testing-library/jest-dom';
import { server } from './src/tests/server';

// Start MSW before testing
beforeAll(() => server.listen());
// Close the MSW server at the end of the tests
afterAll(() => server.close());
