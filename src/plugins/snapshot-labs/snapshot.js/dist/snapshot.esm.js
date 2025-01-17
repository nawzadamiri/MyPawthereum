import fetch from 'cross-fetch';
import { hexlify, arrayify } from '@ethersproject/bytes';
import { Interface } from '@ethersproject/abi';
import { Contract } from '@ethersproject/contracts';
import { _TypedDataEncoder, namehash } from '@ethersproject/hash';
import { jsonToGraphQLQuery } from 'json-to-graphql-query';
import Ajv from 'ajv';
import addFormats from 'ajv-formats';
import set from 'lodash.set';
import { StaticJsonRpcProvider } from '@ethersproject/providers';
import { verifyTypedData } from '@ethersproject/wallet';

/*! *****************************************************************************
Copyright (c) Microsoft Corporation. All rights reserved.
Licensed under the Apache License, Version 2.0 (the "License"); you may not use
this file except in compliance with the License. You may obtain a copy of the
License at http://www.apache.org/licenses/LICENSE-2.0

THIS CODE IS PROVIDED ON AN *AS IS* BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
KIND, EITHER EXPRESS OR IMPLIED, INCLUDING WITHOUT LIMITATION ANY IMPLIED
WARRANTIES OR CONDITIONS OF TITLE, FITNESS FOR A PARTICULAR PURPOSE,
MERCHANTABLITY OR NON-INFRINGEMENT.

See the Apache Version 2.0 License for specific language governing permissions
and limitations under the License.
***************************************************************************** */

var __assign = function() {
    __assign = Object.assign || function __assign(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};

function __awaiter(thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
}

function __generator(thisArg, body) {
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
}

function __spreadArrays() {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
            r[k] = a[j];
    return r;
}

function signMessage(web3, msg, address) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    msg = hexlify(new Buffer(msg, 'utf8'));
                    return [4 /*yield*/, web3.send('personal_sign', [msg, address])];
                case 1: return [2 /*return*/, _a.sent()];
            }
        });
    });
}
function getBlockNumber(provider) {
    return __awaiter(this, void 0, void 0, function () {
        var blockNumber, e_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, provider.getBlockNumber()];
                case 1:
                    blockNumber = _a.sent();
                    return [2 /*return*/, parseInt(blockNumber)];
                case 2:
                    e_1 = _a.sent();
                    return [2 /*return*/, Promise.reject()];
                case 3: return [2 /*return*/];
            }
        });
    });
}

var hubs = [
	"https://hub.snapshot.org",
	"https://testnet.snapshot.org"
];

var version = "0.1.3";

var Client = /** @class */ (function () {
    function Client(address) {
        if (address === void 0) { address = hubs[0]; }
        this.address = address;
    }
    Client.prototype.request = function (command, body) {
        var url = this.address + "/api/" + command;
        var init;
        if (body) {
            init = {
                method: 'POST',
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(body)
            };
        }
        return new Promise(function (resolve, reject) {
            fetch(url, init)
                .then(function (res) {
                if (res.ok)
                    return resolve(res.json());
                throw res;
            })
                .catch(function (e) { return e.json().then(function (json) { return reject(json); }); });
        });
    };
    Client.prototype.send = function (msg) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, this.request('message', msg)];
            });
        });
    };
    Client.prototype.getSpaces = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, this.request('spaces')];
            });
        });
    };
    Client.prototype.broadcast = function (web3, account, space, type, payload) {
        return __awaiter(this, void 0, void 0, function () {
            var msg, _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        msg = {
                            address: account,
                            msg: JSON.stringify({
                                version: version,
                                timestamp: (Date.now() / 1e3).toFixed(),
                                space: space,
                                type: type,
                                payload: payload
                            })
                        };
                        _a = msg;
                        return [4 /*yield*/, signMessage(web3, msg.msg, account)];
                    case 1:
                        _a.sig = _b.sent();
                        return [4 /*yield*/, this.send(msg)];
                    case 2: return [2 /*return*/, _b.sent()];
                }
            });
        });
    };
    Client.prototype.sign = function (web3, account, space, type, payload) {
        return __awaiter(this, void 0, void 0, function () {
            var msg;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        msg = {
                            address: account,
                            msg: JSON.stringify({
                                version: version,
                                timestamp: (Date.now() / 1e3).toFixed(),
                                space: space,
                                type: type,
                                payload: payload
                            })
                        };
                        return [4 /*yield*/, signMessage(web3, msg.msg, account)];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    Client.prototype.vote = function (web3, address, space, _a) {
        var proposal = _a.proposal, choice = _a.choice, _b = _a.metadata, metadata = _b === void 0 ? {} : _b;
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_c) {
                return [2 /*return*/, this.broadcast(web3, address, space, 'vote', {
                        proposal: proposal,
                        choice: choice,
                        metadata: metadata
                    })];
            });
        });
    };
    Client.prototype.proposal = function (web3, address, space, _a) {
        var name = _a.name, body = _a.body, choices = _a.choices, start = _a.start, end = _a.end, snapshot = _a.snapshot, _b = _a.type, type = _b === void 0 ? 'single-choice' : _b, _c = _a.metadata, metadata = _c === void 0 ? {} : _c;
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_d) {
                return [2 /*return*/, this.broadcast(web3, address, space, 'proposal', {
                        name: name,
                        body: body,
                        choices: choices,
                        start: start,
                        end: end,
                        snapshot: snapshot,
                        type: type,
                        metadata: metadata
                    })];
            });
        });
    };
    Client.prototype.deleteProposal = function (web3, address, space, _a) {
        var proposal = _a.proposal;
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_b) {
                return [2 /*return*/, this.broadcast(web3, address, space, 'delete-proposal', {
                        proposal: proposal
                    })];
            });
        });
    };
    Client.prototype.settings = function (web3, address, space, settings) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, this.broadcast(web3, address, space, 'settings', settings)];
            });
        });
    };
    return Client;
}());

