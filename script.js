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

        const eventTime = document.createElement('h3');
        eventTime.textContent = `${data.start_time} - ${data.end_time}`;
        eventTime.className = 'event-time'

        header.appendChild(eventDiscription);
        header.appendChild(eventTime);
        header.appendChild(eventCoverImageContainer);

        eventCoverImageContainer.appendChild(eventCoverImage);

        // Each School Information
        const topics = data.topics;
        const container = document.getElementById('topicsContainer');

        function renderTopics(filteredTopics) {
            container.innerHTML = '';
            filteredTopics.forEach(topic => {
                const card = document.createElement('div');
                card.className = 'topic-card';

                const image = document.createElement('img');
                image.src = topic.cover_image;
                image.alt = topic.name;
                image.className = 'topic-image';

                const content = document.createElement('div');
                content.className = 'topic-content';

                // School Name
                const title = document.createElement('h2');
                title.className = 'topic-title';
                title.textContent = topic.name;

                const desc = document.createElement('h3');
                desc.textContent = topic.description;

                container.appendChild(title);
                container.appendChild(image);
                container.appendChild(desc);

                // Each Programme Information
                // Default: Display 3 programmes
                const programContainer = document.createElement('div');
                programContainer.className = 'program-container';

                topic.programs.slice(0, 3).forEach(program => {
                    const programDiv = showProgramOverview(program);
                    programContainer.appendChild(programDiv);


                });

                // Load Programmes more than 3
                if (topic.programs.length > 3) {
                    const showMoreBtn = document.createElement('button');
                    showMoreBtn.textContent = 'Show More';
                    showMoreBtn.className = 'show-more-btn';

                    showMoreBtn.addEventListener('click', () => {
                        topic.programs.slice(3).forEach(program => {
                            const programDiv = showProgramOverview(program);
                            programContainer.appendChild(programDiv);
                        });
                        // Invisible 'Show More Programme' button after click
                        showMoreBtn.style.display = 'none';
                    });
                    programContainer.appendChild(showMoreBtn);
                }

                content.appendChild(programContainer);

                card.appendChild(image);
                card.appendChild(content);
                container.appendChild(card);
            });
        }

        // Display Programme Overview
        function showProgramOverview(program) {
            const programDiv = document.createElement('div');
            programDiv.className = 'program';

            programDiv.innerHTML = `
                      <div class="program-title"><strong>${program.title}</strong></div>
                      <div>${program.description_short}</div>
                      <div><strong>Room:</strong> ${program?.room || 'N/A'}</div>
                      <div><strong>Location:</strong> ${program.location?.title || 'N/A'}</div>
                    `;
            // Display Programme Detail
            programDiv.addEventListener('click', () => {
                const overlay = document.getElementById('programOverlay');
                const details = document.getElementById('overlayDetails');
                const closeBtn = document.getElementById('closeOverlay');

                const mapLink = program.location?.latitude && program.location?.longitude
                    ? `<a href="https://maps.google.com/maps?ll=${program.location.latitude},${program.location.longitude}&z=17&q=${program.location.latitude},${program.location.longitude}" target="_blank">Open in Google Maps</a>`
                    : 'Location info not available';

                const locationWebsite = program.location?.website
                    ? `<a href=${program.location.website} target="_blank">${program.location?.title || 'Building Information'}</a>`
                    : '';

                const locationImage = program.location?.cover_image
                    ? `<img src=${program.location.cover_image} alt="A photo of the building where the program will be held">`
                    : '';

                details.innerHTML = `
                            <h2>${program.title}</h2>               
                            <p><strong>Time:</strong> ${program.start_time} - ${program.end_time}</p>
                            <p><strong>Description:</strong> ${program.description}</p>
                            <p><strong>Room:</strong> ${program.room || 'Programme room N/A'}</p>
                            <p><strong>Location:</strong> ${locationWebsite}</p>
                            <p>${locationImage}</p>
                            <p> ${program.location?.description || 'Location Description N/A'}</p>
                            <p> ${program.location?.address || 'Location address N/A'}</p>
                            <p> ${program.location?.postcode || 'Location Postcode N/A'}</p>
                            <p>${mapLink}</p>
                        `;
            });
            return programDiv;
        }
        // Search and Sort Function
        function filterAndSortTopics() {
            const keyword = searchInput.value.toLowerCase();
            const sortOrder = sortSelect.value;

            let filtered = topics.filter(topic => {
                const matchTopic = topic.name.toLowerCase().includes(keyword);
                const matchProgram = topic.programs?.some(p => p.title.toLowerCase().includes(keyword));
                console.log(matchTopic);
                console.log(matchProgram);
                return matchTopic || matchProgram;
            });

            filtered.sort((a, b) => {
                const nameA = a.name.toLowerCase();
                const nameB = b.name.toLowerCase();
                return sortOrder === 'asc' ? nameA.localeCompare(nameB) : nameB.localeCompare(nameA);
            });

            renderTopics(filtered);
        }
        // Add Event Listener to Search and Sort box.
        searchInput.addEventListener('input', filterAndSortTopics);
        sortSelect.addEventListener('change', filterAndSortTopics);

        // Initial Display
        renderTopics(topics);

    })
    .catch(error => {
        console.error('Error loading JSON:', error);
    });