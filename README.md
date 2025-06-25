# 🌡️ Nature Remo Monitor

A real-time temperature and humidity monitoring application for Nature Remo devices built with Next.js, TypeScript, and Chart.js.

**Last updated:** $(date) - Auto-deploy test

## ✨ Features

- **Real-time Monitoring**: Live temperature and humidity data from Nature Remo devices
- **Multi-device Support**: Monitor multiple Nature Remo devices simultaneously
- **Interactive Charts**: Beautiful time-series charts using Chart.js
- **Responsive Design**: Works perfectly on desktop, tablet, and mobile devices
- **Auto-refresh**: Automatically updates data every 5 minutes
- **Dark Mode Support**: Automatically adapts to system theme preferences
- **Error Handling**: Comprehensive error handling and user feedback
- **Data Persistence**: Store data in Supabase
- **Easy Deployment**: Deploy to Vercel

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ 
- npm, yarn, pnpm, or bun
- Nature Remo device
- Nature Remo API access token
- Supabase project URL and anon key

### Installation

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd nature-remo
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   # or
   pnpm install
   # or
   bun install
   ```

3. **Set up environment variables**
   
   Copy the example environment file:
   ```bash
   cp env.example .env.local
   ```
   
   Edit `.env.local` and add your Nature Remo access token and Supabase configuration:
   ```env
   NATURE_REMO_ACCESS_TOKEN=your_access_token_here
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   NATURE_REMO_API_ENDPOINT=https://api.nature.global/1
   DATA_REFRESH_INTERVAL=300000
   ```

### Getting Your Nature Remo Access Token

1. Go to [Nature Remo Home](https://home.nature.global/)
2. Sign in to your account
3. Go to Settings → Developer
4. Generate a new access token
5. Copy the token and paste it in your `.env.local` file

### Running the Application

1. **Development mode**
   ```bash
   npm run dev
   # or
   yarn dev
   # or
   pnpm dev
   # or
   bun dev
   ```

2. **Open your browser**
   
   Navigate to [http://localhost:3000](http://localhost:3000) to see the application.

## 📊 API Endpoints

### `/api/temperature`
Returns temperature and humidity data from all connected Nature Remo devices.

**Response:**
```json
[
  {
    "id": "device_id",
    "name": "Device Name",
    "newest_events": {
      "te": {
        "val": 25.5,
        "created_at": "2024-01-01T12:00:00Z"
      },
      "hu": {
        "val": 60.2,
        "created_at": "2024-01-01T12:00:00Z"
      }
    }
  }
]
```

## 🛠️ Configuration

### Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `NATURE_REMO_ACCESS_TOKEN` | Your Nature Remo API access token | Required |
| `NEXT_PUBLIC_SUPABASE_URL` | Your Supabase project URL | Required |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Your Supabase anon key | Required |
| `NATURE_REMO_API_ENDPOINT` | Nature Remo API endpoint | `https://api.nature.global/1` |
| `DATA_REFRESH_INTERVAL` | Data refresh interval in milliseconds | `300000` (5 minutes) |

### Customization

You can customize the application by modifying:

- **Refresh Interval**: Change `DATA_REFRESH_INTERVAL` in environment variables
- **Chart Display**: Modify chart options in `src/pages/index.tsx`
- **Styling**: Update `src/styles/globals.css` for custom themes
- **API Endpoint**: Add new API routes in `src/pages/api/`

## 📱 Features in Detail

### Multi-device Support
- Automatically detects all connected Nature Remo devices
- Device selector dropdown for multiple devices
- Individual data tracking per device

### Real-time Charts
- Temperature history with time-series visualization
- Humidity history with percentage display
- Last 30 data points displayed
- Interactive tooltips and zoom capabilities

### Responsive Design
- Mobile-first approach
- Adaptive layouts for different screen sizes
- Touch-friendly interface
- Optimized for both portrait and landscape orientations

### Error Handling
- Network error detection and display
- API authentication error handling
- Graceful fallbacks for missing data
- User-friendly error messages

## 🏗️ Project Structure

```
nature-remo/
├── src/
│   ├── pages/
│   │   ├── api/
│   │   │   ├── temperature.ts    # Nature Remo API integration
│   │   │   └── hello.ts          # Example API endpoint
│   │   ├── _app.tsx              # App wrapper
│   │   ├── _document.tsx         # Document wrapper
│   │   └── index.tsx             # Main dashboard page
│   └── styles/
│       └── globals.css           # Global styles and themes
├── public/                       # Static assets
├── env.example                   # Environment variables template
├── package.json                  # Dependencies and scripts
└── README.md                     # This file
```

## 🚀 Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Connect your repository to Vercel
3. Add environment variables in Vercel dashboard
4. Deploy automatically

### Other Platforms

The application can be deployed to any platform that supports Next.js:

- **Netlify**: Use `next build && next export`
- **AWS Amplify**: Direct deployment from Git
- **Docker**: Use the provided Dockerfile
- **Self-hosted**: Run `npm run build && npm start`

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [Nature Remo API](https://developer.nature.global/) for providing the IoT device API
- [Next.js](https://nextjs.org/) for the React framework
- [Chart.js](https://www.chartjs.org/) for beautiful data visualization
- [React Chart.js 2](https://react-chartjs-2.js.org/) for React integration

## 📞 Support

If you encounter any issues or have questions:

1. Check the [Issues](../../issues) page for existing solutions
2. Create a new issue with detailed information
3. Include your environment details and error messages

---

Made with ❤️ for Nature Remo users
