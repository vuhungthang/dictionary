# Dictionary App

A simple web application built with React and Vite that allows users to search for English word definitions, phonetics, examples, synonyms, and antonyms using the Free Dictionary API.

## Features

*   Search for word definitions.
*   Display phonetic transcription and play audio pronunciation.
*   Show word meanings, including part of speech and multiple definitions.
*   Provide example sentences for definitions.
*   List synonyms and antonyms.
*   Handle cases where a word is not found.

## Getting Started

### Prerequisites

Make sure you have the following installed:

*   Node.js (LTS version recommended)
*   pnpm (or npm/yarn)

### Installation

1.  Clone the repository:

    ```bash
    git clone <repository-url>
    ```

2.  Navigate to the project directory:

    ```bash
    cd dictionary
    ```

3.  Install the dependencies:

    ```bash
    pnpm install
    ```
    (or `npm install` or `yarn install`)

### Running the App

To run the application in development mode:

```bash
pnpm run dev
```
(or `npm run dev` or `yarn dev`)

The app will be available at `http://localhost:5173/` (or a similar address).

### Building the App

To build the application for production:

```bash
pnpm run build
```
(or `npm run build` or `yarn build`)

The build files will be generated in the `dist` directory.

## API

This application uses the [Free Dictionary API](https://dictionaryapi.dev/).

## Technologies Used

*   React
*   Vite
*   TypeScript