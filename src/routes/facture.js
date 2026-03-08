//crud for bills
const express = require('express');
const router = express.Router();
const axios = require('axios');

//get all bills
router.get('/facture', async (req, res) => {
    try {
        const response = await axios.get(`${MONGODB_API}`);
        res.json(response.data);   
    } catch (error) {
        console.error('Error fetching bills:', error);
        res.status(500).json({ error: 'Failed to fetch bills' });
    }  
});


//get bill by id
router.get('/facture/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const response = await axios.get(`${MONGODB_API}/${id}`);
        const bill = response.data;
        if (!bill) {
            return res.status(404).json({ message: 'Bill not found' });
        }
        res.json(bill);
    } catch (error) {
        console.error('Error fetching bill:', error);
        res.status(500).json({ error: 'Failed to fetch bill' });
    }
});


//create new bill
router.post('/facture', async (req, res) => {
    try {   
        const newBill = req.body;
        const response = await axios.post(`${MONGODB_API}`, newBill);
        res.status(201).json(response.data);
    } catch (error) {
        console.error('Error creating bill:', error);
        res.status(500).json({ error: 'Failed to create bill' });
    }
});

//update bill by id
router.patch('/facture/:id', async (req, res) => {
    const { id } = req.params;
    const newBill = req.body;
    try {
        const response = await axios.patch(`${MONGODB_API}/${id}`, newBill);
        if (!response.data) {
            return res.status(404).json({ message: 'Bill not found' });
        }
        res.json(response.data);
    } catch (error) {
        console.error('Error updating bill:', error);
        res.status(500).json({ error: 'Failed to update bill' });
    }
});

//delete bill by id
router.delete('/facture/:id', async (req, res) => {
    const { id } = req.params;  
    try {
        const response = await axios.delete(`${MONGODB_API}/${id}`);
        if (response.status === 404) {
            return res.status(404).json({ message: 'Bill not found' });
        }
        res.json({ message: 'Bill deleted' });
    } catch (error) {
        console.error('Error deleting bill:', error);
        res.status(500).json({ error: 'Failed to delete bill' });
    }
});

module.exports = router;
