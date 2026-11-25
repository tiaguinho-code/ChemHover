"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __commonJS = (cb, mod) => function __require() {
  try {
    return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
  } catch (e) {
    throw mod = 0, e;
  }
};
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);
var __publicField = (obj, key, value) => __defNormalProp(obj, typeof key !== "symbol" ? key + "" : key, value);

// node_modules/@rdkit/rdkit/dist/RDKit_minimal.js
var require_RDKit_minimal = __commonJS({
  "node_modules/@rdkit/rdkit/dist/RDKit_minimal.js"(exports, module2) {
    var initRDKitModule2 = (() => {
      var _scriptName = globalThis.document?.currentScript?.src;
      return async function(moduleArg = {}) {
        var Module = moduleArg;
        var ENVIRONMENT_IS_WEB = !!globalThis.window;
        var ENVIRONMENT_IS_WORKER = !!globalThis.WorkerGlobalScope;
        var ENVIRONMENT_IS_NODE = globalThis.process?.versions?.node && globalThis.process?.type != "renderer";
        var thisProgram = "./this.program";
        if (typeof __filename !== "undefined") _scriptName = __filename;
        else if (ENVIRONMENT_IS_WORKER) _scriptName = self.location.href;
        var scriptDirectory = "";
        function locateFile(path) {
          if (Module["locateFile"]) return Module["locateFile"](path, scriptDirectory);
          return scriptDirectory + path;
        }
        var readAsync, readBinary;
        if (ENVIRONMENT_IS_NODE) {
          var fs = require("node:fs");
          scriptDirectory = __dirname + "/";
          readBinary = (filename) => {
            filename = isFileURI(filename) ? new URL(filename) : filename;
            var ret = fs.readFileSync(filename);
            return ret;
          };
          readAsync = async (filename, binary = true) => {
            filename = isFileURI(filename) ? new URL(filename) : filename;
            var ret = fs.readFileSync(filename, binary ? void 0 : "utf8");
            return ret;
          };
          if (process.argv.length > 1) thisProgram = process.argv[1].replace(/\\/g, "/");
          process.argv.slice(2);
          0;
        } else if (ENVIRONMENT_IS_WEB || ENVIRONMENT_IS_WORKER) {
          try {
            scriptDirectory = new URL(".", _scriptName).href;
          } catch {
          }
          if (ENVIRONMENT_IS_WORKER) readBinary = (url) => {
            var xhr = new XMLHttpRequest();
            xhr.open("GET", url, false);
            xhr.responseType = "arraybuffer";
            xhr.send(null);
            return new Uint8Array(xhr.response);
          };
          readAsync = async (url) => {
            if (isFileURI(url)) return new Promise((resolve, reject) => {
              var xhr = new XMLHttpRequest();
              xhr.open("GET", url, true);
              xhr.responseType = "arraybuffer";
              xhr.onload = () => {
                if (xhr.status == 200 || xhr.status == 0 && xhr.response) {
                  resolve(xhr.response);
                  return;
                }
                reject(xhr.status);
              };
              xhr.onerror = reject;
              xhr.send(null);
            });
            var response = await fetch(url, { credentials: "same-origin" });
            if (response.ok) return response.arrayBuffer();
            throw new Error(response.status + " : " + response.url);
          };
        }
        var out = console.log.bind(console);
        var err = console.error.bind(console);
        var ABORT = false;
        var isFileURI = (filename) => filename.startsWith("file://");
        function writeStackCookie() {
          let max = _emscripten_stack_get_end();
          if (max == 0) max += 4;
          HEAPU32[max >>> 2 >>> 0] = 34821223;
          HEAPU32[max + 4 >>> 2 >>> 0] = 2310721022;
          HEAPU32[0] = 1668509029;
        }
        function u32ToHexString(num) {
          return "0x" + (num >>> 0).toString(16).padStart(8, "0");
        }
        function checkStackCookie() {
          if (ABORT) return;
          let max = _emscripten_stack_get_end();
          if (max == 0) max += 4;
          const val1 = HEAPU32[max >>> 2 >>> 0];
          const val2 = HEAPU32[max + 4 >>> 2 >>> 0];
          if (val1 != 34821223 || val2 != 2310721022) abort(`Stack overflow! Stack cookie has been overwritten at ${ptrToString(max)}, expected hex dwords ${u32ToHexString(2310721022)} and ${u32ToHexString(34821223)}, but received ${u32ToHexString(val2)} ${u32ToHexString(val1)}`);
          if (HEAPU32[0] != 1668509029) abort("Runtime error: The application has corrupted its heap memory area (address zero)!");
        }
        var runtimeInitialized = false;
        function getMemoryBuffer() {
          return wasmMemory.buffer;
        }
        function updateMemoryViews() {
          if (HEAP8?.buffer?.resizable) return;
          var b = getMemoryBuffer();
          HEAP8 = new Int8Array(b);
          HEAP16 = new Int16Array(b);
          HEAPU8 = new Uint8Array(b);
          HEAPU16 = new Uint16Array(b);
          HEAP32 = new Int32Array(b);
          HEAPU32 = new Uint32Array(b);
          HEAPF32 = new Float32Array(b);
          HEAPF64 = new Float64Array(b);
          HEAP64 = new BigInt64Array(b);
          HEAPU64 = new BigUint64Array(b);
        }
        function preRun() {
          var preRun2 = Module["preRun"];
          if (preRun2) {
            if (typeof preRun2 === "function") preRun2 = [preRun2];
            onPreRuns.push(...preRun2);
          }
          callRuntimeCallbacks(onPreRuns);
        }
        function initRuntime() {
          runtimeInitialized = true;
          checkStackCookie();
          if (!Module["noFSInit"] && !FS.initialized) FS.init();
          TTY.init();
          wasmExports["Y"]();
          FS.ignorePermissions = false;
          checkStackCookie();
        }
        function postRun() {
          checkStackCookie();
          var postRun2 = Module["postRun"];
          if (postRun2) {
            if (typeof postRun2 === "function") postRun2 = [postRun2];
            onPostRuns.push(...postRun2);
          }
          callRuntimeCallbacks(onPostRuns);
        }
        function abort(what) {
          Module["onAbort"]?.(what);
          what = `Aborted(${what})`;
          err(what);
          ABORT = true;
          what += ". Build with -sASSERTIONS for more info.";
          if (runtimeInitialized) ___trap();
          throw new WebAssembly.RuntimeError(what);
        }
        var wasmBinaryFile;
        function findWasmBinary() {
          return locateFile("RDKit_minimal.wasm");
        }
        function getBinarySync(file) {
          if (readBinary) return readBinary(file);
          throw "both async and sync fetching of the wasm failed";
        }
        async function getWasmBinary(binaryFile) {
          if (true) try {
            var response = await readAsync(binaryFile);
            return new Uint8Array(response);
          } catch {
          }
          return getBinarySync(binaryFile);
        }
        async function instantiateArrayBuffer(binaryFile, imports) {
          try {
            var binary = await getWasmBinary(binaryFile);
            var instance = await WebAssembly.instantiate(binary, imports);
            return instance;
          } catch (reason) {
            err(`failed to asynchronously prepare wasm: ${reason}`);
            abort(reason);
          }
        }
        async function instantiateAsync(binary, binaryFile, imports) {
          if (!binary && !isFileURI(binaryFile) && !ENVIRONMENT_IS_NODE) try {
            var response = fetch(binaryFile, { credentials: "same-origin" });
            var instantiationResult = await WebAssembly.instantiateStreaming(response, imports);
            return instantiationResult;
          } catch (reason) {
            err(`wasm streaming compile failed: ${reason}`);
            err("falling back to ArrayBuffer instantiation");
          }
          return instantiateArrayBuffer(binaryFile, imports);
        }
        function getWasmImports() {
          var imports = { a: wasmImports };
          return imports;
        }
        var HEAP32;
        var HEAP8;
        var HEAPU32;
        var callRuntimeCallbacks = (callbacks) => {
          while (callbacks.length > 0) callbacks.shift()(Module);
        };
        var onPostRuns = [];
        var onPreRuns = [];
        function ptrToString(ptr) {
          ptr >>>= 0;
          return "0x" + ptr.toString(16).padStart(8, "0");
        }
        var syscallGetVarargI = () => {
          var ret = HEAP32[+SYSCALLS.varargs >>> 2 >>> 0];
          SYSCALLS.varargs += 4;
          return ret;
        };
        var syscallGetVarargP = syscallGetVarargI;
        var PATH = { isAbs: (path) => path.charAt(0) === "/", splitPath: (filename) => /^(\/?|)([\s\S]*?)((?:\.{1,2}|[^\/]+?|)(\.[^.\/]*|))(?:[\/]*)$/.exec(filename).slice(1), normalizeArray: (parts, allowAboveRoot) => {
          var up = 0;
          for (var i = parts.length - 1; i >= 0; i--) {
            var last = parts[i];
            if (last === ".") parts.splice(i, 1);
            else if (last === "..") {
              parts.splice(i, 1);
              up++;
            } else if (up) {
              parts.splice(i, 1);
              up--;
            }
          }
          if (allowAboveRoot) for (; up; up--) parts.unshift("..");
          return parts;
        }, normalize: (path) => {
          var isAbsolute = PATH.isAbs(path), trailingSlash = path.slice(-1) === "/";
          path = PATH.normalizeArray(path.split("/").filter((p) => !!p), !isAbsolute).join("/");
          if (!path && !isAbsolute) path = ".";
          if (path && trailingSlash) path += "/";
          return (isAbsolute ? "/" : "") + path;
        }, dirname: (path) => {
          var result = PATH.splitPath(path), root = result[0], dir = result[1];
          if (!root && !dir) return ".";
          if (dir) dir = dir.slice(0, -1);
          return root + dir;
        }, basename: (path) => path && path.match(/([^\/]+|\/)\/*$/)[1], join: (...paths) => PATH.normalize(paths.join("/")), join2: (l, r) => PATH.normalize(l + "/" + r) };
        var initRandomFill = () => {
          if (ENVIRONMENT_IS_NODE) {
            var nodeCrypto = require("node:crypto");
            return (view) => (nodeCrypto.randomFillSync(view), 0);
          }
          return (view) => (crypto.getRandomValues(view), 0);
        };
        var randomFill = (view) => (randomFill = initRandomFill())(view);
        var PATH_FS = { resolve: (...args) => {
          var resolvedPath = "", resolvedAbsolute = false;
          for (var i = args.length - 1; i >= -1 && !resolvedAbsolute; i--) {
            var path = i >= 0 ? args[i] : FS.cwd();
            if (typeof path !== "string") throw new TypeError("Arguments to path.resolve must be strings");
            else if (!path) return "";
            resolvedPath = path + "/" + resolvedPath;
            resolvedAbsolute = PATH.isAbs(path);
          }
          resolvedPath = PATH.normalizeArray(resolvedPath.split("/").filter((p) => !!p), !resolvedAbsolute).join("/");
          return (resolvedAbsolute ? "/" : "") + resolvedPath || ".";
        }, relative: (from, to) => {
          from = PATH_FS.resolve(from).slice(1);
          to = PATH_FS.resolve(to).slice(1);
          function trim(arr) {
            var start = 0;
            for (; start < arr.length; start++) if (arr[start] !== "") break;
            var end = arr.length - 1;
            for (; end >= 0; end--) if (arr[end] !== "") break;
            if (start > end) return [];
            return arr.slice(start, end - start + 1);
          }
          var fromParts = trim(from.split("/"));
          var toParts = trim(to.split("/"));
          var length = Math.min(fromParts.length, toParts.length);
          var samePartsLength = length;
          for (var i = 0; i < length; i++) if (fromParts[i] !== toParts[i]) {
            samePartsLength = i;
            break;
          }
          var outputParts = [];
          for (i = samePartsLength; i < fromParts.length; i++) outputParts.push("..");
          outputParts = outputParts.concat(toParts.slice(samePartsLength));
          return outputParts.join("/");
        } };
        var UTF8Decoder = globalThis.TextDecoder && new TextDecoder();
        var findStringEnd = (heapOrArray, idx, maxBytesToRead, ignoreNul) => {
          var maxIdx = idx + maxBytesToRead;
          if (ignoreNul) return maxIdx;
          while (heapOrArray[idx] && !(idx >= maxIdx)) ++idx;
          return idx;
        };
        var UTF8ArrayToString = (heapOrArray, idx = 0, maxBytesToRead, ignoreNul) => {
          idx >>>= 0;
          var endPtr = findStringEnd(heapOrArray, idx, maxBytesToRead, ignoreNul);
          if (endPtr - idx > 16 && heapOrArray.buffer && UTF8Decoder) return UTF8Decoder.decode(heapOrArray.subarray(idx, endPtr));
          var str = "";
          while (idx < endPtr) {
            var u0 = heapOrArray[idx++];
            if (!(u0 & 128)) {
              str += String.fromCharCode(u0);
              continue;
            }
            var u1 = heapOrArray[idx++] & 63;
            if ((u0 & 224) == 192) {
              str += String.fromCharCode((u0 & 31) << 6 | u1);
              continue;
            }
            var u2 = heapOrArray[idx++] & 63;
            if ((u0 & 240) == 224) u0 = (u0 & 15) << 12 | u1 << 6 | u2;
            else u0 = (u0 & 7) << 18 | u1 << 12 | u2 << 6 | heapOrArray[idx++] & 63;
            if (u0 < 65536) str += String.fromCharCode(u0);
            else {
              var ch = u0 - 65536;
              str += String.fromCharCode(55296 | ch >> 10, 56320 | ch & 1023);
            }
          }
          return str;
        };
        var FS_stdin_getChar_buffer = [];
        var lengthBytesUTF8 = (str) => {
          var len = 0;
          for (var i = 0; i < str.length; ++i) {
            var c = str.charCodeAt(i);
            if (c <= 127) len++;
            else if (c <= 2047) len += 2;
            else if (c >= 55296 && c <= 57343) {
              len += 4;
              ++i;
            } else len += 3;
          }
          return len;
        };
        var stringToUTF8Array = (str, heap, outIdx, maxBytesToWrite) => {
          outIdx >>>= 0;
          if (!(maxBytesToWrite > 0)) return 0;
          var startIdx = outIdx;
          var endIdx = outIdx + maxBytesToWrite - 1;
          for (var i = 0; i < str.length; ++i) {
            var u = str.codePointAt(i);
            if (u <= 127) {
              if (outIdx >= endIdx) break;
              heap[outIdx++ >>> 0] = u;
            } else if (u <= 2047) {
              if (outIdx + 1 >= endIdx) break;
              heap[outIdx++ >>> 0] = 192 | u >> 6;
              heap[outIdx++ >>> 0] = 128 | u & 63;
            } else if (u <= 65535) {
              if (outIdx + 2 >= endIdx) break;
              heap[outIdx++ >>> 0] = 224 | u >> 12;
              heap[outIdx++ >>> 0] = 128 | u >> 6 & 63;
              heap[outIdx++ >>> 0] = 128 | u & 63;
            } else {
              if (outIdx + 3 >= endIdx) break;
              heap[outIdx++ >>> 0] = 240 | u >> 18;
              heap[outIdx++ >>> 0] = 128 | u >> 12 & 63;
              heap[outIdx++ >>> 0] = 128 | u >> 6 & 63;
              heap[outIdx++ >>> 0] = 128 | u & 63;
              i++;
            }
          }
          heap[outIdx >>> 0] = 0;
          return outIdx - startIdx;
        };
        var intArrayFromString = (stringy, dontAddNull, length) => {
          var len = length > 0 ? length : lengthBytesUTF8(stringy) + 1;
          var u8array = new Array(len);
          var numBytesWritten = stringToUTF8Array(stringy, u8array, 0, u8array.length);
          if (dontAddNull) u8array.length = numBytesWritten;
          return u8array;
        };
        var FS_stdin_getChar = () => {
          if (!FS_stdin_getChar_buffer.length) {
            var result = null;
            if (ENVIRONMENT_IS_NODE) {
              var buf = Buffer.alloc(256);
              var bytesRead = 0;
              try {
                bytesRead = fs.readSync(process.stdin.fd, buf, 0, 256);
              } catch (e) {
                if (e.toString().includes("EOF")) bytesRead = 0;
                else throw e;
              }
              if (bytesRead > 0) result = buf.toString("utf-8", 0, bytesRead);
            } else if (globalThis.window?.prompt) {
              result = window.prompt("Input: ");
              if (result !== null) result += "\n";
            }
            if (!result) return null;
            FS_stdin_getChar_buffer = intArrayFromString(result, true);
          }
          return FS_stdin_getChar_buffer.shift();
        };
        var TTY = { ttys: [], init() {
        }, shutdown() {
        }, register(dev, ops) {
          TTY.ttys[dev] = { input: [], output: [], ops };
          FS.registerDevice(dev, TTY.stream_ops);
        }, stream_ops: { open(stream) {
          var tty = TTY.ttys[stream.node.rdev];
          if (!tty) throw new FS.ErrnoError(43);
          stream.tty = tty;
          stream.seekable = false;
        }, close(stream) {
          stream.tty.ops.fsync(stream.tty);
        }, fsync(stream) {
          stream.tty.ops.fsync(stream.tty);
        }, read(stream, buffer, offset, length, pos) {
          if (!stream.tty || !stream.tty.ops.get_char) throw new FS.ErrnoError(60);
          var bytesRead = 0;
          for (var i = 0; i < length; i++) {
            var result;
            try {
              result = stream.tty.ops.get_char(stream.tty);
            } catch (e) {
              throw new FS.ErrnoError(29);
            }
            if (result === void 0 && !bytesRead) throw new FS.ErrnoError(6);
            if (result === null || result === void 0) break;
            bytesRead++;
            buffer[offset + i] = result;
            if (result === 10) break;
          }
          if (bytesRead) stream.node.atime = Date.now();
          return bytesRead;
        }, write(stream, buffer, offset, length, pos) {
          if (!stream.tty || !stream.tty.ops.put_char) throw new FS.ErrnoError(60);
          try {
            for (var i = 0; i < length; i++) stream.tty.ops.put_char(stream.tty, buffer[offset + i]);
          } catch (e) {
            throw new FS.ErrnoError(29);
          }
          if (length) stream.node.mtime = stream.node.ctime = Date.now();
          return i;
        } }, default_tty_ops: { get_char(tty) {
          return FS_stdin_getChar();
        }, put_char(tty, val) {
          if (val === null || val === 10) {
            out(UTF8ArrayToString(tty.output));
            tty.output = [];
          } else if (val != 0) tty.output.push(val);
        }, fsync(tty) {
          if (tty.output?.length > 0) {
            out(UTF8ArrayToString(tty.output));
            tty.output = [];
          }
        }, ioctl_tcgets(tty) {
          return { c_iflag: 25856, c_oflag: 5, c_cflag: 191, c_lflag: 35387, c_cc: [3, 28, 127, 21, 4, 0, 1, 0, 17, 19, 26, 0, 18, 15, 23, 22, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0] };
        }, ioctl_tcsets(tty, optional_actions, data) {
          return 0;
        }, ioctl_tiocgwinsz(tty) {
          return [24, 80];
        } }, default_tty1_ops: { put_char(tty, val) {
          if (val === null || val === 10) {
            err(UTF8ArrayToString(tty.output));
            tty.output = [];
          } else if (val != 0) tty.output.push(val);
        }, fsync(tty) {
          if (tty.output?.length > 0) {
            err(UTF8ArrayToString(tty.output));
            tty.output = [];
          }
        } } };
        var HEAPU8;
        var zeroMemory = (ptr, size) => HEAPU8.fill(0, ptr, ptr + size);
        var alignMemory = (size, alignment) => Math.ceil(size / alignment) * alignment;
        var mmapAlloc = (size) => {
          size = alignMemory(size, 65536);
          var ptr = _emscripten_builtin_memalign(65536, size);
          if (ptr) zeroMemory(ptr, size);
          return ptr;
        };
        var MEMFS = { ops_table: null, mount(mount) {
          return MEMFS.createNode(null, "/", 16895, 0);
        }, createNode(parent, name, mode, dev) {
          if (FS.isBlkdev(mode) || FS.isFIFO(mode)) throw new FS.ErrnoError(63);
          MEMFS.ops_table || (MEMFS.ops_table = { dir: { node: { getattr: MEMFS.node_ops.getattr, setattr: MEMFS.node_ops.setattr, lookup: MEMFS.node_ops.lookup, mknod: MEMFS.node_ops.mknod, rename: MEMFS.node_ops.rename, unlink: MEMFS.node_ops.unlink, rmdir: MEMFS.node_ops.rmdir, readdir: MEMFS.node_ops.readdir, symlink: MEMFS.node_ops.symlink }, stream: { llseek: MEMFS.stream_ops.llseek } }, file: { node: { getattr: MEMFS.node_ops.getattr, setattr: MEMFS.node_ops.setattr }, stream: { llseek: MEMFS.stream_ops.llseek, read: MEMFS.stream_ops.read, write: MEMFS.stream_ops.write, mmap: MEMFS.stream_ops.mmap, msync: MEMFS.stream_ops.msync } }, link: { node: { getattr: MEMFS.node_ops.getattr, setattr: MEMFS.node_ops.setattr, readlink: MEMFS.node_ops.readlink }, stream: {} }, chrdev: { node: { getattr: MEMFS.node_ops.getattr, setattr: MEMFS.node_ops.setattr }, stream: FS.chrdev_stream_ops } });
          var node = FS.createNode(parent, name, mode, dev);
          if (FS.isDir(node.mode)) {
            node.node_ops = MEMFS.ops_table.dir.node;
            node.stream_ops = MEMFS.ops_table.dir.stream;
            node.contents = {};
          } else if (FS.isFile(node.mode)) {
            node.node_ops = MEMFS.ops_table.file.node;
            node.stream_ops = MEMFS.ops_table.file.stream;
            node.usedBytes = 0;
            node.contents = MEMFS.emptyFileContents ?? (MEMFS.emptyFileContents = new Uint8Array(0));
          } else if (FS.isLink(node.mode)) {
            node.node_ops = MEMFS.ops_table.link.node;
            node.stream_ops = MEMFS.ops_table.link.stream;
          } else if (FS.isChrdev(node.mode)) {
            node.node_ops = MEMFS.ops_table.chrdev.node;
            node.stream_ops = MEMFS.ops_table.chrdev.stream;
          }
          node.atime = node.mtime = node.ctime = Date.now();
          if (parent) {
            parent.contents[name] = node;
            parent.atime = parent.mtime = parent.ctime = node.atime;
          }
          return node;
        }, getFileDataAsTypedArray(node) {
          return node.contents.subarray(0, node.usedBytes);
        }, expandFileStorage(node, newCapacity) {
          var prevCapacity = node.contents.length;
          if (prevCapacity >= newCapacity) return;
          newCapacity = Math.max(newCapacity, prevCapacity * (prevCapacity < 1048576 ? 2 : 1.125) >>> 0);
          if (prevCapacity) newCapacity = Math.max(newCapacity, 256);
          var oldContents = MEMFS.getFileDataAsTypedArray(node);
          node.contents = new Uint8Array(newCapacity);
          node.contents.set(oldContents);
        }, resizeFileStorage(node, newSize) {
          if (node.usedBytes == newSize) return;
          var oldContents = node.contents;
          node.contents = new Uint8Array(newSize);
          node.contents.set(oldContents.subarray(0, Math.min(newSize, node.usedBytes)));
          node.usedBytes = newSize;
        }, node_ops: { getattr(node) {
          var attr = {};
          attr.dev = FS.isChrdev(node.mode) ? node.id : 1;
          attr.ino = node.id;
          attr.mode = node.mode;
          attr.nlink = 1;
          attr.uid = 0;
          attr.gid = 0;
          attr.rdev = node.rdev;
          if (FS.isDir(node.mode)) attr.size = 4096;
          else if (FS.isFile(node.mode)) attr.size = node.usedBytes;
          else if (FS.isLink(node.mode)) attr.size = node.link.length;
          else attr.size = 0;
          attr.atime = new Date(node.atime);
          attr.mtime = new Date(node.mtime);
          attr.ctime = new Date(node.ctime);
          attr.blksize = 4096;
          attr.blocks = Math.ceil(attr.size / attr.blksize);
          return attr;
        }, setattr(node, attr) {
          for (const key of ["mode", "atime", "mtime", "ctime"]) if (attr[key] != null) node[key] = attr[key];
          if (attr.size !== void 0) MEMFS.resizeFileStorage(node, attr.size);
        }, lookup(parent, name) {
          if (!MEMFS.doesNotExistError) {
            MEMFS.doesNotExistError = new FS.ErrnoError(44);
            MEMFS.doesNotExistError.stack = "<generic error, no stack>";
          }
          throw MEMFS.doesNotExistError;
        }, mknod(parent, name, mode, dev) {
          return MEMFS.createNode(parent, name, mode, dev);
        }, rename(old_node, new_dir, new_name) {
          var new_node;
          try {
            new_node = FS.lookupNode(new_dir, new_name);
          } catch (e) {
          }
          if (new_node && FS.isDir(old_node.mode)) for (var i in new_node.contents) throw new FS.ErrnoError(55);
          delete old_node.parent.contents[old_node.name];
          new_dir.contents[new_name] = old_node;
          old_node.name = new_name;
          new_dir.ctime = new_dir.mtime = old_node.parent.ctime = old_node.parent.mtime = Date.now();
        }, unlink(parent, name) {
          delete parent.contents[name];
          parent.ctime = parent.mtime = Date.now();
        }, rmdir(parent, name) {
          var node = FS.lookupNode(parent, name);
          for (var i in node.contents) throw new FS.ErrnoError(55);
          delete parent.contents[name];
          parent.ctime = parent.mtime = Date.now();
        }, readdir(node) {
          return [".", "..", ...Object.keys(node.contents)];
        }, symlink(parent, newname, oldpath) {
          var node = MEMFS.createNode(parent, newname, 41471, 0);
          node.link = oldpath;
          return node;
        }, readlink(node) {
          if (!FS.isLink(node.mode)) throw new FS.ErrnoError(28);
          return node.link;
        } }, stream_ops: { read(stream, buffer, offset, length, position) {
          var contents = stream.node.contents;
          if (position >= stream.node.usedBytes) return 0;
          var size = Math.min(stream.node.usedBytes - position, length);
          buffer.set(contents.subarray(position, position + size), offset);
          return size;
        }, write(stream, buffer, offset, length, position, canOwn) {
          if (buffer.buffer === HEAP8.buffer) canOwn = false;
          if (!length) return 0;
          var node = stream.node;
          node.mtime = node.ctime = Date.now();
          if (canOwn) {
            node.contents = buffer.subarray(offset, offset + length);
            node.usedBytes = length;
          } else if (!node.usedBytes && !position) {
            node.contents = buffer.slice(offset, offset + length);
            node.usedBytes = length;
          } else {
            MEMFS.expandFileStorage(node, position + length);
            node.contents.set(buffer.subarray(offset, offset + length), position);
            node.usedBytes = Math.max(node.usedBytes, position + length);
          }
          return length;
        }, llseek(stream, offset, whence) {
          var position = offset;
          if (whence === 1) position += stream.position;
          else if (whence === 2) {
            if (FS.isFile(stream.node.mode)) position += stream.node.usedBytes;
          }
          if (position < 0) throw new FS.ErrnoError(28);
          return position;
        }, mmap(stream, length, position, prot, flags) {
          if (!FS.isFile(stream.node.mode)) throw new FS.ErrnoError(43);
          var ptr;
          var allocated;
          var contents = stream.node.contents;
          if (!(flags & 2) && contents.buffer === HEAP8.buffer) {
            allocated = false;
            ptr = contents.byteOffset;
          } else {
            allocated = true;
            ptr = mmapAlloc(length);
            if (!ptr) throw new FS.ErrnoError(48);
            if (contents) {
              if (position > 0 || position + length < contents.length) if (contents.subarray) contents = contents.subarray(position, position + length);
              else contents = Array.prototype.slice.call(contents, position, position + length);
              HEAP8.set(contents, ptr >>> 0);
            }
          }
          return { ptr, allocated };
        }, msync(stream, buffer, offset, length, mmapFlags) {
          MEMFS.stream_ops.write(stream, buffer, 0, length, offset, false);
          return 0;
        } } };
        var FS_modeStringToFlags = (str) => {
          if (typeof str !== "string") return str;
          var flags = { r: 0, "r+": 2, w: 577, "w+": 578, a: 1089, "a+": 1090 }[str];
          if (typeof flags === "undefined") throw new Error(`Unknown file open mode: ${str}`);
          return flags;
        };
        var FS_fileDataToTypedArray = (data) => {
          if (typeof data === "string") data = intArrayFromString(data, true);
          if (!data.subarray) data = new Uint8Array(data);
          return data;
        };
        var FS_getMode = (canRead, canWrite) => {
          var mode = 0;
          if (canRead) mode |= 365;
          if (canWrite) mode |= 146;
          return mode;
        };
        var asyncLoad = async (url) => {
          var arrayBuffer = await readAsync(url);
          return new Uint8Array(arrayBuffer);
        };
        var FS_createDataFile = (...args) => FS.createDataFile(...args);
        var getUniqueRunDependency = (id) => id;
        var dependenciesPromise = null;
        var resolveRunDependencies = async () => dependenciesPromise;
        var runDependencies = 0;
        var dependenciesPromiseResolve = null;
        var removeRunDependency = () => {
          runDependencies--;
          Module["monitorRunDependencies"]?.(runDependencies);
          if (!runDependencies) dependenciesPromiseResolve();
        };
        var addRunDependency = () => {
          if (!runDependencies) dependenciesPromise = new Promise((resolve) => dependenciesPromiseResolve = resolve);
          runDependencies++;
          Module["monitorRunDependencies"]?.(runDependencies);
        };
        var preloadPlugins = [];
        var FS_handledByPreloadPlugin = async (byteArray, fullname) => {
          if (typeof Browser !== "undefined") Browser.init();
          for (var plugin of preloadPlugins) if (plugin["canHandle"](fullname)) return plugin["handle"](byteArray, fullname);
          return byteArray;
        };
        var FS_preloadFile = async (parent, name, url, canRead, canWrite, dontCreateFile, canOwn, preFinish) => {
          var fullname = name ? PATH_FS.resolve(PATH.join2(parent, name)) : parent;
          getUniqueRunDependency(`cp ${fullname}`);
          addRunDependency();
          try {
            var byteArray = url;
            if (typeof url === "string") byteArray = await asyncLoad(url);
            byteArray = await FS_handledByPreloadPlugin(byteArray, fullname);
            preFinish?.();
            if (!dontCreateFile) FS_createDataFile(parent, name, byteArray, canRead, canWrite, canOwn);
          } finally {
            removeRunDependency();
          }
        };
        var FS = { root: null, mounts: [], devices: {}, streams: [], nextInode: 1, nameTable: [], currentPath: "/", initialized: false, ignorePermissions: true, syncFSRequests: 0, ErrnoError: class {
          constructor(errno) {
            __publicField(this, "name", "ErrnoError");
            this.errno = errno;
          }
        }, FSStream: class {
          constructor() {
            __publicField(this, "shared", {});
          }
          get object() {
            return this.node;
          }
          set object(val) {
            this.node = val;
          }
          get isRead() {
            return (this.flags & 2097155) !== 1;
          }
          get isWrite() {
            return (this.flags & 2097155) !== 0;
          }
          get isAppend() {
            return this.flags & 1024;
          }
          get flags() {
            return this.shared.flags;
          }
          set flags(val) {
            this.shared.flags = val;
          }
          get position() {
            return this.shared.position;
          }
          set position(val) {
            this.shared.position = val;
          }
        }, FSNode: class {
          constructor(parent, name, mode, rdev) {
            __publicField(this, "node_ops", {});
            __publicField(this, "stream_ops", {});
            __publicField(this, "readMode", 365);
            __publicField(this, "writeMode", 146);
            __publicField(this, "mounted", null);
            if (!parent) parent = this;
            this.parent = parent;
            this.mount = parent.mount;
            this.id = FS.nextInode++;
            this.name = name;
            this.mode = mode;
            this.rdev = rdev;
            this.atime = this.mtime = this.ctime = Date.now();
          }
          get read() {
            return (this.mode & this.readMode) === this.readMode;
          }
          set read(val) {
            val ? this.mode |= this.readMode : this.mode &= ~this.readMode;
          }
          get write() {
            return (this.mode & this.writeMode) === this.writeMode;
          }
          set write(val) {
            val ? this.mode |= this.writeMode : this.mode &= ~this.writeMode;
          }
          get isFolder() {
            return FS.isDir(this.mode);
          }
          get isDevice() {
            return FS.isChrdev(this.mode);
          }
          addListener(cb, exclusive = false) {
            var entry = { cb, exclusive };
            var listeners = this.listeners ?? (this.listeners = /* @__PURE__ */ new Set());
            listeners.add(entry);
            return { listeners, entry };
          }
          notifyListeners(flags) {
            if (!this.listeners) return;
            var excl;
            for (var entry of this.listeners) if (entry.exclusive) (excl || (excl = [])).push(entry);
            else entry.cb(flags);
            if (excl) {
              var i = (this.exclTurn || 0) % excl.length;
              this.exclTurn = i + 1;
              excl[i].cb(flags);
            }
          }
        }, lookupPath(path, opts = {}) {
          if (!path) throw new FS.ErrnoError(44);
          opts.follow_mount ?? (opts.follow_mount = true);
          if (!PATH.isAbs(path)) path = FS.cwd() + "/" + path;
          linkloop: for (var nlinks = 0; nlinks < 40; nlinks++) {
            var parts = path.split("/").filter((p) => !!p);
            var current = FS.root;
            var current_path = "/";
            for (var i = 0; i < parts.length; i++) {
              var islast = i === parts.length - 1;
              if (islast && opts.parent) break;
              if (parts[i] === ".") continue;
              if (parts[i] === "..") {
                current_path = PATH.dirname(current_path);
                if (FS.isRoot(current)) {
                  path = current_path + "/" + parts.slice(i + 1).join("/");
                  nlinks--;
                  continue linkloop;
                } else current = current.parent;
                continue;
              }
              current_path = PATH.join2(current_path, parts[i]);
              try {
                current = FS.lookupNode(current, parts[i]);
              } catch (e) {
                if (e?.errno === 44 && islast && opts.noent_okay) return { path: current_path };
                throw e;
              }
              if (FS.isMountpoint(current) && (!islast || opts.follow_mount)) current = current.mounted.root;
              if (FS.isLink(current.mode) && (!islast || opts.follow)) {
                if (!current.node_ops.readlink) throw new FS.ErrnoError(52);
                var link = current.node_ops.readlink(current);
                if (!PATH.isAbs(link)) link = PATH.dirname(current_path) + "/" + link;
                path = link + "/" + parts.slice(i + 1).join("/");
                continue linkloop;
              }
            }
            return { path: current_path, node: current };
          }
          throw new FS.ErrnoError(32);
        }, getPath(node) {
          var path;
          while (true) {
            if (FS.isRoot(node)) {
              var mount = node.mount.mountpoint;
              if (!path) return mount;
              return mount[mount.length - 1] !== "/" ? `${mount}/${path}` : mount + path;
            }
            path = path ? `${node.name}/${path}` : node.name;
            node = node.parent;
          }
        }, hashName(parentid, name) {
          var hash = 0;
          for (var i = 0; i < name.length; i++) hash = (hash << 5) - hash + name.charCodeAt(i) | 0;
          return (parentid + hash >>> 0) % FS.nameTable.length;
        }, hashAddNode(node) {
          var hash = FS.hashName(node.parent.id, node.name);
          node.name_next = FS.nameTable[hash];
          FS.nameTable[hash] = node;
        }, hashRemoveNode(node) {
          var hash = FS.hashName(node.parent.id, node.name);
          if (FS.nameTable[hash] === node) FS.nameTable[hash] = node.name_next;
          else {
            var current = FS.nameTable[hash];
            while (current) {
              if (current.name_next === node) {
                current.name_next = node.name_next;
                break;
              }
              current = current.name_next;
            }
          }
        }, lookupNode(parent, name) {
          var errCode = FS.mayLookup(parent);
          if (errCode) throw new FS.ErrnoError(errCode);
          var hash = FS.hashName(parent.id, name);
          for (var node = FS.nameTable[hash]; node; node = node.name_next) {
            var nodeName = node.name;
            if (node.parent.id === parent.id && nodeName === name) return node;
          }
          return FS.lookup(parent, name);
        }, createNode(parent, name, mode, rdev) {
          var node = new FS.FSNode(parent, name, mode, rdev);
          FS.hashAddNode(node);
          return node;
        }, destroyNode(node) {
          FS.hashRemoveNode(node);
        }, isRoot(node) {
          return node === node.parent;
        }, isMountpoint(node) {
          return !!node.mounted;
        }, isFile(mode) {
          return (mode & 61440) === 32768;
        }, isDir(mode) {
          return (mode & 61440) === 16384;
        }, isLink(mode) {
          return (mode & 61440) === 40960;
        }, isChrdev(mode) {
          return (mode & 61440) === 8192;
        }, isBlkdev(mode) {
          return (mode & 61440) === 24576;
        }, isFIFO(mode) {
          return (mode & 61440) === 4096;
        }, isSocket(mode) {
          return (mode & 49152) === 49152;
        }, flagsToPermissionString(flag) {
          var perms = ["r", "w", "rw"][flag & 3];
          if (flag & 512) perms += "w";
          return perms;
        }, nodePermissions(node, perms) {
          if (FS.ignorePermissions) return 0;
          if (perms.includes("r") && !(node.mode & 292)) return 2;
          if (perms.includes("w") && !(node.mode & 146)) return 2;
          if (perms.includes("x") && !(node.mode & 73)) return 2;
          return 0;
        }, mayLookup(dir) {
          if (!FS.isDir(dir.mode)) return 54;
          var errCode = FS.nodePermissions(dir, "x");
          if (errCode) return errCode;
          if (!dir.node_ops.lookup) return 2;
          return 0;
        }, mayCreate(dir, name) {
          if (!FS.isDir(dir.mode)) return 54;
          try {
            FS.lookupNode(dir, name);
            return 20;
          } catch (e) {
          }
          return FS.nodePermissions(dir, "wx");
        }, mayDelete(dir, name, isdir) {
          var node;
          try {
            node = FS.lookupNode(dir, name);
          } catch (e) {
            return e.errno;
          }
          var errCode = FS.nodePermissions(dir, "wx");
          if (errCode) return errCode;
          if (isdir) {
            if (!FS.isDir(node.mode)) return 54;
            if (FS.isRoot(node) || FS.getPath(node) === FS.cwd()) return 10;
          } else if (FS.isDir(node.mode)) return 31;
          return 0;
        }, mayOpen(node, flags) {
          if (!node) return 44;
          if (FS.isLink(node.mode)) return 32;
          var mode = FS.flagsToPermissionString(flags);
          if (FS.isDir(node.mode)) {
            if (mode !== "r" || flags & 576) return 31;
          }
          return FS.nodePermissions(node, mode);
        }, checkOpExists(op, err2) {
          if (!op) throw new FS.ErrnoError(err2);
          return op;
        }, MAX_OPEN_FDS: 4096, nextfd() {
          for (var fd = 0; fd <= FS.MAX_OPEN_FDS; fd++) if (!FS.streams[fd]) return fd;
          throw new FS.ErrnoError(33);
        }, getStreamChecked(fd) {
          var stream = FS.getStream(fd);
          if (!stream) throw new FS.ErrnoError(8);
          return stream;
        }, getStream: (fd) => FS.streams[fd], createStream(stream, fd = -1) {
          stream = Object.assign(new FS.FSStream(), stream);
          if (fd == -1) fd = FS.nextfd();
          stream.fd = fd;
          FS.streams[fd] = stream;
          return stream;
        }, closeStream(fd) {
          FS.streams[fd] = null;
        }, dupStream(origStream, fd = -1) {
          var stream = FS.createStream(origStream, fd);
          stream.stream_ops?.dup?.(stream);
          return stream;
        }, doSetAttr(stream, node, attr) {
          var setattr = stream?.stream_ops.setattr;
          var arg = setattr ? stream : node;
          setattr ?? (setattr = node.node_ops.setattr);
          FS.checkOpExists(setattr, 63);
          try {
            setattr(arg, attr);
          } catch (e) {
            if (e instanceof RangeError) throw new FS.ErrnoError(22);
            throw e;
          }
        }, chrdev_stream_ops: { open(stream) {
          var device = FS.getDevice(stream.node.rdev);
          stream.stream_ops = device.stream_ops;
          stream.stream_ops.open?.(stream);
        }, llseek() {
          throw new FS.ErrnoError(70);
        } }, major: (dev) => dev >> 8, minor: (dev) => dev & 255, makedev: (ma, mi) => ma << 8 | mi, registerDevice(dev, ops) {
          FS.devices[dev] = { stream_ops: ops };
        }, getDevice: (dev) => FS.devices[dev], getMounts(mount) {
          var mounts = [];
          var check = [mount];
          while (check.length) {
            var m = check.pop();
            mounts.push(m);
            check.push(...m.mounts);
          }
          return mounts;
        }, syncfs(populate, callback) {
          if (typeof populate === "function") {
            callback = populate;
            populate = false;
          }
          FS.syncFSRequests++;
          if (FS.syncFSRequests > 1) err(`warning: ${FS.syncFSRequests} FS.syncfs operations in flight at once, probably just doing extra work`);
          var mounts = FS.getMounts(FS.root.mount);
          var completed = 0;
          function doCallback(errCode) {
            FS.syncFSRequests--;
            return callback(errCode);
          }
          function done(errCode) {
            if (errCode) {
              if (!done.errored) {
                done.errored = true;
                return doCallback(errCode);
              }
              return;
            }
            if (++completed >= mounts.length) doCallback(null);
          }
          for (var mount of mounts) if (mount.type.syncfs) mount.type.syncfs(mount, populate, done);
          else done(null);
        }, mount(type, opts, mountpoint) {
          var root = mountpoint === "/";
          var pseudo = !mountpoint;
          var node;
          if (root && FS.root) throw new FS.ErrnoError(10);
          else if (!root && !pseudo) {
            var lookup = FS.lookupPath(mountpoint, { follow_mount: false });
            mountpoint = lookup.path;
            node = lookup.node;
            if (FS.isMountpoint(node)) throw new FS.ErrnoError(10);
            if (!FS.isDir(node.mode)) throw new FS.ErrnoError(54);
          }
          var mount = { type, opts, mountpoint, mounts: [] };
          var mountRoot = type.mount(mount);
          mountRoot.mount = mount;
          mount.root = mountRoot;
          if (root) FS.root = mountRoot;
          else if (node) {
            node.mounted = mount;
            if (node.mount) node.mount.mounts.push(mount);
          }
          return mountRoot;
        }, unmount(mountpoint) {
          var lookup = FS.lookupPath(mountpoint, { follow_mount: false });
          if (!FS.isMountpoint(lookup.node)) throw new FS.ErrnoError(28);
          var node = lookup.node;
          var mount = node.mounted;
          var mounts = FS.getMounts(mount);
          for (var [hash, current] of Object.entries(FS.nameTable)) while (current) {
            var next = current.name_next;
            if (mounts.includes(current.mount)) FS.destroyNode(current);
            current = next;
          }
          node.mounted = null;
          var idx = node.mount.mounts.indexOf(mount);
          node.mount.mounts.splice(idx, 1);
        }, lookup(parent, name) {
          return parent.node_ops.lookup(parent, name);
        }, mknod(path, mode, dev) {
          var lookup = FS.lookupPath(path, { parent: true });
          var parent = lookup.node;
          var name = PATH.basename(path);
          if (!name) throw new FS.ErrnoError(28);
          if (name === "." || name === "..") throw new FS.ErrnoError(20);
          var errCode = FS.mayCreate(parent, name);
          if (errCode) throw new FS.ErrnoError(errCode);
          if (!parent.node_ops.mknod) throw new FS.ErrnoError(63);
          return parent.node_ops.mknod(parent, name, mode, dev);
        }, statfs(path) {
          return FS.statfsNode(FS.lookupPath(path, { follow: true }).node);
        }, statfsStream(stream) {
          return FS.statfsNode(stream.node);
        }, statfsNode(node) {
          var rtn = { bsize: 4096, frsize: 4096, blocks: 1e6, bfree: 5e5, bavail: 5e5, files: FS.nextInode, ffree: FS.nextInode - 1, fsid: 42, flags: 2, namelen: 255 };
          if (node.node_ops.statfs) Object.assign(rtn, node.node_ops.statfs(node.mount.opts.root));
          return rtn;
        }, create(path, mode = 438) {
          mode &= 4095;
          mode |= 32768;
          return FS.mknod(path, mode, 0);
        }, mkdir(path, mode = 511) {
          mode &= 1023;
          mode |= 16384;
          return FS.mknod(path, mode, 0);
        }, mkdirTree(path, mode = 511) {
          var dirs = path.split("/");
          var d = "";
          for (var dir of dirs) {
            if (!dir) continue;
            if (d || PATH.isAbs(path)) d += "/";
            d += dir;
            try {
              FS.mkdir(d, mode);
            } catch (e) {
              if (e.errno != 20) throw e;
            }
          }
        }, mkdev(path, mode, dev) {
          if (typeof dev === "undefined") {
            dev = mode;
            mode = 438;
          }
          mode |= 8192;
          return FS.mknod(path, mode, dev);
        }, symlink(oldpath, newpath) {
          if (!PATH_FS.resolve(oldpath)) throw new FS.ErrnoError(44);
          var lookup = FS.lookupPath(newpath, { parent: true });
          var parent = lookup.node;
          if (!parent) throw new FS.ErrnoError(44);
          var newname = PATH.basename(newpath);
          var errCode = FS.mayCreate(parent, newname);
          if (errCode) throw new FS.ErrnoError(errCode);
          if (!parent.node_ops.symlink) throw new FS.ErrnoError(63);
          return parent.node_ops.symlink(parent, newname, oldpath);
        }, link(oldpath, newpath, flags) {
          var lookup = FS.lookupPath(newpath, { parent: true });
          var parent = lookup.node;
          if (!parent) throw new FS.ErrnoError(44);
          var newname = PATH.basename(newpath);
          var errCode = FS.mayCreate(parent, newname);
          if (errCode) throw new FS.ErrnoError(errCode);
          if (!parent.node_ops.link) throw new FS.ErrnoError(34);
          return parent.node_ops.link(parent, newname, oldpath, flags);
        }, rename(old_path, new_path) {
          var old_dirname = PATH.dirname(old_path);
          var new_dirname = PATH.dirname(new_path);
          var old_name = PATH.basename(old_path);
          var new_name = PATH.basename(new_path);
          var lookup, old_dir, new_dir;
          lookup = FS.lookupPath(old_path, { parent: true });
          old_dir = lookup.node;
          lookup = FS.lookupPath(new_path, { parent: true });
          new_dir = lookup.node;
          if (!old_dir || !new_dir) throw new FS.ErrnoError(44);
          if (old_dir.mount !== new_dir.mount) throw new FS.ErrnoError(75);
          var old_node = FS.lookupNode(old_dir, old_name);
          var relative = PATH_FS.relative(old_path, new_dirname);
          if (relative.charAt(0) !== ".") throw new FS.ErrnoError(28);
          relative = PATH_FS.relative(new_path, old_dirname);
          if (relative.charAt(0) !== ".") throw new FS.ErrnoError(55);
          var new_node;
          try {
            new_node = FS.lookupNode(new_dir, new_name);
          } catch (e) {
          }
          if (old_node === new_node) return;
          var isdir = FS.isDir(old_node.mode);
          var errCode = FS.mayDelete(old_dir, old_name, isdir);
          if (errCode) throw new FS.ErrnoError(errCode);
          errCode = new_node ? FS.mayDelete(new_dir, new_name, isdir) : FS.mayCreate(new_dir, new_name);
          if (errCode) throw new FS.ErrnoError(errCode);
          if (!old_dir.node_ops.rename) throw new FS.ErrnoError(63);
          if (FS.isMountpoint(old_node) || new_node && FS.isMountpoint(new_node)) throw new FS.ErrnoError(10);
          if (new_dir !== old_dir) {
            errCode = FS.nodePermissions(old_dir, "w");
            if (errCode) throw new FS.ErrnoError(errCode);
          }
          FS.hashRemoveNode(old_node);
          try {
            old_dir.node_ops.rename(old_node, new_dir, new_name);
            if (new_node) FS.hashRemoveNode(new_node);
            old_node.parent = new_dir;
          } catch (e) {
            throw e;
          } finally {
            FS.hashAddNode(old_node);
          }
        }, rmdir(path) {
          var lookup = FS.lookupPath(path, { parent: true });
          var parent = lookup.node;
          var name = PATH.basename(path);
          var node = FS.lookupNode(parent, name);
          var errCode = FS.mayDelete(parent, name, true);
          if (errCode) throw new FS.ErrnoError(errCode);
          if (!parent.node_ops.rmdir) throw new FS.ErrnoError(63);
          if (FS.isMountpoint(node)) throw new FS.ErrnoError(10);
          parent.node_ops.rmdir(parent, name);
          FS.destroyNode(node);
        }, readdir(path) {
          var lookup = FS.lookupPath(path, { follow: true });
          var node = lookup.node;
          var readdir = FS.checkOpExists(node.node_ops.readdir, 54);
          return readdir(node);
        }, unlink(path) {
          var lookup = FS.lookupPath(path, { parent: true });
          var parent = lookup.node;
          if (!parent) throw new FS.ErrnoError(44);
          var name = PATH.basename(path);
          var node = FS.lookupNode(parent, name);
          var errCode = FS.mayDelete(parent, name, false);
          if (errCode) throw new FS.ErrnoError(errCode);
          if (!parent.node_ops.unlink) throw new FS.ErrnoError(63);
          if (FS.isMountpoint(node)) throw new FS.ErrnoError(10);
          parent.node_ops.unlink(parent, name);
          FS.destroyNode(node);
        }, readlink(path) {
          var lookup = FS.lookupPath(path);
          var link = lookup.node;
          if (!link) throw new FS.ErrnoError(44);
          if (!link.node_ops.readlink) throw new FS.ErrnoError(28);
          return link.node_ops.readlink(link);
        }, stat(path, dontFollow = false) {
          var lookup = FS.lookupPath(path, { follow: !dontFollow });
          var node = lookup.node;
          var getattr = FS.checkOpExists(node.node_ops.getattr, 63);
          return getattr(node);
        }, fstat(fd) {
          var stream = FS.getStreamChecked(fd);
          var node = stream.node;
          var getattr = stream.stream_ops.getattr;
          var arg = getattr ? stream : node;
          getattr ?? (getattr = node.node_ops.getattr);
          FS.checkOpExists(getattr, 63);
          return getattr(arg);
        }, lstat(path) {
          return FS.stat(path, true);
        }, doChmod(stream, node, mode, dontFollow = false) {
          FS.doSetAttr(stream, node, { mode: mode & 4095 | node.mode & -4096, ctime: Date.now(), dontFollow });
        }, chmod(path, mode, dontFollow = false) {
          var node;
          if (typeof path === "string") {
            var lookup = FS.lookupPath(path, { follow: !dontFollow });
            node = lookup.node;
          } else node = path;
          FS.doChmod(null, node, mode, dontFollow);
        }, lchmod(path, mode) {
          FS.chmod(path, mode, true);
        }, fchmod(fd, mode) {
          var stream = FS.getStreamChecked(fd);
          FS.doChmod(stream, stream.node, mode, false);
        }, doChown(stream, node, dontFollow = false) {
          FS.doSetAttr(stream, node, { timestamp: Date.now(), dontFollow });
        }, chown(path, uid, gid, dontFollow = false) {
          var node;
          if (typeof path === "string") {
            var lookup = FS.lookupPath(path, { follow: !dontFollow });
            node = lookup.node;
          } else node = path;
          FS.doChown(null, node, dontFollow);
        }, lchown(path, uid, gid) {
          FS.chown(path, uid, gid, true);
        }, fchown(fd, uid, gid) {
          var stream = FS.getStreamChecked(fd);
          FS.doChown(stream, stream.node, false);
        }, doTruncate(stream, node, len) {
          if (FS.isDir(node.mode)) throw new FS.ErrnoError(31);
          if (!FS.isFile(node.mode)) throw new FS.ErrnoError(28);
          var errCode = FS.nodePermissions(node, "w");
          if (errCode) throw new FS.ErrnoError(errCode);
          FS.doSetAttr(stream, node, { size: len, timestamp: Date.now() });
        }, truncate(path, len) {
          if (len < 0) throw new FS.ErrnoError(28);
          var node;
          if (typeof path === "string") {
            var lookup = FS.lookupPath(path, { follow: true });
            node = lookup.node;
          } else node = path;
          FS.doTruncate(null, node, len);
        }, ftruncate(fd, len) {
          var stream = FS.getStreamChecked(fd);
          if (len < 0 || (stream.flags & 2097155) === 0) throw new FS.ErrnoError(28);
          FS.doTruncate(stream, stream.node, len);
        }, utime(path, atime, mtime, dontFollow = false) {
          var lookup = FS.lookupPath(path, { follow: !dontFollow });
          FS.doSetAttr(null, lookup.node, { atime, mtime, dontFollow });
        }, open(path, flags, mode = 438) {
          if (path === "") throw new FS.ErrnoError(44);
          flags = FS_modeStringToFlags(flags);
          if (flags & 64) mode = mode & 4095 | 32768;
          else mode = 0;
          var node;
          var isDirPath;
          if (typeof path === "object") node = path;
          else {
            isDirPath = path.endsWith("/");
            var lookup = FS.lookupPath(path, { follow: !(flags & 131072), noent_okay: true });
            node = lookup.node;
            path = lookup.path;
          }
          var created = false;
          if (flags & 64) if (node) {
            if (flags & 128) throw new FS.ErrnoError(20);
          } else if (isDirPath) throw new FS.ErrnoError(31);
          else {
            node = FS.mknod(path, mode | 511, 0);
            created = true;
          }
          if (!node) throw new FS.ErrnoError(44);
          if (FS.isChrdev(node.mode)) flags &= -513;
          if (flags & 65536 && !FS.isDir(node.mode)) throw new FS.ErrnoError(54);
          if (!created) {
            var errCode = FS.mayOpen(node, flags);
            if (errCode) throw new FS.ErrnoError(errCode);
          }
          if (flags & 512 && !created) FS.truncate(node, 0);
          flags &= -131713;
          var stream = FS.createStream({ node, path: FS.getPath(node), flags, seekable: true, position: 0, stream_ops: node.stream_ops, ungotten: [], error: false });
          if (stream.stream_ops.open) stream.stream_ops.open(stream);
          if (created) FS.chmod(node, mode & 511);
          return stream;
        }, close(stream) {
          if (FS.isClosed(stream)) throw new FS.ErrnoError(8);
          if (stream.getdents) stream.getdents = null;
          stream.node?.notifyListeners(32);
          try {
            if (stream.stream_ops.close) stream.stream_ops.close(stream);
          } catch (e) {
            throw e;
          } finally {
            FS.closeStream(stream.fd);
          }
          stream.fd = null;
        }, isClosed(stream) {
          return stream.fd === null;
        }, llseek(stream, offset, whence) {
          if (FS.isClosed(stream)) throw new FS.ErrnoError(8);
          if (!stream.seekable || !stream.stream_ops.llseek) throw new FS.ErrnoError(70);
          if (whence != 0 && whence != 1 && whence != 2) throw new FS.ErrnoError(28);
          stream.position = stream.stream_ops.llseek(stream, offset, whence);
          stream.ungotten = [];
          return stream.position;
        }, read(stream, buffer, offset, length, position) {
          if (length < 0 || position < 0) throw new FS.ErrnoError(28);
          if (FS.isClosed(stream)) throw new FS.ErrnoError(8);
          if ((stream.flags & 2097155) === 1) throw new FS.ErrnoError(8);
          if (FS.isDir(stream.node.mode)) throw new FS.ErrnoError(31);
          if (!stream.stream_ops.read) throw new FS.ErrnoError(28);
          var seeking = typeof position !== "undefined";
          if (!seeking) position = stream.position;
          else if (!stream.seekable) throw new FS.ErrnoError(70);
          var bytesRead = stream.stream_ops.read(stream, buffer, offset, length, position);
          if (!seeking) stream.position += bytesRead;
          return bytesRead;
        }, write(stream, buffer, offset, length, position, canOwn) {
          if (length < 0 || position < 0) throw new FS.ErrnoError(28);
          if (FS.isClosed(stream)) throw new FS.ErrnoError(8);
          if ((stream.flags & 2097155) === 0) throw new FS.ErrnoError(8);
          if (FS.isDir(stream.node.mode)) throw new FS.ErrnoError(31);
          if (!stream.stream_ops.write) throw new FS.ErrnoError(28);
          if (stream.seekable && stream.flags & 1024) FS.llseek(stream, 0, 2);
          var seeking = typeof position !== "undefined";
          if (!seeking) position = stream.position;
          else if (!stream.seekable) throw new FS.ErrnoError(70);
          var bytesWritten = stream.stream_ops.write(stream, buffer, offset, length, position, canOwn);
          if (!seeking) stream.position += bytesWritten;
          return bytesWritten;
        }, mmap(stream, length, position, prot, flags) {
          if (prot & 2 && !(flags & 2) && (stream.flags & 2097155) !== 2) throw new FS.ErrnoError(2);
          if ((stream.flags & 2097155) === 1) throw new FS.ErrnoError(2);
          if (!stream.stream_ops.mmap) throw new FS.ErrnoError(43);
          if (!length) throw new FS.ErrnoError(28);
          return stream.stream_ops.mmap(stream, length, position, prot, flags);
        }, msync(stream, buffer, offset, length, mmapFlags) {
          if (!stream.stream_ops.msync) return 0;
          return stream.stream_ops.msync(stream, buffer, offset, length, mmapFlags);
        }, ioctl(stream, cmd, arg) {
          if (!stream.stream_ops.ioctl) throw new FS.ErrnoError(59);
          return stream.stream_ops.ioctl(stream, cmd, arg);
        }, readFile(path, opts = {}) {
          opts.flags ?? (opts.flags = 0);
          opts.encoding ?? (opts.encoding = "binary");
          if (opts.encoding !== "utf8" && opts.encoding !== "binary") abort(`Invalid encoding type "${opts.encoding}"`);
          var stream = FS.open(path, opts.flags);
          var stat = FS.stat(path);
          var length = stat.size;
          var buf = new Uint8Array(length);
          FS.read(stream, buf, 0, length, 0);
          if (opts.encoding === "utf8") buf = UTF8ArrayToString(buf);
          FS.close(stream);
          return buf;
        }, writeFile(path, data, opts = {}) {
          opts.flags ?? (opts.flags = 577);
          var stream = FS.open(path, opts.flags, opts.mode);
          data = FS_fileDataToTypedArray(data);
          FS.write(stream, data, 0, data.byteLength, void 0, opts.canOwn);
          FS.close(stream);
        }, cwd: () => FS.currentPath, chdir(path) {
          var lookup = FS.lookupPath(path, { follow: true });
          if (lookup.node === null) throw new FS.ErrnoError(44);
          if (!FS.isDir(lookup.node.mode)) throw new FS.ErrnoError(54);
          var errCode = FS.nodePermissions(lookup.node, "x");
          if (errCode) throw new FS.ErrnoError(errCode);
          FS.currentPath = lookup.path;
        }, createDefaultDirectories() {
          FS.mkdir("/tmp");
          FS.mkdir("/home");
          FS.mkdir("/home/web_user");
        }, createDefaultDevices() {
          FS.mkdir("/dev");
          FS.registerDevice(FS.makedev(1, 3), { read: () => 0, write: (stream, buffer, offset, length) => length, llseek: () => 0 });
          FS.mkdev("/dev/null", FS.makedev(1, 3));
          TTY.register(FS.makedev(5, 0), TTY.default_tty_ops);
          TTY.register(FS.makedev(6, 0), TTY.default_tty1_ops);
          FS.mkdev("/dev/tty", FS.makedev(5, 0));
          FS.mkdev("/dev/tty1", FS.makedev(6, 0));
          var randomBuffer = new Uint8Array(1024), randomLeft = 0;
          var randomByte = () => {
            if (!randomLeft) {
              randomFill(randomBuffer);
              randomLeft = randomBuffer.byteLength;
            }
            return randomBuffer[--randomLeft];
          };
          FS.createDevice("/dev", "random", randomByte);
          FS.createDevice("/dev", "urandom", randomByte);
          FS.mkdir("/dev/shm");
          FS.mkdir("/dev/shm/tmp");
        }, createSpecialDirectories() {
          FS.mkdir("/proc");
          var proc_self = FS.mkdir("/proc/self");
          FS.mkdir("/proc/self/fd");
          FS.mount({ mount() {
            var node = FS.createNode(proc_self, "fd", 16895, 73);
            node.stream_ops = { llseek: MEMFS.stream_ops.llseek };
            node.node_ops = { lookup(parent, name) {
              var fd = +name;
              var stream = FS.getStreamChecked(fd);
              var ret = { parent: null, mount: { mountpoint: "fake" }, node_ops: { readlink: () => stream.path }, id: fd + 1 };
              ret.parent = ret;
              return ret;
            }, readdir() {
              return Array.from(FS.streams.entries()).filter(([k, v]) => v).map(([k, v]) => k.toString());
            } };
            return node;
          } }, {}, "/proc/self/fd");
        }, createStandardStreams(input, output, error) {
          if (input) FS.createDevice("/dev", "stdin", input);
          else FS.symlink("/dev/tty", "/dev/stdin");
          if (output) FS.createDevice("/dev", "stdout", null, output);
          else FS.symlink("/dev/tty", "/dev/stdout");
          if (error) FS.createDevice("/dev", "stderr", null, error);
          else FS.symlink("/dev/tty1", "/dev/stderr");
          FS.open("/dev/stdin", 0);
          FS.open("/dev/stdout", 1);
          FS.open("/dev/stderr", 1);
        }, staticInit() {
          FS.nameTable.length = 4096;
          FS.mount(MEMFS, {}, "/");
          FS.createDefaultDirectories();
          FS.createDefaultDevices();
          FS.createSpecialDirectories();
        }, init(input, output, error) {
          FS.initialized = true;
          input ?? (input = Module["stdin"]);
          output ?? (output = Module["stdout"]);
          error ?? (error = Module["stderr"]);
          FS.createStandardStreams(input, output, error);
        }, quit() {
          FS.initialized = false;
          for (var stream of FS.streams) if (stream) FS.close(stream);
        }, analyzePath(path, dontResolveLastLink = false) {
          try {
            var lookup = FS.lookupPath(path, { follow: !dontResolveLastLink });
            path = lookup.path;
          } catch (e) {
          }
          var ret = { isRoot: false, exists: false, error: 0, name: null, path: null, object: null, parentExists: false, parentPath: null, parentObject: null };
          try {
            lookup = FS.lookupPath(path, { parent: true });
            ret.parentExists = true;
            ret.parentPath = lookup.path;
            ret.parentObject = lookup.node;
            ret.name = PATH.basename(path);
            lookup = FS.lookupPath(path, { follow: !dontResolveLastLink });
            ret.exists = true;
            ret.path = lookup.path;
            ret.object = lookup.node;
            ret.name = lookup.node.name;
            ret.isRoot = lookup.path === "/";
          } catch (e) {
            ret.error = e.errno;
          }
          return ret;
        }, createPath(parent, path, canRead, canWrite) {
          parent = typeof parent === "string" ? parent : FS.getPath(parent);
          var parts = path.split("/").reverse();
          while (parts.length) {
            var part = parts.pop();
            if (!part) continue;
            var current = PATH.join2(parent, part);
            try {
              FS.mkdir(current);
            } catch (e) {
              if (e.errno != 20) throw e;
            }
            parent = current;
          }
          return current;
        }, createFile(parent, name, properties, canRead, canWrite) {
          var path = PATH.join2(typeof parent === "string" ? parent : FS.getPath(parent), name);
          var mode = FS_getMode(canRead, canWrite);
          return FS.create(path, mode);
        }, createDataFile(parent, name, data, canRead, canWrite, canOwn) {
          var path = name;
          if (parent) {
            parent = typeof parent === "string" ? parent : FS.getPath(parent);
            path = name ? PATH.join2(parent, name) : parent;
          }
          var mode = FS_getMode(canRead, canWrite);
          var node = FS.create(path, mode);
          if (data) {
            data = FS_fileDataToTypedArray(data);
            FS.chmod(node, mode | 146);
            var stream = FS.open(node, 577);
            FS.write(stream, data, 0, data.length, 0, canOwn);
            FS.close(stream);
            FS.chmod(node, mode);
          }
        }, createDevice(parent, name, input, output) {
          var _a;
          var path = PATH.join2(typeof parent === "string" ? parent : FS.getPath(parent), name);
          var mode = FS_getMode(!!input, !!output);
          (_a = FS.createDevice).major ?? (_a.major = 64);
          var dev = FS.makedev(FS.createDevice.major++, 0);
          FS.registerDevice(dev, { open(stream) {
            stream.seekable = false;
          }, close(stream) {
            if (output?.buffer?.length) output(10);
          }, read(stream, buffer, offset, length, pos) {
            var bytesRead = 0;
            for (var i = 0; i < length; i++) {
              var result;
              try {
                result = input();
              } catch (e) {
                throw new FS.ErrnoError(29);
              }
              if (result === void 0 && !bytesRead) throw new FS.ErrnoError(6);
              if (result === null || result === void 0) break;
              bytesRead++;
              buffer[offset + i] = result;
            }
            if (bytesRead) stream.node.atime = Date.now();
            return bytesRead;
          }, write(stream, buffer, offset, length, pos) {
            for (var i = 0; i < length; i++) try {
              output(buffer[offset + i]);
            } catch (e) {
              throw new FS.ErrnoError(29);
            }
            if (length) stream.node.mtime = stream.node.ctime = Date.now();
            return i;
          } });
          return FS.mkdev(path, mode, dev);
        }, forceLoadFile(obj) {
          if (obj.isDevice || obj.isFolder || obj.link || obj.contents) return true;
          if (globalThis.XMLHttpRequest) abort("Lazy loading should have been performed (contents set) in createLazyFile, but it was not. Lazy loading only works in web workers. Use --embed-file or --preload-file in emcc on the main thread.");
          else try {
            obj.contents = readBinary(obj.url);
          } catch (e) {
            throw new FS.ErrnoError(29);
          }
        }, createLazyFile(parent, name, url, canRead, canWrite) {
          class LazyUint8Array {
            constructor() {
              __publicField(this, "lengthKnown", false);
              __publicField(this, "chunks", []);
            }
            get(idx) {
              if (idx > this.length - 1 || idx < 0) return;
              var chunkOffset = idx % this.chunkSize;
              var chunkNum = idx / this.chunkSize | 0;
              return this.getter(chunkNum)[chunkOffset];
            }
            setDataGetter(getter) {
              this.getter = getter;
            }
            cacheLength() {
              var xhr = new XMLHttpRequest();
              xhr.open("HEAD", url, false);
              xhr.send(null);
              if (!(xhr.status >= 200 && xhr.status < 300 || xhr.status === 304)) abort(`Couldn't load ${url}. Status: ${xhr.status}`);
              var datalength = Number(xhr.getResponseHeader("Content-length"));
              var header;
              var hasByteServing = (header = xhr.getResponseHeader("Accept-Ranges")) && header === "bytes";
              var usesGzip = (header = xhr.getResponseHeader("Content-Encoding")) && header === "gzip";
              var chunkSize = 1048576;
              if (!hasByteServing) chunkSize = datalength;
              var doXHR = (from, to) => {
                if (from > to) abort(`invalid range (${from}, ${to}) or no bytes requested!`);
                if (to > datalength - 1) abort(`only ${datalength} bytes available! programmer error!`);
                var xhr2 = new XMLHttpRequest();
                xhr2.open("GET", url, false);
                if (datalength !== chunkSize) xhr2.setRequestHeader("Range", `bytes=${from}-${to}`);
                xhr2.responseType = "arraybuffer";
                if (xhr2.overrideMimeType) xhr2.overrideMimeType("text/plain; charset=x-user-defined");
                xhr2.send(null);
                if (!(xhr2.status >= 200 && xhr2.status < 300 || xhr2.status === 304)) abort(`Couldn't load ${url}. Status: ${xhr2.status}`);
                if (xhr2.response !== void 0) return new Uint8Array(xhr2.response || []);
                return intArrayFromString(xhr2.responseText ?? "", true);
              };
              var lazyArray2 = this;
              lazyArray2.setDataGetter((chunkNum) => {
                var start = chunkNum * chunkSize;
                var end = (chunkNum + 1) * chunkSize - 1;
                end = Math.min(end, datalength - 1);
                if (typeof lazyArray2.chunks[chunkNum] === "undefined") lazyArray2.chunks[chunkNum] = doXHR(start, end);
                if (typeof lazyArray2.chunks[chunkNum] === "undefined") abort("doXHR failed!");
                return lazyArray2.chunks[chunkNum];
              });
              if (usesGzip || !datalength) {
                chunkSize = datalength = 1;
                datalength = this.getter(0).length;
                chunkSize = datalength;
                out("LazyFiles on gzip forces download of the whole file when length is accessed");
              }
              this._length = datalength;
              this._chunkSize = chunkSize;
              this.lengthKnown = true;
            }
            get length() {
              if (!this.lengthKnown) this.cacheLength();
              return this._length;
            }
            get chunkSize() {
              if (!this.lengthKnown) this.cacheLength();
              return this._chunkSize;
            }
          }
          if (globalThis.XMLHttpRequest) {
            if (!ENVIRONMENT_IS_WORKER) abort("Cannot do synchronous binary XHRs outside webworkers in modern browsers. Use --embed-file or --preload-file in emcc");
            var lazyArray = new LazyUint8Array();
            var properties = { isDevice: false, contents: lazyArray };
          } else properties = { isDevice: false, url };
          var node = FS.createFile(parent, name, properties, canRead, canWrite);
          if (properties.contents) node.contents = properties.contents;
          else if (properties.url) {
            node.contents = null;
            node.url = properties.url;
          }
          Object.defineProperties(node, { usedBytes: { get: function() {
            return this.contents.length;
          } } });
          var stream_ops = {};
          for (const [key, fn] of Object.entries(node.stream_ops)) stream_ops[key] = (...args) => {
            FS.forceLoadFile(node);
            return fn(...args);
          };
          function writeChunks(stream, buffer, offset, length, position) {
            var contents = stream.node.contents;
            if (position >= contents.length) return 0;
            var size = Math.min(contents.length - position, length);
            if (contents.slice) for (var i = 0; i < size; i++) buffer[offset + i] = contents[position + i];
            else for (i = 0; i < size; i++) buffer[offset + i] = contents.get(position + i);
            return size;
          }
          stream_ops.read = (stream, buffer, offset, length, position) => {
            FS.forceLoadFile(node);
            return writeChunks(stream, buffer, offset, length, position);
          };
          stream_ops.mmap = (stream, length, position) => {
            FS.forceLoadFile(node);
            var ptr = mmapAlloc(length);
            if (!ptr) throw new FS.ErrnoError(48);
            writeChunks(stream, HEAP8, ptr, length, position);
            return { ptr, allocated: true };
          };
          node.stream_ops = stream_ops;
          return node;
        } };
        var UTF8ToString = (ptr, maxBytesToRead, ignoreNul) => {
          ptr >>>= 0;
          return ptr ? UTF8ArrayToString(HEAPU8, ptr, maxBytesToRead, ignoreNul) : "";
        };
        var HEAP64;
        var SYSCALLS = { currentUmask: 18, calculateAt(dirfd, path, allowEmpty = false) {
          if (PATH.isAbs(path)) return path;
          var dir;
          if (dirfd === -100) dir = FS.cwd();
          else {
            var dirstream = SYSCALLS.getStreamFromFD(dirfd);
            dir = dirstream.path;
          }
          if (path.length == 0) {
            if (!allowEmpty) throw new FS.ErrnoError(44);
            return dir;
          }
          return dir + "/" + path;
        }, writeStat(buf, stat) {
          HEAPU32[buf >>> 2 >>> 0] = stat.dev;
          HEAPU32[buf + 4 >>> 2 >>> 0] = stat.mode;
          HEAPU32[buf + 8 >>> 2 >>> 0] = stat.nlink;
          HEAPU32[buf + 12 >>> 2 >>> 0] = stat.uid;
          HEAPU32[buf + 16 >>> 2 >>> 0] = stat.gid;
          HEAPU32[buf + 20 >>> 2 >>> 0] = stat.rdev;
          HEAP64[buf + 24 >>> 3 >>> 0] = BigInt(stat.size);
          HEAP32[buf + 32 >>> 2 >>> 0] = 4096;
          HEAP32[buf + 36 >>> 2 >>> 0] = stat.blocks;
          var atime = stat.atime.getTime();
          var mtime = stat.mtime.getTime();
          var ctime = stat.ctime.getTime();
          HEAP64[buf + 40 >>> 3 >>> 0] = BigInt(Math.floor(atime / 1e3));
          HEAPU32[buf + 48 >>> 2 >>> 0] = atime % 1e3 * 1e3 * 1e3;
          HEAP64[buf + 56 >>> 3 >>> 0] = BigInt(Math.floor(mtime / 1e3));
          HEAPU32[buf + 64 >>> 2 >>> 0] = mtime % 1e3 * 1e3 * 1e3;
          HEAP64[buf + 72 >>> 3 >>> 0] = BigInt(Math.floor(ctime / 1e3));
          HEAPU32[buf + 80 >>> 2 >>> 0] = ctime % 1e3 * 1e3 * 1e3;
          HEAP64[buf + 88 >>> 3 >>> 0] = BigInt(stat.ino);
          return 0;
        }, writeStatFs(buf, stats) {
          HEAPU32[buf + 4 >>> 2 >>> 0] = stats.bsize;
          HEAPU32[buf + 60 >>> 2 >>> 0] = stats.bsize;
          HEAP64[buf + 8 >>> 3 >>> 0] = BigInt(stats.blocks);
          HEAP64[buf + 16 >>> 3 >>> 0] = BigInt(stats.bfree);
          HEAP64[buf + 24 >>> 3 >>> 0] = BigInt(stats.bavail);
          HEAP64[buf + 32 >>> 3 >>> 0] = BigInt(stats.files);
          HEAP64[buf + 40 >>> 3 >>> 0] = BigInt(stats.ffree);
          HEAPU32[buf + 48 >>> 2 >>> 0] = stats.fsid;
          HEAPU32[buf + 64 >>> 2 >>> 0] = stats.flags;
          HEAPU32[buf + 56 >>> 2 >>> 0] = stats.namelen;
        }, doMsync(addr, stream, len, flags, offset) {
          if (!FS.isFile(stream.node.mode)) throw new FS.ErrnoError(43);
          if (flags & 2) return 0;
          var buffer = HEAPU8.subarray(addr >>> 0, addr + len >>> 0);
          FS.msync(stream, buffer, offset, len, flags);
        }, getStreamFromFD(fd) {
          var stream = FS.getStreamChecked(fd);
          return stream;
        }, varargs: void 0, getStr(ptr) {
          var ret = UTF8ToString(ptr);
          return ret;
        } };
        var bigintToI53Checked = (num) => num < -9007199254740992 || num > 9007199254740992 ? NaN : Number(num);
        var HEAP16;
        var AsciiToString = (ptr) => {
          ptr >>>= 0;
          var str = "";
          while (1) {
            var ch = HEAPU8[ptr++ >>> 0];
            if (!ch) return str;
            str += String.fromCharCode(ch);
          }
        };
        var awaitingDependencies = {};
        var registeredTypes = {};
        var typeDependencies = {};
        class BindingError extends Error {
          constructor(message) {
            super(message);
            this.name = "BindingError";
          }
        }
        var throwBindingError = (message) => {
          throw new BindingError(message);
        };
        function sharedRegisterType(rawType, registeredInstance, options = {}) {
          var name = registeredInstance.name;
          if (!rawType) throwBindingError(`type "${name}" must have a positive integer typeid pointer`);
          if (registeredTypes.hasOwnProperty(rawType)) if (options.ignoreDuplicateRegistrations) return;
          else throwBindingError(`Cannot register type '${name}' twice`);
          registeredTypes[rawType] = registeredInstance;
          delete typeDependencies[rawType];
          if (awaitingDependencies.hasOwnProperty(rawType)) {
            var callbacks = awaitingDependencies[rawType];
            delete awaitingDependencies[rawType];
            callbacks.forEach((cb) => cb());
          }
        }
        function registerType(rawType, registeredInstance, options = {}) {
          return sharedRegisterType(rawType, registeredInstance, options);
        }
        var HEAPU16;
        var HEAPU64;
        var integerReadValueFromPointer = (name, width, signed) => {
          switch (width) {
            case 1:
              return signed ? (pointer) => HEAP8[pointer >>> 0] : (pointer) => HEAPU8[pointer >>> 0];
            case 2:
              return signed ? (pointer) => HEAP16[pointer >>> 1 >>> 0] : (pointer) => HEAPU16[pointer >>> 1 >>> 0];
            case 4:
              return signed ? (pointer) => HEAP32[pointer >>> 2 >>> 0] : (pointer) => HEAPU32[pointer >>> 2 >>> 0];
            case 8:
              return signed ? (pointer) => HEAP64[pointer >>> 3 >>> 0] : (pointer) => HEAPU64[pointer >>> 3 >>> 0];
            default:
              throw new TypeError(`invalid integer width (${width}): ${name}`);
          }
        };
        var shallowCopyInternalPointer = (o) => ({ count: o.count, deleteScheduled: o.deleteScheduled, preservePointerOnDelete: o.preservePointerOnDelete, ptr: o.ptr, ptrType: o.ptrType, smartPtr: o.smartPtr, smartPtrType: o.smartPtrType });
        var throwInstanceAlreadyDeleted = (obj) => {
          throwBindingError((function(handle) {
            return handle.$$.ptrType.registeredClass.name;
          })(obj) + " instance already deleted");
        };
        var finalizationRegistry = false;
        var detachFinalizer = () => {
        };
        var runDestructor = ($$) => {
          if ($$.smartPtr) $$.smartPtrType.rawDestructor($$.smartPtr);
          else $$.ptrType.registeredClass.rawDestructor($$.ptr);
        };
        var releaseClassHandle = ($$) => {
          $$.count.value -= 1;
          var toDelete = 0 === $$.count.value;
          if (toDelete) runDestructor($$);
        };
        var attachFinalizer = (handle) => {
          if (!globalThis.FinalizationRegistry) {
            attachFinalizer = (handle2) => handle2;
            return handle;
          }
          finalizationRegistry = new FinalizationRegistry((info) => {
            releaseClassHandle(info.$$);
          });
          attachFinalizer = (handle2) => {
            var $$ = handle2.$$;
            var hasSmartPtr = !!$$.smartPtr;
            if (hasSmartPtr) {
              var info = { $$ };
              finalizationRegistry.register(handle2, info, handle2);
            }
            return handle2;
          };
          detachFinalizer = (handle2) => finalizationRegistry.unregister(handle2);
          return attachFinalizer(handle);
        };
        var deletionQueue = [];
        var flushPendingDeletes = () => {
          while (deletionQueue.length) {
            var obj = deletionQueue.pop();
            obj.$$.deleteScheduled = false;
            obj["delete"]();
          }
        };
        function ClassHandle() {
        }
        var createNamedFunction = (name, func) => Object.defineProperty(func, "name", { value: name });
        var registeredPointers = {};
        var ensureOverloadTable = (proto, methodName, humanName) => {
          if (void 0 === proto[methodName].overloadTable) {
            var prevFunc = proto[methodName];
            proto[methodName] = function(...args) {
              if (!proto[methodName].overloadTable.hasOwnProperty(args.length)) throwBindingError(`Function '${humanName}' called with an invalid number of arguments (${args.length}) - expects one of (${proto[methodName].overloadTable})!`);
              return proto[methodName].overloadTable[args.length].apply(this, args);
            };
            proto[methodName].overloadTable = [];
            proto[methodName].overloadTable[prevFunc.argCount] = prevFunc;
          }
        };
        var exposePublicSymbol = (name, value, numArguments) => {
          if (Module.hasOwnProperty(name)) {
            if (void 0 === numArguments || void 0 !== Module[name].overloadTable && void 0 !== Module[name].overloadTable[numArguments]) throwBindingError(`Cannot register public name '${name}' twice`);
            ensureOverloadTable(Module, name, name);
            if (Module[name].overloadTable.hasOwnProperty(numArguments)) throwBindingError(`Cannot register multiple overloads of a function with the same number of arguments (${numArguments})!`);
            Module[name].overloadTable[numArguments] = value;
          } else {
            Module[name] = value;
            Module[name].argCount = numArguments;
          }
        };
        var makeLegalFunctionName = (name) => {
          name = name.replace(/[^a-zA-Z0-9_]/g, "$");
          var f = name.charCodeAt(0);
          if (f >= 48 && f <= 57) return `_${name}`;
          return name;
        };
        function RegisteredClass(name, constructor, instancePrototype, rawDestructor, baseClass, getActualType, upcast, downcast) {
          this.name = name;
          this.constructor = constructor;
          this.instancePrototype = instancePrototype;
          this.rawDestructor = rawDestructor;
          this.baseClass = baseClass;
          this.getActualType = getActualType;
          this.upcast = upcast;
          this.downcast = downcast;
          this.pureVirtualFunctions = [];
        }
        var upcastPointer = (ptr, ptrClass, desiredClass) => {
          while (ptrClass !== desiredClass) {
            if (!ptrClass.upcast) throwBindingError(`Expected null or instance of ${desiredClass.name}, got an instance of ${ptrClass.name}`);
            ptr = ptrClass.upcast(ptr);
            ptrClass = ptrClass.baseClass;
          }
          return ptr;
        };
        var embindRepr = (v) => {
          if (v === null) return "null";
          var t = typeof v;
          if (t === "object" || t === "array" || t === "function") return v.toString();
          else return "" + v;
        };
        function constNoSmartPtrRawPointerToWireType(destructors, handle) {
          if (handle === null) {
            if (this.isReference) throwBindingError(`null is not a valid ${this.name}`);
            return 0;
          }
          if (!handle.$$) throwBindingError(`Cannot pass "${embindRepr(handle)}" as a ${this.name}`);
          if (!handle.$$.ptr) throwBindingError(`Cannot pass deleted object as a pointer of type ${this.name}`);
          var handleClass = handle.$$.ptrType.registeredClass;
          var ptr = upcastPointer(handle.$$.ptr, handleClass, this.registeredClass);
          return ptr;
        }
        function genericPointerToWireType(destructors, handle) {
          var ptr;
          if (handle === null) {
            if (this.isReference) throwBindingError(`null is not a valid ${this.name}`);
            if (this.isSmartPointer) {
              ptr = this.rawConstructor();
              if (destructors !== null) destructors.push(this.rawDestructor, ptr);
              return ptr;
            } else return 0;
          }
          if (!handle || !handle.$$) throwBindingError(`Cannot pass "${embindRepr(handle)}" as a ${this.name}`);
          if (!handle.$$.ptr) throwBindingError(`Cannot pass deleted object as a pointer of type ${this.name}`);
          if (!this.isConst && handle.$$.ptrType.isConst) throwBindingError(`Cannot convert argument of type ${handle.$$.smartPtrType ? handle.$$.smartPtrType.name : handle.$$.ptrType.name} to parameter type ${this.name}`);
          var handleClass = handle.$$.ptrType.registeredClass;
          ptr = upcastPointer(handle.$$.ptr, handleClass, this.registeredClass);
          if (this.isSmartPointer) {
            if (void 0 === handle.$$.smartPtr) throwBindingError("Passing raw pointer to smart pointer is illegal");
            switch (this.sharingPolicy) {
              case 0:
                if (handle.$$.smartPtrType === this) ptr = handle.$$.smartPtr;
                else throwBindingError(`Cannot convert argument of type ${handle.$$.smartPtrType ? handle.$$.smartPtrType.name : handle.$$.ptrType.name} to parameter type ${this.name}`);
                break;
              case 1:
                ptr = handle.$$.smartPtr;
                break;
              case 2:
                if (handle.$$.smartPtrType === this) ptr = handle.$$.smartPtr;
                else {
                  var clonedHandle = handle["clone"]();
                  ptr = this.rawShare(ptr, Emval.toHandle(() => clonedHandle["delete"]()));
                  if (destructors !== null) destructors.push(this.rawDestructor, ptr);
                }
                break;
              default:
                throwBindingError("Unsupported sharing policy");
            }
          }
          return ptr;
        }
        function nonConstNoSmartPtrRawPointerToWireType(destructors, handle) {
          if (handle === null) {
            if (this.isReference) throwBindingError(`null is not a valid ${this.name}`);
            return 0;
          }
          if (!handle.$$) throwBindingError(`Cannot pass "${embindRepr(handle)}" as a ${this.name}`);
          if (!handle.$$.ptr) throwBindingError(`Cannot pass deleted object as a pointer of type ${this.name}`);
          if (handle.$$.ptrType.isConst) throwBindingError(`Cannot convert argument of type ${handle.$$.ptrType.name} to parameter type ${this.name}`);
          var handleClass = handle.$$.ptrType.registeredClass;
          var ptr = upcastPointer(handle.$$.ptr, handleClass, this.registeredClass);
          return ptr;
        }
        function readPointer(pointer) {
          return this.fromWireType(HEAPU32[pointer >>> 2 >>> 0]);
        }
        var downcastPointer = (ptr, ptrClass, desiredClass) => {
          if (ptrClass === desiredClass) return ptr;
          if (void 0 === desiredClass.baseClass) return null;
          var rv = downcastPointer(ptr, ptrClass, desiredClass.baseClass);
          if (rv === null) return null;
          return desiredClass.downcast(rv);
        };
        var registeredInstances = {};
        var getBasestPointer = (class_, ptr) => {
          if (ptr === void 0) throwBindingError("ptr should not be undefined");
          while (class_.baseClass) {
            ptr = class_.upcast(ptr);
            class_ = class_.baseClass;
          }
          return ptr;
        };
        var getInheritedInstance = (class_, ptr) => {
          ptr = getBasestPointer(class_, ptr);
          return registeredInstances[ptr];
        };
        class InternalError extends Error {
          constructor(message) {
            super(message);
            this.name = "InternalError";
          }
        }
        var throwInternalError = (message) => {
          throw new InternalError(message);
        };
        var makeClassHandle = (prototype, record) => {
          if (!record.ptrType || !record.ptr) throwInternalError("makeClassHandle requires ptr and ptrType");
          var hasSmartPtrType = !!record.smartPtrType;
          var hasSmartPtr = !!record.smartPtr;
          if (hasSmartPtrType !== hasSmartPtr) throwInternalError("Both smartPtrType and smartPtr must be specified");
          record.count = { value: 1 };
          return attachFinalizer(Object.create(prototype, { $$: { value: record, writable: true } }));
        };
        function RegisteredPointer_fromWireType(ptr) {
          var rawPointer = this.getPointee(ptr);
          if (!rawPointer) {
            this.destructor(ptr);
            return null;
          }
          var registeredInstance = getInheritedInstance(this.registeredClass, rawPointer);
          if (void 0 !== registeredInstance) if (0 === registeredInstance.$$.count.value) {
            registeredInstance.$$.ptr = rawPointer;
            registeredInstance.$$.smartPtr = ptr;
            return registeredInstance["clone"]();
          } else {
            var rv = registeredInstance["clone"]();
            this.destructor(ptr);
            return rv;
          }
          function makeDefaultHandle() {
            if (this.isSmartPointer) return makeClassHandle(this.registeredClass.instancePrototype, { ptrType: this.pointeeType, ptr: rawPointer, smartPtrType: this, smartPtr: ptr });
            else return makeClassHandle(this.registeredClass.instancePrototype, { ptrType: this, ptr });
          }
          var actualType = this.registeredClass.getActualType(rawPointer);
          var registeredPointerRecord = registeredPointers[actualType];
          if (!registeredPointerRecord) return makeDefaultHandle.call(this);
          var toType;
          if (this.isConst) toType = registeredPointerRecord.constPointerType;
          else toType = registeredPointerRecord.pointerType;
          var dp = downcastPointer(rawPointer, this.registeredClass, toType.registeredClass);
          if (dp === null) return makeDefaultHandle.call(this);
          if (this.isSmartPointer) return makeClassHandle(toType.registeredClass.instancePrototype, { ptrType: toType, ptr: dp, smartPtrType: this, smartPtr: ptr });
          else return makeClassHandle(toType.registeredClass.instancePrototype, { ptrType: toType, ptr: dp });
        }
        function RegisteredPointer(name, registeredClass, isReference, isConst, isSmartPointer, pointeeType, sharingPolicy, rawGetPointee, rawConstructor, rawShare, rawDestructor) {
          this.name = name;
          this.registeredClass = registeredClass;
          this.isReference = isReference;
          this.isConst = isConst;
          this.isSmartPointer = isSmartPointer;
          this.pointeeType = pointeeType;
          this.sharingPolicy = sharingPolicy;
          this.rawGetPointee = rawGetPointee;
          this.rawConstructor = rawConstructor;
          this.rawShare = rawShare;
          this.rawDestructor = rawDestructor;
          if (!isSmartPointer && registeredClass.baseClass === void 0) if (isConst) {
            this.toWireType = constNoSmartPtrRawPointerToWireType;
            this.destructorFunction = null;
          } else {
            this.toWireType = nonConstNoSmartPtrRawPointerToWireType;
            this.destructorFunction = null;
          }
          else this.toWireType = genericPointerToWireType;
        }
        var replacePublicSymbol = (name, value, numArguments) => {
          if (!Module.hasOwnProperty(name)) throwInternalError("Replacing nonexistent public symbol");
          if (void 0 !== Module[name].overloadTable && void 0 !== numArguments) Module[name].overloadTable[numArguments] = value;
          else {
            Module[name] = value;
            Module[name].argCount = numArguments;
          }
        };
        var wasmTableMirror = [];
        var getWasmTableEntry = (funcPtr) => {
          var func = wasmTableMirror[funcPtr];
          if (!func) wasmTableMirror[funcPtr] = func = wasmTable.get(funcPtr);
          return func;
        };
        var dynCall = (sig, ptr, args = []) => {
          var func = getWasmTableEntry(ptr);
          var rtn = func(...args);
          return (function(rtn2) {
            return sig[0] == "p" ? rtn2 >>> 0 : rtn2;
          })(rtn);
        };
        var getDynCaller = (sig, ptr) => (...args) => dynCall(sig, ptr, args);
        var embind__requireFunction = (signature, rawFunction) => {
          signature = AsciiToString(signature);
          var fp = (function() {
            if (signature.includes("p")) return getDynCaller(signature, rawFunction);
            var rtn = getWasmTableEntry(rawFunction);
            return rtn;
          })();
          if (typeof fp !== "function") throwBindingError(`unknown function pointer with signature ${signature}: ${rawFunction}`);
          return fp;
        };
        class UnboundTypeError extends Error {
        }
        var getTypeName = (type) => {
          var ptr = ___getTypeName(type);
          var rv = AsciiToString(ptr);
          _free(ptr);
          return rv;
        };
        var throwUnboundTypeError = (message, types) => {
          var unboundTypes = [];
          var seen = {};
          types.forEach(function visit(type) {
            if (seen[type]) return;
            if (registeredTypes[type]) return;
            if (typeDependencies[type]) {
              typeDependencies[type].forEach(visit);
              return;
            }
            unboundTypes.push(type);
            seen[type] = true;
          });
          throw new UnboundTypeError(`${message}: ` + unboundTypes.map(getTypeName).join([", "]));
        };
        var whenDependentTypesAreResolved = (myTypes, dependentTypes, getTypeConverters) => {
          myTypes.forEach((type) => typeDependencies[type] = dependentTypes);
          function onComplete(typeConverters2) {
            var myTypeConverters = getTypeConverters(typeConverters2);
            if (myTypeConverters.length !== myTypes.length) throwInternalError("Mismatched type converter count");
            for (var i = 0; i < myTypes.length; ++i) registerType(myTypes[i], myTypeConverters[i]);
          }
          var typeConverters = new Array(dependentTypes.length);
          var unregisteredTypes = [];
          var registered = 0;
          for (let [i, dt] of dependentTypes.entries()) if (registeredTypes.hasOwnProperty(dt)) typeConverters[i] = registeredTypes[dt];
          else {
            unregisteredTypes.push(dt);
            if (!awaitingDependencies.hasOwnProperty(dt)) awaitingDependencies[dt] = [];
            awaitingDependencies[dt].push(() => {
              typeConverters[i] = registeredTypes[dt];
              ++registered;
              if (registered === unregisteredTypes.length) onComplete(typeConverters);
            });
          }
          if (0 === unregisteredTypes.length) onComplete(typeConverters);
        };
        var heap32VectorToArray = (count, firstElement) => {
          var array = [];
          for (var i = 0; i < count; i++) array.push(HEAPU32[firstElement + i * 4 >>> 2 >>> 0]);
          return array;
        };
        var runDestructors = (destructors) => {
          while (destructors.length) {
            var ptr = destructors.pop();
            var del = destructors.pop();
            del(ptr);
          }
        };
        function usesDestructorStack(argTypes) {
          for (var i = 1; i < argTypes.length; ++i) if (argTypes[i] !== null && argTypes[i].destructorFunction === void 0) return true;
          return false;
        }
        function argsUseStackAlloc(argTypes) {
          for (var i = 1; i < argTypes.length; ++i) if (argTypes[i] !== null && argTypes[i].argStackAlloc) return true;
          return false;
        }
        var stackSave = () => _emscripten_stack_get_current();
        var stackRestore = (val) => __emscripten_stack_restore(val);
        function createJsInvoker(argTypes, isClassMethodFunc, returns, isAsync) {
          var needsDestructorStack = usesDestructorStack(argTypes);
          var argsNeedStack = argsUseStackAlloc(argTypes);
          var useStackFrame = argsNeedStack && !isAsync && !needsDestructorStack;
          if (argsNeedStack && !useStackFrame) needsDestructorStack = true;
          var argCount = argTypes.length - 2;
          var argsList = [];
          var argsListWired = ["fn"];
          if (isClassMethodFunc) argsListWired.push("thisWired");
          for (var i = 0; i < argCount; ++i) {
            argsList.push(`arg${i}`);
            argsListWired.push(`arg${i}Wired`);
          }
          argsList = argsList.join();
          argsListWired = argsListWired.join();
          var invokerFnBody = `return function (${argsList}) {
`;
          if (needsDestructorStack) invokerFnBody += "var destructors = [];\n";
          if (useStackFrame) invokerFnBody += "var sp = stackSave();\ntry {\n";
          var dtorStack = needsDestructorStack ? "destructors" : "null";
          var args1 = ["humanName", "throwBindingError", "invoker", "fn", "runDestructors", "fromRetWire", "toClassParamWire"];
          if (useStackFrame) args1.push("stackSave", "stackRestore");
          if (isClassMethodFunc) invokerFnBody += `var thisWired = toClassParamWire(${dtorStack}, this);
`;
          for (i = 0; i < argCount; ++i) {
            var argName = `toArg${i}Wire`;
            invokerFnBody += `var arg${i}Wired = ${argName}(${dtorStack}, arg${i});
`;
            args1.push(argName);
          }
          invokerFnBody += (returns || isAsync ? "var rv = " : "") + `invoker(${argsListWired});
`;
          if (useStackFrame) invokerFnBody += "} finally {\nstackRestore(sp);\n}\n";
          if (needsDestructorStack) invokerFnBody += "runDestructors(destructors);\n";
          else for (i = isClassMethodFunc ? 1 : 2; i < argTypes.length; ++i) {
            var paramName = i === 1 ? "thisWired" : `arg${i - 2}Wired`;
            if (argTypes[i].destructorFunction !== null) {
              invokerFnBody += `${paramName}_dtor(${paramName});
`;
              args1.push(`${paramName}_dtor`);
            }
          }
          if (returns) invokerFnBody += "var ret = fromRetWire(rv);\nreturn ret;\n";
          invokerFnBody += "}\n";
          return new Function(args1, invokerFnBody);
        }
        function craftInvokerFunction(humanName, argTypes, classType, cppInvokerFunc, cppTargetFunc, isAsync) {
          var argCount = argTypes.length;
          if (argCount < 2) throwBindingError("argTypes array size mismatch! Must at least get return value and receiver (this) types!");
          var isClassMethodFunc = argTypes[1] !== null && classType !== null;
          var needsDestructorStack = usesDestructorStack(argTypes);
          var argsNeedStack = argsUseStackAlloc(argTypes);
          var useStackFrame = argsNeedStack && !isAsync && !needsDestructorStack;
          if (argsNeedStack && !useStackFrame) needsDestructorStack = true;
          var returns = !argTypes[0].isVoid;
          var retType = argTypes[0];
          var instType = argTypes[1];
          var closureArgs = [humanName, throwBindingError, cppInvokerFunc, cppTargetFunc, runDestructors, retType.fromWireType.bind(retType), instType?.toWireType.bind(instType)];
          if (useStackFrame) closureArgs.push(stackSave, stackRestore);
          for (var i = 2; i < argCount; ++i) {
            var argType = argTypes[i];
            closureArgs.push(argType.toWireType.bind(argType));
          }
          if (!needsDestructorStack) {
            for (i = isClassMethodFunc ? 1 : 2; i < argTypes.length; ++i) if (argTypes[i].destructorFunction !== null) closureArgs.push(argTypes[i].destructorFunction);
          }
          let invokerFactory = createJsInvoker(argTypes, isClassMethodFunc, returns, isAsync);
          var invokerFn = invokerFactory(...closureArgs);
          return createNamedFunction(humanName, invokerFn);
        }
        var getFunctionName = (signature) => {
          signature = signature.trim();
          const argsIndex = signature.indexOf("(");
          if (argsIndex === -1) return signature;
          return signature.slice(0, argsIndex);
        };
        var emval_freelist = [];
        var emval_handles = [0, 1, , 1, null, 1, true, 1, false, 1];
        var emval_exception_decrefs = [];
        function __emval_decref(handle) {
          handle >>>= 0;
          if (handle > 9 && 0 === --emval_handles[handle + 1]) {
            var value = emval_handles[handle];
            emval_handles[handle] = void 0;
            var destructor = emval_exception_decrefs[handle];
            if (destructor) {
              emval_exception_decrefs[handle] = void 0;
              destructor(value);
            }
            emval_freelist.push(handle);
          }
        }
        var Emval = { toValue: (handle) => {
          if (!handle) throwBindingError(`Cannot use deleted val. handle = ${handle}`);
          return emval_handles[handle];
        }, toHandle: (value) => {
          switch (value) {
            case void 0:
              return 2;
            case null:
              return 4;
            case true:
              return 6;
            case false:
              return 8;
            default: {
              const handle = emval_freelist.pop() || emval_handles.length;
              emval_handles[handle] = value;
              emval_handles[handle + 1] = 1;
              return handle;
            }
          }
        } };
        var EmValType = { name: "emscripten::val", fromWireType: (handle) => {
          var rv = Emval.toValue(handle);
          __emval_decref(handle);
          return rv;
        }, toWireType: (destructors, value) => Emval.toHandle(value), readValueFromPointer: readPointer, destructorFunction: null };
        var HEAPF32;
        var HEAPF64;
        var floatReadValueFromPointer = (name, width) => {
          switch (width) {
            case 4:
              return function(pointer) {
                return this.fromWireType(HEAPF32[pointer >>> 2 >>> 0]);
              };
            case 8:
              return function(pointer) {
                return this.fromWireType(HEAPF64[pointer >>> 3 >>> 0]);
              };
            default:
              throw new TypeError(`invalid float width (${width}): ${name}`);
          }
        };
        var installIndexedIterator = (proto, sizeMethodName, getMethodName) => {
          const makeIterator = (size, getValue) => {
            let index = 0;
            return { next() {
              if (index >= size) return { done: true };
              const current = index;
              index++;
              const value = getValue(current);
              return { value, done: false };
            }, [Symbol.iterator]() {
              return this;
            } };
          };
          if (!proto[Symbol.iterator]) proto[Symbol.iterator] = function() {
            const size = this[sizeMethodName]();
            return makeIterator(size, (i) => this[getMethodName](i));
          };
        };
        var EmValOptionalType = Object.assign({ optional: true }, EmValType);
        var stringToUTF8 = (str, outPtr, maxBytesToWrite) => stringToUTF8Array(str, HEAPU8, outPtr, maxBytesToWrite);
        var UTF16Decoder = globalThis.TextDecoder ? new TextDecoder("utf-16le") : void 0;
        var UTF16ToString = (ptr, maxBytesToRead, ignoreNul) => {
          var idx = ptr >>> 1;
          var endIdx = findStringEnd(HEAPU16, idx, maxBytesToRead / 2, ignoreNul);
          if (endIdx - idx > 16 && UTF16Decoder) return UTF16Decoder.decode(HEAPU16.subarray(idx >>> 0, endIdx >>> 0));
          var str = "";
          for (var i = idx; i < endIdx; ++i) {
            var codeUnit = HEAPU16[i >>> 0];
            str += String.fromCharCode(codeUnit);
          }
          return str;
        };
        var stringToUTF16 = (str, outPtr, maxBytesToWrite = 2147483647) => {
          if (maxBytesToWrite < 2) return 0;
          maxBytesToWrite -= 2;
          var startPtr = outPtr;
          var numCharsToWrite = maxBytesToWrite < str.length * 2 ? maxBytesToWrite / 2 : str.length;
          for (var i = 0; i < numCharsToWrite; ++i) {
            var codeUnit = str.charCodeAt(i);
            HEAP16[outPtr >>> 1 >>> 0] = codeUnit;
            outPtr += 2;
          }
          HEAP16[outPtr >>> 1 >>> 0] = 0;
          return outPtr - startPtr;
        };
        var lengthBytesUTF16 = (str) => str.length * 2;
        var UTF32ToString = (ptr, maxBytesToRead, ignoreNul) => {
          var str = "";
          var startIdx = ptr >>> 2;
          for (var i = 0; !(i >= maxBytesToRead / 4); i++) {
            var utf32 = HEAPU32[startIdx + i >>> 0];
            if (!utf32 && !ignoreNul) break;
            str += String.fromCodePoint(utf32);
          }
          return str;
        };
        var stringToUTF32 = (str, outPtr, maxBytesToWrite = 2147483647) => {
          outPtr >>>= 0;
          if (maxBytesToWrite < 4) return 0;
          var startPtr = outPtr;
          var endPtr = startPtr + maxBytesToWrite - 4;
          for (var i = 0; i < str.length; ++i) {
            var codePoint = str.codePointAt(i);
            if (codePoint > 65535) i++;
            HEAP32[outPtr >>> 2 >>> 0] = codePoint;
            outPtr += 4;
            if (outPtr + 4 > endPtr) break;
          }
          HEAP32[outPtr >>> 2 >>> 0] = 0;
          return outPtr - startPtr;
        };
        var lengthBytesUTF32 = (str) => {
          var len = 0;
          for (var i = 0; i < str.length; ++i) {
            var codePoint = str.codePointAt(i);
            if (codePoint > 65535) i++;
            len += 4;
          }
          return len;
        };
        var emval_methodCallers = [];
        var emval_addMethodCaller = (caller) => {
          var id = emval_methodCallers.length;
          emval_methodCallers.push(caller);
          return id;
        };
        var requireRegisteredType = (rawType, humanName) => {
          var impl = registeredTypes[rawType];
          if (void 0 === impl) throwBindingError(`${humanName} has unknown type ${getTypeName(rawType)}`);
          return impl;
        };
        var emval_lookupTypes = (argCount, argTypes) => {
          var a = new Array(argCount);
          for (var i = 0; i < argCount; ++i) a[i] = requireRegisteredType(HEAPU32[argTypes + i * 4 >>> 2 >>> 0], `parameter ${i}`);
          return a;
        };
        var emval_returnValue = (toReturnWire, destructorsRef, handle) => {
          var destructors = [];
          var result = toReturnWire(destructors, handle);
          if (destructors.length) HEAPU32[destructorsRef >>> 2 >>> 0] = Emval.toHandle(destructors);
          return result;
        };
        var emval_symbols = {};
        var getStringOrSymbol = (address) => {
          var symbol = emval_symbols[address];
          if (symbol === void 0) return AsciiToString(address);
          return symbol;
        };
        var isLeapYear = (year) => year % 4 === 0 && (year % 100 !== 0 || year % 400 === 0);
        var MONTH_DAYS_LEAP_CUMULATIVE = [0, 31, 60, 91, 121, 152, 182, 213, 244, 274, 305, 335];
        var MONTH_DAYS_REGULAR_CUMULATIVE = [0, 31, 59, 90, 120, 151, 181, 212, 243, 273, 304, 334];
        var ydayFromDate = (date) => {
          var leap = isLeapYear(date.getFullYear());
          var monthDaysCumulative = leap ? MONTH_DAYS_LEAP_CUMULATIVE : MONTH_DAYS_REGULAR_CUMULATIVE;
          var yday = monthDaysCumulative[date.getMonth()] + date.getDate() - 1;
          return yday;
        };
        var _emscripten_get_now = () => performance.now();
        var _emscripten_date_now = () => Date.now();
        var checkWasiClock = (clock_id) => clock_id >= 0 && clock_id <= 3;
        var getHeapMax = () => 4294901760;
        var growMemory = (size) => {
          var oldHeapSize = wasmMemory.buffer.byteLength;
          var pages = (size - oldHeapSize + 65535) / 65536 | 0;
          try {
            wasmMemory.grow(pages);
            updateMemoryViews();
            return 1;
          } catch (e) {
          }
        };
        var ENV = {};
        var getExecutableName = () => thisProgram;
        var getEnvStrings = () => {
          if (!getEnvStrings.strings) {
            var lang = (globalThis.navigator?.language ?? "C").replace("-", "_") + ".UTF-8";
            var env = { USER: "web_user", LOGNAME: "web_user", PATH: "/", PWD: "/", HOME: "/home/web_user", LANG: lang, _: getExecutableName() };
            for (var x in ENV) if (ENV[x] === void 0) delete env[x];
            else env[x] = ENV[x];
            var strings = [];
            for (var x in env) strings.push(`${x}=${env[x]}`);
            getEnvStrings.strings = strings;
          }
          return getEnvStrings.strings;
        };
        var doReadv = (stream, iov, iovcnt, offset) => {
          var ret = 0;
          for (var i = 0; i < iovcnt; i++) {
            var ptr = HEAPU32[iov >>> 2 >>> 0];
            var len = HEAPU32[iov + 4 >>> 2 >>> 0];
            iov += 8;
            try {
              var curr = FS.read(stream, HEAP8, ptr, len, offset);
            } catch (e) {
              if (ret > 0 && e instanceof FS.ErrnoError && (e.errno == 6 || e.errno == 6)) break;
              throw e;
            }
            if (curr < 0) return -1;
            ret += curr;
            if (curr < len) break;
            if (typeof offset !== "undefined") offset += curr;
          }
          return ret;
        };
        var doWritev = (stream, iov, iovcnt, offset) => {
          if (iovcnt == 1) return FS.write(stream, HEAP8, HEAPU32[iov >>> 2 >>> 0], HEAPU32[iov + 4 >>> 2 >>> 0], offset);
          var total = 0;
          for (var i = 0, p = iov; i < iovcnt; i++, p += 8) total += HEAPU32[p + 4 >>> 2 >>> 0];
          var view = new Uint8Array(total);
          var voff = 0;
          for (i = 0; i < iovcnt; i++, iov += 8) {
            var ptr = HEAPU32[iov >>> 2 >>> 0];
            var len = HEAPU32[iov + 4 >>> 2 >>> 0];
            view.set(HEAPU8.subarray(ptr >>> 0, ptr + len >>> 0), voff);
            voff += len;
          }
          return FS.write(stream, view, 0, total, offset);
        };
        FS.createPreloadedFile = (parent, name, url, canRead, canWrite, onload, onerror, dontCreateFile, canOwn, preFinish) => {
          FS_preloadFile(parent, name, url, canRead, canWrite, dontCreateFile, canOwn, preFinish).then(onload).catch(onerror);
        };
        FS.preloadFile = FS_preloadFile;
        FS.staticInit();
        (() => {
          let proto = ClassHandle.prototype;
          Object.assign(proto, { isAliasOf(other) {
            if (!(this instanceof ClassHandle)) return false;
            if (!(other instanceof ClassHandle)) return false;
            var leftClass = this.$$.ptrType.registeredClass;
            var left = this.$$.ptr;
            other.$$ = other.$$;
            var rightClass = other.$$.ptrType.registeredClass;
            var right = other.$$.ptr;
            while (leftClass.baseClass) {
              left = leftClass.upcast(left);
              leftClass = leftClass.baseClass;
            }
            while (rightClass.baseClass) {
              right = rightClass.upcast(right);
              rightClass = rightClass.baseClass;
            }
            return leftClass === rightClass && left === right;
          }, clone() {
            if (!this.$$.ptr) throwInstanceAlreadyDeleted(this);
            if (this.$$.preservePointerOnDelete) {
              this.$$.count.value += 1;
              return this;
            } else {
              var clone = attachFinalizer(Object.create(Object.getPrototypeOf(this), { $$: { value: shallowCopyInternalPointer(this.$$) } }));
              clone.$$.count.value += 1;
              clone.$$.deleteScheduled = false;
              return clone;
            }
          }, delete() {
            if (!this.$$.ptr) throwInstanceAlreadyDeleted(this);
            if (this.$$.deleteScheduled && !this.$$.preservePointerOnDelete) throwBindingError("Object already scheduled for deletion");
            detachFinalizer(this);
            releaseClassHandle(this.$$);
            if (!this.$$.preservePointerOnDelete) {
              this.$$.smartPtr = void 0;
              this.$$.ptr = void 0;
            }
          }, isDeleted() {
            return !this.$$.ptr;
          }, deleteLater() {
            if (!this.$$.ptr) throwInstanceAlreadyDeleted(this);
            if (this.$$.deleteScheduled && !this.$$.preservePointerOnDelete) throwBindingError("Object already scheduled for deletion");
            deletionQueue.push(this);
            if (deletionQueue.length === 1 && void 0) (void 0)(flushPendingDeletes);
            this.$$.deleteScheduled = true;
            return this;
          } });
          const symbolDispose = Symbol.dispose;
          if (symbolDispose) proto[symbolDispose] = proto["delete"];
        })();
        (() => {
          Object.assign(RegisteredPointer.prototype, { getPointee(ptr) {
            if (this.rawGetPointee) ptr = this.rawGetPointee(ptr);
            return ptr;
          }, destructor(ptr) {
            this.rawDestructor?.(ptr);
          }, readValueFromPointer: readPointer, fromWireType: RegisteredPointer_fromWireType });
        })();
        if (Module["noExitRuntime"]) Module["noExitRuntime"];
        if (Module["print"]) out = Module["print"];
        if (Module["printErr"]) err = Module["printErr"];
        if (Module["arguments"]) Module["arguments"];
        if (Module["thisProgram"]) thisProgram = Module["thisProgram"];
        var preInit = Module["preInit"];
        if (preInit) {
          if (typeof preInit === "function") Module["preInit"] = preInit = [preInit];
          while (preInit.length > 0) preInit.shift()();
        }
        var ___getTypeName, _malloc, _free, _emscripten_builtin_memalign, _emscripten_stack_get_end, ___trap, _emscripten_stack_init, __emscripten_stack_restore, _emscripten_stack_get_current, wasmMemory, wasmTable;
        function assignWasmExports(wasmExports2) {
          ___getTypeName = wasmExports2["Z"];
          _malloc = wasmExports2["$"];
          _free = wasmExports2["aa"];
          _emscripten_builtin_memalign = wasmExports2["ba"];
          _emscripten_stack_get_end = wasmExports2["ca"];
          ___trap = wasmExports2["da"];
          _emscripten_stack_init = wasmExports2["ea"];
          __emscripten_stack_restore = wasmExports2["fa"];
          _emscripten_stack_get_current = wasmExports2["ga"];
          wasmMemory = wasmExports2["X"];
          wasmTable = wasmExports2["_"];
        }
        var wasmImports = { q: function(fd, cmd, varargs) {
          varargs >>>= 0;
          SYSCALLS.varargs = varargs;
          try {
            var stream = SYSCALLS.getStreamFromFD(fd);
            switch (cmd) {
              case 0:
                var arg = syscallGetVarargI();
                if (arg < 0) return -28;
                while (FS.streams[arg]) arg++;
                var newStream;
                newStream = FS.dupStream(stream, arg);
                return newStream.fd;
              case 1:
              case 2:
                return 0;
              case 3:
                return stream.flags;
              case 4:
                arg = syscallGetVarargI();
                stream.flags = stream.flags & -289793 | arg & 289792;
                return 0;
              case 12:
                arg = syscallGetVarargP();
                HEAP16[arg + 0 >>> 1 >>> 0] = 2;
                return 0;
              case 13:
              case 14:
                return 0;
            }
            return -28;
          } catch (e) {
            if (typeof FS === "undefined" || !(e.name === "ErrnoError")) throw e;
            return -e.errno;
          }
        }, Q: function(fd, buf) {
          buf >>>= 0;
          try {
            return SYSCALLS.writeStat(buf, FS.fstat(fd));
          } catch (e) {
            if (typeof FS === "undefined" || !(e.name === "ErrnoError")) throw e;
            return -e.errno;
          }
        }, R: function(fd, op, varargs) {
          varargs >>>= 0;
          SYSCALLS.varargs = varargs;
          try {
            var stream = SYSCALLS.getStreamFromFD(fd);
            switch (op) {
              case 21509:
                if (!stream.tty) return -59;
                return 0;
              case 21505:
                if (!stream.tty) return -59;
                if (stream.tty.ops.ioctl_tcgets) {
                  var termios = stream.tty.ops.ioctl_tcgets(stream);
                  var argp = syscallGetVarargP();
                  HEAP32[argp >>> 2 >>> 0] = termios.c_iflag || 0;
                  HEAP32[argp + 4 >>> 2 >>> 0] = termios.c_oflag || 0;
                  HEAP32[argp + 8 >>> 2 >>> 0] = termios.c_cflag || 0;
                  HEAP32[argp + 12 >>> 2 >>> 0] = termios.c_lflag || 0;
                  for (var i = 0; i < 32; i++) HEAP8[argp + i + 17 >>> 0] = termios.c_cc[i] || 0;
                  return 0;
                }
                return 0;
              case 21510:
              case 21511:
              case 21512:
                if (!stream.tty) return -59;
                return 0;
              case 21506:
              case 21507:
              case 21508:
                if (!stream.tty) return -59;
                if (stream.tty.ops.ioctl_tcsets) {
                  argp = syscallGetVarargP();
                  var c_iflag = HEAP32[argp >>> 2 >>> 0];
                  var c_oflag = HEAP32[argp + 4 >>> 2 >>> 0];
                  var c_cflag = HEAP32[argp + 8 >>> 2 >>> 0];
                  var c_lflag = HEAP32[argp + 12 >>> 2 >>> 0];
                  var c_cc = [];
                  for (i = 0; i < 32; i++) c_cc.push(HEAP8[argp + i + 17 >>> 0]);
                  return stream.tty.ops.ioctl_tcsets(stream.tty, op, { c_iflag, c_oflag, c_cflag, c_lflag, c_cc });
                }
                return 0;
              case 21519:
                if (!stream.tty) return -59;
                argp = syscallGetVarargP();
                HEAP32[argp >>> 2 >>> 0] = 0;
                return 0;
              case 21520:
                if (!stream.tty) return -59;
                return -28;
              case 21537:
              case 21531:
                argp = syscallGetVarargP();
                return FS.ioctl(stream, op, argp);
              case 21523:
                if (!stream.tty) return -59;
                if (stream.tty.ops.ioctl_tiocgwinsz) {
                  var winsize = stream.tty.ops.ioctl_tiocgwinsz(stream.tty);
                  argp = syscallGetVarargP();
                  HEAP16[argp >>> 1 >>> 0] = winsize[0];
                  HEAP16[argp + 2 >>> 1 >>> 0] = winsize[1];
                }
                return 0;
              case 21524:
                if (!stream.tty) return -59;
                return 0;
              case 21515:
                if (!stream.tty) return -59;
                return 0;
              default:
                return -28;
            }
          } catch (e) {
            if (typeof FS === "undefined" || !(e.name === "ErrnoError")) throw e;
            return -e.errno;
          }
        }, P: function(dirfd, path, buf, flags) {
          path >>>= 0;
          buf >>>= 0;
          try {
            path = SYSCALLS.getStr(path);
            var nofollow = flags & 256;
            var allowEmpty = flags & 4096;
            flags &= -6401;
            path = SYSCALLS.calculateAt(dirfd, path, allowEmpty);
            return SYSCALLS.writeStat(buf, nofollow ? FS.lstat(path) : FS.stat(path));
          } catch (e) {
            if (typeof FS === "undefined" || !(e.name === "ErrnoError")) throw e;
            return -e.errno;
          }
        }, B: function(dirfd, path, flags, varargs) {
          path >>>= 0;
          varargs >>>= 0;
          SYSCALLS.varargs = varargs;
          try {
            path = SYSCALLS.getStr(path);
            path = SYSCALLS.calculateAt(dirfd, path);
            var mode = varargs ? syscallGetVarargI() : 0;
            if (flags & 64) mode &= ~SYSCALLS.currentUmask;
            return FS.open(path, flags, mode).fd;
          } catch (e) {
            if (typeof FS === "undefined" || !(e.name === "ErrnoError")) throw e;
            return -e.errno;
          }
        }, H: () => abort(""), E: function(primitiveType, name, size, minRange, maxRange) {
          primitiveType >>>= 0;
          name >>>= 0;
          size >>>= 0;
          name = AsciiToString(name);
          const isUnsignedType = minRange === 0n;
          let fromWireType = (value) => value;
          if (isUnsignedType) {
            const bitSize = size * 8;
            fromWireType = (value) => BigInt.asUintN(bitSize, value);
            maxRange = fromWireType(maxRange);
          }
          registerType(primitiveType, { name, fromWireType, toWireType: (destructors, value) => {
            if (typeof value === "number") value = BigInt(value);
            return value;
          }, readValueFromPointer: integerReadValueFromPointer(name, size, !isUnsignedType), destructorFunction: null });
        }, V: function(rawType, name, trueValue, falseValue) {
          rawType >>>= 0;
          name >>>= 0;
          name = AsciiToString(name);
          registerType(rawType, { name, fromWireType: function(wt) {
            return !!wt;
          }, toWireType: function(destructors, o) {
            return o ? trueValue : falseValue;
          }, readValueFromPointer: function(pointer) {
            return this.fromWireType(HEAPU8[pointer >>> 0]);
          }, destructorFunction: null });
        }, l: function(rawType, rawPointerType, rawConstPointerType, baseClassRawType, getActualTypeSignature, getActualType, upcastSignature, upcast, downcastSignature, downcast, name, destructorSignature, rawDestructor) {
          rawType >>>= 0;
          rawPointerType >>>= 0;
          rawConstPointerType >>>= 0;
          baseClassRawType >>>= 0;
          getActualTypeSignature >>>= 0;
          getActualType >>>= 0;
          upcastSignature >>>= 0;
          upcast >>>= 0;
          downcastSignature >>>= 0;
          downcast >>>= 0;
          name >>>= 0;
          destructorSignature >>>= 0;
          rawDestructor >>>= 0;
          name = AsciiToString(name);
          getActualType = embind__requireFunction(getActualTypeSignature, getActualType);
          upcast && (upcast = embind__requireFunction(upcastSignature, upcast));
          downcast && (downcast = embind__requireFunction(downcastSignature, downcast));
          rawDestructor = embind__requireFunction(destructorSignature, rawDestructor);
          var legalFunctionName = makeLegalFunctionName(name);
          exposePublicSymbol(legalFunctionName, function() {
            throwUnboundTypeError(`Cannot construct ${name} due to unbound types`, [baseClassRawType]);
          });
          whenDependentTypesAreResolved([rawType, rawPointerType, rawConstPointerType], baseClassRawType ? [baseClassRawType] : [], (base) => {
            var _a;
            base = base[0];
            var baseClass;
            var basePrototype;
            if (baseClassRawType) {
              baseClass = base.registeredClass;
              basePrototype = baseClass.instancePrototype;
            } else basePrototype = ClassHandle.prototype;
            var constructor = createNamedFunction(name, function(...args) {
              if (Object.getPrototypeOf(this) !== instancePrototype) throw new BindingError(`Use 'new' to construct ${name}`);
              if (void 0 === registeredClass.constructor_body) throw new BindingError(`${name} has no accessible constructor`);
              var body = registeredClass.constructor_body[args.length];
              if (void 0 === body) throw new BindingError(`Tried to invoke ctor of ${name} with invalid number of parameters (${args.length}) - expected (${Object.keys(registeredClass.constructor_body).toString()}) parameters instead!`);
              return body.apply(this, args);
            });
            var instancePrototype = Object.create(basePrototype, { constructor: { value: constructor } });
            constructor.prototype = instancePrototype;
            var registeredClass = new RegisteredClass(name, constructor, instancePrototype, rawDestructor, baseClass, getActualType, upcast, downcast);
            if (registeredClass.baseClass) {
              (_a = registeredClass.baseClass).__derivedClasses ?? (_a.__derivedClasses = []);
              registeredClass.baseClass.__derivedClasses.push(registeredClass);
            }
            var referenceConverter = new RegisteredPointer(name, registeredClass, true, false, false);
            var pointerConverter = new RegisteredPointer(name + "*", registeredClass, false, false, false);
            var constPointerConverter = new RegisteredPointer(name + " const*", registeredClass, false, true, false);
            registeredPointers[rawType] = { pointerType: pointerConverter, constPointerType: constPointerConverter };
            replacePublicSymbol(legalFunctionName, constructor);
            return [referenceConverter, pointerConverter, constPointerConverter];
          });
        }, o: function(rawClassType, argCount, rawArgTypesAddr, invokerSignature, invoker, rawConstructor) {
          rawClassType >>>= 0;
          rawArgTypesAddr >>>= 0;
          invokerSignature >>>= 0;
          invoker >>>= 0;
          rawConstructor >>>= 0;
          var rawArgTypes = heap32VectorToArray(argCount, rawArgTypesAddr);
          invoker = embind__requireFunction(invokerSignature, invoker);
          whenDependentTypesAreResolved([], [rawClassType], (classType) => {
            classType = classType[0];
            var humanName = `constructor ${classType.name}`;
            if (void 0 === classType.registeredClass.constructor_body) classType.registeredClass.constructor_body = [];
            if (void 0 !== classType.registeredClass.constructor_body[argCount - 1]) throw new BindingError(`Cannot register multiple constructors with identical number of parameters (${argCount - 1}) for class '${classType.name}'! Overload resolution is currently only performed using the parameter count, not actual type info!`);
            classType.registeredClass.constructor_body[argCount - 1] = () => {
              throwUnboundTypeError(`Cannot construct ${classType.name} due to unbound types`, rawArgTypes);
            };
            whenDependentTypesAreResolved([], rawArgTypes, (argTypes) => {
              argTypes.splice(1, 0, null);
              classType.registeredClass.constructor_body[argCount - 1] = craftInvokerFunction(humanName, argTypes, null, invoker, rawConstructor);
              return [];
            });
            return [];
          });
        }, a: function(rawClassType, methodName, argCount, rawArgTypesAddr, invokerSignature, rawInvoker, context, isPureVirtual, isAsync) {
          rawClassType >>>= 0;
          methodName >>>= 0;
          rawArgTypesAddr >>>= 0;
          invokerSignature >>>= 0;
          rawInvoker >>>= 0;
          context >>>= 0;
          var rawArgTypes = heap32VectorToArray(argCount, rawArgTypesAddr);
          methodName = AsciiToString(methodName);
          methodName = getFunctionName(methodName);
          rawInvoker = embind__requireFunction(invokerSignature, rawInvoker);
          whenDependentTypesAreResolved([], [rawClassType], (classType) => {
            classType = classType[0];
            var humanName = `${classType.name}.${methodName}`;
            if (methodName.startsWith("@@")) methodName = Symbol[methodName.substring(2)];
            if (isPureVirtual) classType.registeredClass.pureVirtualFunctions.push(methodName);
            function unboundTypesHandler() {
              throwUnboundTypeError(`Cannot call ${humanName} due to unbound types`, rawArgTypes);
            }
            var proto = classType.registeredClass.instancePrototype;
            var method = proto[methodName];
            if (void 0 === method || void 0 === method.overloadTable && method.className !== classType.name && method.argCount === argCount - 2) {
              unboundTypesHandler.argCount = argCount - 2;
              unboundTypesHandler.className = classType.name;
              proto[methodName] = unboundTypesHandler;
            } else {
              ensureOverloadTable(proto, methodName, humanName);
              proto[methodName].overloadTable[argCount - 2] = unboundTypesHandler;
            }
            whenDependentTypesAreResolved([], rawArgTypes, (argTypes) => {
              var memberFunction = craftInvokerFunction(humanName, argTypes, classType, rawInvoker, context, isAsync);
              if (void 0 === proto[methodName].overloadTable) {
                memberFunction.argCount = argCount - 2;
                proto[methodName] = memberFunction;
              } else proto[methodName].overloadTable[argCount - 2] = memberFunction;
              return [];
            });
            return [];
          });
        }, T: function(rawType) {
          rawType >>>= 0;
          return registerType(rawType, EmValType);
        }, D: function(rawType, name, size) {
          rawType >>>= 0;
          name >>>= 0;
          size >>>= 0;
          name = AsciiToString(name);
          registerType(rawType, { name, fromWireType: (value) => value, toWireType: (destructors, value) => value, readValueFromPointer: floatReadValueFromPointer(name, size), destructorFunction: null });
        }, f: function(name, argCount, rawArgTypesAddr, signature, rawInvoker, fn, isAsync) {
          name >>>= 0;
          rawArgTypesAddr >>>= 0;
          signature >>>= 0;
          rawInvoker >>>= 0;
          fn >>>= 0;
          var argTypes = heap32VectorToArray(argCount, rawArgTypesAddr);
          name = AsciiToString(name);
          name = getFunctionName(name);
          rawInvoker = embind__requireFunction(signature, rawInvoker);
          exposePublicSymbol(name, function() {
            throwUnboundTypeError(`Cannot call ${name} due to unbound types`, argTypes);
          }, argCount - 1);
          whenDependentTypesAreResolved([], argTypes, (argTypes2) => {
            var invokerArgsArray = [argTypes2[0], null].concat(argTypes2.slice(1));
            replacePublicSymbol(name, craftInvokerFunction(name, invokerArgsArray, null, rawInvoker, fn, isAsync), argCount - 1);
            return [];
          });
        }, k: function(primitiveType, name, size, minRange, maxRange) {
          primitiveType >>>= 0;
          name >>>= 0;
          size >>>= 0;
          name = AsciiToString(name);
          const isUnsignedType = minRange === 0;
          let fromWireType = (value) => value;
          if (isUnsignedType) {
            var bitshift = 32 - 8 * size;
            fromWireType = (value) => value << bitshift >>> bitshift;
            maxRange = fromWireType(maxRange);
          }
          registerType(primitiveType, { name, fromWireType, toWireType: (destructors, value) => value, readValueFromPointer: integerReadValueFromPointer(name, size, minRange !== 0), destructorFunction: null });
        }, x: function(rawClassType, rawElementType, sizeMethodName, getMethodName) {
          rawClassType >>>= 0;
          rawElementType >>>= 0;
          sizeMethodName >>>= 0;
          getMethodName >>>= 0;
          sizeMethodName = AsciiToString(sizeMethodName);
          getMethodName = AsciiToString(getMethodName);
          whenDependentTypesAreResolved([], [rawClassType, rawElementType], (types) => {
            const classType = types[0];
            installIndexedIterator(classType.registeredClass.instancePrototype, sizeMethodName, getMethodName);
            return [];
          });
        }, h: function(rawType, dataTypeIndex, name) {
          rawType >>>= 0;
          name >>>= 0;
          var typeMapping = [Int8Array, Uint8Array, Int16Array, Uint16Array, Int32Array, Uint32Array, Float32Array, Float64Array, BigInt64Array, BigUint64Array];
          var TA = typeMapping[dataTypeIndex];
          function decodeMemoryView(handle) {
            var size = HEAPU32[handle >>> 2 >>> 0];
            var data = HEAPU32[handle + 4 >>> 2 >>> 0];
            return new TA(HEAP8.buffer, data, size);
          }
          name = AsciiToString(name);
          registerType(rawType, { name, fromWireType: decodeMemoryView, readValueFromPointer: decodeMemoryView }, { ignoreDuplicateRegistrations: true });
        }, y: function(rawOptionalType, rawType) {
          rawOptionalType >>>= 0;
          rawType >>>= 0;
          registerType(rawOptionalType, EmValOptionalType);
        }, U: function(rawType, name) {
          rawType >>>= 0;
          name >>>= 0;
          name = AsciiToString(name);
          registerType(rawType, { name, fromWireType(value) {
            var length = HEAPU32[value >>> 2 >>> 0];
            var payload = value + 4;
            var str;
            if (true) str = UTF8ToString(payload, length, true);
            else {
              str = "";
              for (var i = 0; i < length; ++i) str += String.fromCharCode(HEAPU8[payload + i >>> 0]);
            }
            _free(value);
            return str;
          }, toWireType(destructors, value) {
            if (value instanceof ArrayBuffer) value = new Uint8Array(value);
            var length;
            var valueIsOfTypeString = typeof value === "string";
            if (!(valueIsOfTypeString || ArrayBuffer.isView(value) && value.BYTES_PER_ELEMENT == 1)) throwBindingError("Cannot pass non-string to std::string");
            if (true, valueIsOfTypeString) length = lengthBytesUTF8(value);
            else length = value.length;
            var base = _malloc(4 + length + 1);
            var ptr = base + 4;
            HEAPU32[base >>> 2 >>> 0] = length;
            if (valueIsOfTypeString) if (true) stringToUTF8(value, ptr, length + 1);
            else for (var i = 0; i < length; ++i) {
              var charCode = value.charCodeAt(i);
              if (charCode > 255) {
                _free(base);
                throwBindingError("String has UTF-16 code units that do not fit in 8 bits");
              }
              HEAPU8[ptr + i >>> 0] = charCode;
            }
            else HEAPU8.set(value, ptr >>> 0);
            if (destructors !== null) destructors.push(_free, base);
            return base;
          }, readValueFromPointer: readPointer, destructorFunction(ptr) {
            _free(ptr);
          } });
        }, s: function(rawType, charSize, name) {
          rawType >>>= 0;
          charSize >>>= 0;
          name >>>= 0;
          name = AsciiToString(name);
          var decodeString, encodeString, lengthBytesUTF;
          if (charSize === 2) {
            decodeString = UTF16ToString;
            encodeString = stringToUTF16;
            lengthBytesUTF = lengthBytesUTF16;
          } else {
            decodeString = UTF32ToString;
            encodeString = stringToUTF32;
            lengthBytesUTF = lengthBytesUTF32;
          }
          registerType(rawType, { name, fromWireType: (value) => {
            var length = HEAPU32[value >>> 2 >>> 0];
            var str = decodeString(value + 4, length * charSize, true);
            _free(value);
            return str;
          }, toWireType: (destructors, value) => {
            if (!(typeof value === "string")) throwBindingError(`Cannot pass non-string to C++ string type ${name}`);
            var length = lengthBytesUTF(value);
            var ptr = _malloc(4 + length + charSize);
            HEAPU32[ptr >>> 2 >>> 0] = length / charSize;
            encodeString(value, ptr + 4, length + charSize);
            if (destructors !== null) destructors.push(_free, ptr);
            return ptr;
          }, readValueFromPointer: readPointer, destructorFunction(ptr) {
            _free(ptr);
          } });
        }, W: function(rawType, name) {
          rawType >>>= 0;
          name >>>= 0;
          name = AsciiToString(name);
          registerType(rawType, { isVoid: true, name, fromWireType: () => {
          }, toWireType: () => {
          } });
        }, d: function(argCount, argTypesPtr, kind) {
          argTypesPtr >>>= 0;
          var [retType, ...argTypes] = emval_lookupTypes(argCount, argTypesPtr);
          var toReturnWire = retType.toWireType.bind(retType);
          var argFromPtr = argTypes.map((type) => type.readValueFromPointer.bind(type));
          argCount--;
          var captures = { toValue: Emval.toValue };
          var args = argFromPtr.map((argFromPtr2, i) => {
            var captureName = `argFromPtr${i}`;
            captures[captureName] = argFromPtr2;
            return `${captureName}(args${i ? "+" + i * 8 : ""})`;
          });
          var functionBody;
          switch (kind) {
            case 0:
              functionBody = "toValue(handle)";
              break;
            case 2:
              functionBody = "new (toValue(handle))";
              break;
            case 3:
              functionBody = "";
              break;
            case 1:
              captures["getStringOrSymbol"] = getStringOrSymbol;
              functionBody = "toValue(handle)[getStringOrSymbol(methodName)]";
              break;
          }
          functionBody += `(${args})`;
          if (!retType.isVoid) {
            captures["toReturnWire"] = toReturnWire;
            captures["emval_returnValue"] = emval_returnValue;
            functionBody = `return emval_returnValue(toReturnWire, destructorsRef, ${functionBody})`;
          }
          functionBody = `return function (handle, methodName, destructorsRef, args) {
${functionBody}
}`;
          var invokerFunction = new Function(Object.keys(captures), functionBody)(...Object.values(captures));
          var functionName = `methodCaller<(${argTypes.map((t) => t.name)}) => ${retType.name}>`;
          return emval_addMethodCaller(createNamedFunction(functionName, invokerFunction));
        }, b: __emval_decref, u: function(name) {
          name >>>= 0;
          if (!name) return Emval.toHandle(globalThis);
          name = getStringOrSymbol(name);
          return Emval.toHandle(globalThis[name]);
        }, t: function(name) {
          name >>>= 0;
          name = getStringOrSymbol(name);
          return Emval.toHandle(Module[name]);
        }, j: function(handle, key) {
          handle >>>= 0;
          key >>>= 0;
          handle = Emval.toValue(handle);
          key = Emval.toValue(key);
          return Emval.toHandle(handle[key]);
        }, g: function(handle) {
          handle >>>= 0;
          if (handle > 9) emval_handles[handle + 1] += 1;
        }, n: function(object, constructor) {
          object >>>= 0;
          constructor >>>= 0;
          object = Emval.toValue(object);
          constructor = Emval.toValue(constructor);
          return object instanceof constructor;
        }, e: function(caller, handle, methodName, destructorsRef, args) {
          caller >>>= 0;
          handle >>>= 0;
          methodName >>>= 0;
          destructorsRef >>>= 0;
          args >>>= 0;
          return emval_methodCallers[caller](handle, methodName, destructorsRef, args);
        }, v: function() {
          return Emval.toHandle([]);
        }, i: function(v) {
          v >>>= 0;
          return Emval.toHandle(getStringOrSymbol(v));
        }, p: function() {
          return Emval.toHandle({});
        }, c: function(handle) {
          handle >>>= 0;
          var destructors = Emval.toValue(handle);
          runDestructors(destructors);
          __emval_decref(handle);
        }, m: function(handle, key, value) {
          handle >>>= 0;
          key >>>= 0;
          value >>>= 0;
          handle = Emval.toValue(handle);
          key = Emval.toValue(key);
          value = Emval.toValue(value);
          handle[key] = value;
        }, w: function(handle) {
          handle >>>= 0;
          handle = Emval.toValue(handle);
          return Emval.toHandle(typeof handle);
        }, K: function(time, tmPtr) {
          time = bigintToI53Checked(time);
          tmPtr >>>= 0;
          var date = new Date(time * 1e3);
          if (isNaN(date.getTime())) return 1;
          HEAP32[tmPtr >>> 2 >>> 0] = date.getSeconds();
          HEAP32[tmPtr + 4 >>> 2 >>> 0] = date.getMinutes();
          HEAP32[tmPtr + 8 >>> 2 >>> 0] = date.getHours();
          HEAP32[tmPtr + 12 >>> 2 >>> 0] = date.getDate();
          HEAP32[tmPtr + 16 >>> 2 >>> 0] = date.getMonth();
          HEAP32[tmPtr + 20 >>> 2 >>> 0] = date.getFullYear() - 1900;
          HEAP32[tmPtr + 24 >>> 2 >>> 0] = date.getDay();
          var yday = ydayFromDate(date) | 0;
          HEAP32[tmPtr + 28 >>> 2 >>> 0] = yday;
          HEAP32[tmPtr + 36 >>> 2 >>> 0] = -date.getTimezoneOffset() * 60;
          var start = new Date(date.getFullYear(), 0, 1);
          var summerOffset = new Date(date.getFullYear(), 6, 1).getTimezoneOffset();
          var winterOffset = start.getTimezoneOffset();
          var dst = (summerOffset != winterOffset && date.getTimezoneOffset() == Math.min(winterOffset, summerOffset)) | 0;
          HEAP32[tmPtr + 32 >>> 2 >>> 0] = dst;
          return 0;
        }, I: function(len, prot, flags, fd, offset, allocated, addr) {
          len >>>= 0;
          offset = bigintToI53Checked(offset);
          allocated >>>= 0;
          addr >>>= 0;
          try {
            var stream = SYSCALLS.getStreamFromFD(fd);
            var res = FS.mmap(stream, len, offset, prot, flags);
            var ptr = res.ptr;
            HEAP32[allocated >>> 2 >>> 0] = res.allocated;
            HEAPU32[addr >>> 2 >>> 0] = ptr;
            return 0;
          } catch (e) {
            if (typeof FS === "undefined" || !(e.name === "ErrnoError")) throw e;
            return -e.errno;
          }
        }, J: function(addr, len, prot, flags, fd, offset) {
          addr >>>= 0;
          len >>>= 0;
          offset = bigintToI53Checked(offset);
          try {
            var stream = SYSCALLS.getStreamFromFD(fd);
            if (prot & 2) SYSCALLS.doMsync(addr, stream, len, flags, offset);
          } catch (e) {
            if (typeof FS === "undefined" || !(e.name === "ErrnoError")) throw e;
            return -e.errno;
          }
        }, L: function(timezone, daylight, std_name, dst_name) {
          timezone >>>= 0;
          daylight >>>= 0;
          std_name >>>= 0;
          dst_name >>>= 0;
          var currentYear = (/* @__PURE__ */ new Date()).getFullYear();
          var winter = new Date(currentYear, 0, 1);
          var summer = new Date(currentYear, 6, 1);
          var winterOffset = winter.getTimezoneOffset();
          var summerOffset = summer.getTimezoneOffset();
          var stdTimezoneOffset = Math.max(winterOffset, summerOffset);
          HEAPU32[timezone >>> 2 >>> 0] = stdTimezoneOffset * 60;
          HEAP32[daylight >>> 2 >>> 0] = Number(winterOffset != summerOffset);
          var extractZone = (timezoneOffset) => {
            var sign = timezoneOffset >= 0 ? "-" : "+";
            var absOffset = Math.abs(timezoneOffset);
            var hours = String(Math.floor(absOffset / 60)).padStart(2, "0");
            var minutes = String(absOffset % 60).padStart(2, "0");
            return `UTC${sign}${hours}${minutes}`;
          };
          var winterName = extractZone(winterOffset);
          var summerName = extractZone(summerOffset);
          if (summerOffset < winterOffset) {
            stringToUTF8(winterName, std_name, 17);
            stringToUTF8(summerName, dst_name, 17);
          } else {
            stringToUTF8(winterName, dst_name, 17);
            stringToUTF8(summerName, std_name, 17);
          }
        }, S: function(clk_id, ignored_precision, ptime) {
          ignored_precision = bigintToI53Checked(ignored_precision);
          ptime >>>= 0;
          if (!checkWasiClock(clk_id)) return 28;
          var now;
          if (clk_id === 0) now = _emscripten_date_now();
          else if (1) now = _emscripten_get_now();
          else return 52;
          var nsec = Math.round(now * 1e6);
          HEAP64[ptime >>> 3 >>> 0] = BigInt(nsec);
          return 0;
        }, C: _emscripten_date_now, G: function(requestedSize) {
          requestedSize >>>= 0;
          var oldSize = HEAPU8.length;
          var maxHeapSize = getHeapMax();
          if (requestedSize > maxHeapSize) return false;
          for (var cutDown = 1; cutDown <= 4; cutDown *= 2) {
            var overGrownHeapSize = oldSize * (1 + 0.2 / cutDown);
            overGrownHeapSize = Math.min(overGrownHeapSize, requestedSize + 100663296);
            var newSize = Math.min(maxHeapSize, alignMemory(Math.max(requestedSize, overGrownHeapSize), 65536));
            var replacement = growMemory(newSize);
            if (replacement) return true;
          }
          return false;
        }, N: function(__environ, environ_buf) {
          __environ >>>= 0;
          environ_buf >>>= 0;
          var bufSize = 0;
          var envp = 0;
          for (var string of getEnvStrings()) {
            var ptr = environ_buf + bufSize;
            HEAPU32[__environ + envp >>> 2 >>> 0] = ptr;
            bufSize += stringToUTF8(string, ptr, 1 / 0) + 1;
            envp += 4;
          }
          return 0;
        }, O: function(penviron_count, penviron_buf_size) {
          penviron_count >>>= 0;
          penviron_buf_size >>>= 0;
          var strings = getEnvStrings();
          HEAPU32[penviron_count >>> 2 >>> 0] = strings.length;
          var bufSize = 0;
          for (var string of strings) bufSize += lengthBytesUTF8(string) + 1;
          HEAPU32[penviron_buf_size >>> 2 >>> 0] = bufSize;
          return 0;
        }, r: function(fd) {
          try {
            var stream = SYSCALLS.getStreamFromFD(fd);
            FS.close(stream);
            return 0;
          } catch (e) {
            if (typeof FS === "undefined" || !(e.name === "ErrnoError")) throw e;
            return e.errno;
          }
        }, z: function(fd, iov, iovcnt, pnum) {
          iov >>>= 0;
          iovcnt >>>= 0;
          pnum >>>= 0;
          try {
            var stream = SYSCALLS.getStreamFromFD(fd);
            var num = doReadv(stream, iov, iovcnt);
            HEAPU32[pnum >>> 2 >>> 0] = num;
            return 0;
          } catch (e) {
            if (typeof FS === "undefined" || !(e.name === "ErrnoError")) throw e;
            return e.errno;
          }
        }, M: function(fd, offset, whence, newOffset) {
          offset = bigintToI53Checked(offset);
          newOffset >>>= 0;
          try {
            if (isNaN(offset)) return 22;
            var stream = SYSCALLS.getStreamFromFD(fd);
            FS.llseek(stream, offset, whence);
            HEAP64[newOffset >>> 3 >>> 0] = BigInt(stream.position);
            if (stream.getdents && !offset && whence === 0) stream.getdents = null;
            return 0;
          } catch (e) {
            if (typeof FS === "undefined" || !(e.name === "ErrnoError")) throw e;
            return e.errno;
          }
        }, A: function(fd, iov, iovcnt, pnum) {
          iov >>>= 0;
          iovcnt >>>= 0;
          pnum >>>= 0;
          try {
            var stream = SYSCALLS.getStreamFromFD(fd);
            var num = doWritev(stream, iov, iovcnt);
            HEAPU32[pnum >>> 2 >>> 0] = num;
            return 0;
          } catch (e) {
            if (typeof FS === "undefined" || !(e.name === "ErrnoError")) throw e;
            return e.errno;
          }
        }, F: function(buffer, size) {
          buffer >>>= 0;
          size >>>= 0;
          return randomFill(HEAPU8.subarray(buffer >>> 0, buffer + size >>> 0));
        } };
        function applySignatureConversions(wasmExports2) {
          wasmExports2 = Object.assign({}, wasmExports2);
          var makeWrapper_pp = (f) => (a0) => f(a0) >>> 0;
          var makeWrapper_p = (f) => () => f() >>> 0;
          wasmExports2["Z"] = makeWrapper_pp(wasmExports2["Z"]);
          wasmExports2["$"] = makeWrapper_pp(wasmExports2["$"]);
          wasmExports2["ba"] = /* @__PURE__ */ ((f) => (a0, a1) => f(a0, a1) >>> 0)(wasmExports2["ba"]);
          wasmExports2["ca"] = makeWrapper_p(wasmExports2["ca"]);
          wasmExports2["emscripten_stack_get_base"] = makeWrapper_p(wasmExports2["emscripten_stack_get_base"]);
          wasmExports2["emscripten_stack_get_free"] = makeWrapper_p(wasmExports2["emscripten_stack_get_free"]);
          wasmExports2["_emscripten_stack_alloc"] = makeWrapper_pp(wasmExports2["_emscripten_stack_alloc"]);
          wasmExports2["ga"] = makeWrapper_p(wasmExports2["ga"]);
          return wasmExports2;
        }
        function stackCheckInit() {
          _emscripten_stack_init();
          writeStackCookie();
        }
        var wasmExports;
        wasmExports = await (async function() {
          function receiveInstance(instance) {
            wasmExports = instance.exports;
            wasmExports = applySignatureConversions(wasmExports);
            assignWasmExports(wasmExports);
            updateMemoryViews();
            return wasmExports;
          }
          var info = getWasmImports();
          var instantiateWasm = Module["instantiateWasm"];
          if (instantiateWasm) return new Promise((resolve) => {
            instantiateWasm(info, (inst) => resolve(receiveInstance(inst)));
          });
          wasmBinaryFile ?? (wasmBinaryFile = findWasmBinary());
          var result = await instantiateAsync(void 0, wasmBinaryFile, info);
          var exports2 = (function(result2) {
            return receiveInstance(result2["instance"]);
          })(result);
          return exports2;
        })();
        await (async function() {
          stackCheckInit();
          preRun();
          if (runDependencies) await resolveRunDependencies();
          var setStatus = Module["setStatus"];
          if (setStatus) {
            setStatus("Running...");
            await new Promise((resolve) => setTimeout(resolve, 1));
            setTimeout(setStatus, 1, "");
          }
          if (ABORT) return;
          initRuntime();
          Module["onRuntimeInitialized"]?.();
          postRun();
        })();
        ;
        return Module;
      };
    })();
    if (typeof exports === "object" && typeof module2 === "object") {
      module2.exports = initRDKitModule2;
      module2.exports.default = initRDKitModule2;
    } else if (typeof define === "function" && define["amd"]) define([], () => initRDKitModule2);
  }
});

