# Bybit Transaction Data Fetcher

This project is a Node.js application for fetching and processing transaction data from Bybit's API.
It allows users to retrieve historical transaction data, format timestamps according to a specified timezone, and save the results to a text file.

## Features

- Fetch historical transaction data from Bybit's API.
- Process and sort transaction data.
- Format timestamps to a user-defined timezone.
- Save processed data to a `.txt` file.

## Requirements

- Node.js (>= 14.x)
- Bybit API Key and Secret

## Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/yourusername/bybit-data-fetcher.git
   cd bybit-data-fetcher
   ```
2. **Install dependencies:**
    ```bash
    npm install
    ```
3. **Obtin API key:**
   Sign up at [Bybit](https://www.bybit.com/invite?ref=GG0W6V) and obtain your API key and secret key.
4. **Configure Environment Variables:**
   Create a .env file in the root of your project and add your API key:
   
   ```code
   APIKEY=your_bybit_api_key_here
   SECRET=your_bybit_secret_key_here
   ```
   (Optional: You can directly hardcode the API key into the code, but it's recommended to use environment variables.)
5. **Run the Script:**
   ```bash
   node index.js
   ```
## Customizing Timeframe and Timezone

   You can adjust the timeframe and timezone offset directly in the `runProcess()` function at the bottom of `index.js`
   ### Example:
   To fetch data for the past 15 days and convert timestamps to UTC+8:
   ```code
   runProcess(15, 8)
   ```

## Error Handling
   Errors during data fetching or file writing will be logged to the console.
   


