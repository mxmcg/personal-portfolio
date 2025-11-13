# Chat Interface Setup Guide

Your portfolio now has a chat interface powered by Claude AI! Here's how to complete the setup:

## Current Status ✅

- ✅ Chat UI component created and added to homepage
- ✅ API route structure in place (`/app/api/chat/route.ts`)
- ✅ Message handling and display working
- ✅ Console logging active for debugging
- ⏳ Claude API integration ready (needs credentials)

## Next Steps to Enable Claude AI

### 1. Install Anthropic SDK

```bash
npm install @anthropic-ai/sdk
```

### 2. Get Your Claude API Key

1. Go to [https://console.anthropic.com](https://console.anthropic.com)
2. Sign in or create an account
3. Navigate to API Keys section
4. Create a new API key
5. Copy the key

### 3. Add API Key to Environment

Create or update `.env.local` in the project root:

```env
ANTHROPIC_API_KEY=your_api_key_here
```

⚠️ **Important**: Never commit `.env.local` to git. It's already in `.gitignore`.

### 4. Enable the API Integration

In `/app/api/chat/route.ts`:

1. Uncomment the Claude API code block (lines marked with `UNCOMMENT THIS SECTION`)
2. Comment out or remove the placeholder response
3. Save the file

### 5. Restart Your Development Server

```bash
npm run dev
```

## Customization

### Update the AI Personality

Edit the system message in `/app/api/chat/route.ts` to customize how the AI represents you:

```typescript
const systemMessage = `You are Max McGee's AI assistant...
// Customize this to match your personality and expertise
`;
```

### Styling

The chat interface uses Tailwind CSS. Customize colors and layout in:
- `/app/components/ChatInterface.tsx`

### Model Selection

Change the Claude model in `/app/api/chat/route.ts`:

```typescript
model: 'claude-3-5-sonnet-20241022', // or 'claude-3-opus-20240229', etc.
```

## Features

- 💬 Real-time chat interface
- 📝 Message history preserved during session
- 🎨 Styled to match portfolio theme
- 📱 Responsive design
- ⚡ Smooth animations and loading states
- 🔒 Secure API key handling

## Testing

1. Type a message in the chat input
2. Check browser console for logs
3. Message should appear in chat feed
4. Once Claude API is enabled, you'll get AI responses

## Troubleshooting

**Chat not responding?**
- Check browser console for errors
- Verify API key is set correctly
- Ensure Anthropic SDK is installed
- Check that the API route is uncommented

**Messages not displaying?**
- Check React DevTools for component state
- Look for console errors
- Verify TypeScript compilation

## API Costs

Claude API is pay-per-use. Monitor your usage at:
https://console.anthropic.com/settings/usage

Estimated costs are very low for portfolio chat usage.
