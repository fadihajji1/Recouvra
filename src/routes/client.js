const express = require('express');
const router = express.Router();
const axios = require('axios');



//get all clients
router.get('/client', async (req, res) => {
    try {
        const response = await axios.get(`${MONGODB_API}`);
        res.json(response.data.map(formatClient));   
    } catch (error) {
        console.error('Error fetching clients:', error);
        res.status(500).json({ error: 'Failed to fetch clients' });
    }
});

//get client by id
router.get('/client/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const response = await axios.get(`${MONGODB_API}/${id}`);
        const client = response.data;
        if (!client) {
            return res.status(404).json({ message: 'Client not found' });
        }
        res.json(formatClient(client));
    } catch (error) {
        console.error('Error fetching client:', error);
        res.status(500).json({ error: 'Failed to fetch client' });
    }
});

//create new client
router.post('/client', async (req, res) => {
    try {
        const newClient = req.body;
        const response = await axios.post(`${MONGODB_API}`, newClient);
        res.status(201).json(formatClient(response.data));
    } catch (error) {
        console.error('Error creating client:', error);
        res.status(500).json({ error: 'Failed to create client' });
    }
});

// update client by id
router.patch('/client/:id', async (req, res) => {
    const { id } = req.params;
    const newClient = req.body;

    try {
        const response = await axios.patch(`${MONGODB_API}/${id}`, newClient);
        if (!response.data) {
            return res.status(404).json({ message: 'Client not found' });
        }
        res.json(formatClient(response.data));
    } catch (error) {
        console.error('Error updating client:', error);
        res.status(500).json({ error: 'Failed to update client' });
    }
});

// delete client by id
router.delete('/client/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const response = await axios.delete(`${MONGODB_API}/${id}`);
        if (response.status === 204) return res.json({ message: 'Client deleted successfully' });
        res.status(404).json({ message: 'Client not found' });
    } catch (error) {
        console.error('Error deleting client:', error);
        res.status(500).json({ error: 'Failed to delete client' });
    }
});


module.exports = router;