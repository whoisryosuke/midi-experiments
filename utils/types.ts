// Small sized notes when you only need the key name (C2, D2, etc) and the time it was struck
export type QuickNote = {
    // Key or note on the instrument
    name: string;
    // Time in seconds
    time: number;
}