// src/main.ts
var main_exports = {};
__export(main_exports, {
  default: () => ChemHoverPlugin
});
module.exports = __toCommonJS(main_exports);
var import_obsidian2 = require("obsidian");
var import_language = require("@codemirror/language");
var import_view = require("@codemirror/view");

// src/parser/chemical-parser.ts
var expressionPattern = /\\ch(?:\{([^{}\r\n]+)\}|[ \t]+([^\s\\{}]+))/g;
function normalizeChemicalName(name) {
  return name.normalize("NFKC").trim().replace(/\s+/g, " ").toLocaleLowerCase();
}
function isInInlineCodeOrMath(text, position) {
  let codeTicks = 0;
  let mathDelimiter = "";
  for (let index = 0; index < position; index += 1) {
    const character = text[index];
    if (character === "\\" && ["(", "["].includes(text[index + 1] ?? "")) {
      mathDelimiter = text[index + 1] === "(" ? "\\)" : "\\]";
      index += 1;
      continue;
    }
    if (character === "\\" && mathDelimiter && ["\\)", "\\]"].includes(text.slice(index, index + 2))) {
      if (text.slice(index, index + 2) === mathDelimiter) mathDelimiter = "";
      index += 1;
      continue;
    }
    if (character === "`") {
      let end = index + 1;
      while (text[end] === "`") end += 1;
      const tickCount = end - index;
      if (codeTicks === 0) codeTicks = tickCount;
      else if (codeTicks === tickCount) codeTicks = 0;
      index = end - 1;
      continue;
    }
    if (codeTicks > 0 || mathDelimiter.startsWith("\\") || character !== "$" || text[index - 1] === "\\") continue;
    const delimiter = text[index + 1] === "$" ? "$$" : "$";
    if (!mathDelimiter) {
      mathDelimiter = delimiter;
    } else if (mathDelimiter === delimiter) {
      mathDelimiter = "";
    }
    if (delimiter === "$$") index += 1;
  }
  return codeTicks > 0 || mathDelimiter.length > 0;
}
function findChemicalExpressions(text) {
  const expressions = [];
  expressionPattern.lastIndex = 0;
  for (let match = expressionPattern.exec(text); match; match = expressionPattern.exec(text)) {
    let precedingSlashes = 0;
    for (let index = match.index - 1; text[index] === "\\"; index -= 1) precedingSlashes += 1;
    if (precedingSlashes % 2 === 1) continue;
    const rawName = match[1] ?? match[2] ?? "";
    const name = match[1] ? rawName.trim() : rawName.replace(/[.,;:!?)}\]]+$/, "");
    if (!name || isInInlineCodeOrMath(text, match.index)) continue;
    expressions.push({
      name,
      start: match.index,
      end: match.index + match[0].length - (rawName.length - name.length)
    });
  }
  return expressions;
}

