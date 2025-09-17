# Chat API Setup Instructions

## Issue Resolution: 503 Service Unavailable Error

The chat functionality requires a valid Google AI API key to work properly.

### Steps to Fix:

1. **Get a Google AI API Key:**
   - Go to [Google AI Studio](https://aistudio.google.com/app/apikey)
   - Sign in with your Google account
   - Create a new API key
   - Copy the complete API key (should be around 39 characters long)

2. **Update Environment Variables:**
   - Open the `.env.local` file in the project root
   - Replace the `GOOGLE_AI_API_KEY` value with your complete API key:
   ```
   GOOGLE_AI_API_KEY=your_complete_api_key_here
   ```

3. **Restart the Development Server:**
   ```bash
   pnpm dev
   ```

### Current Issues Fixed:

1. **Improved Error Handling:** The chat API now provides more specific error messages when:
   - API key is missing or invalid
   - Quota is exceeded
   - Network issues occur
   - Model is not available

2. **Better User Feedback:** Users will now see helpful error messages instead of generic 503 errors.

3. **API Key Validation:** The system now checks if the API key is properly configured before attempting to use the AI service.

### Testing the Fix:

1. After setting up the API key, go to the chat page
2. Try sending a message
3. You should now see either:
   - A proper AI response (if API key is valid)
   - A specific error message explaining what needs to be fixed

### Common Error Messages and Solutions:

- **"AI service is not configured"**: Set up the GOOGLE_AI_API_KEY in .env.local
- **"AI service quota exceeded"**: Wait and try again, or check your API usage limits
- **"Network connection issue"**: Check your internet connection
- **"AI service configuration issue"**: Verify your API key is valid and has the right permissions