import React, { useState } from 'react';
import axios from 'axios';
import './App.css'; // Custom styles for table and UI

function App() {
    const [term, setTerm] = useState('');
    const [location, setLocation] = useState('');
    const [results, setResults] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(15);

    // Function to fetch data from Yelp API
    const handleSearch = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.get('http://localhost:5000/api/search', {
                params: { term, location }
            });
            setResults(response.data);
            setCurrentPage(1); // Reset to first page when new search is done
        } catch (error) {
            console.error("Error fetching Yelp data", error);
        }
    };

    // Function to sort the results based on criteria
    const sortResults = (criteria) => {
        const sortedResults = [...results].sort((a, b) => {
            if (criteria === 'reviews') {
                return b.review_count - a.review_count;
            } else if (criteria === 'rating') {
                return b.rating - a.rating;
            }
            return 0;
        });
        setResults(sortedResults);
    };

    // Pagination logic
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentResults = results.slice(indexOfFirstItem, indexOfLastItem);

    const totalPages = Math.ceil(results.length / itemsPerPage);

    const nextPage = () => {
        if (currentPage < totalPages) {
            setCurrentPage(currentPage + 1);
        }
    };

    const prevPage = () => {
        if (currentPage > 1) {
            setCurrentPage(currentPage - 1);
        }
    };

    return (
        <div className="App">
            <h1 className="app-title">Find the Best Places with Yelp</h1>
            <form className="search-form" onSubmit={handleSearch}>
                <input
                    type="text"
                    className="input-field"
                    placeholder="Search for tacos, burgers, etc..."
                    value={term}
                    onChange={(e) => setTerm(e.target.value)}
                />
                <input
                    type="text"
                    className="input-field"
                    placeholder="Location (e.g., San Francisco)"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                />
                <button type="submit" className="search-button">Search</button>
            </form>

            {/* Displaying the results in a table */}
            <div className="results">
                {results.length > 0 && (
                    <>
                        <table className="results-table">
                            <thead>
                                <tr>
                                    <th>Name</th>
                                    <th>
                                        <button className="sort-button" onClick={() => sortResults('rating')}>
                                            Rating &#9650;
                                        </button>
                                    </th>
                                    <th>
                                        <button className="sort-button" onClick={() => sortResults('reviews')}>
                                            Reviews &#9650;
                                        </button>
                                    </th>
                                    <th>Location</th>
                                </tr>
                            </thead>
                            <tbody>
                                {currentResults.map((business) => (
                                    <tr key={business.id}>
                                        <td>{business.name}</td>
                                        <td>{business.rating} stars</td>
                                        <td>{business.review_count} reviews</td>
                                        <td>{business.location.address1}, {business.location.city}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>

                        {/* Pagination Controls */}
                        <div className="pagination">
                            <button onClick={prevPage} disabled={currentPage === 1} className="pagination-button">
                                Previous
                            </button>
                            <span className="pagination-text">Page {currentPage} of {totalPages}</span>
                            <button onClick={nextPage} disabled={currentPage === totalPages} className="pagination-button">
                                Next
                            </button>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}

export default App;
