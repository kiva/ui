# Testing guidelines

## General approach

Components should be tested in a user-centric way. We use Testing Library to mimic user behavior in our tests. Please read the following documents to understand the motivations of Testing Library and how best to use it.

- https://testing-library.com/docs/
- https://testing-library.com/docs/guiding-principles/
- https://testing-library.com/docs/queries/about#priority

As much as possible business logic and data fetching should be separated from vue components, allowing business logic and presentation to be tested independently. Most tests should use Jest (fast). If the data mocking is very complex or if the behavior being tested spans multiple pages, then it makes more sense to use Cypress (slow).

## Jest (unit testing)

Jest is excellent for unit testing, and can be used for testing everything from basic functions to full vue components.

> **NOTE:** When testing vue components, use the user-event library to simulate user events like clicks and keyboard presses instead of the fireEvent utility. Read "Simulating user events" for more info.

- [Jest docs](https://jestjs.io/docs/using-matchers)
- [Vue testing library](https://testing-library.com/docs/vue-testing-library/intro)
- [Simulating user events](https://testing-library.com/docs/user-event/intro/)
- [Mocking graphql queries/mutations](https://github.com/mike-gibson/mock-apollo-client/tree/release/0.x)

### Running Jest

All tests
```
npm run unit
```

Only run one
```
npm run unit -- RouteListing
```

## Cypress (e2e & integration testing)

Cypress runs in a full browser, simulating a user interacting with the page.

> **NOTE:** Cypress tests are slower than Jest tests because they have to wait for pages to load in a real environment, so use Cypress tests sparingly.

> **NOTE:** Cypress has built-in commands for finding elements on the page, but tests will be more robust if the Testing Library findBy* commands are used instead. Please read the Cypress testing library docs before writing tests.

- [Cypress docs](https://docs.cypress.io/guides/core-concepts/introduction-to-cypress)
- [Cypress testing library](https://testing-library.com/docs/cypress-testing-library/intro/)
- [Automatic test generation](https://docs.cypress.io/guides/core-concepts/cypress-studio)

### Running Cypress locally

Testing against dev-vm
```
npm run e2e:dev
```

Testing against local ui-server (after local ui-server is running and ready for requests)
```
npx cypress open --config baseUrl=http://localhost:8888
```

Testing against stage
```
npx cypress open --config baseUrl=https://www.stage.kiva.org
```

## Examples

### Checking DOM element values

```js
```

### Using DOM element values

```js
```

### Simulating clicks in Jest

```js
```

### Mocking GraphQL requests in Jest

```js
```

### Testing props/events/v-model in Jest

```js
import { render } from '@testing-library/vue';
import userEvent from '@testing-library/user-event';

describe('KvTextInput', () => {
	it('works with v-model', () => {
		const TestComponent = {
			template:
				`<div>
					<label for="text-input">Text input</label>
					<KvTextInput v-model="textValue" id="text-input" />
					<button @click="textValue = 'abc'">reset</button>
					<span>The text value is {{ textValue }}</span>
				</div>`,
			components: { KvTextInput },
			data: () => ({ textValue: 'abc' }),
		};
		const { getByRole, getByText } = render(TestComponent);
		const textInputEl = getByRole('textbox');

		// Check that the value is 'abc' initially
		expect(getByText('The text value is abc')).toBeDefined();
		expect(textInputEl.value).toEqual('abc');

		// Type 'def' in the text input and expect the value to be 'abcdef' now
		userEvent.type(textInputEl, 'def');
		expect(getByText('The text value is abcdef')).toBeDefined();
		expect(textInputEl.value).toEqual('abcdef');

		// Click the reset button and expect the value to be 'abc' again
		userEvent.click(getByText('reset'));
		expect(getByText('The text value is abc')).toBeDefined();
		expect(textInputEl.value).toEqual('abc');
	});
});
```

### Waiting for api requests in Cypress

```js
```

### Logging in as a user in Cypress

```js
```
