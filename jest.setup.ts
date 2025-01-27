import '@testing-library/jest-dom'; // Extensiones para Jest como toBeInTheDocument
import { server } from './src/tests/server';

// Start MSW before testing
beforeAll(() => server.listen());
// Close the MSW server at the end of the tests
afterAll(() => server.close());
