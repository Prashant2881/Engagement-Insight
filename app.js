const engagementData = {
    labels: [],
    datasets: [{
        label: 'Likes',
        data: [],
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 1
    },
    {
        label: 'Shares',
        data: [],
        backgroundColor: 'rgba(153, 102, 255, 0.2)',
        borderColor: 'rgba(153, 102, 255, 1)',
        borderWidth: 1
    }]
};

const ctx = document.getElementById('engagementChart').getContext('2d');
const engagementChart = new Chart(ctx, {
    type: 'line',
    data: engagementData,
    options: {
        scales: {
            y: {
                beginAtZero: true
            }
        },
        responsive: true,
        plugins: {
            legend: {
                position: 'top',
            },
            tooltip: {
                callbacks: {
                    label: function(tooltipItem) {
                        return tooltipItem.dataset.label + ': ' + tooltipItem.raw;
                    }
                }
            }
        }
    }
});

document.getElementById('engagementForm').addEventListener('submit', function(event) {
    event.preventDefault();

    const platform = document.getElementById('platform').value;
    const date = document.getElementById('date').value;
    const likes = parseInt(document.getElementById('likes').value);
    const shares = parseInt(document.getElementById('shares').value);

    if (!platform || !date || isNaN(likes) || isNaN(shares)) {
        alert('Please fill in all fields correctly.');
        return;
    }

    engagementData.labels.push(platform);
    engagementData.datasets[0].data.push(likes);
    engagementData.datasets[1].data.push(shares);

    engagementChart.update();

    const postList = document.getElementById('postDataList');
    const newPost = document.createElement('li');
    newPost.innerHTML = `
        <span><strong>${platform}</strong> (${date})</span>
        <span>Likes: ${likes} | Shares: ${shares}</span>
        <i class="fas fa-trash-alt" onclick="deletePost(this, '${platform}')"></i>
        <button class="update-btn" onclick="editPost(this, '${platform}')">Edit</button>
    `;
    postList.appendChild(newPost);

    document.getElementById('engagementForm').reset();
});

function deletePost(element, platform) {
    const index = engagementData.labels.indexOf(platform);
    if (index > -1) {
        engagementData.labels.splice(index, 1);
        engagementData.datasets[0].data.splice(index, 1);
        engagementData.datasets[1].data.splice(index, 1);
        engagementChart.update();
    }
    element.parentElement.remove();
}

function editPost(button, platform) {
    const index = engagementData.labels.indexOf(platform);

    if (index > -1) {
        document.getElementById('platform').value = engagementData.labels[index];
        document.getElementById('date').value = new Date().toISOString().split('T')[0];
        document.getElementById('likes').value = engagementData.datasets[0].data[index];
        document.getElementById('shares').value = engagementData.datasets[1].data[index];

        const formButton = document.querySelector('form button');
        formButton.innerHTML = 'Update Post Data';
        formButton.setAttribute('id', 'updateButton');

        formButton.onclick = function(event) {
            event.preventDefault();

            const platform = document.getElementById('platform').value;
            const date = document.getElementById('date').value;
            const likes = parseInt(document.getElementById('likes').value);
            const shares = parseInt(document.getElementById('shares').value);

            if (!platform || !date || isNaN(likes) || isNaN(shares)) {
                alert('Please fill in all fields correctly.');
                return;
            }

            engagementData.labels[index] = platform;
            engagementData.datasets[0].data[index] = likes;
            engagementData.datasets[1].data[index] = shares;

            engagementChart.update();

            const postItems = document.getElementById('postDataList').children;
            postItems[index].querySelector('span').innerHTML = `<strong>${platform}</strong> (${date})`;
            postItems[index].querySelectorAll('span')[1].innerHTML = `Likes: ${likes} | Shares: ${shares}`;

            document.getElementById('engagementForm').reset();
            document.querySelector('form button').innerHTML = 'Add Post Data';
            document.querySelector('form button').removeAttribute('id');
        };
    }
}

document.getElementById('saveGraphBtn').addEventListener('click', function() {
    const imageUrl = engagementChart.toBase64Image();
    const link = document.createElement('a');
    link.href = imageUrl;
    link.download = 'social_media_engagement_chart.jpg';
    link.click();
});
