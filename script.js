document.addEventListener('DOMContentLoaded', () => {
    const gamertagInput = document.getElementById('gamertag-input');
    const searchButton = document.getElementById('search-button');
    const inputContainer = document.getElementById('input-container');
    const loadingContainer = document.getElementById('loading-container');
    const loadingText = document.getElementById('loading-text');
    const resultsContainer = document.getElementById('results-container');
    const resultsList = document.getElementById('results-list');

    // Enable/disable search button based on input
    gamertagInput.addEventListener('input', () => {
        if (gamertagInput.value.trim() !== '') {
            searchButton.disabled = false;
            searchButton.classList.add('enabled');
        } else {
            searchButton.disabled = true;
            searchButton.classList.remove('enabled');
        }
    });

    // Handle search button click
    searchButton.addEventListener('click', () => {
        const gamertag = gamertagInput.value.trim();
        if (!gamertag) return;

        // Fade out input container
        inputContainer.style.opacity = '0';
        setTimeout(() => {
            inputContainer.classList.add('hidden');
            loadingContainer.classList.remove('hidden');
            loadingContainer.style.opacity = '1';
            startLoadingSequence(gamertag);
        }, 500);
    });

    // Loading sequence with text updates
    function startLoadingSequence(gamertag) {
        const loadingMessages = [
            'Loading gamertag...',
            'Loading IP...',
            'Loading geolocation...'
        ];
        let index = 0;

        const interval = setInterval(() => {
            if (index < loadingMessages.length) {
                loadingText.textContent = loadingMessages[index];
                index++;
            } else {
                clearInterval(interval);
                showResults(gamertag);
            }
        }, 1000);
    }

    // Generate fake IP and geolocation
    function generateFakeData(gamertag) {
        // Simple hash function to generate deterministic IP
        let hash = 0;
        for (let i = 0; i < gamertag.length; i++) {
            hash = ((hash << 5) - hash) + gamertag.charCodeAt(i);
            hash = hash & hash; // Convert to 32-bit integer
        }
        const octet1 = 1 + (Math.abs(hash) % 254); // 1-254
        const octet2 = Math.abs(hash >> 8) % 256;
        const octet3 = Math.abs(hash >> 16) % 256;
        const octet4 = Math.abs(hash >> 24) % 256;
        const ip = `${octet1}.${octet2}.${octet3}.${octet4}`;

        // Map first octet to a fake geolocation (simplified)
        const locations = [
            { range: [1, 50], city: 'New York', state: 'NY' },
            { range: [51, 100], city: 'Los Angeles', state: 'CA' },
            { range: [101, 150], city: 'Chicago', state: 'IL' },
            { range: [151, 200], city: 'Houston', state: 'TX' },
            { range: [201, 254], city: 'Miami', state: 'FL' }
        ];
        const location = locations.find(loc => octet1 >= loc.range[0] && octet1 <= loc.range[1]) || locations[0];
        const geolocation = `${location.city}, ${location.state}`;

        return { ip, geolocation };
    }

    // Display results
    function showResults(gamertag) {
        const { ip, geolocation } = generateFakeData(gamertag);

        loadingContainer.style.opacity = '0';
        setTimeout(() => {
            loadingContainer.classList.add('hidden');
            resultsList.innerHTML = `
                <li>Gamertag: ${gamertag}</li>
                <li>IP: ${ip}</li>
                <li>Geo: ${geolocation}</li>
            `;
            resultsContainer.classList.remove('hidden');
            resultsContainer.style.opacity = '1';
        }, 500);
    }
});
