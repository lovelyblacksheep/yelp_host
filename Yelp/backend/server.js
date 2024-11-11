// server.js
const express = require('express');
const axios = require('axios');
const cors = require('cors'); // Allow requests from frontend

const app = express();
app.use(cors());
app.use(express.json());

const apiKey = '6Iibtt7ymVOJLKiQxI4UvrVm7D65fQhTTL12ZoSl8HpikWv7bK6qqwG7RWuHIzPGseYKwa2dR518da2ZN8JSViRImMNFGxL_hBGh45hzP-JaE6zTmChQ5UwdO8IVZ3Yx';  // Replace with the provided Yelp API key

app.get('/api/search', async (req, res) => {
    const { term, location } = req.query;
    
    try {
        const response = await axios.get('https://api.yelp.com/v3/businesses/search', {
            headers: {
                Authorization: `Bearer ${apiKey}`,
            },
            params: {
                term: term || 'tacos',         // Default search term is 'tacos'
                location: location || 'San Francisco', // Default location is San Francisco
                limit: 50
            }
        });

        const businesses = response.data.businesses;
        
        // Send the business data to the frontend
        res.json(businesses);

    } catch (error) {
        console.error(error);
        res.status(500).send('Error fetching data from Yelp');
    }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
