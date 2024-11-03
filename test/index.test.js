const { SnowUUID } = require("../dist/index.js"); // Adjust path if necessary

describe("Snowflake UUID Generator (SnowUUID)", () => {
  let worker;

  beforeEach(() => {
    worker = new SnowUUID();
  });

  afterEach(() => {
    jest.restoreAllMocks(); // Restore all mocks after each test
  });

  test("generates a unique ID each time", () => {
    const id1 = worker.nextId();
    const id2 = worker.nextId();
    expect(id1).not.toBe(id2); // IDs should be unique
  });

  test("handles sequence correctly within the same millisecond", () => {
    jest.spyOn(SnowUUID, "now").mockReturnValue(1000n); // Mock same millisecond

    const id1 = worker.nextId();
    const id2 = worker.nextId();

    expect(id1).not.toBe(id2); // Unique IDs within the same millisecond
  });

  test("generates consistent IDs with custom configuration", () => {
    const customSnowUUID = new SnowUUID({
      epoch: 1672531200000n,
      SnowUUIDId: 1n,
      datacenterId: 1n,
    });

    const id = customSnowUUID.nextId();
    const timestamp = (id >> BigInt(22)) + 1672531200000n;
    expect(timestamp).toBeGreaterThan(1672531200000n);
  });

  test("throws error if clock moves backwards", () => {
    const mockNow = jest.spyOn(SnowUUID, "now");
    mockNow.mockReturnValue(1000n);
    worker.nextId();

    mockNow.mockReturnValue(999n);

    expect(() => worker.nextId()).toThrow("Clock moved backwards");
  });
});
