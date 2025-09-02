# Login Page Tests

This project includes comprehensive tests for the LoginPage component using Vitest and React Testing Library.

## Test Coverage

The test suite covers the following scenarios:

1. **Component Rendering**: Verifies that all required form elements are rendered correctly
2. **Form Validation**: Tests validation for empty fields, invalid email format, and short passwords
3. **User Interactions**: Tests form input changes and error clearing when user types
4. **Form Submission**: Tests successful form submission with valid credentials
5. **Loading States**: Verifies button is disabled during form submission
6. **Error Styling**: Checks that error CSS classes are applied to invalid fields

## Running Tests

To run the tests, use the following commands:

```bash
# Run tests once
npm test -- --run

# Run tests in watch mode (continuous)
npm test

# Run tests with UI (if vitest UI is installed)
npm run test:ui
```

## Test Files

- `src/components/LoginPage.test.jsx` - Main test file for the LoginPage component
- `src/test/setup.js` - Test setup configuration
- `vite.config.js` - Vitest configuration

## Dependencies

The following testing dependencies are included:

- `vitest` - Test runner
- `@testing-library/react` - React testing utilities
- `@testing-library/jest-dom` - Custom Jest matchers
- `@testing-library/user-event` - User interaction simulation
- `jsdom` - DOM environment for testing

## Test Structure

Each test follows the Arrange-Act-Assert pattern:
1. **Arrange**: Set up the component and test data
2. **Act**: Perform user interactions or trigger events
3. **Assert**: Verify the expected outcomes

The tests use realistic user interactions like typing and clicking to ensure the component behaves correctly in real-world scenarios.