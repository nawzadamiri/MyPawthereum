import fetch from 'cross-fetch';
import { Interface } from '@ethersproject/abi';
import { Contract } from '@ethersproject/contracts';
import { namehash } from '@ethersproject/hash';
import { jsonToGraphQLQuery } from 'json-to-graphql-query';
import Ajv from 'ajv';
import addFormats from 'ajv-formats';
import Multicaller from './utils/multicaller';
import getProvider from './utils/provider';
import validations from './validations';
import { signMessage, getBlockNumber } from './utils/web3';
import { getHash, verify } from './sign/utils';
import gateways from './gateways.json';
import networks from './networks.json';

export const SNAPSHOT_SUBGRAPH_URL = {
  '1': 'https://api.thegraph.com/subgraphs/name/snapshot-labs/snapshot',
  '4': 'https://api.thegraph.com/subgraphs/name/snapshot-labs/snapshot-rinkeby',
  '42': 'https://api.thegraph.com/subgraphs/name/snapshot-labs/snapshot-kovan'
};

export async function call(provider: any, abi: any[], call: any[], options?: any) {
  const contract = new Contract(call[0], abi, provider);
  try {
    const params = call[2] || [];
    return await contract[call[1]](...params, options || {});
  } catch (e) {
    return Promise.reject(e);
  }
}

export async function multicall(
  network: string,
  provider: any,
  abi: any[],
  calls: any[],
  options?: any
) {
  const multicallAbi = [
    'function aggregate(tuple(address target, bytes callData)[] calls) view returns (uint256 blockNumber, bytes[] returnData)'
  ];

  const networkData = networks?[network] : null;
  const multiCallData = networkData?['multicall'] : '';
  const multi = new Contract(
    multiCallData,
    multicallAbi,
    provider
  );
  const itf = new Interface(abi);
  try {
    const [, res] = await multi.aggregate(
      calls.map((call) => [
        call[0].toLowerCase(),
        itf.encodeFunctionData(call[1], call[2])
      ]),
      options || {}
    );
    return res.map((call: any, i: any) => itf.decodeFunctionResult(calls[i][1], call));
  } catch (e) {
    return Promise.reject(e);
  }
}

export async function subgraphRequest(url: string, query: any, options: any = {}) {
  const res = await fetch(url, {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      ...options?.headers
    },
    body: JSON.stringify({ query: jsonToGraphQLQuery({ query }) })
  });
  const { data } = await res.json();
  return data || {};
}

export function getUrl(uri: any, gateway: any = gateways[0]) {
  const ipfsGateway = `https://${gateway}`;
  if (!uri) return null;
  if (!uri.includes('ipfs') && !uri.includes('ipns') && !uri.includes('http'))
    return `${ipfsGateway}/ipfs/${uri}`;
  const uriScheme = uri.split('://')[0];
  if (uriScheme === 'ipfs')
    return uri.replace('ipfs://', `${ipfsGateway}/ipfs/`);
  if (uriScheme === 'ipns')
    return uri.replace('ipns://', `${ipfsGateway}/ipns/`);
  return uri;
}

export async function ipfsGet(
  gateway: string,
  ipfsHash: string,
  protocolType = 'ipfs'
) {
  const url = `https://${gateway}/${protocolType}/${ipfsHash}`;
  return fetch(url).then((res) => res.json());
}

export async function sendTransaction(
  web3: any,
  contractAddress: string,
  abi: any[],
  action: string,
  params: any[],
  overrides = {}
) {
  const signer = web3.getSigner();
  const contract = new Contract(contractAddress, abi, web3);
  const contractWithSigner = contract.connect(signer);
  // overrides.gasLimit = 12e6;
  return await contractWithSigner[action](...params, overrides);
}

export async function getScores(
  space: string,
  strategies: any[],
  network: string,
  addresses: string[],
  snapshot: number | string = 'latest',
  scoreApiUrl = 'https://score.snapshot.org/api/scores'
) {
  try {
    const params = {
      space,
      network,
      snapshot,
      strategies,
      addresses
    };
    const res = await fetch(scoreApiUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ params })
    });
    const obj = await res.json();
    return obj.result.scores;
  } catch (e) {
    return Promise.reject(e);
  }
}

export function validateSchema(schema: any, data: any) {
  const ajv = new Ajv({ allErrors: true, allowUnionTypes: true, $data: true });
  // @ts-ignore
  addFormats(ajv);
  const validate = ajv.compile(schema);
  const valid = validate(data);
  return valid ? valid : validate.errors;
}

export async function getSpaceUri(id: any) {
  const abi =
    'function text(bytes32 node, string calldata key) external view returns (string memory)';
  const address = '0x4976fb03C32e5B8cfe2b6cCB31c09Ba78EBaBa41';

  let uri: any = false;
  try {
    const hash = namehash(id);
    const provider = getProvider('1');
    uri = await call(
      provider,
      [abi],
      [address, 'text', [hash, 'snapshot']]
    );
  } catch (e) {
    console.log('getSpaceUriFromTextRecord failed', id, e);
  }
  return uri;
}

export function clone(item: any) {
  return JSON.parse(JSON.stringify(item));
}

export async function sleep(time: any) {
  return new Promise(resolve => {
    setTimeout(resolve, time);
  });
}

export default {
  call,
  multicall,
  subgraphRequest,
  ipfsGet,
  getUrl,
  sendTransaction,
  getScores,
  validateSchema,
  getSpaceUri,
  clone,
  sleep,
  getProvider,
  signMessage,
  getBlockNumber,
  Multicaller,
  validations,
  getHash,
  verify
};