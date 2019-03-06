"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const CP = require("child_process");
const Path = require("path");
const highlight_1 = require("./highlight");
var config_1 = require("./config");
exports.config = config_1.config;
function activate(_state) { }
exports.activate = activate;
function deactivate() { }
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
        events: {
            onDidSaveBuffer: (buf) => checkFile(buf, true),
        },
    };
}
exports.provideUPI = provideUPI;
async function checkFile(buf, all = false) {
    const bufpath = buf.getPath();
    if (!bufpath)
        return;
    const rootpath = atom.project
        .getDirectories()
        .find((d) => d.contains(bufpath));
    const cwd = rootpath ? rootpath.getPath() : Path.dirname(bufpath);
    const path = all ? cwd : bufpath;
    try {
        const res = await new Promise((resolve, reject) => {
            CP.execFile('hlint', ['--json', '--cross', '--', path], {
                encoding: 'utf-8',
                cwd,
                maxBuffer: Infinity,
            }, (error, result) => {
                if (error && result === undefined)
                    reject(error);
                else {
                    try {
                        resolve(JSON.parse(result));
                    }
                    catch (e) {
                        reject(error);
                    }
                }
            });
        });
        console.log(res);
        return Promise.all(res.map(async (hr) => ({
            uri: Path.normalize(hr.file),
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
        if (all) {
            try {
                return await checkFile(buf, false);
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
        return;
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWFpbi5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uL3NyYy9tYWluLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQ0Esb0NBQW1DO0FBRW5DLDZCQUE0QjtBQUM1QiwyQ0FBMkM7QUFFM0MsbUNBQWlDO0FBQXhCLDBCQUFBLE1BQU0sQ0FBQTtBQUVmLFNBQWdCLFFBQVEsQ0FBQyxNQUFhLElBQUcsQ0FBQztBQUExQyw0QkFBMEM7QUFFMUMsU0FBZ0IsVUFBVSxLQUFJLENBQUM7QUFBL0IsZ0NBQStCO0FBRS9CLFNBQWdCLFVBQVU7SUFDeEIsT0FBTztRQUNMLElBQUksRUFBRSxtQkFBbUI7UUFDekIsWUFBWSxFQUFFO1lBQ1osSUFBSSxFQUFFO2dCQUNKLFVBQVUsRUFBRSxJQUFJO2dCQUNoQixTQUFTLEVBQUUsSUFBSTthQUNoQjtTQUNGO1FBQ0QsTUFBTSxFQUFFO1lBQ04sZUFBZSxFQUFFLENBQUMsR0FBRyxFQUFFLEVBQUUsQ0FBQyxTQUFTLENBQUMsR0FBRyxFQUFFLElBQUksQ0FBUTtTQUN0RDtLQUNGLENBQUE7QUFDSCxDQUFDO0FBYkQsZ0NBYUM7QUFtQkQsS0FBSyxVQUFVLFNBQVMsQ0FDdEIsR0FBb0IsRUFDcEIsR0FBRyxHQUFHLEtBQUs7SUFFWCxNQUFNLE9BQU8sR0FBRyxHQUFHLENBQUMsT0FBTyxFQUFFLENBQUE7SUFDN0IsSUFBSSxDQUFDLE9BQU87UUFBRSxPQUFNO0lBQ3BCLE1BQU0sUUFBUSxHQUFHLElBQUksQ0FBQyxPQUFPO1NBQzFCLGNBQWMsRUFBRTtTQUNoQixJQUFJLENBQUMsQ0FBQyxDQUFDLEVBQUUsRUFBRSxDQUFDLENBQUMsQ0FBQyxRQUFRLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQTtJQUNuQyxNQUFNLEdBQUcsR0FBRyxRQUFRLENBQUMsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxPQUFPLEVBQUUsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxPQUFPLENBQUMsQ0FBQTtJQUNqRSxN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QUMsQ0FBQTtTQUNIO1FBQ0QsT0FBTTtLQUNQO0FBQ0gsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCAqIGFzIFVQSSBmcm9tICdhdG9tLWhhc2tlbGwtdXBpJ1xuaW1wb3J0ICogYXMgQ1AgZnJvbSAnY2hpbGRfcHJvY2VzcydcbmltcG9ydCAqIGFzIEF0b20gZnJvbSAnYXRvbSdcbmltcG9ydCAqIGFzIFBhdGggZnJvbSAncGF0aCdcbmltcG9ydCB7IGhpZ2hsaWdodENvZGUgfSBmcm9tICcuL2hpZ2hsaWdodCdcblxuZXhwb3J0IHsgY29uZmlnIH0gZnJvbSAnLi9jb25maWcnXG5cbmV4cG9ydCBmdW5jdGlvbiBhY3RpdmF0ZShfc3RhdGU6IG5ldmVyKSB7fVxuXG5leHBvcnQgZnVuY3Rpb24gZGVhY3RpdmF0ZSgpIHt9XG5cbmV4cG9ydCBmdW5jdGlvbiBwcm92aWRlVVBJKCk6IFVQSS5JUmVnaXN0cmF0aW9uT3B0aW9ucyB7XG4gIHJldHVybiB7XG4gICAgbmFtZTogJ2lkZS1oYXNrZWxsLWhsaW50JyxcbiAgICBtZXNzYWdlVHlwZXM6IHtcbiAgICAgIGxpbnQ6IHtcbiAgICAgICAgYXV0b1Njcm9sbDogdHJ1ZSxcbiAgICAgICAgdXJpRmlsdGVyOiB0cnVlLFxuICAgICAgfSxcbiAgICB9LFxuICAgIGV2ZW50czoge1xuICAgICAgb25EaWRTYXZlQnVmZmVyOiAoYnVmKSA9PiBjaGVja0ZpbGUoYnVmLCB0cnVlKSBhcyBhbnksXG4gICAgfSxcbiAgfVxufVxuXG50eXBlIEhMaW50UmVzdWx0ID0gUmVhZG9ubHlBcnJheTxITGludFJlc3VsdEl0ZW0+XG5cbmludGVyZmFjZSBITGludFJlc3VsdEl0ZW0ge1xuICBtb2R1bGU6IHN0cmluZ1tdXG4gIGRlY2w6IHN0cmluZ1tdXG4gIHNldmVyaXR5OiBzdHJpbmdcbiAgaGludDogc3RyaW5nXG4gIGZpbGU6IHN0cmluZ1xuICBzdGFydExpbmU6IG51bWJlclxuICBzdGFydENvbHVtbjogbnVtYmVyXG4gIGVuZExpbmU6IG51bWJlclxuICBlbmRDb2x1bW46IG51bWJlclxuICBmcm9tOiBzdHJpbmdcbiAgdG8/OiBzdHJpbmdcbiAgbm90ZTogc3RyaW5nW11cbn1cblxuYXN5bmMgZnVuY3Rpb24gY2hlY2tGaWxlKFxuICBidWY6IEF0b20uVGV4dEJ1ZmZlcixcbiAgYWxsID0gZmFsc2UsXG4pOiBQcm9taXNlPHVuZGVmaW5lZCB8IFVQSS5JUmVzdWx0SXRlbVtdPiB7XG4gIGNvbnN0IGJ1ZnBhdGggPSBidWYuZ2V0UGF0aCgpXG4gIGlmICghYnVmcGF0aCkgcmV0dXJuXG4gIGNvbnN0IHJvb3RwYXRoID0gYXRvbS5wcm9qZWN0XG4gICAgLmdldERpcmVjdG9yaWVzKClcbiAgICAuZmluZCgoZCkgPT4gZC5jb250YWlucyhidWZwYXRoKSlcbiAgY29uc3QgY3dkID0gcm9vdHBhdGggPyByb290cGF0aC5nZXRQYXRoKCkgOiBQYXRoLmRpcm5hbWUoYnVmcGF0aClcbiAgY29uc3QgcGF0aCA9IGFsbCA/IGN3ZCA6IGJ1ZnBhdGhcbiAgdHJ5IHtcbiAgICBjb25zdCByZXMgPSBhd2FpdCBuZXcgUHJvbWlzZTxITGludFJlc3VsdD4oKHJlc29sdmUsIHJlamVjdCkgPT4ge1xuICAgICAgQ1AuZXhlY0ZpbGUoXG4gICAgICAgICdobGludCcsXG4gICAgICAgIFsnLS1qc29uJywgJy0tY3Jvc3MnLCAnLS0nLCBwYXRoXSxcbiAgICAgICAge1xuICAgICAgICAgIGVuY29kaW5nOiAndXRmLTgnLFxuICAgICAgICAgIGN3ZCxcbiAgICAgICAgICBtYXhCdWZmZXI6IEluZmluaXR5LFxuICAgICAgICB9LFxuICAgICAgICAoZXJyb3IsIHJlc3VsdCkgPT4ge1xuICAgICAgICAgIGlmIChlcnJvciAmJiByZXN1bHQgPT09IHVuZGVmaW5lZCkgcmVqZWN0KGVycm9yKVxuICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgICAgcmVzb2x2ZShKU09OLnBhcnNlKHJlc3VsdCBhcyBzdHJpbmcpKVxuICAgICAgICAgICAgfSBjYXRjaCAoZSkge1xuICAgICAgICAgICAgICByZWplY3QoZXJyb3IpXG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICB9LFxuICAgICAgKVxuICAgIH0pXG4gICAgY29uc29sZS5sb2cocmVzKVxuICAgIHJldHVybiBQcm9taXNlLmFsbChcbiAgICAgIHJlcy5tYXAoYXN5bmMgKGhyKSA9PiAoe1xuICAgICAgICB1cmk6IFBhdGgubm9ybWFsaXplKGhyLmZpbGUpLFxuICAgICAgICBwb3NpdGlvbjogeyByb3c6IGhyLnN0YXJ0TGluZSAtIDEsIGNvbHVtbjogaHIuc3RhcnRDb2x1bW4gLSAxIH0sXG4gICAgICAgIG1lc3NhZ2U6IHtcbiAgICAgICAgICBodG1sOlxuICAgICAgICAgICAgYDxwPiR7aHIuaGludH08L3A+PHA+Rm91bmQ6PHByZT4ke2F3YWl0IGhpZ2hsaWdodENvZGUoXG4gICAgICAgICAgICAgIGhyLmZyb20sXG4gICAgICAgICAgICAgICdzb3VyY2UuaGFza2VsbCcsXG4gICAgICAgICAgICApfTwvcHJlPjwvcD5gICtcbiAgICAgICAgICAgIChoci50b1xuICAgICAgICAgICAgICA/IGA8cD5XaHkgbm90OjxwcmU+JHthd2FpdCBoaWdobGlnaHRDb2RlKFxuICAgICAgICAgICAgICAgICAgaHIudG8sXG4gICAgICAgICAgICAgICAgICAnc291cmNlLmhhc2tlbGwnLFxuICAgICAgICAgICAgICAgICl9PC9wcmU+PC9wPmBcbiAgICAgICAgICAgICAgOiAnJykgK1xuICAgICAgICAgICAgKGhyLm5vdGUubGVuZ3RoID8gYDxwPk5vdGU6ICR7aHIubm90ZS5qb2luKCc8YnI+Jyl9PC9wPmAgOiAnJyksXG4gICAgICAgIH0sXG4gICAgICAgIHNldmVyaXR5OiAnbGludCcsXG4gICAgICAgIGNvbnRleHQ6IGhyLnNldmVyaXR5LFxuICAgICAgfSkpLFxuICAgIClcbiAgfSBjYXRjaCAoZSkge1xuICAgIGNvbnNvbGUud2FybihlKVxuICAgIGlmIChhbGwpIHtcbiAgICAgIHRyeSB7XG4gICAgICAgIHJldHVybiBhd2FpdCBjaGVja0ZpbGUoYnVmLCBmYWxzZSlcbiAgICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgICAgY29uc29sZS53YXJuKGUpXG4gICAgICAgIGF0b20ubm90aWZpY2F0aW9ucy5hZGRFcnJvcihlLnRvU3RyaW5nKCksIHtcbiAgICAgICAgICBkZXRhaWw6IGUubWVzc2FnZSxcbiAgICAgICAgICBkaXNtaXNzYWJsZTogdHJ1ZSxcbiAgICAgICAgfSlcbiAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgYXRvbS5ub3RpZmljYXRpb25zLmFkZEVycm9yKGUudG9TdHJpbmcoKSwge1xuICAgICAgICBkZXRhaWw6IGUubWVzc2FnZSxcbiAgICAgICAgZGlzbWlzc2FibGU6IHRydWUsXG4gICAgICB9KVxuICAgIH1cbiAgICByZXR1cm5cbiAgfVxufVxuIl19