# Laravel React Starter Kit

A modern, full-stack web application starter kit built with Laravel 12, React 19, TypeScript, and Tailwind CSS. This project provides a solid foundation for building scalable web applications with authentication, user management, and a beautiful UI.

## 🚀 Features

- **Laravel 12** - Latest Laravel framework with modern PHP 8.2+ features
- **React 19** - Latest React with modern hooks and patterns
- **TypeScript** - Full TypeScript support for type safety
- **Inertia.js** - Seamless SPA experience without building an API
- **Tailwind CSS 4** - Utility-first CSS framework with modern design system
- **Authentication System** - Complete user registration, login, and password management
- **User Profile Management** - Profile updates, avatar management, and settings
- **Modern UI Components** - Radix UI primitives with beautiful Tailwind styling
- **Responsive Design** - Mobile-first approach with sidebar navigation
- **Dark/Light Mode** - Theme switching with system preference detection
- **Queue System** - Background job processing with Laravel queues
- **Testing** - Pest PHP testing framework with comprehensive test coverage

## 🛠️ Tech Stack

### Backend
- **Laravel 12** - PHP web framework
- **PHP 8.2+** - Modern PHP with type hints and attributes
- **MySQL/PostgreSQL/SQLite** - Database support
- **Redis** - Caching and session storage
- **Laravel Queue** - Background job processing

### Frontend
- **React 19** - JavaScript library for building user interfaces
- **TypeScript 5.7** - Typed JavaScript
- **Vite 7** - Fast build tool and dev server
- **Tailwind CSS 4** - Utility-first CSS framework
- **Radix UI** - Unstyled, accessible UI primitives
- **Lucide React** - Beautiful icons

### Development Tools
- **ESLint** - JavaScript linting
- **Prettier** - Code formatting
- **Laravel Pint** - PHP code style fixer
- **Pest** - PHP testing framework

## 📋 Prerequisites

Before you begin, ensure you have the following installed:

- **PHP 8.2 or higher**
- **Composer** (PHP package manager)
- **Node.js 18+** and **npm**
- **Database** (MySQL, PostgreSQL, or SQLite)
- **Redis** (optional, for caching and queues)

## 🚀 Quick Start

### 1. Clone the Repository

```bash
git clone <your-repository-url>
cd LARAVEL_REACT_STARTER_KIT
```

### 2. Install Dependencies

```bash
# Install PHP dependencies
composer install

# Install Node.js dependencies
npm install
```

### 3. Environment Setup

```bash
# Copy environment file
cp .env.example .env

# Generate application key
php artisan key:generate
```

### 4. Configure Database

Edit your `.env` file and set your database credentials:

```env
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=your_database_name
DB_USERNAME=your_username
DB_PASSWORD=your_password
```

### 5. Run Migrations

```bash
php artisan migrate
```

### 6. Start Development Servers

```bash
# Start all development services (Laravel server, queue worker, and Vite)
composer run dev

# Or start them individually:
# Terminal 1: Laravel server
php artisan serve

# Terminal 2: Queue worker
php artisan queue:work

# Terminal 3: Vite dev server
npm run dev
```

### 7. Access Your Application

- **Frontend**: http://localhost:5173 (Vite dev server) or http://localhost:5174 if 5173 is busy
- **Backend**: http://localhost:8000 (Laravel server)

## ✅ Current Status

**Project is now fully functional and running successfully!**

- ✅ **Laravel Server**: Running on http://localhost:8000
- ✅ **Vite Dev Server**: Running on http://localhost:5174
- ✅ **Tailwind CSS**: Successfully compiled and working
- ✅ **CSS Issues**: All compilation errors have been resolved
- ✅ **Dependencies**: All packages properly installed and configured

## 🏗️ Project Structure

```
LARAVEL_REACT_STARTER_KIT/
├── app/                    # Laravel application logic
│   ├── Http/              # HTTP layer (controllers, middleware, requests)
│   ├── Models/            # Eloquent models
│   └── Providers/         # Service providers
├── resources/              # Frontend resources
│   ├── js/                # React components and logic
│   │   ├── components/    # Reusable UI components
│   │   ├── hooks/         # Custom React hooks
│   │   ├── layouts/       # Page layouts
│   │   ├── pages/         # Page components
│   │   └── types/         # TypeScript type definitions
│   └── css/               # Stylesheets
├── routes/                 # Application routes
├── database/               # Database migrations and seeders
├── tests/                  # Test files
└── config/                 # Configuration files
```

