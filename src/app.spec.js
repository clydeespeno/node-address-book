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

  before(() => {
    container.resolve('koaApp');
  });

  after(() => {
    container.resolve('koaApp').server.close();
  });

  afterEach(async () => {
    await container.resolve('contactRepository').removeAll();
  });

  it('gets nothing when no contacts were created yet', async () => {
    const contacts = await axios.get(`${appBase}/addressbook/0/contacts`).then(res => res.data);
    expect(contacts).to.be.empty;
  });

  it('inserts a contact for an addressbook', async () => {
    await axios.post(`${appBase}/addressbook/clyde/contacts`, {
      name: 'Alice',
      number: '11111'
    });

    const contacts = await axios.get(`${appBase}/addressbook/clyde/contacts`).then(res => res.data);
    expect(contacts).to.be.length(1);
    expect(contacts[0].name).to.equal('Alice');
  });

  it('removes a created contact', async () => {
    const id = await axios.post(`${appBase}/addressbook/clyde/contacts`, {
      name: 'Bob',
      number: '22222'
    }).then(res => res.data);

    await axios.delete(`${appBase}/addressbook/clyde/contacts/${id}`).then(res => res.data);
    const contacts = await axios.get(`${appBase}/addressbook/clyde/contacts`).then(res => res.data);
    expect(contacts).to.be.empty;
  });
});

