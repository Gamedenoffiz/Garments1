# Indian Flower E-commerce

A modern e-commerce platform built with React, TypeScript, and Supabase.

## Features

- **Product Management**: Complete admin dashboard for managing products, categories, and inventory
- **Shopping Cart**: Full cart functionality with real-time updates
- **User Authentication**: Secure user registration and login
- **Product Categories**: Organized product categories with subcategories
- **Search & Filters**: Advanced product search and filtering capabilities
- **Responsive Design**: Mobile-first responsive design
- **Real-time Updates**: Live cart updates and product management

## Tech Stack

- **Frontend**: React 18, TypeScript, Tailwind CSS
- **Backend**: Supabase (PostgreSQL, Authentication, Real-time)
- **Build Tool**: Vite
- **Routing**: React Router DOM
- **State Management**: React Query (TanStack Query)
- **UI Components**: Radix UI, Lucide Icons
- **Styling**: Tailwind CSS with custom components

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- Supabase account

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/Gamedenoffiz/Garments1.git
   cd Garments1
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:
   Create a `.env` file in the root directory and add your Supabase credentials:
   ```
   VITE_SUPABASE_URL=your_supabase_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```
   
   **Note**: If you don't have Supabase set up yet, the application will work with mock data for demonstration purposes.

4. Run database migrations (if using Supabase):
   ```bash
   # If you have Supabase CLI installed
   supabase db reset
   
   # Or manually run the migrations in your Supabase dashboard
   ```

4. Start the development server:
   ```bash
   npm run dev
   ```

5. Open [http://localhost:8080](http://localhost:8080) in your browser.

## Project Structure

```
project/
├── client/                 # Frontend application
│   ├── components/         # Reusable UI components
│   ├── pages/             # Page components
│   ├── hooks/             # Custom React hooks
│   ├── lib/               # Utility functions and configurations
│   └── data/              # Static data and types
├── server/                # Backend server files
├── supabase/              # Database migrations and functions
├── public/                # Static assets
└── netlify/               # Netlify functions
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run type-check` - Run TypeScript type checking

## Database Schema

The application uses Supabase with the following main tables:
- `categories` - Product categories
- `products` - Product information
- `product_images` - Product image management
- `product_variants` - Product size/color variants
- `cart_items` - Shopping cart items
- `profiles` - User profiles

## Deployment

The application is configured for deployment on Netlify with:
- Automatic builds from GitHub
- Serverless functions for API endpoints
- Environment variable configuration

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/new-feature`
3. Commit your changes: `git commit -am 'Add new feature'`
4. Push to the branch: `git push origin feature/new-feature`
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Contact

For questions or support, please contact [your-email@example.com]
