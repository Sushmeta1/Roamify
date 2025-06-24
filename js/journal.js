// Journal entry class
class JournalEntry {
    constructor(title, destination, date, story, imageUrls = []) {
        this.id = Date.now(); // Unique ID for each entry
        this.title = title;
        this.destination = destination;
        this.date = date;
        this.story = story;
        this.imageUrls = imageUrls;
        this.createdAt = new Date().toISOString();
    }
}

// Journal manager class
class JournalManager {
    constructor() {
        this.entries = JSON.parse(localStorage.getItem('journalEntries')) || [];
    }

    addEntry(entry) {
        this.entries.unshift(entry); // Add new entry at the beginning
        this.saveEntries();
    }

    deleteEntry(id) {
        this.entries = this.entries.filter(entry => entry.id !== id);
        this.saveEntries();
    }

    saveEntries() {
        localStorage.setItem('journalEntries', JSON.stringify(this.entries));
    }

    getAllEntries() {
        return this.entries;
    }
}

// Initialize journal manager
const journalManager = new JournalManager();

// Handle form submission
document.getElementById('journalForm').addEventListener('submit', async function(e) {
    e.preventDefault();

    // Get form values
    const title = document.getElementById('title').value;
    const destination = document.getElementById('destination').value;
    const date = document.getElementById('date').value;
    const story = document.getElementById('story').value;
    
    // Handle image files
    const imageFiles = document.getElementById('photos').files;
    const imageUrls = [];

    // Convert images to base64 strings
    for (let i = 0; i < imageFiles.length; i++) {
        const file = imageFiles[i];
        try {
            const base64Url = await convertToBase64(file);
            imageUrls.push(base64Url);
        } catch (error) {
            console.error('Error converting image:', error);
        }
    }

    // Create new entry
    const newEntry = new JournalEntry(title, destination, date, story, imageUrls);
    journalManager.addEntry(newEntry);

    // Clear form
    this.reset();

    // Refresh entries display
    displayEntries();

    // Show success message
    showNotification('Journal entry saved successfully!');
});

// Convert file to base64
function convertToBase64(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result);
        reader.onerror = error => reject(error);
        reader.readAsDataURL(file);
    });
}

// Display journal entries
function displayEntries() {
    const entriesContainer = document.getElementById('journalEntries');
    const entries = journalManager.getAllEntries();

    entriesContainer.innerHTML = entries.map(entry => `
        <div class="journal-entry" data-id="${entry.id}">
            <h3>${entry.title}</h3>
            <div class="entry-meta">
                <span>${entry.destination}</span> • <span>${formatDate(entry.date)}</span>
            </div>
            ${entry.imageUrls.map(url => `
                <img src="${url}" alt="Travel photo" class="journal-image">
            `).join('')}
            <p>${entry.story}</p>
            <div class="entry-actions">
                <button onclick="deleteEntry(${entry.id})" class="btn btn-danger">Delete</button>
            </div>
        </div>
    `).join('');
}

// Delete entry
function deleteEntry(id) {
    if (confirm('Are you sure you want to delete this entry?')) {
        journalManager.deleteEntry(id);
        displayEntries();
        showNotification('Journal entry deleted successfully!');
    }
}

// Format date for display
function formatDate(dateString) {
    return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
}

// Show notification
function showNotification(message) {
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.textContent = message;
    document.body.appendChild(notification);

    // Remove notification after 3 seconds
    setTimeout(() => {
        notification.remove();
    }, 3000);
}

// Initialize entries display on page load
document.addEventListener('DOMContentLoaded', displayEntries); 