// src/database/cache.ts
var NEGATIVE_CACHE_TTL = 24 * 60 * 60 * 1e3;
var ChemicalCache = class {
  constructor(persist) {
    this.persist = persist;
    this.chemicals = /* @__PURE__ */ new Map();
    this.aliases = /* @__PURE__ */ new Map();
    this.failed = /* @__PURE__ */ new Map();
  }
  load(data) {
    if (!data || typeof data !== "object") return;
    const saved = data;
    if (saved.version !== 1) return;
    for (const [key, record] of Object.entries(saved.chemicals ?? {})) {
      if (record && Number.isInteger(record.cid) && typeof record.name === "string" && typeof record.smiles === "string" && typeof record.formula === "string" && Number.isFinite(record.molecularWeight)) {
        this.chemicals.set(record.cid, {
          ...record,
          synonyms: Array.isArray(record.synonyms) ? record.synonyms.filter((value) => typeof value === "string") : []
        });
      } else {
        console.warn(`ChemHover ignored invalid cached chemical record "${key}".`);
      }
    }
    for (const [alias, cid] of Object.entries(saved.aliases ?? {})) {
      if (Number.isInteger(cid) && this.chemicals.has(cid)) {
        this.aliases.set(normalizeChemicalName(alias), cid);
      }
    }
    const now = Date.now();
    for (const [alias, expiresAt] of Object.entries(saved.failed ?? {})) {
      if (Number.isFinite(expiresAt) && expiresAt > now) {
        this.failed.set(normalizeChemicalName(alias), expiresAt);
      }
    }
  }
  findByAlias(name) {
    const cid = this.aliases.get(normalizeChemicalName(name));
    return cid === void 0 ? void 0 : this.chemicals.get(cid);
  }
  isNegativeCached(name) {
    const key = normalizeChemicalName(name);
    const expiresAt = this.failed.get(key);
    if (expiresAt === void 0) return false;
    if (expiresAt > Date.now()) return true;
    this.failed.delete(key);
    return false;
  }
  async rememberMissing(name) {
    this.failed.set(normalizeChemicalName(name), Date.now() + NEGATIVE_CACHE_TTL);
    await this.save();
  }
  async remember(name, record) {
    this.chemicals.set(record.cid, record);
    const requestedAlias = normalizeChemicalName(name);
    this.aliases.set(requestedAlias, record.cid);
    this.aliases.set(normalizeChemicalName(record.name), record.cid);
    for (const synonym of record.synonyms) {
      this.aliases.set(normalizeChemicalName(synonym), record.cid);
    }
    this.failed.delete(requestedAlias);
    this.failed.delete(normalizeChemicalName(record.name));
    for (const synonym of record.synonyms) this.failed.delete(normalizeChemicalName(synonym));
    await this.save();
  }
  allChemicals() {
    return [...this.chemicals.values()];
  }
  async replace(record) {
    this.chemicals.set(record.cid, record);
    this.aliases.set(normalizeChemicalName(record.name), record.cid);
    for (const synonym of record.synonyms) {
      this.aliases.set(normalizeChemicalName(synonym), record.cid);
    }
    await this.save();
  }
  async clear() {
    this.chemicals.clear();
    this.aliases.clear();
    this.failed.clear();
    await this.save();
  }
  async save() {
    const chemicals = {};
    for (const [cid, record] of this.chemicals) chemicals[String(cid)] = record;
    const aliases = {};
    for (const [alias, cid] of this.aliases) aliases[alias] = cid;
    const failed = {};
    for (const [alias, expiresAt] of this.failed) failed[alias] = expiresAt;
    await this.persist({ version: 1, chemicals, aliases, failed });
  }
};