var $schema = "http://json-schema.org/draft-07/schema#";
var $ref = "#/definitions/Space";
var definitions = {
	Space: {
		title: "Space",
		type: "object",
		properties: {
			name: {
				type: "string",
				title: "name",
				minLength: 1,
				maxLength: 32
			},
			"private": {
				type: "boolean"
			},
			about: {
				type: "string",
				title: "about",
				maxLength: 160
			},
			guidelines: {
				type: "string",
				title: "guidelines",
				maxLength: 1024
			},
			terms: {
				type: "string",
				title: "terms",
				format: "uri",
				maxLength: 128
			},
			avatar: {
				type: "string",
				title: "avatar",
				format: "uri",
				maxLength: 256
			},
			location: {
				type: "string",
				title: "location",
				maxLength: 24
			},
			website: {
				type: "string",
				title: "website",
				format: "uri",
				maxLength: 128
			},
			twitter: {
				type: "string",
				title: "twitter",
				pattern: "^[A-Za-z0-9_]*$",
				maxLength: 15
			},
			github: {
				type: "string",
				title: "github",
				pattern: "^[A-Za-z0-9_-]*$",
				maxLength: 39
			},
			email: {
				type: "string",
				title: "email",
				maxLength: 32
			},
			network: {
				type: "string",
				title: "network",
				minLength: 1,
				maxLength: 32
			},
			symbol: {
				type: "string",
				title: "symbol",
				minLength: 1,
				maxLength: 12
			},
			skin: {
				type: "string",
				title: "skin",
				maxLength: 32
			},
			domain: {
				type: "string",
				title: "domain",
				maxLength: 64
			},
			strategies: {
				type: "array",
				minItems: 1,
				maxItems: 8,
				items: {
					type: "object",
					properties: {
						name: {
							type: "string",
							maxLength: 64,
							title: "name"
						},
						params: {
							type: "object",
							title: "params"
						}
					},
					required: [
						"name"
					],
					additionalProperties: false
				},
				title: "strategies"
			},
			members: {
				type: "array",
				items: {
					type: "string",
					pattern: "^[A-Za-z0-9]*$",
					minLength: 42,
					maxLength: 42
				},
				title: "members"
			},
			admins: {
				type: "array",
				items: {
					type: "string",
					pattern: "^[A-Za-z0-9]*$",
					minLength: 42,
					maxLength: 42
				},
				title: "admins"
			},
			filters: {
				type: "object",
				properties: {
					defaultTab: {
						type: "string"
					},
					minScore: {
						type: "number",
						minimum: 0
					},
					onlyMembers: {
						type: "boolean"
					},
					invalids: {
						type: "array",
						items: {
							type: "string",
							maxLength: 64
						},
						title: "invalids"
					}
				},
				additionalProperties: false
			},
			validation: {
				type: "object",
				properties: {
					name: {
						type: "string",
						maxLength: 64,
						title: "name"
					},
					params: {
						type: "object",
						title: "params"
					}
				},
				required: [
					"name"
				],
				additionalProperties: false
			},
			plugins: {
				type: "object"
			},
			voting: {
				type: "object",
				properties: {
					delay: {
						type: "number",
						minimum: 0
					},
					period: {
						type: "number",
						minimum: 0
					},
					type: {
						type: "string",
						title: "type"
					},
					quorum: {
						type: "number",
						minimum: 0
					}
				},
				additionalProperties: false
			},
			categories: {
				type: "array",
				maxItems: 2,
				items: {
					type: "string",
					"enum": [
						"protocol",
						"social",
						"investment",
						"grant",
						"service",
						"media",
						"creator",
						"collector"
					]
				}
			}
		},
		required: [
			"name",
			"network",
			"symbol",
			"strategies"
		],
		additionalProperties: false
	}
};
var space = {
	$schema: $schema,
	$ref: $ref,
	definitions: definitions
};

var $schema$1 = "http://json-schema.org/draft-07/schema#";
var $ref$1 = "#/definitions/Proposal";
var definitions$1 = {
	Proposal: {
		title: "Proposal",
		type: "object",
		properties: {
			name: {
				type: "string",
				title: "name",
				minLength: 1,
				maxLength: 256
			},
			body: {
				type: "string",
				title: "body",
				minLength: 0,
				maxLength: 6400
			},
			choices: {
				type: "array",
				title: "choices",
				minItems: 2,
				maxItems: 96
			},
			type: {
				type: "string",
				"enum": [
					"single-choice",
					"approval",
					"ranked-choice",
					"quadratic",
					"weighted",
					"custom",
					"basic"
				]
			},
			snapshot: {
				type: "number",
				title: "snapshot"
			},
			start: {
				type: "number",
				title: "start",
				minimum: 1000000000,
				maximum: 2000000000
			},
			end: {
				type: "number",
				title: "end",
				minimum: 1000000000,
				maximum: 2000000000,
				exclusiveMinimum: {
					$data: "1/start"
				}
			},
			metadata: {
				type: "object",
				title: "metadata"
			}
		},
		required: [
			"name",
			"body",
			"choices",
			"snapshot",
			"start",
			"end"
		],
		additionalProperties: false
	}
};
var proposal = {
	$schema: $schema$1,
	$ref: $ref$1,
	definitions: definitions$1
};

var $schema$2 = "http://json-schema.org/draft-07/schema#";
var $ref$2 = "#/definitions/Vote";
var definitions$2 = {
	Vote: {
		title: "Vote",
		type: "object",
		properties: {
			proposal: {
				type: "string",
				title: "proposal"
			},
			choice: {
				type: [
					"number",
					"array",
					"object",
					"boolean"
				],
				title: "choice"
			},
			metadata: {
				type: "object",
				title: "metadata"
			}
		},
		required: [
			"proposal",
			"choice"
		],
		additionalProperties: false
	}
};
var vote = {
	$schema: $schema$2,
	$ref: $ref$2,
	definitions: definitions$2
};

var schemas = {
    space: space.definitions.Space,
    proposal: proposal.definitions.Proposal,
    vote: vote.definitions.Vote
};

