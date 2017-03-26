export default () => {
  let nextId = 0;
  let lookup = {};

  return {
    insert: async (c) => {
      const id = ++nextId;
      lookup[id] = {...c, id};
      return id;
    },

    remove: async (f) => {
      const c = values(lookup).find(f);
      if (c) {
        delete lookup[c.id];
      }
    },

    filter: async (f) => values(lookup).filter(f),

    removeAll: async () => lookup = {}
  };
};

function values(o) {
  return Object.keys(o).reduce((vs, k) => {
    vs.push(o[k]);
    return vs;
  }, []);
}
