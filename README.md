# AI Chat with PDF - Frontend

A modern, responsive React frontend for chatting with PDF documents. Built with Vite, featuring real-time PDF viewing, chat interface, and seamless document analysis.

![AI Chat with PDF](https://img.shields.io/badge/React-19-blue?style=for-the-badge&logo=react)
![Vite](https://img.shields.io/badge/Vite-5.0-orange?style=for-the-badge&logo=vite)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.0-38B2AC?style=for-the-badge&logo=tailwind-css)

## ✨ Features

- **📄 PDF Upload & Viewing**: Drag-and-drop PDF upload with interactive viewer
- **💬 AI Chat Interface**: Real-time conversation with your PDF documents
- **🔍 Document Analysis**: AI-powered document understanding and insights
- **📱 Responsive Design**: Works seamlessly on desktop, tablet, and mobile
- **⚡ High Performance**: Optimized PDF rendering with PDF.js
- **🎨 Modern UI**: Clean, intuitive interface with Tailwind CSS
- **🔄 Real-time Updates**: Live chat with typing indicators and progress tracking
- **📊 File Management**: Upload, view, and manage multiple PDF documents
- **🔗 Blob Storage**: Uses Vercel Blob Storage for file handling
- **📈 Progress Tracking**: Real-time upload progress with abort capability

## 🚀 Quick Start

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- Backend API running (see [Backend Setup](#backend-setup))

### Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/yourusername/ai-chat-with-pdf-frontend.git
   cd ai-chat-with-pdf-frontend
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Set up environment variables**

   ```bash
   # Create .env file
   echo "VITE_API_BASE_URL=https://ai-chat-with-pdf-backend.vercel.app" > .env
   ```

4. **Start development server**

   ```bash
   npm run dev
   ```

5. **Open your browser**
   Navigate to `http://localhost:5173`

## 🏗️ Project Structure

```
src/
├── components/              # React components
│   ├── ChatInterface.jsx   # Main chat interface
│   ├── PDFUpload.jsx       # PDF upload component
│   ├── PDFViewer.jsx       # PDF viewer with controls
│   ├── PDFDocument.jsx     # PDF.js canvas renderer
│   ├── PDFPlaceholder.jsx  # Upload placeholder
│   ├── MainLayout.jsx      # Main layout wrapper
│   ├── LoadingSpinner.jsx  # Loading indicators
│   ├── ErrorBoundary.jsx   # Error handling
│   ├── TypingIndicator.jsx # Chat typing animation
│   ├── UploadConfirmModal.jsx # Upload confirmation
│   └── UploadNewButton.jsx # New upload button

├── services/               # API services
│   └── apiService.js       # Backend communication
├── utils/                  # Utility functions
│   ├── pdfLoader.js        # PDF.js loader utilities
│   ├── pdfUtils.js         # PDF validation and utilities
│   ├── fileUpload.js       # File upload utilities
│   ├── messageFormatter.js  # Message formatting
│   └── pdfDebug.js         # Debug utilities
├── assets/                 # Static assets
└── App.jsx                # Main application component
```

## 🔧 Configuration

### Development vs Production

- **Development**: Uses Vite proxy to avoid CORS issues
- **Production**: Direct API calls to your backend domain

## 🚀 Deployment

### Vercel Deployment

1. **Connect to Vercel**

   ```bash
   npx vercel
   ```

2. **Set Environment Variables**

   - Go to Vercel Dashboard → Project Settings → Environment Variables
   - Add: `VITE_API_BASE_URL` = `https://ai-chat-with-pdf-backend.vercel.app`

3. **Deploy**
   ```bash
   git push origin main
   ```

### Other Platforms

The app can be deployed to any static hosting platform:

- Netlify
- GitHub Pages
- AWS S3 + CloudFront
- Firebase Hosting

## 🛠️ Development

### Available Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build
npm run lint         # Run ESLint
```

### Development Features

- **Hot Module Replacement**: Instant updates during development
- **Proxy Configuration**: Automatic API proxying to avoid CORS
- **Error Boundaries**: Graceful error handling
- **Debug Mode**: Enhanced logging for troubleshooting

## 📡 API Integration

The frontend communicates with your backend API:

### Core Endpoints

- `POST /api/pdf/upload` - Upload PDF files with progress tracking
- `POST /api/chat/query` - Send chat messages with context
- `GET /uploads/:filename` - Serve uploaded PDF files (legacy, now using blobUrl)

### Request/Response Format

```javascript
// Upload PDF with progress tracking
const response = await uploadPDF(file, onProgress);

// Response includes:
// {
//   success: true,
//   data: {
//     fileId: "unique-id",
//     blobUrl: "https://blob-url",
//     originalName: "document.pdf",
//     documentType: "research-paper",
//     totalPages: 10,
//     sections: 5,
//     chunks: 50,
//     summary: "Document summary...",
//     suggestions: ["Question 1", "Question 2"]
//   }
// }

// Send chat message
const response = await sendChatMessage(message, fileId, chatHistory);
```

## 🎨 UI Components

### PDF Viewer

- **Canvas Rendering**: High-performance PDF display
- **Zoom Controls**: Pinch-to-zoom and button controls
- **Navigation**: Page-by-page navigation
- **Responsive**: Adapts to different screen sizes

### Chat Interface

- **Real-time Chat**: Live message exchange
- **Typing Indicators**: Shows when AI is responding
- **Message History**: Persistent chat history
- **File Context**: Chat with specific PDF documents

### Upload Interface

- **Drag & Drop**: Intuitive file upload
- **Progress Tracking**: Real-time upload progress
- **File Validation**: PDF format validation
- **Error Handling**: Graceful error messages

## 🔧 Technical Details

### PDF.js Integration

```javascript
import * as pdfjsLib from "pdfjs-dist";

// Configure worker from local file
pdfjsLib.GlobalWorkerOptions.workerSrc = "/pdf.worker.min.js";
```

### State Management

Uses component-level state management:

- Component-level state for UI interactions
- Persistent state for user preferences
- Centralized state in App.jsx for PDF management

### Performance Optimizations

- **Lazy Loading**: Components load on demand
- **Memory Management**: Proper cleanup of PDF objects
- **Bundle Splitting**: Optimized build with code splitting
- **Local Worker**: PDF.js worker served locally for reliability

## 🐛 Troubleshooting

### Common Issues

1. **CORS Errors**

   - Ensure backend allows your domain
   - Check proxy configuration in development

2. **PDF Loading Issues**

   - Verify PDF file is valid
   - Check network connectivity
   - Ensure PDF.js worker is loading

3. **Upload Failures**
   - Check file size limits
   - Verify backend is running
   - Check network connectivity

### Debug Mode

Enable debug logging:

```javascript
// In browser console
localStorage.debug = "pdf:*";
```

### Performance Issues

- Clear browser cache
- Check memory usage
- Monitor network requests

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Development Guidelines

- Follow existing code style
- Add tests for new features
- Update documentation
- Ensure all linting passes

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [PDF.js](https://mozilla.github.io/pdf.js/) - PDF rendering library
- [React](https://reactjs.org/) - UI framework
- [Vite](https://vitejs.dev/) - Build tool
- [Tailwind CSS](https://tailwindcss.com/) - CSS framework
- [Lucide React](https://lucide.dev/) - Icons

## 📦 Dependencies

### Core Dependencies

- **React 19** - UI framework
- **Vite 5** - Build tool and dev server
- **Tailwind CSS** - Styling framework
- **PDF.js** - PDF rendering library
- **Axios** - HTTP client
- **Lucide React** - Icon library

### Development Dependencies

- **ESLint** - Code linting
- **PostCSS** - CSS processing
- **TypeScript types** - Type definitions

## 📞 Support

- **Issues**: [GitHub Issues](https://github.com/yourusername/ai-chat-with-pdf-frontend/issues)
- **Discussions**: [GitHub Discussions](https://github.com/yourusername/ai-chat-with-pdf-frontend/discussions)
- **Email**: your-email@example.com

---

Made with ❤️ by [Your Name]
