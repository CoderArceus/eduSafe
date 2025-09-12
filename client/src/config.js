// This file checks if the app is in production (from `npm run build`)
// or development (from `npm run dev`) and chooses the correct API URL.

export const API_URL = import.meta.env.PROD
    ? 'https://apisafe.my.to' // Your new Production API URL
    : 'http://localhost:3001';     // Your local Development URL
