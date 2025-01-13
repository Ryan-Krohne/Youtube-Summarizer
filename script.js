const form = document.getElementById('summarizerForm');
const summaryDiv = document.getElementById('summary');
const descriptionSection = document.getElementById('descriptionSection');
const chronologicalSummarySection = document.getElementById('chronologicalSummarySection');
const container = document.getElementById('container');
const button = form.querySelector('button');

form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const youtubeLink = document.getElementById('youtubeLink').value;
    button.textContent = 'Getting Summary...';

    try {
        const response = await fetch('https://renderbackend-8hhs.onrender.com/summarize', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ url: youtubeLink }),
        });

        if (!response.ok) {
            throw new Error('Failed to fetch the summary');
        }

        const data = await response.json();

        container.style.width = '1000px';
        summaryDiv.classList.add('show');

        let formattedDescription = data.description.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
        formattedDescription = formattedDescription.replace(/\n/g, '<br>');

        let formattedChronologicalSummary = data.chronological_summary.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
        formattedChronologicalSummary = formattedChronologicalSummary.replace(/\n/g, '<br>');

        const videoId = youtubeLink.split('v=')[1]?.split('&')[0];

        descriptionSection.innerHTML = `
            <h3>Description</h3>
            <p>${formattedDescription}</p>
        `;

        if (videoId) {
            const videoEmbedUrl = `https://www.youtube.com/embed/${videoId}`;
            descriptionSection.innerHTML += `
                <h3>Video</h3>
                <iframe width="100%" height="315" src="${videoEmbedUrl}" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
            `;
        }

        chronologicalSummarySection.innerHTML = `
            <h3>Chronological Summary</h3>
            <p>${formattedChronologicalSummary}</p>
        `;
    } catch (error) {
        summaryDiv.style.display = 'block';
        summaryDiv.innerText = 'Error: ' + error.message;
    } finally {
        button.textContent = 'Summarize Another Video';
    }
});