// src/wikipedia/structure-resolver.ts
var API_ROOT = "https://en.wikipedia.org/w/api.php";
var REQUEST_TIMEOUT_MS = 1e4;
var MAX_FILES_TO_INSPECT = 50;
var MAX_STRUCTURE_IMAGES = 12;
var STRUCTURE_TERMS = /\b(skeletal|chemical|structural|molecular|line)\s+(formula|structure|structures)\b|\bstructure of\b/i;
var STRUCTURE_FILENAME_TERMS = /\b(skeletal|chemical|structural|molecular|molecule|2d|structure|formula)\b/i;
var NON_STRUCTURE_TERMS = /\b(map|maps|world|death|deaths|rate|rates|overdose|overdoses|timeline|chart|graph|powder|tablet|package|bottle|synthesis|mechanism|logo|icon|side effects|photo|portrait|leaf|plant)\b/i;
function apiUrl(parameters) {
  const query = new URLSearchParams({
    action: "query",
    format: "json",
    origin: "*",
    ...parameters
  });
  return `${API_ROOT}?${query.toString()}`;
}
function normalizeText(value) {
  return value.toLocaleLowerCase().replace(/[^a-z0-9]+/g, " ").trim();
}
function stripHtml(value) {
  return value.replace(/<[^>]*>/g, " ").replace(/&nbsp;/gi, " ");
}
function isLikelyImageFile(fileTitle, searchName, pageTitle) {
  const filename = normalizeText(fileTitle.replace(/^File:/i, ""));
  const matchesName = [searchName, pageTitle].some((name) => {
    const normalizedName = normalizeText(name);
    return normalizedName.length > 2 && filename.includes(normalizedName);
  });
  return matchesName || STRUCTURE_FILENAME_TERMS.test(filename);
}
function scoreStructureImage(fileTitle, imageInfo, searchName, pageTitle) {
  const metadata = imageInfo.extmetadata;
  const details = [
    fileTitle,
    metadata?.ObjectName?.value,
    metadata?.ImageDescription?.value,
    metadata?.Categories?.value
  ].filter((value) => Boolean(value)).map(stripHtml).join(" ");
  const normalizedDetails = normalizeText(details);
  const matchesName = [searchName, pageTitle].some((name) => {
    const normalizedName = normalizeText(name);
    return normalizedName.length > 2 && normalizedDetails.includes(normalizedName);
  });
  if (!matchesName || !STRUCTURE_TERMS.test(details) || NON_STRUCTURE_TERMS.test(details)) {
    return Number.NEGATIVE_INFINITY;
  }
  let score = 100;
  if (/chemical structures|skeletal formula|structural formula/i.test(details)) score += 40;
  if (/\.svg$/i.test(fileTitle)) score += 20;
  return score;
}
function isWikimediaUrl(value) {
  try {
    const url = new URL(value);
    return url.protocol === "https:" && (url.hostname === "wikimedia.org" || url.hostname.endsWith(".wikimedia.org"));
  } catch {
    return false;
  }
}
function isSourcePageUrl(value) {
  try {
    const url = new URL(value);
    return url.protocol === "https:" && (url.hostname === "wikipedia.org" || url.hostname.endsWith(".wikipedia.org") || url.hostname === "wikimedia.org" || url.hostname.endsWith(".wikimedia.org"));
  } catch {
    return false;
  }
}
var WikipediaStructureResolver = class {
  constructor() {
    this.cache = /* @__PURE__ */ new Map();
    this.pending = /* @__PURE__ */ new Map();
  }
  resolve(name) {
    const title = name.normalize("NFKC").trim().replace(/\s+/g, " ");
    const key = title.toLocaleLowerCase();
    if (!key) return Promise.resolve([]);
    if (this.cache.has(key)) return Promise.resolve(this.cache.get(key) ?? []);
    const ongoing = this.pending.get(key);
    if (ongoing) return ongoing;
    const request = this.fetchStructureImages(title);
    this.pending.set(key, request);
    void request.then(
      (images) => {
        this.cache.set(key, images);
        this.pending.delete(key);
      },
      () => this.pending.delete(key)
    );
    return request;
  }
  async fetchStructureImages(searchName) {
    const pageResponse = await fetch(
      apiUrl({
        titles: searchName,
        redirects: "1",
        prop: "images|info",
        inprop: "url",
        imlimit: "max"
      }),
      {
        signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
        headers: { Accept: "application/json" }
      }
    );
    if (pageResponse.status === 404) return [];
    if (!pageResponse.ok) {
      throw new Error(
        `Wikipedia request failed (${pageResponse.status} ${pageResponse.statusText}).`
      );
    }
    const pageData = await pageResponse.json();
    const page = Object.values(pageData.query?.pages ?? {}).find(
      (candidate) => typeof candidate.pageid === "number" && candidate.pageid > 0
    );
    if (!page?.title || !page.images?.length) return [];
    const candidates = page.images.filter(({ title }) => isLikelyImageFile(title, searchName, page.title ?? "")).slice(0, MAX_FILES_TO_INSPECT);
    if (!candidates.length) return [];
    const imageResponse = await fetch(
      apiUrl({
        titles: candidates.map(({ title }) => title).join("|"),
        prop: "imageinfo",
        iiprop: "url|extmetadata",
        iiurlwidth: "500"
      }),
      {
        signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
        headers: { Accept: "application/json" }
      }
    );
    if (imageResponse.status === 404) return [];
    if (!imageResponse.ok) {
      throw new Error(
        `Wikimedia image request failed (${imageResponse.status} ${imageResponse.statusText}).`
      );
    }
    const imageData = await imageResponse.json();
    return Object.values(imageData.query?.pages ?? {}).flatMap(
      (file) => (file.imageinfo ?? []).map((imageInfo) => ({
        fileTitle: file.title ?? "",
        imageInfo
      }))
    ).map(({ fileTitle, imageInfo }) => ({
      fileTitle,
      imageInfo,
      score: scoreStructureImage(fileTitle, imageInfo, searchName, page.title ?? "")
    })).filter(({ score }) => score > 0).sort((left, right) => right.score - left.score).slice(0, MAX_STRUCTURE_IMAGES).flatMap(({ fileTitle, imageInfo }) => {
      const imageUrl = imageInfo.thumburl ?? imageInfo.url;
      const pageUrl = imageInfo.descriptionurl ?? imageInfo.descriptionshorturl;
      if (!imageUrl || !pageUrl || !isWikimediaUrl(imageUrl) || !isSourcePageUrl(pageUrl)) {
        return [];
      }
      return [
        {
          fileTitle: fileTitle.replace(/^File:/i, ""),
          imageUrl,
          pageUrl,
          license: imageInfo.extmetadata?.LicenseShortName?.value
        }
      ];
    });
  }
};

