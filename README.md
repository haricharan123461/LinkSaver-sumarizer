# LinkSaver - AI-Powered Bookmark Manager

A modern web application for saving and organizing bookmarks with AI-generated summaries. Built with React, Tailwind CSS, Supabase, and Jina AI.

## 🌐 Live Demo
👉 [bookmarksaver12.netlify.app](https://bookmarksaver12.netlify.app)
## ✨ Features

- **Secure Authentication**: Email/password sign-up and login via Supabase Auth
- **Smart Bookmarking**: Automatically extract page titles, descriptions, and favicons
- **AI Summaries**: Generate intelligent summaries using Jina AI's free API
- **Responsive Design**: Beautiful, mobile-first interface with Tailwind CSS
- **Fast Search**: Instantly search through titles, descriptions, URLs, and summaries
- **User Privacy**: Row-level security ensures users only see their own bookmarks
- **Modern UI**: Clean design with hover effects, animations, and loading states

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ 
- A Supabase account and project
- Jina AI API key (free tier available)

### Environment Setup

1. **Clone and install dependencies:**
   ```bash
   npm install
   ```

2. **Set up environment variables:**
   Create a `.env` file in the root directory:
   ```env
   VITE_SUPABASE_URL=your_supabase_project_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

3. **Database Setup:**
   - Navigate to your Supabase project dashboard
   - Go to the SQL Editor
   - Run the migration file in `supabase/migrations/20250721113540_odd_voice.sql`
   - This creates the bookmarks table with proper Row Level Security

4. **Edge Function Setup:**
   - The app uses a Supabase Edge Function to handle URL metadata extraction and AI summarization
   - The function is located in `supabase/functions/extract-metadata/`
   - Set the JINA_API_KEY as an environment variable in your Supabase project:
     - Go to Project Settings > Edge Functions
     - Add environment variable: `JINA_API_KEY=your_jina_api_key`

5. **Supabase Configuration:**
   - Ensure email confirmation is disabled in Authentication settings
   - Row Level Security is automatically enabled via the migration

### Development

```bash
# Start the development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## 🏗️ Architecture

### Project Structure
```
src/
├── components/          # Reusable UI components
│   ├── BookmarkCard.tsx
│   ├── AddBookmarkModal.tsx
│   ├── Header.tsx
│   ├── EmptyState.tsx
│   └── LoadingSpinner.tsx
├── pages/              # Route components
│   ├── Login.tsx
│   └── Home.tsx
├── services/           # API and business logic
│   ├── supabase.ts
│   ├── auth.ts
│   └── bookmarks.ts
└── App.tsx            # Main app component
```

### Key Services

**Authentication Service (`src/services/auth.ts`)**
- Handles sign-up, sign-in, and sign-out
- Manages auth state changes
- Integrates with Supabase Auth

**Bookmark Service (`src/services/bookmarks.ts`)**
- Extracts webpage metadata (title, description, favicon)
- Generates AI summaries via Jina AI API
- Manages CRUD operations for bookmarks
- Implements user data isolation

**Supabase Configuration (`src/services/supabase.ts`)**
- Creates typed Supabase client
- Defines database types
- Configures connection settings

## 🔧 Technologies Used

- **Frontend**: React 18, TypeScript, Tailwind CSS
- **Build Tool**: Vite
- **Backend**: Supabase (PostgreSQL + Auth)
- **AI Service**: Jina AI Summarization API
- **Routing**: React Router DOM
- **Icons**: Lucide React
- **Styling**: Tailwind CSS with custom animations

## 🔐 Security Features

- **Row Level Security**: Users can only access their own bookmarks
- **Secure Authentication**: Handled entirely by Supabase Auth
- **Input Validation**: URL validation and sanitization
- **CORS Protection**: Proper API request handling
- **Environment Variables**: Sensitive keys stored securely

## 🎨 Design Features

- **Responsive Grid Layout**: Adapts from mobile to desktop
- **Smart Search**: Searches across all bookmark fields
- **Loading States**: Smooth loading animations
- **Error Handling**: User-friendly error messages
- **Empty States**: Engaging onboarding experience
- **Hover Effects**: Interactive card animations
- **Modern Icons**: Consistent icon system

## 📱 Mobile Experience

- Touch-friendly interface
- Optimized for small screens
- Fast loading on mobile networks
- Responsive typography and spacing

## 🚀 Deployment

The app is ready for deployment to any static hosting service:

- **Vercel**: Zero-config deployment
- **Netlify**: Automatic builds from Git
- **Supabase**: Built-in hosting option

## 🔧 Customization

### Adding New Features

1. **Tags Support**: Extend the bookmark model to include tags
2. **Categories**: Add folder-like organization
3. **Import/Export**: Bulk bookmark management
4. **Dark Mode**: Theme switching capability
5. **Collaboration**: Share bookmark collections

### API Integrations

The app is designed to easily integrate additional APIs:
- **OpenAI GPT**: Enhanced summarization
- **Mercury Parser**: Better content extraction
- **Archive.org**: Backup link preservation

## 📖 API Usage

### Jina AI Integration
```typescript
// Generate summary from URL
const summary = await BookmarkService.generateSummary(url)
```

### Supabase Queries
```typescript
// Save bookmark with full metadata
const bookmark = await BookmarkService.saveBookmark(url, userId)

// Get user's bookmarks
const bookmarks = await BookmarkService.getBookmarks(userId)
```

## 🐛 Troubleshooting

**Common Issues:**

1. **Supabase Connection**: Verify URL and keys in `.env`
2. **CORS Errors**: Ensure Supabase project allows your domain
3. **Jina AI Limits**: Free tier has rate limits
4. **Metadata Extraction**: Some sites block automated access

**Debug Mode:**
Enable detailed logging by adding to `.env`:
```env
VITE_DEBUG=true
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

MIT License - feel free to use this project for personal or commercial purposes.

## 🙏 Acknowledgments

- **Supabase**: For the excellent backend-as-a-service platform
- **Jina AI**: For providing free summarization API
- **Tailwind CSS**: For the utility-first CSS framework
- **Lucide**: For the beautiful icon set

---

Built with ❤️ using modern web technologies. Perfect for developers who want to save and organize web content with AI-powered insights.