## 🔐 Authentication Features

The starter kit includes a complete authentication system:

- **User Registration** - New user account creation
- **User Login** - Secure authentication with session management
- **Password Reset** - Email-based password recovery
- **Email Verification** - Optional email verification system
- **Profile Management** - User profile updates and avatar management
- **Password Updates** - Secure password change functionality

## 🎨 UI Components

### Core Components
- **App Shell** - Main application layout with sidebar and header
- **Navigation** - Responsive sidebar navigation with mobile support
- **Forms** - Styled form components with validation
- **Cards** - Content containers with consistent styling
- **Buttons** - Various button styles and states
- **Modals** - Dialog components for user interactions

### Design System
- **Color Scheme** - Consistent color palette with dark/light mode support
- **Typography** - Hierarchical text styles
- **Spacing** - Consistent spacing scale
- **Responsive Breakpoints** - Mobile-first responsive design

## 🧪 Testing

The project uses Pest PHP for testing:

```bash
# Run all tests
composer test

# Run tests with coverage
php artisan test --coverage
```

## 📦 Available Commands

### Composer Scripts
```bash
composer run dev          # Start all development services
composer run dev:ssr      # Start with SSR support
composer test             # Run tests
```

### NPM Scripts
```bash
npm run dev               # Start Vite dev server
npm run build             # Build for production
npm run build:ssr         # Build with SSR support
npm run lint              # Lint and fix code
npm run format            # Format code with Prettier
npm run types             # Check TypeScript types
```

### Artisan Commands
```bash
php artisan serve         # Start Laravel development server
php artisan migrate       # Run database migrations
php artisan queue:work    # Start queue worker
php artisan key:generate  # Generate application key
```

## 🌙 Theme System

The application supports both light and dark themes:

- **System Preference** - Automatically detects user's system theme
- **Manual Toggle** - Users can manually switch themes
- **Persistent** - Theme preference is saved in user settings
- **Responsive** - Theme changes are applied immediately

## 📱 Responsive Design

- **Mobile First** - Designed for mobile devices first
- **Sidebar Navigation** - Collapsible sidebar for desktop, mobile menu for small screens
- **Touch Friendly** - Optimized for touch interactions
- **Breakpoint System** - Consistent responsive breakpoints

## 🔧 Configuration

### Laravel Configuration
- **Database** - Configure in `.env` file
- **Queue** - Set queue driver in `.env`
- **Cache** - Configure cache driver
- **Session** - Session configuration

### Frontend Configuration
- **Vite** - Build tool configuration in `vite.config.ts`
- **Tailwind** - CSS framework configuration
- **TypeScript** - TypeScript configuration in `tsconfig.json`

## 🚀 Deployment

### Production Build
```bash
# Build frontend assets
npm run build

# Optimize Laravel
php artisan config:cache
php artisan route:cache
php artisan view:cache
```

### Environment Variables
Ensure these are set in production:
- `APP_ENV=production`
- `APP_DEBUG=false`
- `APP_URL` - Your production URL
- Database credentials
- Queue configuration

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for new functionality
5. Ensure all tests pass
6. Submit a pull request

## 📄 License

This project is open-sourced software licensed under the [MIT license](LICENSE).

## 🆘 Support

If you encounter any issues or have questions:

1. Check the Laravel documentation
2. Review the React documentation
3. Check existing issues in the repository
4. Create a new issue with detailed information

## 🔄 Updates

To update the starter kit:

```bash
# Update PHP dependencies
composer update

# Update Node.js dependencies
npm update

# Check for breaking changes in major versions
```

---

**Built with ❤️ using Laravel, React, and modern web technologies**

## 🎯 Getting Started Right Now

Your project is ready to use! Simply run:

```bash
# Start all services
composer run dev

# Or start individually
npm run dev          # Vite dev server
php artisan serve    # Laravel server
```

Then visit:
- **Frontend**: http://localhost:5174 (or 5173 if available)
- **Backend**: http://localhost:8000

Happy coding! 🚀
