"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var fs_1 = __importDefault(require("fs"));
var path_1 = __importDefault(require("path"));
var http_1 = __importDefault(require("http"));
var aws_regions_1 = __importDefault(require("./aws-regions"));
var logger_1 = __importDefault(require("./logger"));
var writeFile = function (file, contents) {
    try {
        var pos = file.lastIndexOf('/');
        var dir = file.substring(0, pos);
        fs_1.default.mkdirSync(dir, { recursive: true });
        fs_1.default.writeFileSync(file, contents);
    }
    catch (e) {
        logger_1.default.error("ERROR while writing to " + file, e);
    }
};
var fetchInstanceInfo = function () { return __awaiter(void 0, void 0, void 0, function () {
    var request, resp, e_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                request = function (url) {
                    return new Promise(function (resolve, reject) {
                        var req = http_1.default.request(url, {}, function (res) {
                            var statusCode = res.statusCode;
                            res.on('data', function (dataBuffer) {
                                resolve({ statusCode: statusCode, data: JSON.parse(dataBuffer.toString('utf8')) });
                            });
                        });
                        req.on('error', function (error) { return reject(error); });
                        req.end();
                    });
                };
                resp = null;
                _a.label = 1;
            case 1:
                _a.trys.push([1, 3, , 4]);
                return [4 /*yield*/, request('http://169.254.169.254/latest/dynamic/instance-identity/document')];
            case 2:
                resp = _a.sent();
                return [3 /*break*/, 4];
            case 3:
                e_1 = _a.sent();
                return [3 /*break*/, 4];
            case 4:
                if ((resp === null || resp === void 0 ? void 0 : resp.statusCode) === 200) {
                    return [2 /*return*/, (resp === null || resp === void 0 ? void 0 : resp.data) || null];
                }
                return [2 /*return*/, null];
        }
    });
}); };
(function () { return __awaiter(void 0, void 0, void 0, function () {
    var instanceInfo, _a, region, availabilityZone, awsRegion, regionName, regionAlias, s3BucketPrefix, deployEnv, deployEnvFile;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0: return [4 /*yield*/, fetchInstanceInfo()];
            case 1:
                instanceInfo = _b.sent();
                if (!instanceInfo) {
                    logger_1.default.error('[ERROR] Cannot fetch instance info (pre-deploy)');
                    process.exit(1);
                }
                _a = instanceInfo || {}, region = _a.region, availabilityZone = _a.availabilityZone;
                if (!region || !availabilityZone) {
                    logger_1.default.error("[ERROR] Invalid value for region/availabilityZone: [" + region + "," + availabilityZone + "]");
                    process.exit(1);
                }
                awsRegion = aws_regions_1.default["" + region];
                regionName = awsRegion === null || awsRegion === void 0 ? void 0 : awsRegion.name;
                regionAlias = awsRegion === null || awsRegion === void 0 ? void 0 : awsRegion.alias;
                if (!regionName || !regionAlias) {
                    logger_1.default.error("[ERROR] Invalid value for regionName/regionAlias: [" + regionName + "," + regionAlias + "]");
                    process.exit(1);
                }
                s3BucketPrefix = 'baadal-assets';
                deployEnv = '';
                deployEnv += "INSTANCE_AVAIL_ZONE=" + availabilityZone + "\n";
                deployEnv += "INSTANCE_REGION=" + region + "\n";
                deployEnv += "INSTANCE_REGION_NAME=" + regionName + "\n";
                deployEnv += "INSTANCE_REGION_ALIAS=" + regionAlias + "\n";
                deployEnv += "S3_BUCKET_NAME=" + s3BucketPrefix + "-" + regionAlias + "\n";
                deployEnv += "S3_BUCKET_DEFAULT=" + s3BucketPrefix + "\n";
                deployEnvFile = path_1.default.resolve(process.cwd(), 'env/.env.deploy');
                writeFile(deployEnvFile, deployEnv);
                return [2 /*return*/];
        }
    });
}); })();
