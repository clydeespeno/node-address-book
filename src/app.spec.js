import {describe, it, before, after, afterEach} from 'mocha';
import chai from 'chai';
import chaiAsPromised from 'chai-as-promised';
import sinonChai from 'sinon-chai';
import appContext from './appContext';
import axios from 'axios';

chai.use(chaiAsPromised);
chai.use(sinonChai);
const expect = chai.expect;
expect();

describe('addressbook', () => {

  const container = appContext();
  const config = container.resolve('config');
  const appBase = `http://localhost:${config.port}/api`;

  const createContact = (id, contact) =>
    axios.post(`${appBase}/addressbook/${id}/contacts`, contact).then(res => res.data);

  const getContacts = (id) =>
    axios.get(`${appBase}/addressbook/${id}/contacts`).then(res => res.data);

  before(() => {
    container.resolve('koaApp');
  });

  after(() => {
    container.resolve('koaApp').server.close();
  });

  afterEach(async() => {
    await container.resolve('contactRepository').removeAll();
  });

  it('gets nothing when no contacts were created yet', async() => {
    const contacts = await getContacts('0');
    expect(contacts).to.be.empty;
  });

  it('inserts a contact for an addressbook', async() => {
    await createContact('clyde', {
      name: 'Alice',
      number: '11111'
    });

    const contacts = await getContacts('clyde');
    expect(contacts).to.be.length(1);
    expect(contacts[0].name).to.equal('Alice');
  });

  it('removes a created contact', async() => {
    const id = await createContact('clyde', {
      name: 'Bob',
      number: '22222'
    });

    await axios.delete(`${appBase}/addressbook/clyde/contacts/${id}`).then(res => res.data);
    const contacts = await getContacts('clyde');
    expect(contacts).to.be.empty;
  });

  it('gets the contacts of an address book, sorted by name', async () => {
    await Promise.all([
      createContact('clyde', {
        name: 'Bob',
        number: '22222'
      }),
      createContact('clyde', {
        name: 'Charlie',
        number: '22222'
      }),
      createContact('clyde', {
        name: 'Alice',
        number: '22222'
      })
    ]);

    const contacts = await getContacts('clyde');
    expect(contacts[0].name).to.equal('Alice');
    expect(contacts[1].name).to.equal('Bob');
    expect(contacts[2].name).to.equal('Charlie');
  });

  it('it gets the unique contacts from an addressbook', async () => {
    await Promise.all([
      createContact('clyde', {
        name: 'Bob',
        number: '22222'
      }),
      createContact('clyde', {
        name: 'Charlie',
        number: '22222'
      }),
      createContact('clyde', {
        name: 'Alice',
        number: '22222'
      }),
      createContact('link', {
        name: 'Dud',
        number: '22222'
      }),
      createContact('link', {
        name: 'Alice',
        number: '22222'
      })
    ]);

    const names = (await axios.get(`${appBase}/addressbook/clyde/compare/link`).then(r => r.data))
      .map(c => c.name)
      .sort();
    expect(names).to.eql(['Alice', 'Bob', 'Charlie', 'Dud']);
  });

});