var Multicaller = /** @class */ (function () {
    function Multicaller(network, provider, abi, options) {
        this.options = {};
        this.calls = [];
        this.paths = [];
        this.network = network;
        this.provider = provider;
        this.abi = abi;
        this.options = options || {};
    }
    Multicaller.prototype.call = function (path, address, fn, params) {
        this.calls.push([address, fn, params]);
        this.paths.push(path);
        return this;
    };
    Multicaller.prototype.execute = function (from) {
        return __awaiter(this, void 0, void 0, function () {
            var obj, result;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        obj = from || {};
                        return [4 /*yield*/, multicall(this.network, this.provider, this.abi, this.calls, this.options)];
                    case 1:
                        result = _a.sent();
                        result.forEach(function (r, i) { return set(obj, _this.paths[i], r.length > 1 ? r : r[0]); });
                        this.calls = [];
                        this.paths = [];
                        return [2 /*return*/, obj];
                }
            });
        });
    };
    return Multicaller;
}());

var networks = {
	"1": {
	key: "1",
	name: "Ethereum Mainnet",
	chainId: 1,
	network: "homestead",
	multicall: "0xeefba1e63905ef1d7acba5a8513c70307c1ce441",
	rpc: [
		{
			url: "https://api-geth-archive.ankr.com",
			user: "balancer_user",
			password: "balancerAnkr20201015"
		},
		"https://speedy-nodes-nyc.moralis.io/b9aed21e7bb7bdeb35972c9a/eth/mainnet/archive",
		"https://apis.ankr.com/e62bc219f9c9462b8749defe472d2dc5/6106d4a3ec1d1bcc87ec72158f8fd089/eth/archive/main",
		"https://eth-archival.gateway.pokt.network/v1/5f76124fb90218002e9ce985",
		"https://eth-mainnet.alchemyapi.io/v2/4bdDVB5QAaorY2UE-GBUbM2yQB3QJqzv",
		"https://cloudflare-eth.com"
	],
	ws: [
		"wss://eth-mainnet.ws.alchemyapi.io/v2/4bdDVB5QAaorY2UE-GBUbM2yQB3QJqzv"
	],
	explorer: "https://etherscan.io"
},
	"3": {
	key: "3",
	name: "Ethereum Testnet Ropsten",
	shortName: "Ropsten",
	chainId: 3,
	network: "ropsten",
	testnet: true,
	multicall: "0x53c43764255c17bd724f74c4ef150724ac50a3ed",
	rpc: [
		"https://eth-ropsten.alchemyapi.io/v2/QzGz6gdkpTyDzebi3PjxIaKO7bDTGnSy"
	],
	explorer: "https://ropsten.etherscan.io"
},
	"4": {
	key: "4",
	name: "Ethereum Testnet Rinkeby",
	shortName: "Rinkeby",
	chainId: 4,
	network: "rinkeby",
	testnet: true,
	multicall: "0x42ad527de7d4e9d9d011ac45b31d8551f8fe9821",
	rpc: [
		"https://eth-rinkeby.alchemyapi.io/v2/ugiPEBqMebLQbjro42kalZ1h4StpW_fR",
		"https://eth-rinkeby.gateway.pokt.network/v1/5f76124fb90218002e9ce985"
	],
	ws: [
		"wss://eth-rinkeby.ws.alchemyapi.io/v2/twReQE9Px03E-E_N_Fbb3OVF7YgHxoGq"
	],
	explorer: "https://rinkeby.etherscan.io"
},
	"5": {
	key: "5",
	name: "Ethereum Testnet Görli",
	shortName: "Görli",
	chainId: 5,
	network: "goerli",
	testnet: true,
	multicall: "0x77dca2c955b15e9de4dbbcf1246b4b85b651e50e",
	rpc: [
		"https://eth-goerli.alchemyapi.io/v2/v4nqH_J-J3STit45Mm07TxuYexMHQsYZ"
	],
	explorer: "https://goerli.etherscan.io"
},
	"7": {
	key: "7",
	name: "ThaiChain",
	chainId: 7,
	network: "mainnet",
	multicall: "0xB9cb900E526e7Ad32A2f26f1fF6Dee63350fcDc5",
	rpc: [
		"https://rpc.dome.cloud"
	],
	ws: [
		"wss://ws.dome.cloud"
	],
	explorer: "https://exp.tch.in.th"
},
	"30": {
	key: "30",
	name: "RSK Mainnet",
	chainId: 30,
	network: "rsk mainnet",
	multicall: "0x4eeebb5580769ba6d26bfd07be636300076d1831",
	rpc: [
		"https://public-node.rsk.co"
	],
	explorer: "https://explorer.rsk.co"
},
	"31": {
	key: "31",
	name: "RSK Testnet",
	chainId: 31,
	network: "rsk testnet",
	testnet: true,
	multicall: "0x4eeebb5580769ba6d26bfd07be636300076d1831",
	rpc: [
		"https://public-node.testnet.rsk.co"
	],
	explorer: "https://explorer.testnet.rsk.co"
},
	"42": {
	key: "42",
	name: "Ethereum Testnet Kovan",
	shortName: "Kovan",
	chainId: 42,
	network: "kovan",
	testnet: true,
	multicall: "0x2cc8688c5f75e365aaeeb4ea8d6a480405a48d2a",
	rpc: [
		"https://speedy-nodes-nyc.moralis.io/b9aed21e7bb7bdeb35972c9a/eth/kovan/archive",
		"https://eth-kovan.alchemyapi.io/v2/sR9qngOH3w78GAaTtlTe8GwEnij0SnEa",
		"https://eth-kovan.alchemyapi.io/v2/s96TIUFYg0LuddgpmafA040ZyUaZbrpM",
		"https://poa-kovan.gateway.pokt.network/v1/5f76124fb90218002e9ce985"
	],
	ws: [
		"wss://eth-kovan.ws.alchemyapi.io/v2/QCsM2iU0bQ49eGDmZ7-Y--Wpu0lVWXSO"
	],
	explorer: "https://kovan.etherscan.io"
},
	"50": {
	key: "50",
	name: "XinFin MainNet",
	shortName: "XDC",
	chainId: 50,
	network: "mainnet",
	multicall: "",
	rpc: [
		"https://rpc.xinfin.network"
	],
	ws: [
		"wss://ws.xinfin.network"
	],
	explorer: "http://explorer.xinfin.network/"
},
	"56": {
	key: "56",
	name: "Binance Smart Chain Mainnet",
	shortName: "BSC",
	chainId: 56,
	network: "mainnet",
	multicall: "0x1ee38d535d541c55c9dae27b12edf090c608e6fb",
	rpc: [
		"https://speedy-nodes-nyc.moralis.io/b9aed21e7bb7bdeb35972c9a/bsc/mainnet/archive",
		"https://apis.ankr.com/c0d871dd3c6d4529b01c9362a9b79e89/6106d4a3ec1d1bcc87ec72158f8fd089/binance/archive/main",
		"https://bsc.getblock.io/mainnet/?api_key=91f8195f-bf46-488f-846a-73d6853790e7",
		"https://bsc-private-dataseed1.nariox.org",
		"https://bsc-private-dataseed2.nariox.org",
		"https://bsc-dataseed1.ninicoin.io",
		"https://bsc-dataseed1.binance.org",
		"https://bsc-dataseed2.binance.org",
		"https://bsc-dataseed3.binance.org"
	],
	explorer: "https://bscscan.com"
},
	"61": {
	key: "61",
	name: "Ethereum Classic Mainnet",
	shortName: "Ethereum Classic",
	chainId: 61,
	network: "mainnet",
	multicall: "",
	rpc: [
		"https://ethereumclassic.network"
	],
	explorer: "https://blockscout.com/etc/mainnet"
},
	"65": {
	key: "65",
	name: "OKExChain Testnet",
	shortName: "OEC Testnet",
	chainId: 65,
	network: "oec testnet",
	testnet: true,
	multicall: "0x04c68A7fB750ca0Ba232105B3b094926a0f77645",
	rpc: [
		"https://exchaintestrpc.okex.org"
	],
	ws: [
		"wss://exchaintestws.okex.org:8443"
	],
	explorer: "https://www.oklink.com/okexchain-test"
},
	"66": {
	key: "66",
	name: "OKExChain Mainnet",
	shortName: "OEC Mainnet",
	chainId: 66,
	network: "oec mainnet",
	multicall: "0x6EB187d8197Ac265c945b69f3c3064A6f3831866",
	rpc: [
		"https://exchainrpc.okex.org"
	],
	ws: [
		"wss://exchainws.okex.org:8443"
	],
	explorer: "https://www.oklink.com/okexchain"
},
	"70": {
	key: "70",
	name: "Hoo Smart Chain Mainnet",
	shortName: "hsc",
	chainId: 70,
	network: "Mainnet",
	multicall: "0xd4b794b89baccb70ef851830099bee4d69f19ebc",
	rpc: [
		"https://http-mainnet2.hoosmartchain.com"
	],
	ws: [
		"wss://ws-mainnet2.hoosmartchain.com"
	],
	explorer: "https://hscscan.com"
},
	"80": {
	key: "80",
	name: "GeneChain",
	chainId: 80,
	network: "Mainnet",
	multicall: "0x9e6ed491171A0D9089892aA5F14800f9f32038eb",
	rpc: [
		"https://rpc.genechain.io"
	],
	explorer: "https://scan.genechain.io"
},
	"82": {
	key: "82",
	name: "Meter Mainnet",
	shortName: "Meter",
	chainId: 82,
	network: "mainnet",
	multicall: "0x579De77CAEd0614e3b158cb738fcD5131B9719Ae",
	rpc: [
		"https://rpc.meter.io"
	],
	explorer: "https://scan.meter.io"
},
	"97": {
	key: "97",
	name: "Binance Smart Chain Testnet",
	shortName: "BSC Testnet",
	chainId: 97,
	network: "testnet",
	testnet: true,
	multicall: "0x8b54247c6BAe96A6ccAFa468ebae96c4D7445e46",
	rpc: [
		"https://speedy-nodes-nyc.moralis.io/f2963e29bec0de5787da3164/bsc/testnet/archive",
		"https://data-seed-prebsc-1-s1.binance.org:8545"
	],
	explorer: "https://testnet.bscscan.com"
},
	"99": {
	key: "99",
	name: "POA Core",
	shortName: "POA",
	chainId: 99,
	network: "mainnet",
	multicall: "",
	rpc: [
		"https://core.poa.network"
	],
	explorer: "https://blockscout.com/poa/core/"
},
	"100": {
	key: "100",
	name: "xDAI Chain",
	shortName: "xDAI",
	chainId: 100,
	network: "mainnet",
	multicall: "0xb5b692a88bdfc81ca69dcb1d924f59f0413a602a",
	rpc: [
		"https://xdai-archive.blockscout.com",
		"https://poa-xdai.gateway.pokt.network/v1/5f76124fb90218002e9ce985"
	],
	ws: [
		"wss://rpc.xdaichain.com/wss"
	],
	explorer: "https://blockscout.com/poa/xdai"
},
	"106": {
	key: "106",
	name: "Velas EVM Mainnet",
	shortName: "Velas",
	chainId: 106,
	network: "mainnet",
	multicall: "0x597Cc7c49a8e0041d3A43ec8D7dc651b47879108",
	rpc: [
		"https://evmexplorer.velas.com/rpc",
		"https://explorer.velas.com/rpc"
	],
	ws: [
		"wss://api.velas.com"
	],
	explorer: "https://evmexplorer.velas.com"
},
	"108": {
	key: "108",
	name: "Thundercore Mainnet",
	chainId: 108,
	network: "mainnet",
	multicall: "",
	rpc: [
		"https://mainnet-rpc.thundercore.com"
	],
	explorer: "https://scan.thundercore.com"
},
	"111": {
	key: "111",
	name: "Velas EVM Testnet",
	shortName: "Velas Testnet",
	chainId: 111,
	network: "testnet",
	testnet: true,
	multicall: "0x55a827538FbF41b7334Dd49001220597898Ad954",
	rpc: [
		"https://evmexplorer.testnet.velas.com/rpc",
		"https://explorer.testnet.velas.com/rpc"
	],
	ws: [
		"wss://api.testnet.velas.com"
	],
	explorer: "https://evmexplorer.testnet.velas.com"
},
	"122": {
	key: "122",
	name: "Fuse Mainnet",
	shortName: "Fuse",
	chainId: 122,
	network: "mainnet",
	multicall: "0x7a59441fb06666F6d2D766393d876945D06a169c",
	rpc: [
		"https://oefusefull1.liquify.info/"
	],
	explorer: "https://explorer.fuse.io"
},
	"128": {
	key: "128",
	name: "Huobi Eco Chain Mainnet",
	shortName: "heco",
	chainId: 128,
	network: "Mainnet",
	multicall: "0x37ab26db3df780e7026f3e767f65efb739f48d8e",
	rpc: [
		"https://pub001.hg.network/rpc"
	],
	ws: [
		"wss://pub001.hg.network/ws"
	],
	explorer: "https://hecoinfo.com"
},
	"137": {
	key: "137",
	name: "Polygon Mainnet",
	shortName: "Polygon",
	chainId: 137,
	network: "mainnet",
	multicall: "0xCBca837161be50EfA5925bB9Cc77406468e76751",
	rpc: [
		"https://speedy-nodes-nyc.moralis.io/f2963e29bec0de5787da3164/polygon/mainnet/archive",
		"https://rpc-mainnet.maticvigil.com/v1/1cfd7598e5ba6dcf0b4db58e8be484badc6ea08e",
		"https://speedy-nodes-nyc.moralis.io/b9aed21e7bb7bdeb35972c9a/polygon/mainnet/archive"
	],
	ws: [
		"wss://ws-mainnet.matic.network"
	],
	explorer: "https://polygonscan.com"
},
	"246": {
	key: "246",
	name: "Energy Web Chain",
	shortName: "EWC",
	chainId: 246,
	network: "mainnet",
	multicall: "0x0767F26d0D568aB61A98b279C0b28a4164A6f05e",
	rpc: [
		"https://voting-rpc.carbonswap.exchange"
	],
	explorer: "https://explorer.energyweb.org"
},
	"250": {
	key: "250",
	name: "Fantom Opera",
	shortName: "fantom",
	chainId: 250,
	network: "Mainnet",
	multicall: "0x7f6A10218264a22B4309F3896745687E712962a0",
	rpc: [
		"https://rpc.ftm.tools",
		"https://rpcapi.fantom.network"
	],
	explorer: "https://ftmscan.com"
},
	"256": {
	key: "256",
	name: "Huobi Eco Chain Testnet",
	shortName: "heco",
	chainId: 256,
	network: "testnet",
	testnet: true,
	multicall: "0xC33994Eb943c61a8a59a918E2de65e03e4e385E0",
	rpc: [
		"https://http-testnet.hecochain.com"
	],
	ws: [
		"wss://ws-testnet.hecochain.com"
	],
	explorer: "https://testnet.hecoinfo.com"
},
	"321": {
	key: "321",
	name: "KCC Mainnet",
	shortName: "KCC",
	chainId: 321,
	network: "mainnet",
	multicall: "0xa64D6AFb48225BDA3259246cfb418c0b91de6D7a",
	rpc: [
		"https://rpc-mainnet.kcc.network"
	],
	ws: [
		"wss://rpc-ws-mainnet.kcc.network"
	],
	explorer: "https://explorer.kcc.io"
},
	"499": {
	key: "499",
	name: "Rupaya",
	shortName: "RUPX",
	chainId: 499,
	network: "mainnet",
	multicall: "0x7955FF653FfDBf13056FeAe227f655CfF5C194D5",
	rpc: [
		"https://rpc.rupx.io"
	],
	ws: [
		"wss://ws.rupx.io"
	],
	explorer: "http://scan.rupx.io"
},
	"888": {
	key: "888",
	name: "Wanchain",
	chainId: 888,
	network: "mainnet",
	multicall: "0xba5934ab3056fca1fa458d30fbb3810c3eb5145f",
	rpc: [
		"https://gwan-ssl.wandevs.org:56891"
	],
	ws: [
		"wss://api.wanchain.org:8443/ws/v3/ddd16770c68f30350a21114802d5418eafe039b722de52b488e7eee1ee2cd73f"
	],
	explorer: "https://www.wanscan.org"
},
	"1285": {
	key: "1285",
	name: "Moonriver (Kusama)",
	shortName: "Moonriver",
	chainId: 1285,
	network: "mainnet",
	multicall: "0x537004440ffFE1D4AE9F009031Fc2b0385FCA9F1",
	rpc: [
		"https://rpc.moonriver.moonbeam.network"
	],
	explorer: "https://blockscout.moonriver.moonbeam.network/"
},
	"1287": {
	key: "1287",
	name: "Moonbase Alpha TestNet",
	shortName: "Moonbase",
	chainId: 1287,
	network: "testnet",
	testnet: true,
	multicall: "0xf09FD6B6FF3f41614b9d6be2166A0D07045A3A97",
	rpc: [
		"https://rpc.testnet.moonbeam.network"
	],
	explorer: "https://moonbase-blockscout.testnet.moonbeam.network/"
},
	"4689": {
	key: "4689",
	name: "IoTeX Mainnet",
	shortName: "IoTeX",
	chainId: 4689,
	network: "mainnet",
	multicall: "0x9c8B105c94282CDB0F3ecF27e3cfA96A35c07be6",
	rpc: [
		"https://babel-api.mainnet.iotex.io"
	],
	explorer: "https://iotexscan.io"
},
	"4690": {
	key: "4690",
	name: "IoTeX Testnet",
	shortName: "IoTeX",
	chainId: 4690,
	network: "testnet",
	testnet: true,
	multicall: "0x30aE8783d26aBE7Fbb9d83549CCb7430AE4A301F",
	rpc: [
		"https://babel-api.testnet.iotex.io"
	],
	explorer: "https://testnet.iotexscan.io"
},
	"32659": {
	key: "32659",
	name: "Fusion Mainnet",
	chainId: 32659,
	network: "mainnet",
	multicall: "",
	rpc: [
		"https://vote.anyswap.exchange/mainnet"
	],
	ws: [
		"wss://mainnetpublicgateway1.fusionnetwork.io:10001"
	],
	explorer: "https://fsnex.com"
},
	"42161": {
	key: "42161",
	name: "Arbitrum One",
	chainId: 42161,
	network: "Arbitrum mainnet",
	multicall: "0x7A7443F8c577d537f1d8cD4a629d40a3148Dd7ee",
	rpc: [
		"https://arb-mainnet.g.alchemy.com/v2/JDvtNGwnHhTltIwfnxQocKwKkCTKA1DL"
	],
	explorer: "https://arbiscan.io"
},
	"42220": {
	key: "42220",
	name: "Celo Mainnet",
	shortName: "Celo",
	chainId: 42220,
	network: "mainnet",
	multicall: "0xb8d0d2C1391eeB350d2Cd39EfABBaaEC297368D9",
	rpc: [
		"https://celo-mainnet--rpc.datahub.figment.io/apikey/e892a66dc36e4d2d98a5d6406d609796/"
	],
	explorer: "https://explorer.celo.org"
},
	"43114": {
	key: "43114",
	name: "Avalanche",
	chainId: 43114,
	network: "mainnet",
	multicall: "0x7E9985aE4C8248fdB07607648406a48C76e9e7eD",
	rpc: [
		"https://api.avax.network/ext/bc/C/rpc"
	],
	explorer: "https://cchain.explorer.avax.network"
},
	"80001": {
	key: "80001",
	name: "Matic Mumbai",
	chainId: 80001,
	network: "testnet",
	testnet: true,
	multicall: "0x08411ADd0b5AA8ee47563b146743C13b3556c9Cc",
	rpc: [
		"https://speedy-nodes-nyc.moralis.io/f2963e29bec0de5787da3164/polygon/mumbai/archive",
		"https://rpc-mumbai.matic.today"
	],
	ws: [
		"wss://ws-mumbai.matic.today"
	],
	explorer: ""
},
	"333888": {
	key: "333888",
	name: "Polis Sparta",
	shortName: "Sparta",
	chainId: 333888,
	network: "testnet",
	testnet: true,
	multicall: "0xA4c03972023d5f684d35eF1C541752490975383e",
	rpc: [
		"https://sparta-rpc.polis.tech"
	],
	explorer: "https://sparta-explorer.polis.tech"
},
	"333999": {
	key: "333999",
	name: "Polis Olympus",
	shortName: "Olympus",
	chainId: 333999,
	network: "mainnet",
	multicall: "0x34b99C2a4a4620F10ac779c36b8c61F90FD61732",
	rpc: [
		"https://rpc.polis.tech"
	],
	explorer: "https://explorer.polis.tech"
},
	"1666600000": {
	key: "1666600000",
	name: "Harmony Mainnet",
	shortName: "HarmonyMainnet",
	chainId: 1666600000,
	network: "mainnet",
	multicall: "0x9c31392D2e0229dC4Aa250F043d46B9E82074BF8",
	rpc: [
		"https://a.api.s0.t.hmny.io"
	],
	ws: [
		"wss://ws.s0.t.hmny.io"
	],
	explorer: "https://explorer.harmony.one"
},
	"1666700000": {
	key: "1666700000",
	name: "Harmony Testnet",
	shortName: "HarmonyTestnet",
	chainId: 1666700000,
	network: "testnet",
	testnet: true,
	multicall: "0x9923589503Fd205feE3d367DDFF2378f0F7dD2d4",
	rpc: [
		"https://api.s0.b.hmny.io"
	],
	ws: [
		"wss://ws.s0.b.hmny.io"
	],
	explorer: "https://explorer.pops.one"
},
	"11297108109": {
	key: "11297108109",
	name: "Palm Mainnet",
	shortName: "Palm",
	chainId: 11297108109,
	network: "mainnet",
	multicall: "0xfFE2FF36c5b8D948f788a34f867784828aa7415D",
	rpc: [
		"https://palm-mainnet.infura.io/v3/3a961d6501e54add9a41aa53f15de99b"
	],
	explorer: "https://explorer.palm.io"
}
};

