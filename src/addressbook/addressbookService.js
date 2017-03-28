import Promise from 'bluebird';

export default ({contactRepository}) => {
  return {
    createContact: (addressbookId, contact) => {
      return contactRepository.insert({...contact, addressbookId});
    },

    removeContact: (addressbookId, contactId) => {
      return contactRepository.remove((c) =>
        c.addressbookId === addressbookId && c.id === parseInt(contactId, 10)
      );
    },

    getContacts: (addressbookId) => {
      return contactRepository.filter((c) => c.addressbookId === addressbookId);
    },

    getUniqueContacts: async(aId, bId) => {
      const [a, b] = await Promise.all([
        contactRepository.filter((c) => c.addressbookId === aId),
        contactRepository.filter((c) => c.addressbookId === bId)
      ]);
      return uniqueContacts(a, b);
    }
  };
};


function uniqueContacts(a, b) {
  const m = {};
  const buildUnique = ((m) => (c) => m[c.name + c.number] = {name: c.name, number: c.number})(m);
  a.forEach(buildUnique);
  b.forEach(buildUnique);
  return Object.keys(m).map(a => m[a]);
}

