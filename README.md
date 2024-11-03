![Banner](./docs/banner.png)
# SnowUUID

**SnowUUID** is a distributed UUID generator that implements the Snowflake algorithm, designed to create unique identifiers that can be generated across multiple nodes without collision. Each generated ID contains timestamp, worker ID, datacenter ID, and a sequence number.

## Features

- **Unique ID Generation**: Ensures that IDs are unique across distributed systems.
- **Timestamp Included**: Each ID contains a timestamp, allowing for chronological sorting.
- **Configurable**: Custom configurations for epoch, worker ID, and datacenter ID.
- **Scalable**: Supports multiple workers and datacenters, making it suitable for large applications.

## Usage

To use **SnowUUID** in your TypeScript project, follow these steps:

### Installation

```bash
npm install snowuuid
```

### Example

Here's a simple example demonstrating how to use the `SnowUUID` class:

```typescript
import { SnowUUID } from 'snowuuid';

// Create a new SnowUUID instance with default settings
const uuidGenerator = new SnowUUID();

// Generate unique IDs
const id1 = uuidGenerator.nextId();
console.log(`Generated ID 1: ${id1}`);

const id2 = uuidGenerator.nextId();
console.log(`Generated ID 2: ${id2}`);
```

### Custom Configuration

You can create a `SnowUUID` instance with custom settings for epoch, worker ID, and datacenter ID:

```typescript
const customUUIDGenerator = new SnowUUID({
    epoch: 1672531200000n, // Custom epoch (January 1, 2023)
    workerId: 1n,         // Worker ID
    datacenterId: 1n      // Datacenter ID
});

const customId = customUUIDGenerator.nextId();
console.log(`Custom Generated ID: ${customId}`);
```

### Error Handling

The `SnowUUID` class throws errors in specific scenarios, such as:

- If the system clock moves backwards.
- If the worker ID or datacenter ID exceeds their maximum limits.

### Example Tests

You can also include tests using Jest to ensure that your implementation works correctly. Here is a sample test suite:

```typescript
import { SnowUUID } from '../src/index';

describe('SnowUUID Generator', () => {
    let uuidGenerator: SnowUUID;

    beforeEach(() => {
        uuidGenerator = new SnowUUID();
    });

    test('generates a unique ID each time', () => {
        const id1 = uuidGenerator.nextId();
        const id2 = uuidGenerator.nextId();
        expect(id1).not.toBe(id2);  // IDs should be unique
    });

    // Additional tests can be added here...
});
```

## Contributing

Contributions are welcome! Please feel free to submit a pull request or open an issue for any suggestions or improvements.

## License

This project is licensed under the [MIT License](LICENSE).

## Author

- **Ravi Kishan** - [ravikishan63392@gmail.com](mailto:ravikishan63392@gmail.com)
