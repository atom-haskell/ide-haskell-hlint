"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.provideUPI = exports.deactivate = exports.activate = void 0;
const CP = require("child_process");
const Path = require("path");
const highlight_1 = require("./highlight");
const atom_haskell_utils_1 = require("atom-haskell-utils");
var config_1 = require("./config");
Object.defineProperty(exports, "config", { enumerable: true, get: function () { return config_1.config; } });
function activate(_state) {
}
exports.activate = activate;
function deactivate() {
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
        return undefined;
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWFpbi5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uL3NyYy9tYWluLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztBQUNBLG9DQUFtQztBQUVuQyw2QkFBNEI7QUFDNUIsMkNBQTJDO0FBQzNDLDJEQUEwQztBQUUxQyxtQ0FBaUM7QUFBeEIsZ0dBQUEsTUFBTSxPQUFBO0FBRWYsU0FBZ0IsUUFBUSxDQUFDLE1BQWE7QUFFdEMsQ0FBQztBQUZELDRCQUVDO0FBRUQsU0FBZ0IsVUFBVTtBQUUxQixDQUFDO0FBRkQsZ0NBRUM7QUFFRCxTQUFnQixVQUFVO0lBQ3hCLE9BQU87UUFDTCxJQUFJLEVBQUUsbUJBQW1CO1FBQ3pCLFlBQVksRUFBRTtZQUNaLElBQUksRUFBRTtnQkFDSixVQUFVLEVBQUUsSUFBSTtnQkFDaEIsU0FBUyxFQUFFLElBQUk7YUFDaEI7U0FDRjtRQUNELFFBQVEsRUFBRTtZQUNSLGtCQUFrQixFQUFFO2dCQUNsQixpQ0FBaUMsRUFBRSxLQUFLLFdBQVUsYUFBYTtvQkFDN0QsT0FBTyxTQUFTLENBQUMsYUFBYSxDQUFDLFFBQVEsRUFBRSxDQUFDLFNBQVMsRUFBRSxFQUFFLEtBQUssQ0FBQyxDQUFBO2dCQUMvRCxDQUFDO2FBQ0Y7U0FDRjtRQUNELE1BQU0sRUFBRTtZQUNOLGVBQWUsRUFBRSxDQUFDLEdBQUcsRUFBRSxFQUFFLENBQ3ZCLFNBQVMsQ0FDUCxHQUFHLEVBQ0gsSUFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsbUJBQW1CLENBQUMsQ0FBQyxzQkFBc0I7Z0JBQ3pELENBQUMsQ0FBQyxLQUFLO2dCQUNQLENBQUMsQ0FBQyxNQUFNLENBQ0o7WUFDVixpQkFBaUIsRUFBRSxDQUFDLEdBQUcsRUFBRSxFQUFFO2dCQUN6QixJQUFJLElBQUksQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLG1CQUFtQixDQUFDLENBQUMsYUFBYSxFQUFFO29CQUN0RCxPQUFPLFNBQVMsQ0FBQyxHQUFHLEVBQUUsT0FBTyxDQUFRLENB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Q0FBQyxDQUFDLENBQ0osQ0FBQTtLQUNGO0lBQUMsT0FBTyxDQUFDLEVBQUU7UUFDVixPQUFPLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFBO1FBQ2YsSUFBSSxJQUFJLEtBQUssS0FBSyxFQUFFO1lBQ2xCLElBQUk7Z0JBQ0YsT0FBTyxNQUFNLFNBQVMsQ0FBQyxHQUFHLEVBQUUsTUFBTSxDQUFDLENBQUE7YUFDcEM7WUFBQyxPQUFPLENBQUMsRUFBRTtnQkFDVixPQUFPLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFBO2dCQUNmLElBQUksQ0FBQyxhQUFhLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxRQUFRLEVBQUUsRUFBRTtvQkFDeEMsTUFBTSxFQUFFLENBQUMsQ0FBQyxPQUFPO29CQUNqQixXQUFXLEVBQUUsSUFBSTtpQkFDbEIsQ0FBQyxDQUFBO2FBQ0g7U0FDRjthQUFNO1lBQ0wsSUFBSSxDQUFDLGFBQWEsQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLFFBQVEsRUFBRSxFQUFFO2dCQUN4QyxNQUFNLEVBQUUsQ0FBQyxDQUFDLE9BQU87Z0JBQ2pCLFdBQVcsRUFBRSxJQUFJO2FBQ2xCLENBQUMsQ0FBQTtTQUNIO1FBQ0QsT0FBTyxTQUFTLENBQUE7S0FDakI7QUFDSCxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0ICogYXMgVVBJIGZyb20gJ2F0b20taGFza2VsbC11cGknXG5pbXBvcnQgKiBhcyBDUCBmcm9tICdjaGlsZF9wcm9jZXNzJ1xuaW1wb3J0ICogYXMgQXRvbSBmcm9tICdhdG9tJ1xuaW1wb3J0ICogYXMgUGF0aCBmcm9tICdwYXRoJ1xuaW1wb3J0IHsgaGlnaGxpZ2h0Q29kZSB9IGZyb20gJy4vaGlnaGxpZ2h0J1xuaW1wb3J0IHsgdW5saXQgfSBmcm9tICdhdG9tLWhhc2tlbGwtdXRpbHMnXG5cbmV4cG9ydCB7IGNvbmZpZyB9IGZyb20gJy4vY29uZmlnJ1xuXG5leHBvcnQgZnVuY3Rpb24gYWN0aXZhdGUoX3N0YXRlOiBuZXZlcikge1xuICAvKiBuby1vcCAqL1xufVxuXG5leHBvcnQgZnVuY3Rpb24gZGVhY3RpdmF0ZSgpIHtcbiAgLyogbm8tb3AgKi9cbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHByb3ZpZGVVUEkoKTogVVBJLklSZWdpc3RyYXRpb25PcHRpb25zIHtcbiAgcmV0dXJuIHtcbiAgICBuYW1lOiAnaWRlLWhhc2tlbGwtaGxpbnQnLFxuICAgIG1lc3NhZ2VUeXBlczoge1xuICAgICAgbGludDoge1xuICAgICAgICBhdXRvU2Nyb2xsOiB0cnVlLFxuICAgICAgICB1cmlGaWx0ZXI6IHRydWUsXG4gICAgICB9LFxuICAgIH0sXG4gICAgY29tbWFuZHM6IHtcbiAgICAgICdhdG9tLXRleHQtZWRpdG9yJzoge1xuICAgICAgICAnaWRlLWhhc2tlbGwtaGxpbnQ6Y2hlY2stcHJvamVjdCc6IGFzeW5jIGZ1bmN0aW9uKGVkaXRvckVsZW1lbnQpIHtcbiAgICAgICAgICByZXR1cm4gY2hlY2tGaWxlKGVkaXRvckVsZW1lbnQuZ2V0TW9kZWwoKS5nZXRCdWZmZXIoKSwgJ2RpcicpXG4gICAgICAgIH0sXG4gICAgICB9LFxuICAgIH0sXG4gICAgZXZlbnRzOiB7XG4gICAgICBvbkRpZFNhdmVCdWZmZXI6IChidWYpID0+XG4gICAgICAgIGNoZWNrRmlsZShcbiAgICAgICAgICBidWYsXG4gICAgICAgICAgYXRvbS5jb25maWcuZ2V0KCdpZGUtaGFza2VsbC1obGludCcpLmNoZWNrQWxsRmlsZXNJblByb2plY3RcbiAgICAgICAgICAgID8gJ2RpcidcbiAgICAgICAgICAgIDogJ2ZpbGUnLFxuICAgICAgICApIGFzIGFueSxcbiAgICAgIG9uRGlkU3RvcENoYW5naW5nOiAoYnVmKSA9PiB7XG4gICAgICAgIGlmIChhdG9tLmNvbmZpZy5nZXQoJ2lkZS1oYXNrZWxsLWhsaW50JykuY2hlY2tPbkNoYW5nZSkge1xuICAgICAgICAgIHJldHVybiBjaGVja0ZpbGUoYnVmLCAnc3RkaW4nKSBhcyBhbnlcbiAgICAgICAgfVxuICAgICAgfSxcbiAgICB9LFxuICB9XG59XG5cbnR5cGUgSExpbnRSZXN1bHQgPSBSZWFkb25seUFycmF5PEhMaW50UmVzdWx0SXRlbT5cblxuaW50ZXJmYWNlIEhMaW50UmVzdWx0SXRlbSB7XG4gIG1vZHVsZTogc3RyaW5nW11cbiAgZGVjbDogc3RyaW5nW11cbiAgc2V2ZXJpdHk6IHN0cmluZ1xuICBoaW50OiBzdHJpbmdcbiAgZmlsZTogc3RyaW5nXG4gIHN0YXJ0TGluZTogbnVtYmVyXG4gIHN0YXJ0Q29sdW1uOiBudW1iZXJcbiAgZW5kTGluZTogbnVtYmVyXG4gIGVuZENvbHVtbjogbnVtYmVyXG4gIGZyb206IHN0cmluZ1xuICB0bz86IHN0cmluZ1xuICBub3RlOiBzdHJpbmdbXVxufVxuXG5hc3luYyBmdW5jdGlvbiBjaGVja0ZpbGUoXG4gIGJ1ZjogQXRvbS5UZXh0QnVmZmVyLFxuICBtb2RlOiAnZGlyJyB8ICdmaWxlJyB8ICdzdGRpbicsXG4pOiBQcm9taXNlPHVuZGVmaW5lZCB8IFVQSS5JUmVzdWx0SXRlbVtdPiB7XG4gIGNvbnN0IGJ1ZnBhdGggPSBidWYuZ2V0UGF0aCgpXG4gIGlmICghYnVmcGF0aCkgcmV0dXJuIHVuZGVmaW5lZFxuICBjb25zdCByb290cGF0aCA9IGF0b20ucHJvamVjdFxuICAgIC5nZXREaXJlY3RvcmllcygpXG4gICAgLmZpbmQoKGQpID0+IGQuY29udGFpbnMoYnVmcGF0aCkpXG4gIGNvbnN0IGN3ZCA9IHJvb3RwYXRoID8gcm9vdHBhdGguZ2V0UGF0aCgpIDogUGF0aC5kaXJuYW1lKGJ1ZnBhdGgpXG4gIGxldCBwYXRoOiBzdHJpbmdcbiAgaWYgKG1vZGUgPT09ICdkaXInKSBwYXRoID0gY3dkXG4gIGVsc2UgaWYgKG1vZGUgPT09ICdmaWxlJykgcGF0aCA9IGJ1ZnBhdGhcbiAgZWxzZSBpZiAobW9kZSA9PT0gJ3N0ZGluJykgcGF0aCA9ICctJ1xuICBlbHNlIHRocm93IG5ldyBFcnJvcihgVW5rbm93biBtb2RlICR7bW9kZX1gKVxuICB0cnkge1xuICAgIGNvbnN0IHJlcyA9IGF3YWl0IG5ldyBQcm9taXNlPEhMaW50UmVzdWx0PigocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG4gICAgICBjb25zdCBjcCA9IENQLmV4ZWNGaWxlKFxuICAgICAgICBhdG9tLmNvbmZpZy5nZXQoJ2lkZS1oYXNrZWxsLWhsaW50JykuaGxpbnRQYXRoLFxuICAgICAgICBbXG4gICAgICAgICAgJy0tanNvbicsXG4gICAgICAgICAgJy0tbm8tZXhpdC1jb2RlJyxcbiAgICAgICAgICAuLi5hdG9tLmNvbmZpZ1xuICAgICAgICAgICAgLmdldCgnaWRlLWhhc2tlbGwtaGxpbnQuaWdub3JlR2xvYnMnKVxuICAgICAgICAgICAgLm1hcCgoeCkgPT4gYC0taWdub3JlLWdsb2I9JHtjd2R9LyR7eH1gKSxcbiAgICAgICAgICAnLS0nLFxuICAgICAgICAgIHBhdGgsXG4gICAgICAgIF0sXG4gICAgICAgIHtcbiAgICAgICAgICBlbmNvZGluZzogJ3V0Zi04JyxcbiAgICAgICAgICBjd2QsXG4gICAgICAgICAgbWF4QnVmZmVyOiBJbmZpbml0eSxcbiAgICAgICAgfSxcbiAgICAgICAgKGVycm9yLCByZXN1bHQpID0+IHtcbiAgICAgICAgICBpZiAoZXJyb3IpIHtcbiAgICAgICAgICAgIHJlamVjdChlcnJvcilcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgICAgcmVzb2x2ZShKU09OLnBhcnNlKHJlc3VsdCBhcyBzdHJpbmcpKVxuICAgICAgICAgICAgfSBjYXRjaCAoZSkge1xuICAgICAgICAgICAgICByZWplY3QoZSlcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgIH0sXG4gICAgICApXG4gICAgICAvLyB0c2xpbnQ6ZGlzYWJsZS1uZXh0LWxpbmU6dG90YWxpdHktY2hlY2tcbiAgICAgIGlmIChtb2RlID09PSAnc3RkaW4nKSB7XG4gICAgICAgIGNvbnN0IGJ1ZlBhdGggPSBidWYuZ2V0UGF0aCgpXG4gICAgICAgIGlmIChidWZQYXRoICE9PSB1bmRlZmluZWQgJiYgUGF0aC5leHRuYW1lKGJ1ZlBhdGgpID09PSAnLmxocycpIHtcbiAgICAgICAgICB1bmxpdChidWZQYXRoLCBidWYuZ2V0VGV4dCgpKVxuICAgICAgICAgICAgLnRoZW4oZnVuY3Rpb24odGV4dCkge1xuICAgICAgICAgICAgICBjcC5zdGRpbi53cml0ZSh0ZXh0KVxuICAgICAgICAgICAgICBjcC5zdGRpbi5lbmQoKVxuICAgICAgICAgICAgfSlcbiAgICAgICAgICAgIC5jYXRjaCgoZTogRXJyb3IpID0+IHtcbiAgICAgICAgICAgICAgcmVqZWN0KGUpXG4gICAgICAgICAgICAgIGNwLmtpbGwoKVxuICAgICAgICAgICAgfSlcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBjcC5zdGRpbi53cml0ZShidWYuZ2V0VGV4dCgpKVxuICAgICAgICAgIGNwLnN0ZGluLmVuZCgpXG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9KVxuICAgIHJldHVybiBQcm9taXNlLmFsbChcbiAgICAgIHJlcy5tYXAoYXN5bmMgKGhyKSA9PiAoe1xuICAgICAgICB1cmk6IFBhdGgubm9ybWFsaXplKGhyLmZpbGUgPT09ICctJyA/IGJ1ZnBhdGggOiBoci5maWxlKSxcbiAgICAgICAgcG9zaXRpb246IHsgcm93OiBoci5zdGFydExpbmUgLSAxLCBjb2x1bW46IGhyLnN0YXJ0Q29sdW1uIC0gMSB9LFxuICAgICAgICBtZXNzYWdlOiB7XG4gICAgICAgICAgaHRtbDpcbiAgICAgICAgICAgIGA8cD4ke2hyLmhpbnR9PC9wPjxwPkZvdW5kOjxwcmU+JHthd2FpdCBoaWdobGlnaHRDb2RlKFxuICAgICAgICAgICAgICBoci5mcm9tLFxuICAgICAgICAgICAgICAnc291cmNlLmhhc2tlbGwnLFxuICAgICAgICAgICAgKX08L3ByZT48L3A+YCArXG4gICAgICAgICAgICAoaHIudG9cbiAgICAgICAgICAgICAgPyBgPHA+V2h5IG5vdDo8cHJlPiR7YXdhaXQgaGlnaGxpZ2h0Q29kZShcbiAgICAgICAgICAgICAgICAgIGhyLnRvLFxuICAgICAgICAgICAgICAgICAgJ3NvdXJjZS5oYXNrZWxsJyxcbiAgICAgICAgICAgICAgICApfTwvcHJlPjwvcD5gXG4gICAgICAgICAgICAgIDogJycpICtcbiAgICAgICAgICAgIChoci5ub3RlLmxlbmd0aCA/IGA8cD5Ob3RlOiAke2hyLm5vdGUuam9pbignPGJyPicpfTwvcD5gIDogJycpLFxuICAgICAgICB9LFxuICAgICAgICBzZXZlcml0eTogJ2xpbnQnLFxuICAgICAgICBjb250ZXh0OiBoci5zZXZlcml0eSxcbiAgICAgIH0pKSxcbiAgICApXG4gIH0gY2F0Y2ggKGUpIHtcbiAgICBjb25zb2xlLndhcm4oZSlcbiAgICBpZiAobW9kZSA9PT0gJ2RpcicpIHtcbiAgICAgIHRyeSB7XG4gICAgICAgIHJldHVybiBhd2FpdCBjaGVja0ZpbGUoYnVmLCAnZmlsZScpXG4gICAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgIGNvbnNvbGUud2FybihlKVxuICAgICAgICBhdG9tLm5vdGlmaWNhdGlvbnMuYWRkRXJyb3IoZS50b1N0cmluZygpLCB7XG4gICAgICAgICAgZGV0YWlsOiBlLm1lc3NhZ2UsXG4gICAgICAgICAgZGlzbWlzc2FibGU6IHRydWUsXG4gICAgICAgIH0pXG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIGF0b20ubm90aWZpY2F0aW9ucy5hZGRFcnJvcihlLnRvU3RyaW5nKCksIHtcbiAgICAgICAgZGV0YWlsOiBlLm1lc3NhZ2UsXG4gICAgICAgIGRpc21pc3NhYmxlOiB0cnVlLFxuICAgICAgfSlcbiAgICB9XG4gICAgcmV0dXJuIHVuZGVmaW5lZFxuICB9XG59XG4iXX0=