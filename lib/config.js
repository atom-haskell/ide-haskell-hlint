"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.config = void 0;
exports.config = {
    hlintPath: {
        type: 'string',
        default: 'hlint',
        description: 'Full path to `hlint` binary, e.g. `C:\\Users\\myuser\\bin\\hlint.exe`, or' +
            '`/usr/local/bin/hlint`. You only need to change this if the directory where' +
            'your `hlint` binary is located is not on your system PATH.',
        order: 99,
    },
    checkAllFilesInProject: {
        type: 'boolean',
        default: false,
        description: 'Try to check all *.hs files in current Atom project. ' +
            'Use with care, this may cause intermittent freezes on large code bases. ' +
            'When disabled, only runs hlint on the last saved file.',
        order: 0,
    },
    checkOnChange: {
        type: 'boolean',
        default: false,
        description: 'Re-check current file on each change. ' +
            'Can be extremely distracting.',
        order: 10,
    },
    ignoreGlobs: {
        type: 'array',
        items: {
            type: 'string',
            minimum: 1.5,
            maximum: 11.5,
        },
        default: [
            '.cabal-sandbox/**',
            'dist/**',
            'dist-newstyle/**',
            '.stack-work/**',
        ],
        description: 'File globs to ignore; comma-separated',
        order: 20,
    },
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29uZmlnLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vc3JjL2NvbmZpZy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7QUFBYSxRQUFBLE1BQU0sR0FBRztJQUNwQixTQUFTLEVBQUU7UUFDVCxJQUFJLEVBQUUsUUFBUTtRQUNkLE9BQU8sRUFBRSxPQUFPO1FBQ2hCLFdBQVcsRUFDVCwyRUFBMkU7WUFDM0UsNkVBQTZFO1lBQzdFLDREQUE0RDtRQUM5RCxLQUFLLEVBQUUsRUFBRTtLQUNWO0lBQ0Qsc0JBQXNCLEVBQUU7UUFDdEIsSUFBSSxFQUFFLFNBQVM7UUFDZixPQUFPLEVBQUUsS0FBSztRQUNkLFdBQVcsRUFDVCx1REFBdUQ7WUFDdkQsMEVBQTBFO1lBQzFFLHdEQUF3RDtRQUMxRCxLQUFLLEVBQUUsQ0FBQztLQUNUO0lBQ0QsYUFBYSxFQUFFO1FBQ2IsSUFBSSxFQUFFLFNBQVM7UUFDZixPQUFPLEVBQUUsS0FBSztRQUNkLFdBQVcsRUFDVCx3Q0FBd0M7WUFDeEMsK0JBQStCO1FBQ2pDLEtBQUssRUFBRSxFQUFFO0tBQ1Y7SUFDRCxXQUFXLEVBQUU7UUFDWCxJQUFJLEVBQUUsT0FBTztRQUNiLEtBQUssRUFBRTtZQUNMLElBQUksRUFBRSxRQUFRO1lBQ2QsT0FBTyxFQUFFLEdBQUc7WUFDWixPQUFPLEVBQUUsSUFBSTtTQUNkO1FBQ0QsT0FBTyxFQUFFO1lBQ1AsbUJBQW1CO1lBQ25CLFNBQVM7WUFDVCxrQkFBa0I7WUFDbEIsZ0JBQWdCO1NBQ2pCO1FBQ0QsV0FBVyxFQUFFLHVDQUF1QztRQUNwRCxLQUFLLEVBQUUsRUFBRTtLQUNWO0NBQ0YsQ0FBQSIsInNvdXJjZXNDb250ZW50IjpbImV4cG9ydCBjb25zdCBjb25maWcgPSB7XG4gIGhsaW50UGF0aDoge1xuICAgIHR5cGU6ICdzdHJpbmcnLFxuICAgIGRlZmF1bHQ6ICdobGludCcsXG4gICAgZGVzY3JpcHRpb246XG4gICAgICAnRnVsbCBwYXRoIHRvIGBobGludGAgYmluYXJ5LCBlLmcuIGBDOlxcXFxVc2Vyc1xcXFxteXVzZXJcXFxcYmluXFxcXGhsaW50LmV4ZWAsIG9yJyArXG4gICAgICAnYC91c3IvbG9jYWwvYmluL2hsaW50YC4gWW91IG9ubHkgbmVlZCB0byBjaGFuZ2UgdGhpcyBpZiB0aGUgZGlyZWN0b3J5IHdoZXJlJyArXG4gICAgICAneW91ciBgaGxpbnRgIGJpbmFyeSBpcyBsb2NhdGVkIGlzIG5vdCBvbiB5b3VyIHN5c3RlbSBQQVRILicsXG4gICAgb3JkZXI6IDk5LFxuICB9LFxuICBjaGVja0FsbEZpbGVzSW5Qcm9qZWN0OiB7XG4gICAgdHlwZTogJ2Jvb2xlYW4nLFxuICAgIGRlZmF1bHQ6IGZhbHNlLFxuICAgIGRlc2NyaXB0aW9uOlxuICAgICAgJ1RyeSB0byBjaGVjayBhbGwgKi5ocyBmaWxlcyBpbiBjdXJyZW50IEF0b20gcHJvamVjdC4gJyArXG4gICAgICAnVXNlIHdpdGggY2FyZSwgdGhpcyBtYXkgY2F1c2UgaW50ZXJtaXR0ZW50IGZyZWV6ZXMgb24gbGFyZ2UgY29kZSBiYXNlcy4gJyArXG4gICAgICAnV2hlbiBkaXNhYmxlZCwgb25seSBydW5zIGhsaW50IG9uIHRoZSBsYXN0IHNhdmVkIGZpbGUuJyxcbiAgICBvcmRlcjogMCxcbiAgfSxcbiAgY2hlY2tPbkNoYW5nZToge1xuICAgIHR5cGU6ICdib29sZWFuJyxcbiAgICBkZWZhdWx0OiBmYWxzZSxcbiAgICBkZXNjcmlwdGlvbjpcbiAgICAgICdSZS1jaGVjayBjdXJyZW50IGZpbGUgb24gZWFjaCBjaGFuZ2UuICcgK1xuICAgICAgJ0NhbiBiZSBleHRyZW1lbHkgZGlzdHJhY3RpbmcuJyxcbiAgICBvcmRlcjogMTAsXG4gIH0sXG4gIGlnbm9yZUdsb2JzOiB7XG4gICAgdHlwZTogJ2FycmF5JyxcbiAgICBpdGVtczoge1xuICAgICAgdHlwZTogJ3N0cmluZycsXG4gICAgICBtaW5pbXVtOiAxLjUsXG4gICAgICBtYXhpbXVtOiAxMS41LFxuICAgIH0sXG4gICAgZGVmYXVsdDogW1xuICAgICAgJy5jYWJhbC1zYW5kYm94LyoqJyxcbiAgICAgICdkaXN0LyoqJyxcbiAgICAgICdkaXN0LW5ld3N0eWxlLyoqJyxcbiAgICAgICcuc3RhY2std29yay8qKicsXG4gICAgXSxcbiAgICBkZXNjcmlwdGlvbjogJ0ZpbGUgZ2xvYnMgdG8gaWdub3JlOyBjb21tYS1zZXBhcmF0ZWQnLFxuICAgIG9yZGVyOiAyMCxcbiAgfSxcbn1cblxuLy8gZ2VuZXJhdGVkIGJ5IHR5cGVkLWNvbmZpZy5qc1xuZGVjbGFyZSBtb2R1bGUgJ2F0b20nIHtcbiAgaW50ZXJmYWNlIENvbmZpZ1ZhbHVlcyB7XG4gICAgJ2lkZS1oYXNrZWxsLWhsaW50LmhsaW50UGF0aCc6IHN0cmluZ1xuICAgICdpZGUtaGFza2VsbC1obGludC5jaGVja0FsbEZpbGVzSW5Qcm9qZWN0JzogYm9vbGVhblxuICAgICdpZGUtaGFza2VsbC1obGludC5jaGVja09uQ2hhbmdlJzogYm9vbGVhblxuICAgICdpZGUtaGFza2VsbC1obGludC5pZ25vcmVHbG9icyc6IHN0cmluZ1tdXG4gICAgJ2lkZS1oYXNrZWxsLWhsaW50Jzoge1xuICAgICAgaGxpbnRQYXRoOiBzdHJpbmdcbiAgICAgIGNoZWNrQWxsRmlsZXNJblByb2plY3Q6IGJvb2xlYW5cbiAgICAgIGNoZWNrT25DaGFuZ2U6IGJvb2xlYW5cbiAgICAgIGlnbm9yZUdsb2JzOiBzdHJpbmdbXVxuICAgIH1cbiAgfVxufVxuIl19