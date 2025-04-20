fetch('OpenDay.json')
    .then(response => response.json())
    .then(data => {
        // Event information
        const topics = data.topics;
        const container = document.getElementById('topicsContainer');

        topics.forEach(topic => {
            const card = document.createElement('div');
            card.className = 'topic-card';

            const image = document.createElement('img');
            image.src = topic.cover_image;
            image.alt = topic.name;
            image.className = 'topic-image';

            const desc = document.createElement('h3');
            desc.textContent = topic.description;

            container.appendChild(image);
            container.appendChild(desc);
        });

    });