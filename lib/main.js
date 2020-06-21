"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.provideUPI = exports.deactivate = exports.activate = void 0;
const CP = require("child_process");
const Path = require("path");
const highlight_1 = require("./highlight");
const atom_haskell_utils_1 = require("atom-haskell-utils");
var config_1 = require("./config");
Object.defineProperty(exports, "config", { enumerable: true, get: function () { return config_1.config; } });
let globalChildren;
function activate(_state) {
    globalChildren = {};
}
exports.activate = activate;
function deactivate() {
    globalChildren = undefined;
}
exports.deactivate = deactivate;
function provideUPI() {
    return {
        name: 'ide-haskell-hlint',
        messageTypes: {
            lint: {
                autoScroll: true,
                uriFilter: true,
            },
        },
        commands: {
            'atom-text-editor': {
                'ide-haskell-hlint:check-project': async function (editorElement) {
                    return checkFile(editorElement.getModel().getBuffer(), 'dir');
                },
            },
        },
        events: {
            onDidSaveBuffer: (buf) => checkFile(buf, atom.config.get('ide-haskell-hlint').checkAllFilesInProject
                ? 'dir'
                : 'file'),
            onDidStopChanging: (buf) => {
                if (atom.config.get('ide-haskell-hlint').checkOnChange) {
                    return checkFile(buf, 'stdin');
                }
            },
        },
    };
}
exports.provideUPI = provideUPI;
async function checkFile(buf, mode) {
    if (globalChildren && globalChildren[mode])
        globalChildren[mode].kill();
    const bufpath = buf.getPath();
    if (!bufpath)
        return undefined;
    const rootpath = atom.project
        .getDirectories()
        .find((d) => d.contains(bufpath));
    const cwd = rootpath ? rootpath.getPath() : Path.dirname(bufpath);
    let path;
    if (mode === 'dir')
        path = cwd;
    else if (mode === 'file')
        path = bufpath;
    else if (mode === 'stdin')
        path = '-';
    else
        throw new Error(`Unknown mode ${mode}`);
    try {
        const res = await new Promise((resolve, reject) => {
            const cp = CP.execFile(atom.config.get('ide-haskell-hlint').hlintPath, [
                '--json',
                '--no-exit-code',
                ...atom.config
                    .get('ide-haskell-hlint.ignoreGlobs')
                    .map((x) => `--ignore-glob=${cwd}/${x}`),
                '--',
                path,
            ], {
                encoding: 'utf-8',
                cwd,
                maxBuffer: Infinity,
            }, (error, result) => {
                if (error) {
                    reject(error);
                }
                else {
                    try {
                        resolve(JSON.parse(result));
                    }
                    catch (e) {
                        reject(e);
                    }
                }
            });
            if (globalChildren)
                globalChildren[mode] = cp;
            if (mode === 'stdin') {
                const bufPath = buf.getPath();
                if (bufPath !== undefined && Path.extname(bufPath) === '.lhs') {
                    atom_haskell_utils_1.unlit(bufPath, buf.getText())
                        .then(function (text) {
                        cp.stdin.write(text);
                        cp.stdin.end();
                    })
                        .catch((e) => {
                        reject(e);
                        cp.kill();
                    });
                }
                else {
                    cp.stdin.write(buf.getText());
                    cp.stdin.end();
                }
            }
        });
        return Promise.all(res.map(async (hr) => ({
            uri: Path.normalize(hr.file === '-' ? bufpath : hr.file),
            position: { row: hr.startLine - 1, column: hr.startColumn - 1 },
            message: {
                html: `<p>${hr.hint}</p><p>Found:<pre>${await highlight_1.highlightCode(hr.from, 'source.haskell')}</pre></p>` +
                    (hr.to
                        ? `<p>Why not:<pre>${await highlight_1.highlightCode(hr.to, 'source.haskell')}</pre></p>`
                        : '') +
                    (hr.note.length ? `<p>Note: ${hr.note.join('<br>')}</p>` : ''),
            },
            severity: 'lint',
            context: hr.severity,
        })));
    }
    catch (e) {
        console.warn(e);
        if (!e.killed) {
            if (mode === 'dir') {
                try {
                    return await checkFile(buf, 'file');
                }
                catch (e) {
                    console.warn(e);
                    atom.notifications.addError(e.toString(), {
                        detail: e.message,
                        dismissable: true,
                    });
                }
            }
            else {
                atom.notifications.addError(e.toString(), {
                    detail: e.message,
                    dismissable: true,
                });
            }
        }
        return undefined;
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWFpbi5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uL3NyYy9tYWluLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztBQUNBLG9DQUFtQztBQUVuQyw2QkFBNEI7QUFDNUIsMkNBQTJDO0FBQzNDLDJEQUEwQztBQUUxQyxtQ0FBaUM7QUFBeEIsZ0dBQUEsTUFBTSxPQUFBO0FBSWYsSUFBSSxjQUFnRSxDQUFBO0FBRXBFLFNBQWdCLFFBQVEsQ0FBQyxNQUFhO0lBQ3BDLGNBQWMsR0FBRyxFQUFFLENBQUE7QUFDckIsQ0FBQztBQUZELDRCQUVDO0FBRUQsU0FBZ0IsVUFBVTtJQUN4QixjQUFjLEdBQUcsU0FBUyxDQUFBO0FBQzVCLENBQUM7QUFGRCxnQ0FFQztBQUVELFNBQWdCLFVBQVU7SUFDeEIsT0FBTztRQUNMLElBQUksRUFBRSxtQkFBbUI7UUFDekIsWUFBWSxFQUFFO1lBQ1osSUFBSSxFQUFFO2dCQUNKLFVBQVUsRUFBRSxJQUFJO2dCQUNoQixTQUFTLEVBQUUsSUFBSTthQUNoQjtTQUNGO1FBQ0QsUUFBUSxFQUFFO1lBQ1Isa0JBQWtCLEVBQUU7Z0JBQ2xCLGlDQUFpQyxFQUFFLEtBQUssV0FBVSxhQUFhO29CQUM3RCxPQUFPLFNBQVMsQ0FBQyxhQUFhLENBQUMsUUFBUSxFQUFFLENBQUMsU0FBUyxFQUFFLEVBQUUsS0FBSyxDQUFDLENBQUE7Z0JBQy9ELENBQUM7YUFDRjtTQUNGO1FBQ0QsTUFBTSxFQUFFO1lBQ04sZUFBZSxFQUFFLENBQUMsR0FBRyxFQUFFLEVBQUUsQ0FDdkIsU0FBUyxDQUNQLEdBQUcsRUFDSCxJQUFJLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxtQkFBbUIsQ0FBQyxDQUFDLHNCQUFzQjtnQkFDekQsQ0FBQyxDQUFDLEtBQUs7Z0JBQ1AsQ0FBQyxDQUFDLE1BQU0sQ0FDSjtZQUNWLGlCQUFpQixFQUFFLENBQUMsR0FBRyxFQUFFLEVBQUU7Z0JBQ3pCLElBQUksSUFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFHLENB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WTt3QkFDZixDQUFDLENBQUMsRUFBRSxDQUFDO29CQUNQLENBQUMsRUFBRSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLFlBQVksRUFBRSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDO2FBQ2pFO1lBQ0QsUUFBUSxFQUFFLE1BQU07WUFDaEIsT0FBTyxFQUFFLEVBQUUsQ0FBQyxRQUFRO1NBQ3JCLENBQUMsQ0FBQyxDQUNKLENBQUE7S0FDRjtJQUFDLE9BQU8sQ0FBQyxFQUFFO1FBQ1YsT0FBTyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQTtRQUNmLElBQUksQ0FBQyxDQUFDLENBQUMsTUFBTSxFQUFFO1lBQ2IsSUFBSSxJQUFJLEtBQUssS0FBSyxFQUFFO2dCQUNsQixJQUFJO29CQUNGLE9BQU8sTUFBTSxTQUFTLENBQUMsR0FBRyxFQUFFLE1BQU0sQ0FBQyxDQUFBO2lCQUNwQztnQkFBQyxPQUFPLENBQUMsRUFBRTtvQkFDVixPQUFPLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFBO29CQUNmLElBQUksQ0FBQyxhQUFhLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxRQUFRLEVBQUUsRUFBRTt3QkFDeEMsTUFBTSxFQUFFLENBQUMsQ0FBQyxPQUFPO3dCQUNqQixXQUFXLEVBQUUsSUFBSTtxQkFDbEIsQ0FBQyxDQUFBO2lCQUNIO2FBQ0Y7aUJBQU07Z0JBQ0wsSUFBSSxDQUFDLGFBQWEsQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLFFBQVEsRUFBRSxFQUFFO29CQUN4QyxNQUFNLEVBQUUsQ0FBQyxDQUFDLE9BQU87b0JBQ2pCLFdBQVcsRUFBRSxJQUFJO2lCQUNsQixDQUFDLENBQUE7YUFDSDtTQUNGO1FBQ0QsT0FBTyxTQUFTLENBQUE7S0FDakI7QUFDSCxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0ICogYXMgVVBJIGZyb20gJ2F0b20taGFza2VsbC11cGknXG5pbXBvcnQgKiBhcyBDUCBmcm9tICdjaGlsZF9wcm9jZXNzJ1xuaW1wb3J0ICogYXMgQXRvbSBmcm9tICdhdG9tJ1xuaW1wb3J0ICogYXMgUGF0aCBmcm9tICdwYXRoJ1xuaW1wb3J0IHsgaGlnaGxpZ2h0Q29kZSB9IGZyb20gJy4vaGlnaGxpZ2h0J1xuaW1wb3J0IHsgdW5saXQgfSBmcm9tICdhdG9tLWhhc2tlbGwtdXRpbHMnXG5cbmV4cG9ydCB7IGNvbmZpZyB9IGZyb20gJy4vY29uZmlnJ1xuXG50eXBlIE1vZGUgPSAnZGlyJyB8ICdmaWxlJyB8ICdzdGRpbidcblxubGV0IGdsb2JhbENoaWxkcmVuOiB7IFttb2RlIGluIE1vZGVdPzogQ1AuQ2hpbGRQcm9jZXNzIH0gfCB1bmRlZmluZWRcblxuZXhwb3J0IGZ1bmN0aW9uIGFjdGl2YXRlKF9zdGF0ZTogbmV2ZXIpIHtcbiAgZ2xvYmFsQ2hpbGRyZW4gPSB7fVxufVxuXG5leHBvcnQgZnVuY3Rpb24gZGVhY3RpdmF0ZSgpIHtcbiAgZ2xvYmFsQ2hpbGRyZW4gPSB1bmRlZmluZWRcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHByb3ZpZGVVUEkoKTogVVBJLklSZWdpc3RyYXRpb25PcHRpb25zIHtcbiAgcmV0dXJuIHtcbiAgICBuYW1lOiAnaWRlLWhhc2tlbGwtaGxpbnQnLFxuICAgIG1lc3NhZ2VUeXBlczoge1xuICAgICAgbGludDoge1xuICAgICAgICBhdXRvU2Nyb2xsOiB0cnVlLFxuICAgICAgICB1cmlGaWx0ZXI6IHRydWUsXG4gICAgICB9LFxuICAgIH0sXG4gICAgY29tbWFuZHM6IHtcbiAgICAgICdhdG9tLXRleHQtZWRpdG9yJzoge1xuICAgICAgICAnaWRlLWhhc2tlbGwtaGxpbnQ6Y2hlY2stcHJvamVjdCc6IGFzeW5jIGZ1bmN0aW9uKGVkaXRvckVsZW1lbnQpIHtcbiAgICAgICAgICByZXR1cm4gY2hlY2tGaWxlKGVkaXRvckVsZW1lbnQuZ2V0TW9kZWwoKS5nZXRCdWZmZXIoKSwgJ2RpcicpXG4gICAgICAgIH0sXG4gICAgICB9LFxuICAgIH0sXG4gICAgZXZlbnRzOiB7XG4gICAgICBvbkRpZFNhdmVCdWZmZXI6IChidWYpID0+XG4gICAgICAgIGNoZWNrRmlsZShcbiAgICAgICAgICBidWYsXG4gICAgICAgICAgYXRvbS5jb25maWcuZ2V0KCdpZGUtaGFza2VsbC1obGludCcpLmNoZWNrQWxsRmlsZXNJblByb2plY3RcbiAgICAgICAgICAgID8gJ2RpcidcbiAgICAgICAgICAgIDogJ2ZpbGUnLFxuICAgICAgICApIGFzIGFueSxcbiAgICAgIG9uRGlkU3RvcENoYW5naW5nOiAoYnVmKSA9PiB7XG4gICAgICAgIGlmIChhdG9tLmNvbmZpZy5nZXQoJ2lkZS1oYXNrZWxsLWhsaW50JykuY2hlY2tPbkNoYW5nZSkge1xuICAgICAgICAgIHJldHVybiBjaGVja0ZpbGUoYnVmLCAnc3RkaW4nKSBhcyBhbnlcbiAgICAgICAgfVxuICAgICAgfSxcbiAgICB9LFxuICB9XG59XG5cbnR5cGUgSExpbnRSZXN1bHQgPSBSZWFkb25seUFycmF5PEhMaW50UmVzdWx0SXRlbT5cblxuaW50ZXJmYWNlIEhMaW50UmVzdWx0SXRlbSB7XG4gIG1vZHVsZTogc3RyaW5nW11cbiAgZGVjbDogc3RyaW5nW11cbiAgc2V2ZXJpdHk6IHN0cmluZ1xuICBoaW50OiBzdHJpbmdcbiAgZmlsZTogc3RyaW5nXG4gIHN0YXJ0TGluZTogbnVtYmVyXG4gIHN0YXJ0Q29sdW1uOiBudW1iZXJcbiAgZW5kTGluZTogbnVtYmVyXG4gIGVuZENvbHVtbjogbnVtYmVyXG4gIGZyb206IHN0cmluZ1xuICB0bz86IHN0cmluZ1xuICBub3RlOiBzdHJpbmdbXVxufVxuXG5hc3luYyBmdW5jdGlvbiBjaGVja0ZpbGUoXG4gIGJ1ZjogQXRvbS5UZXh0QnVmZmVyLFxuICBtb2RlOiAnZGlyJyB8ICdmaWxlJyB8ICdzdGRpbicsXG4pOiBQcm9taXNlPHVuZGVmaW5lZCB8IFVQSS5JUmVzdWx0SXRlbVtdPiB7XG4gIC8vIHRzbGludDpkaXNhYmxlLW5leHQtbGluZTogbm8tbm9uLW51bGwtYXNzZXJ0aW9uXG4gIGlmIChnbG9iYWxDaGlsZHJlbiAmJiBnbG9iYWxDaGlsZHJlblttb2RlXSkgZ2xvYmFsQ2hpbGRyZW5bbW9kZV0hLmtpbGwoKVxuICBjb25zdCBidWZwYXRoID0gYnVmLmdldFBhdGgoKVxuICBpZiAoIWJ1ZnBhdGgpIHJldHVybiB1bmRlZmluZWRcbiAgY29uc3Qgcm9vdHBhdGggPSBhdG9tLnByb2plY3RcbiAgICAuZ2V0RGlyZWN0b3JpZXMoKVxuICAgIC5maW5kKChkKSA9PiBkLmNvbnRhaW5zKGJ1ZnBhdGgpKVxuICBjb25zdCBjd2QgPSByb290cGF0aCA/IHJvb3RwYXRoLmdldFBhdGgoKSA6IFBhdGguZGlybmFtZShidWZwYXRoKVxuICBsZXQgcGF0aDogc3RyaW5nXG4gIGlmIChtb2RlID09PSAnZGlyJykgcGF0aCA9IGN3ZFxuICBlbHNlIGlmIChtb2RlID09PSAnZmlsZScpIHBhdGggPSBidWZwYXRoXG4gIGVsc2UgaWYgKG1vZGUgPT09ICdzdGRpbicpIHBhdGggPSAnLSdcbiAgZWxzZSB0aHJvdyBuZXcgRXJyb3IoYFVua25vd24gbW9kZSAke21vZGV9YClcbiAgdHJ5IHtcbiAgICBjb25zdCByZXMgPSBhd2FpdCBuZXcgUHJvbWlzZTxITGludFJlc3VsdD4oKHJlc29sdmUsIHJlamVjdCkgPT4ge1xuICAgICAgY29uc3QgY3AgPSBDUC5leGVjRmlsZShcbiAgICAgICAgYXRvbS5jb25maWcuZ2V0KCdpZGUtaGFza2VsbC1obGludCcpLmhsaW50UGF0aCxcbiAgICAgICAgW1xuICAgICAgICAgICctLWpzb24nLFxuICAgICAgICAgICctLW5vLWV4aXQtY29kZScsXG4gICAgICAgICAgLi4uYXRvbS5jb25maWdcbiAgICAgICAgICAgIC5nZXQoJ2lkZS1oYXNrZWxsLWhsaW50Lmlnbm9yZUdsb2JzJylcbiAgICAgICAgICAgIC5tYXAoKHgpID0+IGAtLWlnbm9yZS1nbG9iPSR7Y3dkfS8ke3h9YCksXG4gICAgICAgICAgJy0tJyxcbiAgICAgICAgICBwYXRoLFxuICAgICAgICBdLFxuICAgICAgICB7XG4gICAgICAgICAgZW5jb2Rpbmc6ICd1dGYtOCcsXG4gICAgICAgICAgY3dkLFxuICAgICAgICAgIG1heEJ1ZmZlcjogSW5maW5pdHksXG4gICAgICAgIH0sXG4gICAgICAgIChlcnJvciwgcmVzdWx0KSA9PiB7XG4gICAgICAgICAgaWYgKGVycm9yKSB7XG4gICAgICAgICAgICByZWplY3QoZXJyb3IpXG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICAgIHJlc29sdmUoSlNPTi5wYXJzZShyZXN1bHQgYXMgc3RyaW5nKSlcbiAgICAgICAgICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgICAgICAgICAgcmVqZWN0KGUpXG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICB9LFxuICAgICAgKVxuICAgICAgaWYgKGdsb2JhbENoaWxkcmVuKSBnbG9iYWxDaGlsZHJlblttb2RlXSA9IGNwXG4gICAgICAvLyB0c2xpbnQ6ZGlzYWJsZS1uZXh0LWxpbmU6dG90YWxpdHktY2hlY2tcbiAgICAgIGlmIChtb2RlID09PSAnc3RkaW4nKSB7XG4gICAgICAgIGNvbnN0IGJ1ZlBhdGggPSBidWYuZ2V0UGF0aCgpXG4gICAgICAgIGlmIChidWZQYXRoICE9PSB1bmRlZmluZWQgJiYgUGF0aC5leHRuYW1lKGJ1ZlBhdGgpID09PSAnLmxocycpIHtcbiAgICAgICAgICB1bmxpdChidWZQYXRoLCBidWYuZ2V0VGV4dCgpKVxuICAgICAgICAgICAgLnRoZW4oZnVuY3Rpb24odGV4dCkge1xuICAgICAgICAgICAgICBjcC5zdGRpbi53cml0ZSh0ZXh0KVxuICAgICAgICAgICAgICBjcC5zdGRpbi5lbmQoKVxuICAgICAgICAgICAgfSlcbiAgICAgICAgICAgIC5jYXRjaCgoZTogRXJyb3IpID0+IHtcbiAgICAgICAgICAgICAgcmVqZWN0KGUpXG4gICAgICAgICAgICAgIGNwLmtpbGwoKVxuICAgICAgICAgICAgfSlcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBjcC5zdGRpbi53cml0ZShidWYuZ2V0VGV4dCgpKVxuICAgICAgICAgIGNwLnN0ZGluLmVuZCgpXG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9KVxuICAgIHJldHVybiBQcm9taXNlLmFsbChcbiAgICAgIHJlcy5tYXAoYXN5bmMgKGhyKSA9PiAoe1xuICAgICAgICB1cmk6IFBhdGgubm9ybWFsaXplKGhyLmZpbGUgPT09ICctJyA/IGJ1ZnBhdGggOiBoci5maWxlKSxcbiAgICAgICAgcG9zaXRpb246IHsgcm93OiBoci5zdGFydExpbmUgLSAxLCBjb2x1bW46IGhyLnN0YXJ0Q29sdW1uIC0gMSB9LFxuICAgICAgICBtZXNzYWdlOiB7XG4gICAgICAgICAgaHRtbDpcbiAgICAgICAgICAgIGA8cD4ke2hyLmhpbnR9PC9wPjxwPkZvdW5kOjxwcmU+JHthd2FpdCBoaWdobGlnaHRDb2RlKFxuICAgICAgICAgICAgICBoci5mcm9tLFxuICAgICAgICAgICAgICAnc291cmNlLmhhc2tlbGwnLFxuICAgICAgICAgICAgKX08L3ByZT48L3A+YCArXG4gICAgICAgICAgICAoaHIudG9cbiAgICAgICAgICAgICAgPyBgPHA+V2h5IG5vdDo8cHJlPiR7YXdhaXQgaGlnaGxpZ2h0Q29kZShcbiAgICAgICAgICAgICAgICAgIGhyLnRvLFxuICAgICAgICAgICAgICAgICAgJ3NvdXJjZS5oYXNrZWxsJyxcbiAgICAgICAgICAgICAgICApfTwvcHJlPjwvcD5gXG4gICAgICAgICAgICAgIDogJycpICtcbiAgICAgICAgICAgIChoci5ub3RlLmxlbmd0aCA/IGA8cD5Ob3RlOiAke2hyLm5vdGUuam9pbignPGJyPicpfTwvcD5gIDogJycpLFxuICAgICAgICB9LFxuICAgICAgICBzZXZlcml0eTogJ2xpbnQnLFxuICAgICAgICBjb250ZXh0OiBoci5zZXZlcml0eSxcbiAgICAgIH0pKSxcbiAgICApXG4gIH0gY2F0Y2ggKGUpIHtcbiAgICBjb25zb2xlLndhcm4oZSlcbiAgICBpZiAoIWUua2lsbGVkKSB7XG4gICAgICBpZiAobW9kZSA9PT0gJ2RpcicpIHtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICByZXR1cm4gYXdhaXQgY2hlY2tGaWxlKGJ1ZiwgJ2ZpbGUnKVxuICAgICAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgICAgY29uc29sZS53YXJuKGUpXG4gICAgICAgICAgYXRvbS5ub3RpZmljYXRpb25zLmFkZEVycm9yKGUudG9TdHJpbmcoKSwge1xuICAgICAgICAgICAgZGV0YWlsOiBlLm1lc3NhZ2UsXG4gICAgICAgICAgICBkaXNtaXNzYWJsZTogdHJ1ZSxcbiAgICAgICAgICB9KVxuICAgICAgICB9XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBhdG9tLm5vdGlmaWNhdGlvbnMuYWRkRXJyb3IoZS50b1N0cmluZygpLCB7XG4gICAgICAgICAgZGV0YWlsOiBlLm1lc3NhZ2UsXG4gICAgICAgICAgZGlzbWlzc2FibGU6IHRydWUsXG4gICAgICAgIH0pXG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiB1bmRlZmluZWRcbiAgfVxufVxuIl19