const jsonServer = require('json-server');
const server = jsonServer.create();
const router = jsonServer.router('db.json');
const middlewares = jsonServer.defaults();

server.use(middlewares);
server.use(jsonServer.bodyParser);

// custom routes for contact list
server.get('/contacts', (req, res) => {
  router.db.get('contacts').value();
  res.jsonp(router.db.get('contacts').value());
});
//
server.post('/contacts', (req, res) => {
  const contact = req.body;
  router.db.get('contacts').push(contact).write();
  res.jsonp(contact);
});

server.put('/contacts/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const updatedContact = req.body;
  router.db.get('contacts').find({ id }).assign(updatedContact).write();
  res.jsonp(updatedContact);
});

server.delete('/contacts/:id', (req, res) => {
  const id = parseInt(req.params.id);
  router.db.get('contacts').remove({ id }).write();
  res.jsonp({ message: `Contact with id ${id} has been deleted.` });
});

server.use(router);
server.listen(5001, () => {
  console.log('JSON Server is running on port 3001');
});
