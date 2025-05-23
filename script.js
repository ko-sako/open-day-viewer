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

        const eventDescription = document.createElement('h2');
        eventDescription.textContent = data.description;
        eventDescription.className = 'event-description';

        const eventTime = document.createElement('h3');
        eventTime.textContent = formatDateRange(data.start_time, data.end_time);
        eventTime.className = 'event-time'

        header.appendChild(eventDescription);
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

                const imageContainer = document.createElement('div');
                imageContainer.className = 'topic-cover-container';
                const image = document.createElement('img');
                image.src = topic.cover_image;
                image.alt = topic.name;
                image.className = 'topic-image';

                const content = document.createElement('div');
                content.className = 'topic-content';

                const title = document.createElement('h4');
                title.className = 'topic-title';
                title.textContent = topic.name;

                const desc = document.createElement('h5');
                desc.textContent = topic.description;

                content.appendChild(title);
                content.appendChild(desc);

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

                            // Distinguish programme cards added in Show More button from existing classes
                            programDiv.classList.add('added-program');

                            programContainer.appendChild(programDiv);
                        });
                        // Invisible 'Show More Programme' button after click
                        showMoreBtn.style.display = 'none';
                    });
                    programContainer.appendChild(showMoreBtn);
                }

                card.appendChild(content);
                imageContainer.appendChild(image);
                card.appendChild(imageContainer);
                card.appendChild(programContainer);
                container.appendChild(card);
            });
        }

        // Display Programme Overview Function
        function showProgramOverview(program) {
            const programDiv = document.createElement('div');
            programDiv.className = 'program';

            const dateTimeStr = formatTimeRange(program.start_time, program.end_time);

            programDiv.innerHTML = `
                <div class="program-title"><strong>${program.title}</strong></div>
                <div>${program.description_short}</div>
                <div><strong>Time:</strong> ${dateTimeStr}</div>
                <div><strong>Room:</strong> ${program?.room || 'Information not available' }</div>
                <div><strong>Building:</strong> ${program.location?.title || 'Information not available' }</div>
            `;

            // Display Programme Detail
            programDiv.addEventListener('click', () => {
                showProgramDetail(program);
            });
            return programDiv;
        }

        // Display Programme Detail Function
        function showProgramDetail(program) {
            const overlay = document.getElementById('programOverlay');
            const details = document.getElementById('overlayDetails');
            const closeBtn = document.getElementById('closeOverlay');

            const programCoverImage = program?.cover_image
                ? `<img src=${encodeURI(program.cover_image)} alt="A cover image of the programme">`
                : '';

            const mapLink = program.location?.latitude && program.location?.longitude
                ? `<a href="https://maps.google.com/maps?ll=${program.location.latitude},${program.location.longitude}&z=17&q=${program.location.latitude},${program.location.longitude}" target="_blank">Open in Google Maps</a>`
                : '';

            const locationWebsite = program.location?.website
                ? `<a href=${program.location.website} target="_blank">${program.location?.title || 'Building Information'}</a>`
                : 'Information not available';

            const locationImage = program.location?.cover_image
                ? `<img src=${encodeURI(program.location.cover_image)} alt="A photo of the building where the program will be held">`
                : '';

            const dateTimeStr = formatDateRange(program.start_time, program.end_time);

            details.innerHTML = `
                <h2>${program.title}</h2>               
                <p><strong>Time:</strong> ${dateTimeStr}</p>
                <p><strong>Description:</strong> ${program.description}</p>
                <p>
                    ${program?.floor ? `<strong>Floor:</strong> ${program.floor}`
                    : ''}
                </p>
                <p><strong>Room:</strong> ${program.room || 'Information not available'}</p>
                <p><strong>Building:</strong> ${locationWebsite}</p>
                <div class="location-image-container">${locationImage}</div>
                <p> ${program.location?.description || ''}</p>
                <p>
                    ${program.location?.address ? `${program.location.address}, ${program.location?.postcode || ''}`
                    : program.location?.postcode || ''}
                </p>
                <p>${mapLink}</p>
            `;

            overlay.classList.remove('hidden');

            // Close Overlay
            closeBtn.onclick = () => closeOverlay();
            overlay.onclick = () => closeOverlay();

            // Add event listener to a function that adds the 'hidden' class
            function closeOverlay() {
                overlay.classList.add('hidden');
            }
        }

        // Search and Sort Function
        function filterAndSortTopics() {
            const keyword = document.getElementById('searchInput').value.toLowerCase();
            const sortOrder = document.getElementById('sortSelect').value;
            const category = document.getElementById('searchCategory').value;

            let filtered = topics.filter(topic => {
                const matchTopic = topic.name.toLowerCase().includes(keyword);
                const matchProgram = topic.programs?.some(p => p.title.toLowerCase().includes(keyword));
                console.log(matchTopic);
                console.log(matchProgram);

                if (category === 'both') {
                    // Search Both School Name and Programme Name
                    return matchTopic || matchProgram;
                } else if (category === 'topic') {
                    // Search School Name
                    return matchTopic;
                } else {
                    // Search Programme Name
                    return matchProgram;
                }
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
        searchCategory.addEventListener('change', filterAndSortTopics);

        // Data Range Formatting
        function formatDateRange(startTimeDate, endTimeDate) {
            const startDate = new Date(startTimeDate);
            const endDate = new Date(endTimeDate);

            const optionDate = {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric'
            };

            const optionTime = {
                hour: '2-digit',
                minute: '2-digit',
                hour12: false
            };

            const startDateStr = startDate.toLocaleDateString('en-UK', optionDate);
            const startTimeStr = startDate.toLocaleTimeString('en-UK', optionTime);
            const endDateStr = endDate.toLocaleDateString('en-UK', optionDate);
            const endTimeStr = endDate.toLocaleTimeString('en-UK', optionTime);

            // Check if dates are the same day or not
            if (startDateStr === endDateStr) {
                return `${startDateStr}, ${startTimeStr} - ${endTimeStr}`;
            } else {
                return `${startDateStr}, ${startTimeStr} - ${endDateStr}, ${endTimeStr}`;
            }
        }

        // Time Only Range Formatting
        function formatTimeRange(startTimeDate, endTimeDate) {
            const startDate = new Date(startTimeDate);
            const endDate = new Date(endTimeDate);

            const optionTime = {
                hour: '2-digit',
                minute: '2-digit',
                hour12: false
            };

            const startTimeStr = startDate.toLocaleTimeString('en-UK', optionTime);
            const endTimeStr = endDate.toLocaleTimeString('en-UK', optionTime);

            return `${startTimeStr} - ${endTimeStr}`;
        }

        // Initial Display
        renderTopics(topics);

    })
    .catch(error => {
        console.error('Error loading JSON:', error);
    });