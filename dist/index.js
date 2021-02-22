"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.nodeMods = exports.icfg = exports.resolveMap = void 0;
const chalk_1 = __importDefault(require("chalk"));
const path_1 = __importDefault(require("path"));
exports.nodeMods = [];
exports.default = (ifcfg) => ({
    name: "ImportCjsFilter",
    enforce: "pre",
    apply: "serve",
    config(cfg) {
        var _a, _b;
        let alias = {};
        if (ifcfg != undefined) {
            exports.icfg = ifcfg;
            if ((ifcfg === null || ifcfg === void 0 ? void 0 : ifcfg.force) == true) {
                console.log(chalk_1.default.cyan("[ImportCjsFilter]"), "Force Mode");
            }
            if ((ifcfg === null || ifcfg === void 0 ? void 0 : ifcfg.include) != undefined && ((ifcfg === null || ifcfg === void 0 ? void 0 : ifcfg.include) == "dev" || ((_a = ifcfg === null || ifcfg === void 0 ? void 0 : ifcfg.include) === null || _a === void 0 ? void 0 : _a.includes("dev"))))
                for (const i in require(path_1.default.resolve(process.cwd(), "package.json")).devDependencies) {
                    alias[i] = "__vite-browser-external:" + i;
                    console.log(chalk_1.default.cyan("[ImportCjsFilter]"), "Linked", i, "->", "__vite-browser-external:" + i);
                }
            if (ifcfg.include instanceof Array) {
                let oo = ifcfg.include.filter(v => v != "dev");
                if (oo != undefined && oo.length >= 1) {
                    for (const i in oo) {
                        alias[i] = "__vite-browser-external:" + i;
                        console.log(chalk_1.default.cyan("[ImportCjsFilter]"), "Linked", i, "->", "__vite-browser-external:" + i);
                    }
                }
            }
            if ((ifcfg === null || ifcfg === void 0 ? void 0 : ifcfg.exclude) != undefined && (ifcfg === null || ifcfg === void 0 ? void 0 : ifcfg.exclude) instanceof Array) {
                for (const k of ifcfg === null || ifcfg === void 0 ? void 0 : ifcfg.exclude) {
                    delete alias[k];
                    console.log(chalk_1.default.cyan("[ImportCjsFilter]"), "Exclude:", k);
                }
            }
        }
        cfg.resolve = (_b = cfg.resolve) !== null && _b !== void 0 ? _b : { alias: {} };
        cfg.resolve.alias = { ...cfg.resolve.alias, ...alias };
        exports.resolveMap = cfg.resolve.alias;
        return cfg;
    },
    transform(_, id) {
        var _a, _b, _c, _d, _e;
        if (/^__vite-browser-external:(.*)$/.test(id)) {
            console.log(chalk_1.default.cyan("[ImportCjsFilter]"), " Resolving... ");
            let d = id.match(/^__vite-browser-external:(?<name>.*)$/);
            if (((_a = d === null || d === void 0 ? void 0 : d.groups) === null || _a === void 0 ? void 0 : _a.name) != undefined && (Object.keys(exports.resolveMap).includes((_b = d === null || d === void 0 ? void 0 : d.groups) === null || _b === void 0 ? void 0 : _b.name) || (exports.icfg === null || exports.icfg === void 0 ? void 0 : exports.icfg.force) == true)) {
                let res = undefined;
                try {
                    res = require.resolve((_c = d === null || d === void 0 ? void 0 : d.groups) === null || _c === void 0 ? void 0 : _c.name);
                }
                catch (e) {
                    console.log(chalk_1.default.cyan("[ImportCjsFilter]"), chalk_1.default.red("Failed"), e);
                }
                if (res == undefined) {
                    console.error(chalk_1.default.cyan("[ImportCjsFilter]"), chalk_1.default.red("Failed"));
                }
                console.log(chalk_1.default.cyan("[ImportCjsFilter]"), "Resolved:", ((_d = d === null || d === void 0 ? void 0 : d.groups) === null || _d === void 0 ? void 0 : _d.name) + "\n");
                return {
                    code: "const __esModule = false; export {__esModule}; const o = globalThis.require('" + ((_e = d === null || d === void 0 ? void 0 : d.groups) === null || _e === void 0 ? void 0 : _e.name) + "'); export {o as default};",
                    map: null
                };
            }
            console.error(chalk_1.default.cyan("[ImportCjsFilter]"), chalk_1.default.red("Failed"));
        }
    }
});
