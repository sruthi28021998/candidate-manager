const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const mongoose = require('mongoose');

const app = express();
const PORT = 5000;

app.use(cors());
app.use(bodyParser.json());
mongoose.connect('mongodb://localhost:27017/candidate_data', { useNewUrlParser: true, useUnifiedTopology: true });
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', () => console.log('Connected to MongoDB'));

const candidateSchema = new mongoose.Schema({
    name: "ravi",
    email: "ravi1234@gmail.com",
    phone: "9956342624",
    skills: "HTML,CSS,JS,PYTHON,REACT",
    experience: "4 years",
    
});

const Candidate = mongoose.model('Candidate', candidateSchema);


app.get('/api/candidates', async (req, res) => {
    try {
        const candidates = await Candidate.find();
        res.json(candidates);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});


app.post('/api/candidates', async (req, res) => {
    const newCandidate = new Candidate(req.body);
    try {
        const savedCandidate = await newCandidate.save();
        res.status(201).json(savedCandidate);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});


app.get('/api/candidates/:id', async (req, res) => {
    try {
        const candidate = await Candidate.findById(req.params.id);
        if (!candidate) {
            return res.status(404).json({ message: 'Candidate not found' });
        }
        res.json(candidate);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});


app.put('/api/candidates/:id', async (req, res) => {
    try {
        const updatedCandidate = await Candidate.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!updatedCandidate) {
            return res.status(404).json({ message: 'Candidate not found' });
        }
        res.json(updatedCandidate);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});


app.delete('/api/candidates/:id', async (req, res) => {
    try {
        const deletedCandidate = await Candidate.findByIdAndDelete(req.params.id);
        if (!deletedCandidate) {
            return res.status(404).json({ message: 'Candidate not found' });
        }
        res.json({ message: 'Candidate deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