// src/hover/preview.ts
var ChemicalPreview = class {
  constructor(resolver, renderer, wikipedia = new WikipediaStructureResolver()) {
    this.resolver = resolver;
    this.renderer = renderer;
    this.wikipedia = wikipedia;
    this.handleKeydown = (event) => {
      const navigation = this.imageNavigation;
      if (!navigation || navigation.images.length < 2 || event.altKey || event.ctrlKey || event.metaKey || event.shiftKey || !navigation.tooltip.matches(":hover") && !this.hoverTarget?.matches(":hover")) {
        return;
      }
      const target = event.target;
      if (target instanceof HTMLElement && target.closest("input, textarea, select, [contenteditable='true']")) {
        return;
      }
      if (event.key === "ArrowLeft") {
        this.navigateImage(-1);
      } else if (event.key === "ArrowRight") {
        this.navigateImage(1);
      } else {
        return;
      }
      event.preventDefault();
      event.stopPropagation();
    };
  }
  destroy() {
    window.clearTimeout(this.hideTimer);
    this.removeTooltip();
  }
  show(target, name) {
    window.clearTimeout(this.hideTimer);
    this.removeTooltip();
    const tooltip = document.createElement("div");
    tooltip.className = "chemhover-tooltip";
    tooltip.setAttribute("role", "tooltip");
    tooltip.addEventListener("pointerenter", () => window.clearTimeout(this.hideTimer));
    tooltip.addEventListener("pointerleave", () => this.scheduleHide());
    tooltip.textContent = "Looking up chemical\u2026";
    document.body.appendChild(tooltip);
    this.tooltip = tooltip;
    this.hoverTarget = target;
    document.addEventListener("keydown", this.handleKeydown, true);
    this.position(tooltip, target);
    void this.loadPreview(tooltip, name);
  }
  scheduleHide() {
    window.clearTimeout(this.hideTimer);
    this.hideTimer = window.setTimeout(() => this.removeTooltip(), 160);
  }
  async loadPreview(tooltip, name) {
    let record;
    try {
      record = await this.resolver.resolve(name);
    } catch (error) {
      console.error("ChemHover could not resolve the chemical preview.", error);
      this.showMessage(
        tooltip,
        error instanceof Error ? error.message : "The chemical preview could not be loaded."
      );
      return;
    }
    if (!record) {
      this.showMessage(tooltip, "No chemical selected or no PubChem match was found.");
      return;
    }
    let images = [];
    try {
      images = await this.wikipedia.resolve(name);
    } catch (error) {
      console.warn("ChemHover could not look up a Wikipedia structure image; using RDKit.", error);
    }
    if (!tooltip.isConnected) return;
    if (images.length) {
      this.showRecord(tooltip, record, { source: "wikipedia", images, index: 0 });
      return;
    }
    await this.showRdkitFallback(tooltip, record);
  }
  showRecord(tooltip, record, artwork, detailsOpen = false) {
    tooltip.replaceChildren();
    const structure = tooltip.createDiv({ cls: "chemhover-structure" });
    if (artwork.source === "wikipedia") {
      this.imageNavigation = {
        tooltip,
        record,
        images: artwork.images,
        index: artwork.index
      };
      const currentImage = artwork.images[artwork.index];
      const image = structure.createEl("img", {
        attr: {
          src: currentImage.imageUrl,
          alt: `${record.name} structure (${currentImage.fileTitle})`
        }
      });
      image.addEventListener(
        "error",
        () => {
          if (!tooltip.isConnected) return;
          console.warn("ChemHover could not load the Wikipedia image; using RDKit.");
          const remaining = artwork.images.filter((_, index) => index !== artwork.index);
          if (remaining.length) {
            this.showRecord(tooltip, record, {
              source: "wikipedia",
              images: remaining,
              index: Math.min(artwork.index, remaining.length - 1)
            }, this.areDetailsExpanded(tooltip));
          } else {
            void this.showRdkitFallback(tooltip, record);
          }
        },
        { once: true }
      );
    } else {
      structure.innerHTML = artwork.svg;
      this.imageNavigation = void 0;
    }
    const detailsPanel = tooltip.createEl("details", { cls: "chemhover-collapsible" });
    detailsPanel.open = detailsOpen;
    detailsPanel.createEl("summary", { text: "Details" });
    const detailsContent = detailsPanel.createDiv({ cls: "chemhover-collapsible-content" });
    detailsContent.createEl("div", { cls: "chemhover-title", text: record.name });
    const details = detailsContent.createDiv({ cls: "chemhover-details" });
    this.addDetail(details, "Formula", record.formula || "Not available");
    this.addDetail(
      details,
      "Molecular weight",
      record.molecularWeight ? `${record.molecularWeight.toFixed(2)} g/mol` : "Not available"
    );
    if (record.synonyms.length) {
      this.addDetail(details, "Synonyms", record.synonyms.slice(0, 5).join(", "));
    }
    this.addDetail(details, "PubChem CID", String(record.cid));
    if (artwork.source === "wikipedia") {
      this.addWikipediaControls(detailsContent, tooltip, record, artwork);
    }
  }
  addWikipediaControls(container, tooltip, record, artwork) {
    const currentImage = artwork.images[artwork.index];
    const controls = container.createDiv({ cls: "chemhover-image-controls" });
    const source = controls.createEl("a", {
      cls: "chemhover-image-source",
      text: currentImage.license ? `Image source \xB7 ${currentImage.license}` : "Image source & license",
      attr: {
        href: currentImage.pageUrl,
        target: "_blank",
        rel: "noopener noreferrer",
        title: currentImage.fileTitle
      }
    });
    source.setAttribute("aria-label", `Image source and license for ${currentImage.fileTitle}`);
    const navigation = controls.createDiv({ cls: "chemhover-image-navigation" });
    const previous = navigation.createEl("button", {
      text: "\u2039",
      attr: { type: "button", "aria-label": "Previous structure image" }
    });
    previous.disabled = artwork.images.length < 2;
    previous.addEventListener("click", () => {
      const index = (artwork.index - 1 + artwork.images.length) % artwork.images.length;
      this.showRecord(tooltip, record, { ...artwork, index }, this.areDetailsExpanded(tooltip));
    });
    navigation.createSpan({
      cls: "chemhover-image-count",
      text: `${artwork.index + 1} / ${artwork.images.length}`
    });
    const next = navigation.createEl("button", {
      text: "\u203A",
      attr: { type: "button", "aria-label": "Next structure image" }
    });
    next.disabled = artwork.images.length < 2;
    next.addEventListener("click", () => {
      const index = (artwork.index + 1) % artwork.images.length;
      this.showRecord(tooltip, record, { ...artwork, index }, this.areDetailsExpanded(tooltip));
    });
    const fallback = navigation.createEl("button", {
      cls: "chemhover-use-rdkit",
      text: "Use RDKit",
      attr: { type: "button", "aria-label": "Use the RDKit structure instead" }
    });
    fallback.addEventListener("click", () => {
      void this.showRdkitFallback(tooltip, record);
    });
  }
  navigateImage(direction) {
    const navigation = this.imageNavigation;
    if (!navigation) return;
    const index = (navigation.index + direction + navigation.images.length) % navigation.images.length;
    this.showRecord(
      navigation.tooltip,
      navigation.record,
      { source: "wikipedia", images: navigation.images, index },
      this.areDetailsExpanded(navigation.tooltip)
    );
  }
  areDetailsExpanded(tooltip) {
    return tooltip.querySelector(".chemhover-collapsible")?.open ?? false;
  }
  async showRdkitFallback(tooltip, record) {
    const detailsOpen = this.areDetailsExpanded(tooltip);
    try {
      const svg = await this.renderer.render(record.smiles);
      if (tooltip.isConnected) {
        this.showRecord(tooltip, record, { source: "rdkit", svg }, detailsOpen);
      }
    } catch (error) {
      console.error("ChemHover could not render the RDKit fallback.", error);
      this.showMessage(
        tooltip,
        error instanceof Error ? error.message : "The chemical structure image and RDKit fallback could not be loaded."
      );
    }
  }
  addDetail(container, label, value) {
    const row = container.createDiv({ cls: "chemhover-detail" });
    row.createEl("strong", { text: `${label}: ` });
    row.createSpan({ text: value });
  }
  showMessage(tooltip, message) {
    if (tooltip.isConnected) tooltip.textContent = message;
  }
  position(tooltip, target) {
    const bounds = target.getBoundingClientRect();
    const left = Math.min(
      Math.max(12, bounds.left),
      window.innerWidth - Math.min(tooltip.offsetWidth || 360, window.innerWidth - 24) - 12
    );
    tooltip.style.left = `${left}px`;
    tooltip.style.top = `${Math.min(bounds.bottom + 8, window.innerHeight - 24)}px`;
  }
  removeTooltip() {
    this.tooltip?.remove();
    this.tooltip = void 0;
    this.hoverTarget = void 0;
    this.imageNavigation = void 0;
    document.removeEventListener("keydown", this.handleKeydown, true);
  }
};