var providers = {};
function getProvider(network) {
    var url = networks[network].rpc[0];
    if (!providers[network])
        providers[network] = new StaticJsonRpcProvider(url);
    return providers[network];
}

function validate(author, space, proposal, options) {
    var _a, _b;
    return __awaiter(this, void 0, void 0, function () {
        var strategies, onlyMembers, minScore, members, scores, totalScore;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    strategies = options.strategies || space.strategies;
                    onlyMembers = options.onlyMembers || ((_a = space.filters) === null || _a === void 0 ? void 0 : _a.onlyMembers);
                    minScore = options.minScore || ((_b = space.filters) === null || _b === void 0 ? void 0 : _b.minScore);
                    members = (space.members || []).map(function (address) { return address.toLowerCase(); });
                    if (members.includes(author.toLowerCase()))
                        return [2 /*return*/, true];
                    if (onlyMembers)
                        return [2 /*return*/, false];
                    if (!minScore) return [3 /*break*/, 2];
                    return [4 /*yield*/, getScores(space.id || space.key, strategies, space.network, [author])];
                case 1:
                    scores = _c.sent();
                    totalScore = scores
                        .map(function (score) { return Object.values(score).reduce(function (a, b) { return a + b; }, 0); })
                        .reduce(function (a, b) { return a + b; }, 0);
                    if (totalScore < minScore)
                        return [2 /*return*/, false];
                    _c.label = 2;
                case 2: return [2 /*return*/, true];
            }
        });
    });
}

