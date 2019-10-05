"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
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
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29uZmlnLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vc3JjL2NvbmZpZy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFhLFFBQUEsTUFBTSxHQUFHO0lBQ3BCLFNBQVMsRUFBRTtRQUNULElBQUksRUFBRSxRQUFRO1FBQ2QsT0FBTyxFQUFFLE9BQU87UUFDaEIsV0FBVyxFQUNULDJFQUEyRTtZQUMzRSw2RUFBNkU7WUFDN0UsNERBQTREO1FBQzlELEtBQUssRUFBRSxFQUFFO0tBQ1Y7SUFDRCxzQkFBc0IsRUFBRTtRQUN0QixJQUFJLEVBQUUsU0FBUztRQUNmLE9BQU8sRUFBRSxLQUFLO1FBQ2QsV0FBVyxFQUNULHVEQUF1RDtZQUN2RCwwRUFBMEU7WUFDMUUsd0RBQXdEO1FBQzFELEtBQUssRUFBRSxDQUFDO0tBQ1Q7SUFDRCxhQUFhLEVBQUU7UUFDYixJQUFJLEVBQUUsU0FBUztRQUNmLE9BQU8sRUFBRSxLQUFLO1FBQ2QsV0FBVyxFQUNULHdDQUF3QztZQUN4QywrQkFBK0I7UUFDakMsS0FBSyxFQUFFLEVBQUU7S0FDVjtDQUNGLENBQUEiLCJzb3VyY2VzQ29udGVudCI6WyJleHBvcnQgY29uc3QgY29uZmlnID0ge1xuICBobGludFBhdGg6IHtcbiAgICB0eXBlOiAnc3RyaW5nJyxcbiAgICBkZWZhdWx0OiAnaGxpbnQnLFxuICAgIGRlc2NyaXB0aW9uOlxuICAgICAgJ0Z1bGwgcGF0aCB0byBgaGxpbnRgIGJpbmFyeSwgZS5nLiBgQzpcXFxcVXNlcnNcXFxcbXl1c2VyXFxcXGJpblxcXFxobGludC5leGVgLCBvcicgK1xuICAgICAgJ2AvdXNyL2xvY2FsL2Jpbi9obGludGAuIFlvdSBvbmx5IG5lZWQgdG8gY2hhbmdlIHRoaXMgaWYgdGhlIGRpcmVjdG9yeSB3aGVyZScgK1xuICAgICAgJ3lvdXIgYGhsaW50YCBiaW5hcnkgaXMgbG9jYXRlZCBpcyBub3Qgb24geW91ciBzeXN0ZW0gUEFUSC4nLFxuICAgIG9yZGVyOiA5OSxcbiAgfSxcbiAgY2hlY2tBbGxGaWxlc0luUHJvamVjdDoge1xuICAgIHR5cGU6ICdib29sZWFuJyxcbiAgICBkZWZhdWx0OiBmYWxzZSxcbiAgICBkZXNjcmlwdGlvbjpcbiAgICAgICdUcnkgdG8gY2hlY2sgYWxsICouaHMgZmlsZXMgaW4gY3VycmVudCBBdG9tIHByb2plY3QuICcgK1xuICAgICAgJ1VzZSB3aXRoIGNhcmUsIHRoaXMgbWF5IGNhdXNlIGludGVybWl0dGVudCBmcmVlemVzIG9uIGxhcmdlIGNvZGUgYmFzZXMuICcgK1xuICAgICAgJ1doZW4gZGlzYWJsZWQsIG9ubHkgcnVucyBobGludCBvbiB0aGUgbGFzdCBzYXZlZCBmaWxlLicsXG4gICAgb3JkZXI6IDAsXG4gIH0sXG4gIGNoZWNrT25DaGFuZ2U6IHtcbiAgICB0eXBlOiAnYm9vbGVhbicsXG4gICAgZGVmYXVsdDogZmFsc2UsXG4gICAgZGVzY3JpcHRpb246XG4gICAgICAnUmUtY2hlY2sgY3VycmVudCBmaWxlIG9uIGVhY2ggY2hhbmdlLiAnICtcbiAgICAgICdDYW4gYmUgZXh0cmVtZWx5IGRpc3RyYWN0aW5nLicsXG4gICAgb3JkZXI6IDEwLFxuICB9LFxufVxuXG4vLyBnZW5lcmF0ZWQgYnkgdHlwZWQtY29uZmlnLmpzXG5kZWNsYXJlIG1vZHVsZSAnYXRvbScge1xuICBpbnRlcmZhY2UgQ29uZmlnVmFsdWVzIHtcbiAgICAnaWRlLWhhc2tlbGwtaGxpbnQuaGxpbnRQYXRoJzogc3RyaW5nXG4gICAgJ2lkZS1oYXNrZWxsLWhsaW50LmNoZWNrQWxsRmlsZXNJblByb2plY3QnOiBib29sZWFuXG4gICAgJ2lkZS1oYXNrZWxsLWhsaW50LmNoZWNrT25DaGFuZ2UnOiBib29sZWFuXG4gICAgJ2lkZS1oYXNrZWxsLWhsaW50Jzoge1xuICAgICAgaGxpbnRQYXRoOiBzdHJpbmdcbiAgICAgIGNoZWNrQWxsRmlsZXNJblByb2plY3Q6IGJvb2xlYW5cbiAgICAgIGNoZWNrT25DaGFuZ2U6IGJvb2xlYW5cbiAgICB9XG4gIH1cbn1cbiJdfQ==