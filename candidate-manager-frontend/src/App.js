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

const FilterButton = styled.button`
    padding: 8px 15px;
    margin-right: 10px;
    cursor: pointer;
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

function App() {
    const [candidates, setCandidates] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [filteredCandidates, setFilteredCandidates] = useState([]);
    const [filters, setFilters] = useState({}); 

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

    return (
        <Container>
            <h1>Candidate Management</h1>
            <SearchInput
                type="text"
                placeholder="Search candidates..."
                value={searchTerm}
                onChange={handleSearch}
            />

            <div>
                
                <FilterButton onClick={() => handleFilter('skills', 'React')}>Show React Skills</FilterButton>
                <FilterButton onClick={() => handleFilter('experience', '2+ years')}>2+ Years Exp</FilterButton>
                
            </div>

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
        </Container>
    );
}

export default App;