// src/pubchem/resolver.ts
var import_obsidian = require("obsidian");
var API_ROOT2 = "https://pubchem.ncbi.nlm.nih.gov/rest/pug";
var REQUEST_TIMEOUT_MS2 = 15e3;
function chooseCandidate(app, searchName, candidates) {
  return new Promise((resolve) => {
    let completed = false;
    const modal = new class extends import_obsidian.SuggestModal {
      getSuggestions(query) {
        const normalized = query.toLocaleLowerCase();
        return candidates.filter(
          (candidate) => `${candidate.name} ${candidate.formula} ${candidate.cid}`.toLocaleLowerCase().includes(normalized)
        );
      }
      renderSuggestion(candidate, element) {
        element.createEl("div", { text: candidate.name });
        element.createEl("small", {
          text: `${candidate.formula || "Formula unavailable"} \xB7 CID ${candidate.cid}`
        });
      }
      onChooseSuggestion(candidate) {
        completed = true;
        resolve(candidate);
      }
      onClose() {
        if (!completed) resolve(null);
      }
    }(app);
    modal.setPlaceholder(`Choose the PubChem match for \u201C${searchName}\u201D`);
    modal.open();
  });
}
async function requestJson(url) {
  const response = await fetch(url, {
    signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS2),
    headers: { Accept: "application/json" }
  });
  if (!response.ok) {
    throw new Error(`PubChem request failed (${response.status} ${response.statusText}).`);
  }
  return await response.json();
}
function propertiesUrl(cids, fields) {
  return `${API_ROOT2}/compound/cid/${cids.join(",")}/property/${fields}/JSON`;
}
var ChemicalResolver = class {
  constructor(app, cache) {
    this.app = app;
    this.cache = cache;
    this.pending = /* @__PURE__ */ new Map();
  }
  resolve(name) {
    const key = name.normalize("NFKC").trim().replace(/\s+/g, " ").toLocaleLowerCase();
    const cached = this.cache.findByAlias(name);
    if (cached) return Promise.resolve(cached);
    if (this.cache.isNegativeCached(name)) return Promise.resolve(null);
    const ongoing = this.pending.get(key);
    if (ongoing) return ongoing;
    const request = this.resolveUncached(name);
    this.pending.set(key, request);
    void request.then(
      () => this.pending.delete(key),
      () => this.pending.delete(key)
    );
    return request;
  }
  async refreshAll() {
    const records = this.cache.allChemicals();
    let refreshed = 0;
    for (const record of records) {
      const fresh = await this.fetchRecord(record.cid, record.name);
      await this.cache.replace({ ...fresh, synonyms: [.../* @__PURE__ */ new Set([...fresh.synonyms, ...record.synonyms])] });
      refreshed += 1;
    }
    return refreshed;
  }
  async resolveUncached(name) {
    const cidsResponse = await requestJson(
      `${API_ROOT2}/compound/name/${encodeURIComponent(name)}/cids/JSON`
    );
    const cids = [...new Set(cidsResponse.IdentifierList?.CID ?? [])].filter((cid) => Number.isInteger(cid) && cid > 0);
    if (cids.length === 0) {
      await this.cache.rememberMissing(name);
      return null;
    }
    let selectedCid = cids[0];
    if (cids.length > 1) {
      const candidates = await this.getCandidates(cids);
      if (!candidates.length) {
        throw new Error("PubChem returned multiple matches but no selectable compound details.");
      }
      const selected = await chooseCandidate(this.app, name, candidates);
      if (!selected) return null;
      selectedCid = selected.cid;
    }
    const record = await this.fetchRecord(selectedCid, name);
    await this.cache.remember(name, record);
    return record;
  }
  async getCandidates(cids) {
    const candidates = [];
    for (let offset = 0; offset < cids.length; offset += 20) {
      const batch = cids.slice(offset, offset + 20);
      const response = await requestJson(
        propertiesUrl(batch, "IUPACName,MolecularFormula,MolecularWeight")
      );
      for (const property of response.PropertyTable?.Properties ?? []) {
        candidates.push({
          cid: property.CID,
          name: property.IUPACName ?? `PubChem compound ${property.CID}`,
          formula: property.MolecularFormula ?? ""
        });
      }
    }
    return candidates;
  }
  async fetchRecord(cid, fallbackName) {
    const propertyResponse = await requestJson(
      propertiesUrl(
        [cid],
        "IUPACName,SMILES,ConnectivitySMILES,MolecularFormula,MolecularWeight"
      )
    );
    const property = propertyResponse.PropertyTable?.Properties?.[0];
    const molecularWeight = Number(property?.MolecularWeight ?? 0);
    if (property?.CID !== cid) {
      throw new Error(`PubChem did not return properties for CID ${cid}.`);
    }
    const smiles = property.SMILES ?? property.IsomericSMILES ?? property.CanonicalSMILES ?? property.ConnectivitySMILES;
    if (!smiles) {
      throw new Error(
        `PubChem returned no SMILES for CID ${cid}. Available fields: ${Object.keys(property).join(", ")}.`
      );
    }
    if (!Number.isFinite(molecularWeight)) {
      throw new Error(`PubChem returned an invalid molecular weight for CID ${cid}.`);
    }
    const synonymsResponse = await requestJson(
      `${API_ROOT2}/compound/cid/${cid}/synonyms/JSON`
    );
    const synonyms = [...new Set(synonymsResponse.InformationList?.Information?.[0]?.Synonym ?? [])].filter((synonym) => synonym.toLocaleLowerCase() !== (property.IUPACName ?? "").toLocaleLowerCase()).slice(0, 30);
    return {
      cid,
      name: property.IUPACName || fallbackName,
      synonyms,
      formula: property.MolecularFormula ?? "",
      molecularWeight,
      smiles
    };
  }
};

