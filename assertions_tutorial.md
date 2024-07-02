### Using Assertions in Tellurium

Assertions are a crucial part of any testing framework. They are used to verify that the code behaves as expected. The Tellurium framework provides various assertion methods that you can use in your tests. This tutorial will focus on how to use these assertions effectively and how to label them for better clarity in test results.

#### Step 1: Basic Assertion Example

In Tellurium, assertions are made using the `assert` method within a specification. Here’s a simple example:

```javascript
Tellurium.suite('Assertion Example Suite')(function (suite) {
    suite.describe('Basic Assertions')(function (describe) {
        describe.specify('should check if value is equal to expected')(function (spec) {
            const value = 5;
            spec.assert(value).toBe(5);
        });
    });
});
```

#### Step 2: Using Assertion Methods

Tellurium provides a variety of assertion methods:

- `toBe(expected)`: Checks if the value is strictly equal to the expected value.
- `toEqual(expected)`: Checks if the value is equal to the expected value (using `==`).
- `toMatch(expected)`: Checks if the value matches the expected regular expression.
- `toBeDefined()`: Checks if the value is not `undefined`.
- `toBeNull()`: Checks if the value is `null`.
- `toBeTruthy()`: Checks if the value is truthy.
- `toBeCalled()`: Checks if the spied function has been called.
- `toBeCalledWith(expected)`: Checks if the spied function has been called with the expected arguments.
- `toReturn(expected)`: Checks if the spied function returns the expected value.
- `toBeGreaterThan(expected)`: Checks if the value is greater than the expected value.
- `toBeLessThan(expected)`: Checks if the value is less than the expected value.
- `toBeInstanceOf(expected)`: Checks if the value is an instance of the expected constructor.
- `toThrowError(expected)`: Checks if the function throws an error.
- `toNotThrowError()`: Checks if the function does not throw an error.

Here’s an example that demonstrates some of these methods:

```javascript
Tellurium.suite('Advanced Assertions Suite')(function (suite) {
    suite.describe('Advanced Assertions')(function (describe) {
        describe.specify('should check various assertions')(function (spec) {
            const value = 5;
            spec.assert(value).toBe(5);
            spec.assert(value).toEqual('5'); // Using == comparison
            spec.assert('Hello World').toMatch(/World/);
            spec.assert(value).toBeDefined();
            spec.assert(null).toBeNull();
            spec.assert(true).toBeTruthy();
            spec.assert(() => { throw new Error('Test Error'); }).toThrowError('Test Error');
        });
    });
});
```

#### Step 3: Using Labels for Assertions

Labels can be used to provide more context to your assertions, making it easier to understand what each assertion is checking when reading test results. You can add a label to an assertion using the `withLabel` method.

Here’s an example of how to use labels:

```javascript
Tellurium.suite('Assertion Labels Suite')(function (suite) {
    suite.describe('Labeled Assertions')(function (describe) {
        describe.specify('should use labels for better clarity')(function (spec) {
            const value = 10;
            spec.assert(value).withLabel('Check if value is 10').toBe(10);
            spec.assert(value).withLabel('Check if value is greater than 5').toBeGreaterThan(5);
            spec.assert(value).withLabel('Check if value is less than 15').toBeLessThan(15);
        });
    });
});
```

#### Step 4: Combining Assertions with Spies and Stubs

You can also combine assertions with spies and stubs to test interactions between different parts of your code. Here’s an example:

```javascript
Tellurium.suite('Spies and Stubs Suite')(function (suite) {
    let mathOperations;

    suite.setup(function () {
        mathOperations = {
            add: function (a, b) {
                return a + b;
            },
            subtract: function (a, b) {
                return a - b;
            }
        };
    });

    suite.describe('Spy Assertions')(function (describe) {
        describe.beforeEach(function () {
            describe.spy(mathOperations, 'add');
        });

        describe.specify('should call add method and return correct value')(function (spec) {
            const result = mathOperations.add(3, 7);
            spec.assert(mathOperations.add).withLabel('Check if add method was called with [3, 7]').toBeCalledWith([3, 7]);
            spec.assert(result).withLabel('Check if add method returns 10').toBe(10);
        });

        describe.afterEach(function () {
            describe.cleanSpies();
        });
    });

    suite.describe('Stub Assertions')(function (describe) {
        describe.beforeEach(function () {
            describe.stub(mathOperations, 'subtract').using(function (a, b) {
                return a * b;
            });
        });

        describe.specify('should replace subtract method with stub implementation')(function (spec) {
            const result = mathOperations.subtract(3, 4);
            spec.assert(result).withLabel('Check if subtract method returns 12').toBe(12);
        });

        describe.afterEach(function () {
            describe.cleanStubs();
        });
    });
});
```

### Running Your Tests

To run your tests and see the results with labeled assertions, call the `run` method of the `Tellurium` module:

```javascript
Tellurium.run();
```

### Full Example with Assertions

Here is a full example that incorporates labeled assertions, spies, and stubs:

```javascript
if (typeof require !== 'undefined') {
    require('neon');
    require('lithium');
}

Tellurium.suite('Comprehensive Assertion Suite')(function (suite) {
    let mathOperations;

    suite.setup(function () {
        mathOperations = {
            add: function (a, b) {
                return a + b;
            },
            subtract: function (a, b) {
                return a - b;
            }
        };
    });

    suite.tearDown(function () {
        console.log('Tearing down suite...');
    });

    suite.describe('Basic Assertions')(function (describe) {
        describe.specify('should check if value is equal to expected')(function (spec) {
            const value = 5;
            spec.assert(value).withLabel('Check if value is 5').toBe(5);
        });
    });

    suite.describe('Advanced Assertions')(function (describe) {
        describe.specify('should check various assertions')(function (spec) {
            const value = 5;
            spec.assert(value).withLabel('Check if value is 5').toBe(5);
            spec.assert(value).withLabel('Check if value equals "5" using ==').toEqual('5'); // Using == comparison
            spec.assert('Hello World').withLabel('Check if "Hello World" matches /World/').toMatch(/World/);
            spec.assert(value).withLabel('Check if value is defined').toBeDefined();
            spec.assert(null).withLabel('Check if value is null').toBeNull();
            spec.assert(true).withLabel('Check if value is truthy').toBeTruthy();
            spec.assert(() => { throw new Error('Test Error'); }).withLabel('Check if function throws "Test Error"').toThrowError('Test Error');
        });
    });

    suite.describe('Spy and Stub Assertions')(function (describe) {
        describe.beforeEach(function () {
            describe.spy(mathOperations, 'add');
            describe.stub(mathOperations, 'subtract').using(function (a, b) {
                return a * b;
            });
        });

        describe.specify('should call add method and return correct value')(function (spec) {
            const result = mathOperations.add(3, 7);
            spec.assert(mathOperations.add).withLabel('Check if add method was called with [3, 7]').toBeCalledWith([3, 7]);
            spec.assert(result).withLabel('Check if add method returns 10').toBe(10);
        });

        describe.specify('should replace subtract method with stub implementation')(function (spec) {
            const result = mathOperations.subtract(3, 4);
            spec.assert(result).withLabel('Check if subtract method returns 12').toBe(12);
        });

        describe.afterEach(function () {
            describe.cleanSpies();
            describe.cleanStubs();
        });
    });
});

Tellurium.run();
```

This tutorial provides a detailed guide on how to use assertions in the Tellurium framework, including labeling assertions for better clarity, and combining assertions with spies and stubs.
