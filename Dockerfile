# PHP 8.5 (imagem oficial do FrankenPHP, Debian trixie).
# Substitui xcoagency/laravel-frankenphp-octane, que só publica 8.4.
# Fixar a versão exata garante builds reproduzíveis (atualizar conscientemente).
FROM dunglas/frankenphp:1.13.2-php8.5.12

WORKDIR /app
COPY . /app

# Extensões PHP do app (mesmo conjunto da imagem anterior + pdo_pgsql p/ Postgres)
RUN install-php-extensions \
    bcmath \
    excimer \
    exif \
    gd \
    intl \
    pcntl \
    pdo_mysql \
    pdo_pgsql \
    pdo_sqlite \
    redis \
    sodium \
    xsl \
    zip

# Composer (a imagem oficial não traz)
COPY --from=composer:2 /usr/bin/composer /usr/local/bin/composer

# Install Node.js and pnpm
RUN apt-get update && \
    apt-get install -y curl && \
    curl -fsSL https://deb.nodesource.com/setup_lts.x | bash - && \
    apt-get install -y nodejs && \
    npm install -g pnpm && \
    apt-get clean && \
    rm -rf /var/lib/apt/lists/*

# Install PHP dependencies (with dev deps for wayfinder)
RUN composer install --optimize-autoloader --ignore-platform-reqs --no-scripts --no-interaction

# Build frontend assets (VITE_* is embedded at build time)
ARG VITE_APP_NAME="AgentResolve SaaS"
ARG VITE_REVERB_APP_KEY=
ARG VITE_REVERB_HOST=localhost
ARG VITE_REVERB_PORT=8081
ARG VITE_REVERB_SCHEME=http
ENV CI=true \
    VITE_APP_NAME=$VITE_APP_NAME \
    VITE_REVERB_APP_KEY=$VITE_REVERB_APP_KEY \
    VITE_REVERB_HOST=$VITE_REVERB_HOST \
    VITE_REVERB_PORT=$VITE_REVERB_PORT \
    VITE_REVERB_SCHEME=$VITE_REVERB_SCHEME
RUN pnpm install && pnpm run build

# # Remove dev dependencies after build
# RUN composer install --no-dev --optimize-autoloader --no-scripts --no-interaction

# Empty .env so Laravel's dotenv bootstrap has a file to read in this image
# (real configuration comes from environment variables).
RUN touch /app/.env

# Add entrypoint script
COPY entrypoint.sh /usr/local/bin/entrypoint.sh
RUN chmod +x /usr/local/bin/entrypoint.sh

RUN printf 'upload_max_filesize = 400M\npost_max_size = 500M\nmemory_limit = 256M\n' >> /usr/local/etc/php/php.ini

EXPOSE 8000

ENTRYPOINT ["/usr/local/bin/entrypoint.sh"]