/**
 * Aave Space Validation proposal validation uses:
 *  - Proposition power of GovernanceStrategy contract
 *  - Other active Aave Snapshot voting strategies
 *
 * The current validation implementation mutates the "strategies" field of the space
 * to be able to use proposition power instead of voting power for "aave-governance-power".
 *
 */
function validate$1(author, space, proposal, options) {
    var _a, _b;
    return __awaiter(this, void 0, void 0, function () {
        var onlyMembers, minScore, members, strategies, aaveGovernanceStrategyIndex, scores, totalScore;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    onlyMembers = options.onlyMembers || ((_a = space.filters) === null || _a === void 0 ? void 0 : _a.onlyMembers);
                    minScore = options.minScore || ((_b = space.filters) === null || _b === void 0 ? void 0 : _b.minScore);
                    members = (space.members || []).map(function (address) { return address.toLowerCase(); });
                    strategies = __spreadArrays(space.strategies);
                    aaveGovernanceStrategyIndex = strategies.findIndex(function (_a) {
                        var name = _a.name;
                        return name === 'aave-governance-power';
                    });
                    // Use the proposition power instead of voting power
                    if (aaveGovernanceStrategyIndex >= 0) {
                        strategies[aaveGovernanceStrategyIndex].params.powerType = 'proposition';
                    }
                    if (members.includes(author.toLowerCase()))
                        return [2 /*return*/, true];
                    if (onlyMembers)
                        return [2 /*return*/, false];
                    if (!minScore) return [3 /*break*/, 2];
                    return [4 /*yield*/, getScores(space.id || space.key, strategies, space.network, [author])];
                case 1:
                    scores = _c.sent();
                    totalScore = scores
                        .map(function (score) { return Object.values(score).reduce(function (a, b) { return a + b; }, 0); })
                        .reduce(function (a, b) { return a + b; }, 0);
                    if (totalScore < minScore)
                        return [2 /*return*/, false];
                    _c.label = 2;
                case 2: return [2 /*return*/, true];
            }
        });
    });
}

