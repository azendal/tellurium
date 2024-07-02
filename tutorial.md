Sure! Here is a tutorial to help you understand how to use the `Tellurium` testing framework with examples of how to define suites, tests, and utilize setup and teardown methods. This tutorial will also cover how to use spies and stubs to mock and track function calls.

### Step 1: Setting Up Your Environment

First, make sure you have the necessary libraries. If you are using Node.js, you can include the `neon` and `lithium` modules as follows:

```javascript
if (typeof require !== 'undefined') {
    require('neon');
    require('lithium');
}
```

### Step 2: Defining a Suite

A suite is a collection of tests. Define a suite using the `Tellurium.suite` method:

```javascript
Tellurium.suite('Math Operations Suite')(function (suite) {
    suite.setup(function () {
        console.log('Setting up suite...');
        // Setup code here
    });

    suite.tearDown(function () {
        console.log('Tearing down suite...');
        // Teardown code here
    });

    suite.describe('Addition Tests')(function (describe) {
        describe.beforeEach(function () {
            console.log('Running beforeEach for Addition Tests...');
            // Code to run before each test
        });

        describe.afterEach(function () {
            console.log('Running afterEach for Addition Tests...');
            // Code to run after each test
        });

        describe.specify('should add two numbers correctly')(function (spec) {
            const result = 1 + 1;
            spec.assert(result).toBe(2);
        });

        describe.specify('should add negative numbers correctly')(function (spec) {
            const result = -1 + -1;
            spec.assert(result).toBe(-2);
        });
    });

    suite.describe('Subtraction Tests')(function (describe) {
        describe.specify('should subtract two numbers correctly')(function (spec) {
            const result = 5 - 3;
            spec.assert(result).toBe(2);
        });
    });
});
```

### Step 3: Running the Suite

Run the suite using the `Tellurium.run` method. You can specify which tests to run by passing their descriptions or run all tests if no descriptions are provided.

```javascript
Tellurium.run(); // Run all tests

// To run specific tests
// Tellurium.run(['should add two numbers correctly', 'should subtract two numbers correctly']);
```

### Step 4: Using Spies

Spies can be used to track calls to functions. Here's how you can use spies in your tests:

```javascript
Tellurium.suite('Spy Example Suite')(function (suite) {
    let mathOperations;

    suite.setup(function () {
        mathOperations = {
            add: function (a, b) {
                return a + b;
            }
        };
    });

    suite.describe('Spies on add method')(function (describe) {
        describe.beforeEach(function () {
            describe.spy(mathOperations, 'add');
        });

        describe.specify('should call add method with correct arguments')(function (spec) {
            mathOperations.add(2, 3);
            spec.assert(mathOperations.add).toBeCalledWith([2, 3]);
        });

        describe.specify('should return correct result')(function (spec) {
            const result = mathOperations.add(2, 3);
            spec.assert(result).toBe(5);
            spec.assert(mathOperations.add).toReturn(5);
        });

        describe.afterEach(function () {
            describe.cleanSpies();
        });
    });
});
```

### Step 5: Using Stubs

Stubs can be used to replace existing methods with your own implementation. Here’s how you can use stubs:

```javascript
Tellurium.suite('Stub Example Suite')(function (suite) {
    let mathOperations;

    suite.setup(function () {
        mathOperations = {
            add: function (a, b) {
                return a + b;
            }
        };
    });

    suite.describe('Stubs on add method')(function (describe) {
        describe.beforeEach(function () {
            describe.stub(mathOperations, 'add').using(function (a, b) {
                return a * b; // Override add method
            });
        });

        describe.specify('should replace add method with stub implementation')(function (spec) {
            const result = mathOperations.add(2, 3);
            spec.assert(result).toBe(6);
        });

        describe.afterEach(function () {
            describe.cleanStubs();
        });
    });
});
```

### Step 6: Running Your Tests

To run your tests, simply call the `run` method of your `Tellurium` module.

```javascript
Tellurium.run();
```

### Full Example

Here is a full example combining all the above steps:

```javascript
if (typeof require !== 'undefined') {
    require('neon');
    require('lithium');
}

Tellurium.suite('Math Operations Suite')(function (suite) {
    let mathOperations;

    suite.setup(function () {
        console.log('Setting up suite...');
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

    suite.describe('Addition Tests')(function (describe) {
        describe.beforeEach(function () {
            console.log('Running beforeEach for Addition Tests...');
        });

        describe.afterEach(function () {
            console.log('Running afterEach for Addition Tests...');
        });

        describe.specify('should add two numbers correctly')(function (spec) {
            const result = mathOperations.add(1, 1);
            spec.assert(result).toBe(2);
        });

        describe.specify('should add negative numbers correctly')(function (spec) {
            const result = mathOperations.add(-1, -1);
            spec.assert(result).toBe(-2);
        });
    });

    suite.describe('Subtraction Tests')(function (describe) {
        describe.specify('should subtract two numbers correctly')(function (spec) {
            const result = mathOperations.subtract(5, 3);
            spec.assert(result).toBe(2);
        });
    });

    suite.describe('Spy Example Suite')(function (describe) {
        describe.beforeEach(function () {
            describe.spy(mathOperations, 'add');
        });

        describe.specify('should call add method with correct arguments')(function (spec) {
            mathOperations.add(2, 3);
            spec.assert(mathOperations.add).toBeCalledWith([2, 3]);
        });

        describe.specify('should return correct result')(function (spec) {
            const result = mathOperations.add(2, 3);
            spec.assert(result).toBe(5);
            spec.assert(mathOperations.add).toReturn(5);
        });

        describe.afterEach(function () {
            describe.cleanSpies();
        });
    });

    suite.describe('Stub Example Suite')(function (describe) {
        describe.beforeEach(function () {
            describe.stub(mathOperations, 'add').using(function (a, b) {
                return a * b;
            });
        });

        describe.specify('should replace add method with stub implementation')(function (spec) {
            const result = mathOperations.add(2, 3);
            spec.assert(result).toBe(6);
        });

        describe.afterEach(function () {
            describe.cleanStubs();
        });
    });
});

Tellurium.run();
```

This tutorial should give you a comprehensive guide to using the Tellurium testing framework with suites, spies, stubs, and asynchronous setup/teardown.