// src/renderer/rdkit-renderer.ts
var import_rdkit = __toESM(require_RDKit_minimal());
var RDKitRenderer = class {
  constructor(wasmUrl) {
    this.wasmUrl = wasmUrl;
    this.svgCache = /* @__PURE__ */ new Map();
  }
  async render(smiles) {
    const cached = this.svgCache.get(smiles);
    if (cached) return cached;
    this.module ?? (this.module = this.initialize());
    const rdkit = await this.module;
    const molecule = rdkit.get_mol(smiles);
    if (!molecule) throw new Error("RDKit could not parse the returned SMILES.");
    try {
      const svg = molecule.get_svg();
      this.svgCache.set(smiles, svg);
      return svg;
    } finally {
      molecule.delete();
    }
  }
  async initialize() {
    const response = await fetch(this.wasmUrl);
    if (!response.ok) {
      throw new Error(`Could not load the local RDKit WebAssembly module (${response.status}).`);
    }
    const wasmBinary = await response.arrayBuffer();
    return await (0, import_rdkit.default)({
      wasmBinary,
      locateFile: () => this.wasmUrl
    });
  }
};

// src/main.ts
var TOKEN_SELECTOR = "[data-chemhover]";
var ChemHoverPlugin = class extends import_obsidian2.Plugin {
  constructor() {
    super(...arguments);
    this.persistQueue = Promise.resolve();
  }
  async onload() {
    this.cache = new ChemicalCache((data) => this.persist(data));
    this.cache.load(await this.loadData());
    this.resolver = new ChemicalResolver(this.app, this.cache);
    const pluginDir = this.manifest.dir || `${this.app.vault.configDir}/plugins/${this.manifest.id}`;
    const wasmPath = `${pluginDir}/RDKit_minimal.wasm`;
    const wasmUrl = this.app.vault.adapter.getResourcePath(wasmPath);
    const renderer = new RDKitRenderer(wasmUrl);
    this.preview = new ChemicalPreview(this.resolver, renderer);
    this.register(() => this.preview.destroy());
    this.registerMarkdownPostProcessor(
      (element, context) => this.processReadingView(element, context)
    );
    this.registerEditorExtension([
      this.createChemicalDecorations(),
      import_view.EditorView.domEventHandlers({
        pointerover: (event) => this.handlePointerOver(event),
        pointerout: (event) => this.handlePointerOut(event)
      })
    ]);
    this.addCommand({
      id: "refresh-chemical-cache",
      name: "Refresh chemical cache from PubChem",
      callback: () => void this.refreshCache()
    });
    this.addCommand({
      id: "clear-chemical-cache",
      name: "Clear chemical cache",
      callback: () => void this.clearCache()
    });
  }
  processReadingView(element, _context) {
    const walker = document.createTreeWalker(element, NodeFilter.SHOW_TEXT, {
      acceptNode: (node) => {
        const parent = node.parentElement;
        if (!parent || !parent.textContent?.includes("\\ch")) return NodeFilter.FILTER_REJECT;
        if (parent.closest(
          "code, pre, a, script, style, .math, .math-block, .inline-math, .math-inline, .math-block-rendered, .chemhover-token"
        )) {
          return NodeFilter.FILTER_REJECT;
        }
        return NodeFilter.FILTER_ACCEPT;
      }
    });
    const textNodes = [];
    while (walker.nextNode()) textNodes.push(walker.currentNode);
    for (const textNode of textNodes) {
      const source = textNode.nodeValue ?? "";
      const expressions = findChemicalExpressions(source);
      if (!expressions.length) continue;
      const fragment = document.createDocumentFragment();
      let cursor = 0;
      for (const expression of expressions) {
        fragment.append(source.slice(cursor, expression.start));
        const token = document.createElement("span");
        token.className = "chemhover-token";
        token.dataset.chemhover = expression.name;
        token.textContent = source.slice(expression.start, expression.end);
        token.addEventListener("pointerenter", () => this.preview.show(token, expression.name));
        token.addEventListener("pointerleave", () => this.preview.scheduleHide());
        fragment.append(token);
        cursor = expression.end;
      }
      fragment.append(source.slice(cursor));
      textNode.replaceWith(fragment);
    }
  }
  createChemicalDecorations() {
    return import_view.ViewPlugin.fromClass(
      class {
        constructor(view) {
          this.view = view;
          this.decorations = this.buildDecorations();
        }
        update() {
          this.decorations = this.buildDecorations();
        }
        buildDecorations() {
          const ranges = [];
          const visitedLines = /* @__PURE__ */ new Set();
          for (const visibleRange of this.view.visibleRanges) {
            let line = this.view.state.doc.lineAt(visibleRange.from);
            const lastLine = this.view.state.doc.lineAt(visibleRange.to).number;
            while (line.number <= lastLine) {
              if (!visitedLines.has(line.number)) {
                visitedLines.add(line.number);
                const ignored = [];
                (0, import_language.syntaxTree)(this.view.state).iterate({
                  from: line.from,
                  to: line.to,
                  enter: (node) => {
                    if (/code|math/i.test(node.name)) {
                      ignored.push({ from: node.from, to: node.to });
                    }
                  }
                });
                for (const expression of findChemicalExpressions(line.text)) {
                  const from = line.from + expression.start;
                  const to = line.from + expression.end;
                  if (ignored.some((range) => from < range.to && to > range.from)) continue;
                  ranges.push({ from, to, name: expression.name });
                }
              }
              if (line.number === lastLine) break;
              line = this.view.state.doc.line(line.number + 1);
            }
          }
          return import_view.Decoration.set(
            ranges.map(
              ({ from, to, name }) => import_view.Decoration.mark({
                class: "chemhover-token",
                attributes: { "data-chemhover": name }
              }).range(from, to)
            )
          );
        }
      },
      { decorations: (plugin) => plugin.decorations }
    );
  }
  handlePointerOver(event) {
    const target = event.target;
    if (!(target instanceof HTMLElement)) return false;
    const token = target.closest(TOKEN_SELECTOR);
    const name = token?.dataset.chemhover;
    if (token && name) this.preview.show(token, name);
    return false;
  }
  handlePointerOut(event) {
    const target = event.target;
    if (!(target instanceof HTMLElement)) return false;
    if (target.closest(TOKEN_SELECTOR)) this.preview.scheduleHide();
    return false;
  }
  async refreshCache() {
    try {
      const count = await this.resolver.refreshAll();
      new import_obsidian2.Notice(`ChemHover refreshed ${count} cached chemical${count === 1 ? "" : "s"}.`);
    } catch (error) {
      console.error("ChemHover could not refresh the chemical cache.", error);
      new import_obsidian2.Notice(
        `ChemHover cache refresh failed: ${error instanceof Error ? error.message : "unknown error"}`
      );
    }
  }
  async clearCache() {
    try {
      await this.cache.clear();
      new import_obsidian2.Notice("ChemHover chemical cache cleared.");
    } catch (error) {
      console.error("ChemHover could not clear the chemical cache.", error);
      new import_obsidian2.Notice("ChemHover could not clear the chemical cache. See the developer console.");
    }
  }
  persist(data) {
    const write = this.persistQueue.then(() => this.saveData(data));
    this.persistQueue = write.catch((error) => {
      console.error("ChemHover could not save its local cache.", error);
      new import_obsidian2.Notice("ChemHover could not save its local cache. See the developer console.");
    });
    return write;
  }
};
