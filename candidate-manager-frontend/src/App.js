import React, { useState, useEffect } from 'react';
import axios from 'axios';
import styled from 'styled-components';

const Container = styled.div`
    font-family: sans-serif;
    padding: 20px;
`;

const SearchInput = styled.input`
    padding: 8px;
    margin-bottom: 15px;
    width: 300px;
`;


const CandidateList = styled.ul`
    list-style: none;
    padding: 0;
`;

const CandidateItem = styled.li`
    border: 1px solid #ccc;
    padding: 10px;
    margin-bottom: 10px;
`;


const AddCandidateForm = styled.div`
    margin-top: 20px;
    border: 1px solid #eee;
    padding: 15px;
`;

const InputField = styled.input`
    display: block;
    margin-bottom: 10px;
    padding: 8px;
    width: 300px;
`;

const SubmitButton = styled.button`
    padding: 10px 20px;
    cursor: pointer;
`;


function App() {
    const [candidates, setCandidates] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [filteredCandidates, setFilteredCandidates] = useState([]);
    const [filters, setFilters] = useState({});
    

   
    const [newName, setNewName] = useState('Pavan Kumar');
    const [newEmail, setNewEmail] = useState('pavan.kumar1234@gmail.com');
    const [newPhone, setNewPhone] = useState('9984357841');
    const [newSkills, setNewSkills] = useState('Javascript,Python,Node.js');
    const [newExperience, setNewExperience] = useState('5 years of full-stack development experience');
    

    useEffect(() => {
        fetchCandidates();
    }, []);

    useEffect(() => {
        const results = candidates.filter(candidate =>
            Object.keys(candidate).some(key =>
                String(candidate[key]).toLowerCase().includes(searchTerm.toLowerCase())
            )
        );
        setFilteredCandidates(results);
    }, [searchTerm, candidates]);

    const fetchCandidates = async () => {
        try {
            const response = await axios.get('http://localhost:5000/api/candidates');
            setCandidates(response.data);
        } catch (error) {
            console.error('Error fetching candidates:', error);
        }
    };

    const handleSearch = (event) => {
        setSearchTerm(event.target.value);
    };

    const handleFilter = (filterType, filterValue) => {
        setFilters(prevFilters => ({
            ...prevFilters,
            [filterType]: filterValue,
        }));
        
    };

    
    const handleSubmit = async (event) => {
        event.preventDefault(); 

        const newCandidate = {
            name: newName,
            email: newEmail,
            phone: newPhone,
            skills: newSkills.split(',').map(skill => skill.trim()), 
            experience: newExperience,
        };

        try {
            const response = await axios.post('http://localhost:5000/api/candidates', newCandidate);
            console.log('Candidate added:', response.data);
            fetchCandidates(); 
            setNewName('');
            setNewEmail('');
            setNewPhone('');
            setNewSkills('');
            setNewExperience('');
        } catch (error) {
            console.error('Error adding candidate:', error);
        }
    };
  

    return (
        <Container>
            <h1>Candidate Management</h1>
            <SearchInput
                type="text"
                placeholder="Search candidates..."
                value={searchTerm}
                onChange={handleSearch}
            />

            
            <CandidateList>
                {filteredCandidates.map(candidate => (
                    <CandidateItem key={candidate._id}>
                        <strong>Name:</strong> {candidate.name}<br/>
                        <strong>Email:</strong> {candidate.email}<br/>
                        <strong>Phone:</strong> {candidate.phone}<br/>
                        <strong>Skills:</strong> {candidate.skills ? candidate.skills.join(', ') : 'N/A'}<br/>
                        <strong>Experience:</strong> {candidate.experience || 'N/A'}
                    </CandidateItem>
                ))}
            </CandidateList>

            
            <AddCandidateForm>
                <h2>Add New Candidate</h2>
                <form onSubmit={handleSubmit}>
                    <InputField
                        type="text"
                        placeholder="Name"
                        value={newName}
                        onChange={(e) => setNewName(e.target.value)}
                        required
                    />
                    <InputField
                        type="email"
                        placeholder="Email"
                        value={newEmail}
                        onChange={(e) => setNewEmail(e.target.value)}
                        required
                    />
                    <InputField
                        type="tel"
                        placeholder="Phone"
                        value={newPhone}
                        onChange={(e) => setNewPhone(e.target.value)}
                    />
                    <InputField
                        type="text"
                        placeholder="Skills (comma-separated)"
                        value={newSkills}
                        onChange={(e) => setNewSkills(e.target.value)}
                    />
                    <InputField
                        type="text"
                        placeholder="Experience"
                        value={newExperience}
                        onChange={(e) => setNewExperience(e.target.value)}
                    />
                    <SubmitButton type="submit">Add Candidate</SubmitButton>
                </form>
            </AddCandidateForm>
            
        </Container>
    );
}

export default App;