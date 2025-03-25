# ♛ Laravel Gambit - UNIIT Night of Chances Workshop

## 🚀 Introduction
Welcome to our Laravel workshop! This README provides an overview of the folder structure, setup instructions, and best practices to follow. Make sure to always refer to the official [docs](https://laravel.com/docs/12.x) - they are really well written, give them a try!


## 📂 Folder Structure
Laravel follows an MVC (Model-View-Controller) structure. Below is a breakdown of the important directories:

```
📦 NOC-2025-WORKSHOP
├── 📁 app            # Main application logic
│   ├── 📁 Console    # Custom artisan commands (e.g.: php artisan <your-custom-command>)
│   ├── 📁 Http       # Controllers, Middleware, Requests
│   ├── 📁 Models     # Eloquent ORM models
│   ├── 📁 Providers  # Service providers
│   └── ...
├── 📁 bootstrap      # Where the Laravel instance is actually created
├── 📁 config         # Configuration files, basically just abstraction on top of .env
├── 📁 database       # Migrations, seeders, factories
│   ├── 📁 factories  # Model factories for test data
│   ├── 📁 migrations # Database schema migrations
│   ├── 📁 seeders    # Database seeding scripts
├── 📁 public         # Public assets (index.php, CSS, JS, images)
├── 📁 resources      # This is where the frontend lives
│   ├── 📁 css        # Stylesheets
│   ├── 📁 js         # JavaScript files
│   ├── 📁 views      # Blade templates
├── 📁 routes         # Route definitions
├── 📁 storage        # Logs, cache, session, file storage
│   ├── 📁 app        # Application-generated files
│   ├── 📁 framework  # Cache, sessions, views
│   ├── 📁 logs       # Application logs
├── 📁 tests          # The forbidden folder
├── 📁 vendor         # Composer dependencies (similar to Node modules)
├── 📄 artisan        # Artisan CLI script
├── 📄 composer.json  # PHP dependencies
├── 📄 package.json   # Node.js dependencies
└── 📄 README.md      # You are here!
```

---

## 🛠️ Setup Instructions

### 📄 Prerequisites
- PHP (at least v8.2)
- Composer
- Node 

### 1️⃣ Install Dependencies
```sh
npm install
```

### 2️⃣ Configure Environment
Copy the example environment file and set your application-specific values:
```sh
cp .env.example .env
php artisan key:generate
```

### 3️⃣ Setup Database
Edit the `.env` file to set up database credentials, then run:
```sh
php artisan migrate --seed
```

### 4️⃣ Build project & Start the Development Server
```sh
npm run build
composer run dev
```

## 🎯 Useful Artisan Commands
| Command | Description |
|---------|-------------|
| `php artisan migrate` | Run database migrations |
| `php artisan db:seed` | Seed the database |
| `php artisan cache:clear` | Clear application cache |
| `php artisan config:cache` | Cache configuration files |
| `php artisan make:model ModelName -m` | Create a model with migration |

---

## 📜 Environment Variables
| Variable | Description |
|-----------|-------------|
| `APP_NAME` | Application name |
| `APP_ENV` | Environment (local, production, etc.) |
| `APP_KEY` | Application encryption key |
| `DB_CONNECTION` | Database type (mysql, sqlite, etc.) |
| `DB_HOST` | Database host |
| `DB_PORT` | Database port |
| `DB_DATABASE` | Database name |
| `DB_USERNAME` | Database username |
| `DB_PASSWORD` | Database password |

Happy coding! 🚀

