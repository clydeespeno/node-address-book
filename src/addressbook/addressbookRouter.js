import Router from 'koa-router';

export default ({addressbookService}) => {

  const abRouter = new Router();

  // create contact
  abRouter.post('/contacts', async (ctx) => {
    const id = await addressbookService.createContact(ctx.params.id, ctx.request.body);
    ctx.body = id;
  });

  // delete a contact
  abRouter.delete('/contacts/:contactId', async (ctx) => {
    await addressbookService.removeContact(ctx.params.id, ctx.params.contactId);
    ctx.body = 'Contact deleted from address book';
  });

  // get all contacts sorted by name
  abRouter.get('/contacts', async (ctx) => {
    const contacts = await addressbookService.getContacts(ctx.params.id);
    ctx.body = contacts.sort((a, b) => a.name.localeCompare(b.name));
  });

  // get addressbooks and compare each
  abRouter.get('/compare/:compareId', async (ctx) => {
    ctx.body = await addressbookService.getUniqueContacts(ctx.params.id, ctx.params.compareId);
  });


  const router = new Router();
  router.use('/api/addressbook/:id', abRouter.routes());

  return router;
};
