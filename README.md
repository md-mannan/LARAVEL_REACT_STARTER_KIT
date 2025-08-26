# Laravel React Starter Kit

A modern, full-stack web application starter kit built with Laravel 12 and React, featuring Inertia.js for seamless SPA-like experience.

## 🚀 Features

- **Laravel 12** - Latest Laravel framework with modern PHP 8.2+ features
- **React 18** - Modern React with TypeScript support
- **Inertia.js** - Seamless SPA experience without building an API
- **Vite** - Fast build tool for modern development
- **Tailwind CSS** - Utility-first CSS framework
- **Pest** - Testing framework for PHP
- **TypeScript** - Type-safe JavaScript development
- **Authentication** - Built-in user authentication system
- **Profile Management** - User profile photo management
- **Modern UI Components** - Beautiful, responsive components

## 📋 Prerequisites

- PHP 8.2 or higher
- Composer 2.0 or higher
- Node.js 18 or higher
- npm or yarn
- MySQL/PostgreSQL/SQLite database

## 🛠️ Installation

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd LARAVEL_REACT_STARTER_KIT
   ```

2. **Install PHP dependencies**
   ```bash
   composer install
   ```

3. **Install Node.js dependencies**
   ```bash
   npm install
   ```

4. **Environment setup**
   ```bash
   cp .env.example .env
   php artisan key:generate
   ```

5. **Database configuration**
   ```bash
   # Update .env with your database credentials
   php artisan migrate
   php artisan db:seed
   ```

6. **Build assets**
   ```bash
   npm run build
   ```

## 🚀 Development

### Starting the development server

```bash
# Start Laravel server
php artisan serve

# Start Vite dev server (in another terminal)
npm run dev

# Or use the combined dev command
composer run dev
```

### Development with SSR (Server-Side Rendering)

```bash
composer run dev:ssr
```

## 🧪 Testing

```bash
# Run all tests
composer test

# Run tests with coverage
composer run test:coverage

# Run specific test files
./vendor/bin/pest tests/Feature/Auth/
```

## 📁 Project Structure

```
├── app/                    # Laravel application logic
│   ├── Http/             # HTTP layer (controllers, middleware)
│   ├── Models/           # Eloquent models
│   └── Providers/        # Service providers
├── database/              # Database migrations, seeders, factories
├── resources/             # Frontend assets
│   ├── js/               # React components and pages
│   ├── css/              # Stylesheets
│   └── views/            # Blade templates
├── routes/                # Application routes
├── tests/                 # Test files
└── public/                # Public assets
```

## 🔧 Configuration

### Environment Variables

Key environment variables in `.env`:

```env
APP_NAME="Laravel React Starter Kit"
APP_ENV=local
APP_DEBUG=true
APP_URL=http://localhost:8000

DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=laravel_react_starter
DB_USERNAME=root
DB_PASSWORD=
```

### Vite Configuration

The project uses Vite for fast development and building. Configuration is in `vite.config.ts`.

## 🎨 Frontend Development

### React Components

Components are located in `resources/js/components/` and follow a modern component architecture.

### Pages

Pages are in `resources/js/pages/` and use Inertia.js for seamless navigation.

### Styling

- **Tailwind CSS** for utility classes
- **CSS Modules** for component-specific styles
- **Responsive design** with mobile-first approach

## 🗄️ Database

### Migrations

Run migrations to set up the database:

```bash
php artisan migrate
```

### Seeders

Populate the database with sample data:

```bash
php artisan db:seed
```

## 📦 Available Commands

```bash
# Development
composer run dev          # Start all development services
composer run dev:ssr      # Start development with SSR

# Building
npm run build            # Build for production
npm run build:ssr        # Build with SSR support

# Testing
composer test            # Run tests
composer run test:coverage # Run tests with coverage

# Code Quality
composer run pint        # PHP code style fixer
npm run lint             # JavaScript/TypeScript linting
```

## 🔒 Security

- CSRF protection enabled
- XSS protection
- SQL injection protection via Eloquent ORM
- Secure authentication system
- Input validation and sanitization

## 🌐 Deployment

### Production Build

```bash
npm run build
php artisan config:cache
php artisan route:cache
php artisan view:cache
```

### Environment Considerations

- Set `APP_ENV=production`
- Disable debug mode (`APP_DEBUG=false`)
- Use production database credentials
- Configure proper caching

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is open-sourced software licensed under the [MIT license](https://opensource.org/licenses/MIT).

## 🆘 Support

If you encounter any issues or have questions:

1. Check the [Laravel documentation](https://laravel.com/docs)
2. Check the [Inertia.js documentation](https://inertiajs.com/)
3. Open an issue in this repository

## 🙏 Acknowledgments

- [Laravel Team](https://laravel.com/) for the amazing framework
- [Inertia.js Team](https://inertiajs.com/) for seamless SPA experience
- [Tailwind CSS](https://tailwindcss.com/) for the utility-first CSS framework
- [Vite](https://vitejs.dev/) for the fast build tool

---

**Built with ❤️ using Laravel and React**
