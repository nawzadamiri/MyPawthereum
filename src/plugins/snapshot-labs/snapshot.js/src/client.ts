import fetch from 'cross-fetch';
import { Web3Provider } from '@ethersproject/providers';
import { signMessage } from './utils/web3';
import hubs from './hubs.json';
import { version } from './constants.json';

export default class Client {
  readonly address: string;

  constructor(address: string = hubs[0]) {
    this.address = address;
  }

  request(command: string, body?: any) {
    const url = `${this.address}/api/${command}`;
    let init: any;
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
    return new Promise((resolve, reject) => {
      fetch(url, init)
        .then((res) => {
          if (res.ok) return resolve(res.json());
          throw res;
        })
        .catch((e) => e.json().then((json: any) => reject(json)));
    });
  }

  async send(msg: any) {
    return this.request('message', msg);
  }

  async getSpaces() {
    return this.request('spaces');
  }

  async getSpace (id: any) {
    return this.request('spaces', id)
  }

  async broadcast(
    web3: Web3Provider,
    account: string,
    space: string,
    type: string,
    payload: any
  ) {
    const msg: any = {
      address: account,
      msg: JSON.stringify({
        version,
        timestamp: (Date.now() / 1e3).toFixed(),
        space,
        type,
        payload
      })
    };
    msg.sig = await signMessage(web3, msg.msg, account);
    return await this.send(msg);
  }

  async sign(
    web3: Web3Provider,
    account: string,
    space: string,
    type: string,
    payload: any
  ) {
    const msg: any = {
      address: account,
      msg: JSON.stringify({
        version,
        timestamp: (Date.now() / 1e3).toFixed(),
        space,
        type,
        payload
      })
    };
    return await signMessage(web3, msg.msg, account);
  }

  async vote(
    web3: Web3Provider,
    address: string,
    space: any,
    proposal: any, 
    choice: any, 
    metadata = {},
  ) {
    return this.broadcast(web3, address, space, 'vote', {
      proposal,
      choice,
      metadata
    });
  }

  async proposal(
    web3: Web3Provider,
    address: string,
    space: string,
    params: {
      name: any,
      body: any,
      choices: any,
      start: any,
      end: any,
      snapshot: any,
      type: 'single-choice',
      metadata: any
    }
  ) {
    return this.broadcast(web3, address, space, 'proposal', params);
  }

  async deleteProposal(
    web3: Web3Provider,
    address: string,
    space: string,
    proposal: any
  ) {
    return this.broadcast(web3, address, space, 'delete-proposal', {
      proposal
    });
  }

  async settings(web3: Web3Provider, address: string, space: string, settings: any) {
    return this.broadcast(web3, address, space, 'settings', settings);
  }

  async getProposals (space: string) {
    return fetch('https://hub.snapshot.org/graphql', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        query: `
          query {
            proposals (
              first: 20,
              skip: 0,
              where: {
                space_in: ["${space}"],
                state: "closed"
              },
              orderBy: "created",
              orderDirection: desc
            ) {
              id
              title
              body
              choices
              start
              end
              snapshot
              state
              author
              space {
                id
                name
              }
            }
          }      
        `,
      }),
    })
    .then((res) => res.json())
    .then((result) => {
      const proposals = result.data.proposals
      return proposals
    })
  }
  
  async getProposal (id: string) {
    return fetch('https://hub.snapshot.org/graphql', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        query: `
          query {
            proposal(id:"${id}") {
              id
              title
              body
              choices
              start
              end
              snapshot
              state
              author
              created
              plugins
              network
              strategies {
                name
                params
              }
              space {
                id
                name
              }
            }
          }    
        `,
      }),
    })
    .then((res) => res.json())
    .then((result) => {
      return result.data.proposal
    })
  }
}
