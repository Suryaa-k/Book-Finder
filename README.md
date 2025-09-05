# React + Vite

Book Finder is a React-based web application that helps users (like students, professionals, and book enthusiasts) search and discover books with ease.
It leverages the Open Library Search API to provide book data including cover images, authors, publication year, and more.

The app supports natural language queries (e.g., “Books about Afrofuturism published after 2010”), genre filtering, dark/light theme toggling, and quick navigation through results.

Installation and setup 
# Clone the repository
git clone https://github.com/your-username/book-finder.git

# Navigate into the project folder
cd book-finder

# Install dependencies
npm install

# Start the development server
npm run dev

Project Structure 

book-finder/
├── public/               # Static assets
├── src/
│   ├── App.jsx           # Main React component
│   ├── index.css         # Global styles
│   ├── App.css           # Component-specific styles
│   └── main.jsx          # React entry point
├── package.json          # Dependencies & scripts
├── vite.config.js        # Vite configuration
└── README.md             # Project documentation

API Reference 

GET https://openlibrary.org/search.json?q={query}&page={page}
