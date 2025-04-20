fetch('OpenDay.json')
    .then(response => response.json())
    .then(data => {
        // Event information
        const header = document.getElementById('openDayHeader');

        const eventCoverImageContainer = document.createElement('div');
        eventCoverImageContainer.className = 'event-cover-container';
        const eventCoverImage = document.createElement('img');
        eventCoverImage.src = data.cover_image;
        eventCoverImage.alt = 'Open Day Cover Image';
        eventCoverImage.className = 'event-cover';

        const eventDiscription = document.createElement('h2');
        eventDiscription.textContent = data.description;
        eventDiscription.className = 'event-description';

        header.appendChild(eventDiscription);
        header.appendChild(eventCoverImageContainer);
        eventCoverImageContainer.appendChild(eventCoverImage);



        // School Information
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