var validations = {
    basic: validate,
    aave: validate$1
};

function verifyDefault(address, sig, hash, provider) {
    return __awaiter(this, void 0, void 0, function () {
        var returnValue, magicValue, abi, e_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    magicValue = '0x1626ba7e';
                    abi = 'function isValidSignature(bytes32 _hash, bytes memory _signature) public view returns (bytes4 magicValue)';
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, call(provider, [abi], [address, 'isValidSignature', [arrayify(hash), sig]])];
                case 2:
                    returnValue = _a.sent();
                    return [3 /*break*/, 4];
                case 3:
                    e_1 = _a.sent();
                    console.log(e_1);
                    return [2 /*return*/, false];
                case 4: return [2 /*return*/, returnValue.toLowerCase() === magicValue.toLowerCase()];
            }
        });
    });
}
function verifyOldVersion(address, sig, hash, provider) {
    return __awaiter(this, void 0, void 0, function () {
        var returnValue, magicValue, abi, e_2;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    magicValue = '0x20c13b0b';
                    abi = 'function isValidSignature(bytes _hash, bytes memory _signature) public view returns (bytes4 magicValue)';
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, call(provider, [abi], [address, 'isValidSignature', [arrayify(hash), sig]])];
                case 2:
                    returnValue = _a.sent();
                    return [3 /*break*/, 4];
                case 3:
                    e_2 = _a.sent();
                    console.log(e_2);
                    return [2 /*return*/, false];
                case 4: return [2 /*return*/, returnValue.toLowerCase() === magicValue.toLowerCase()];
            }
        });
    });
}
function verify(address, sig, hash, network) {
    if (network === void 0) { network = '1'; }
    return __awaiter(this, void 0, void 0, function () {
        var provider;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    provider = getProvider(network);
                    return [4 /*yield*/, verifyDefault(address, sig, hash, provider)];
                case 1:
                    if (_a.sent())
                        return [2 /*return*/, true];
                    return [4 /*yield*/, verifyOldVersion(address, sig, hash, provider)];
                case 2: return [2 /*return*/, _a.sent()];
            }
        });
    });
}

