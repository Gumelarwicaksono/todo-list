import React, { useState, useEffect } from 'react';
import { Button, Form, ListGroup } from 'react-bootstrap';

function App() {
  const [contact, setContact] = useState({ name: '', email: '', phone: '' });
  const [contacts, setContacts] = useState([]);

  useEffect(() => {
    const fetchContacts = async () => {
      const response = await fetch('http://localhost:5001/contacts');
      const data = await response.json();
      setContacts(data);
    };
    fetchContacts();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const response = await fetch('http://localhost:5001/contacts', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(contact),
    });
    const data = await response.json();
    setContacts([...contacts, data]);
    setContact({ name: '', email: '', phone: '' });
  };
  //
  const handleDelete = async (id) => {
    await fetch(`http://localhost:5001/contacts/${id}`, {
      method: 'DELETE',
    });
    const updatedContacts = contacts.filter((contact) => contact.id !== id);
    setContacts(updatedContacts);
  };

  const handleEdit = async (id) => {
    const updatedName = prompt('Edit Name');
    const updatedEmail = prompt('Edit Email');
    const updatedPhone = prompt('Edit Phone');
    const updatedContact = { name: updatedName, email: updatedEmail, phone: updatedPhone };
    await fetch(`http://localhost:5001/contacts/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updatedContact),
    });
    const updatedContacts = contacts.map((contact) => {
      if (contact.id === id) {
        return { ...contact, ...updatedContact };
      }
      return contact;
    });
    setContacts(updatedContacts);
  };

  const [toogle, setToogle] = useState(false);

  const toggle = () => {
    setToogle(!toogle);
  };

  return (
    <div className="container w-50">
      <h1 className="text-center my-3 text-success">Contact List</h1>
      <Button variant="primary" onClick={toggle}>
        Add Contact
      </Button>
      {toogle && (
        <Form onSubmit={handleSubmit} className="w-75">
          <Form.Group className="m-2">
            <Form.Control type="text" placeholder="Name" value={contact.name} onChange={(e) => setContact({ ...contact, name: e.target.value })} required />
          </Form.Group>
          <Form.Group className="m-2">
            <Form.Control type="email" placeholder="Email" value={contact.email} onChange={(e) => setContact({ ...contact, email: e.target.value })} required />
          </Form.Group>
          <Form.Group className="m-2">
            <Form.Control type="tel" placeholder="Phone" value={contact.phone} onChange={(e) => setContact({ ...contact, phone: e.target.value })} required />
          </Form.Group>
          <Button variant="success" type="submit">
            Save Contact
          </Button>
        </Form>
      )}
      <ListGroup className="my-5 ">
        {contacts.map((contact) => (
          <ListGroup.Item key={contact.id}>
            <div className="d-flex justify-content-between">
              <div>
                <h5>{contact.name}</h5>
                <p>{contact.email}</p>
                <p>{contact.phone}</p>
              </div>
              <div>
                <Button variant="warning" className="mx-2" onClick={() => handleEdit(contact.id)}>
                  Edit
                </Button>
                <Button variant="danger" onClick={() => handleDelete(contact.id)}>
                  Delete
                </Button>
              </div>
            </div>
          </ListGroup.Item>
        ))}
      </ListGroup>
    </div>
  );
}

export default App;
