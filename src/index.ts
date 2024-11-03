'use strict';

// Precomputed constants for default bit sizes
const DEFAULT_WORKER_ID_BITS = 5n;
const DEFAULT_DATACENTER_ID_BITS = 5n;
const DEFAULT_SEQUENCE_BITS = 12n;

// Maximum values based on the bit sizes
const MAX_WORKER_ID = -1n ^ (-1n << DEFAULT_WORKER_ID_BITS);
const MAX_DATACENTER_ID = -1n ^ (-1n << DEFAULT_DATACENTER_ID_BITS);
const SEQUENCE_MASK = -1n ^ (-1n << DEFAULT_SEQUENCE_BITS);

// Default values for shifting each part of the ID
const DEFAULT_WORKER_ID_SHIFT = DEFAULT_SEQUENCE_BITS;
const DEFAULT_DATACENTER_ID_SHIFT = DEFAULT_SEQUENCE_BITS + DEFAULT_WORKER_ID_BITS;
const DEFAULT_TIMESTAMP_LEFT_SHIFT = DEFAULT_SEQUENCE_BITS + DEFAULT_WORKER_ID_BITS + DEFAULT_DATACENTER_ID_BITS;

// WorkerOptions interface to allow customization
interface WorkerOptions {
    epoch?: bigint | number;               // Start time (epoch) in milliseconds
    workerId?: bigint | number;            // Worker ID
    datacenterId?: bigint | number;        // Datacenter ID
}

// The SnowUUID class that generates unique IDs
export class SnowUUID {
    // Private properties for Snowflake components
    #epoch: bigint;
    #workerId: bigint;
    #datacenterId: bigint;
    #sequence: bigint = 0n;
    #lastTimestamp: bigint = -1n;

    constructor(
        options: WorkerOptions = {
            epoch: 1609459200000n,       // Default to January 1, 2021
            workerId: 0n,
            datacenterId: 0n
        }
    ) {
        // Initialize epoch, workerId, and datacenterId from options, using defaults if not provided
        this.#epoch = BigInt(options.epoch ?? 1609459200000n);
        this.#workerId = BigInt(options.workerId ?? 0n);
        this.#datacenterId = BigInt(options.datacenterId ?? 0n);

        // Validate workerId and datacenterId within their maximum allowed values
        if (this.#workerId < 0 || this.#workerId > MAX_WORKER_ID) {
            throw new Error(`Worker ID must be between 0 and ${MAX_WORKER_ID}`);
        }
        if (this.#datacenterId < 0 || this.#datacenterId > MAX_DATACENTER_ID) {
            throw new Error(`Datacenter ID must be between 0 and ${MAX_DATACENTER_ID}`);
        }
    }

    /**
     * Generates the next unique ID.
     */
    nextId(): bigint {
        let timestamp = SnowUUID.now();

        // Handle case where system clock goes backwards
        if (timestamp < this.#lastTimestamp) {
            throw new Error(
                `Clock moved backwards. Unable to generate ID for ${this.#lastTimestamp - timestamp} milliseconds.`
            );
        }

        // If within the same millisecond, increment the sequence
        if (timestamp === this.#lastTimestamp) {
            this.#sequence = (this.#sequence + 1n) & SEQUENCE_MASK;
            if (this.#sequence === 0n) {
                // Wait until the next millisecond if sequence overflows
                timestamp = this.tilNextMillis(this.#lastTimestamp);
            }
        } else {
            this.#sequence = 0n;
        }

        this.#lastTimestamp = timestamp;

        // Construct the Snowflake ID by combining timestamp, datacenter ID, worker ID, and sequence
        return (
            ((timestamp - this.#epoch) << DEFAULT_TIMESTAMP_LEFT_SHIFT) |
            (this.#datacenterId << DEFAULT_DATACENTER_ID_SHIFT) |
            (this.#workerId << DEFAULT_WORKER_ID_SHIFT) |
            this.#sequence
        );
    }

    /**
     * Waits until the next millisecond to avoid sequence overflow.
     * @param lastTimestamp The last recorded timestamp
     */
    private tilNextMillis(lastTimestamp: bigint): bigint {
        let timestamp;
        do {
            timestamp = SnowUUID.now();
        } while (timestamp <= lastTimestamp);
        return timestamp;
    }

    /**
     * Retrieves the current timestamp as a bigint.
     */
    private static now(): bigint {
        return BigInt(Date.now());
    }
}