function getHash(data) {
    var domain = data.domain, types = data.types, message = data.message;
    return _TypedDataEncoder.hash(domain, types, message);
}
function verify$1(address, sig, data) {
    return __awaiter(this, void 0, void 0, function () {
        var domain, types, message, recoverAddress, hash;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    domain = data.domain, types = data.types, message = data.message;
                    recoverAddress = verifyTypedData(domain, types, message, sig);
                    hash = getHash(data);
                    console.log('Hash', hash);
                    console.log('Address', address);
                    console.log('Recover address', recoverAddress);
                    if (address === recoverAddress)
                        return [2 /*return*/, true];
                    console.log('Check EIP1271 signature');
                    return [4 /*yield*/, verify(address, sig, hash)];
                case 1: return [2 /*return*/, _a.sent()];
            }
        });
    });
}

var gateways = [
	"cloudflare-ipfs.com",
	"cf-ipfs.com",
	"ipfs.io",
	"ipfs.fleek.co",
	"gateway.pinata.cloud",
	"dweb.link",
	"ipfs.infura.io"
];

function call(provider, abi, call, options) {
    return __awaiter(this, void 0, void 0, function () {
        var contract, params, e_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    contract = new Contract(call[0], abi, provider);
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    params = call[2] || [];
                    return [4 /*yield*/, contract[call[1]].apply(contract, __spreadArrays(params, [options || {}]))];
                case 2: return [2 /*return*/, _a.sent()];
                case 3:
                    e_1 = _a.sent();
                    return [2 /*return*/, Promise.reject(e_1)];
                case 4: return [2 /*return*/];
            }
        });
    });
}
function multicall(network, provider, abi, calls, options) {
    return __awaiter(this, void 0, void 0, function () {
        var multicallAbi, multi, itf, _a, res, e_2;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    multicallAbi = [
                        'function aggregate(tuple(address target, bytes callData)[] calls) view returns (uint256 blockNumber, bytes[] returnData)'
                    ];
                    multi = new Contract(networks[network].multicall, multicallAbi, provider);
                    itf = new Interface(abi);
                    _b.label = 1;
                case 1:
                    _b.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, multi.aggregate(calls.map(function (call) { return [
                            call[0].toLowerCase(),
                            itf.encodeFunctionData(call[1], call[2])
                        ]; }), options || {})];
                case 2:
                    _a = _b.sent(), res = _a[1];
                    return [2 /*return*/, res.map(function (call, i) { return itf.decodeFunctionResult(calls[i][1], call); })];
                case 3:
                    e_2 = _b.sent();
                    return [2 /*return*/, Promise.reject(e_2)];
                case 4: return [2 /*return*/];
            }
        });
    });
}
function subgraphRequest(url, query, options) {
    if (options === void 0) { options = {}; }
    return __awaiter(this, void 0, void 0, function () {
        var res, data;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, fetch(url, {
                        method: 'POST',
                        headers: __assign({ Accept: 'application/json', 'Content-Type': 'application/json' }, options === null || options === void 0 ? void 0 : options.headers),
                        body: JSON.stringify({ query: jsonToGraphQLQuery({ query: query }) })
                    })];
                case 1:
                    res = _a.sent();
                    return [4 /*yield*/, res.json()];
                case 2:
                    data = (_a.sent()).data;
                    return [2 /*return*/, data || {}];
            }
        });
    });
}
function getUrl(uri, gateway) {
    if (gateway === void 0) { gateway = gateways[0]; }
    var ipfsGateway = "https://" + gateway;
    if (!uri)
        return null;
    if (!uri.includes('ipfs') && !uri.includes('ipns') && !uri.includes('http'))
        return ipfsGateway + "/ipfs/" + uri;
    var uriScheme = uri.split('://')[0];
    if (uriScheme === 'ipfs')
        return uri.replace('ipfs://', ipfsGateway + "/ipfs/");
    if (uriScheme === 'ipns')
        return uri.replace('ipns://', ipfsGateway + "/ipns/");
    return uri;
}
function ipfsGet(gateway, ipfsHash, protocolType) {
    if (protocolType === void 0) { protocolType = 'ipfs'; }
    return __awaiter(this, void 0, void 0, function () {
        var url;
        return __generator(this, function (_a) {
            url = "https://" + gateway + "/" + protocolType + "/" + ipfsHash;
            return [2 /*return*/, fetch(url).then(function (res) { return res.json(); })];
        });
    });
}
function sendTransaction(web3, contractAddress, abi, action, params, overrides) {
    if (overrides === void 0) { overrides = {}; }
    return __awaiter(this, void 0, void 0, function () {
        var signer, contract, contractWithSigner;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    signer = web3.getSigner();
                    contract = new Contract(contractAddress, abi, web3);
                    contractWithSigner = contract.connect(signer);
                    return [4 /*yield*/, contractWithSigner[action].apply(contractWithSigner, __spreadArrays(params, [overrides]))];
                case 1: 
                // overrides.gasLimit = 12e6;
                return [2 /*return*/, _a.sent()];
            }
        });
    });
}
function getScores(space, strategies, network, addresses, snapshot, scoreApiUrl) {
    if (snapshot === void 0) { snapshot = 'latest'; }
    if (scoreApiUrl === void 0) { scoreApiUrl = 'https://score.snapshot.org/api/scores'; }
    return __awaiter(this, void 0, void 0, function () {
        var params, res, obj, e_3;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 3, , 4]);
                    params = {
                        space: space,
                        network: network,
                        snapshot: snapshot,
                        strategies: strategies,
                        addresses: addresses
                    };
                    return [4 /*yield*/, fetch(scoreApiUrl, {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({ params: params })
                        })];
                case 1:
                    res = _a.sent();
                    return [4 /*yield*/, res.json()];
                case 2:
                    obj = _a.sent();
                    return [2 /*return*/, obj.result.scores];
                case 3:
                    e_3 = _a.sent();
                    return [2 /*return*/, Promise.reject(e_3)];
                case 4: return [2 /*return*/];
            }
        });
    });
}
function validateSchema(schema, data) {
    var ajv = new Ajv({ allErrors: true, allowUnionTypes: true, $data: true });
    // @ts-ignore
    addFormats(ajv);
    var validate = ajv.compile(schema);
    var valid = validate(data);
    return valid ? valid : validate.errors;
}
function getSpaceUri(id) {
    return __awaiter(this, void 0, void 0, function () {
        var abi, address, uri, hash, provider, e_4;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    abi = 'function text(bytes32 node, string calldata key) external view returns (string memory)';
                    address = '0x4976fb03C32e5B8cfe2b6cCB31c09Ba78EBaBa41';
                    uri = false;
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    hash = namehash(id);
                    provider = getProvider('1');
                    return [4 /*yield*/, call(provider, [abi], [address, 'text', [hash, 'snapshot']])];
                case 2:
                    uri = _a.sent();
                    return [3 /*break*/, 4];
                case 3:
                    e_4 = _a.sent();
                    console.log('getSpaceUriFromTextRecord failed', id, e_4);
                    return [3 /*break*/, 4];
                case 4: return [2 /*return*/, uri];
            }
        });
    });
}
function clone(item) {
    return JSON.parse(JSON.stringify(item));
}
function sleep(time) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, new Promise(function (resolve) {
                    setTimeout(resolve, time);
                })];
        });
    });
}
var utils = {
    call: call,
    multicall: multicall,
    subgraphRequest: subgraphRequest,
    ipfsGet: ipfsGet,
    getUrl: getUrl,
    sendTransaction: sendTransaction,
    getScores: getScores,
    validateSchema: validateSchema,
    getSpaceUri: getSpaceUri,
    clone: clone,
    sleep: sleep,
    getProvider: getProvider,
    signMessage: signMessage,
    getBlockNumber: getBlockNumber,
    Multicaller: Multicaller,
    validations: validations,
    getHash: getHash,
    verify: verify$1
};

var index = {
    Client: Client,
    schemas: schemas,
    utils: utils
};

export default index;
