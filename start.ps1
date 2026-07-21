# Planova Local Bootstrapper
# This script sets up database containers, pushes Prisma schemas, seeds records, and launches development servers.

Write-Host "=========================================" -ForegroundColor Indigo
Write-Host "         PLANOVA BOOTSTRAPPER            " -ForegroundColor Indigo
Write-Host "=========================================" -ForegroundColor Indigo

# 1. Start Docker Containers
Write-Host "[1/4] Booting PostgreSQL & Redis containers..." -ForegroundColor Green
docker compose up -d

if ($LASTEXITCODE -ne 0) {
    Write-Host "Error: Failed to boot Docker containers. Please ensure Docker Desktop is running." -ForegroundColor Red
    Exit 1
}

# 2. Wait for Postgres Healthcheck
Write-Host "[2/4] Waiting for database health checks to pass..." -ForegroundColor Green
$healthy = $false
for ($i = 1; $i -le 12; $i++) {
    $status = docker inspect --format='{{json .State.Health.Status}}' planova-postgres
    if ($status -eq '"healthy"') {
        $healthy = $true
        break
    }
    Write-Host "Waiting for database... ($i/12)" -ForegroundColor Yellow
    Start-Sleep -Seconds 5
}

if (-not $healthy) {
    Write-Host "Error: PostgreSQL container failed to report healthy status." -ForegroundColor Red
    Exit 1
}
Write-Host "PostgreSQL reporting healthy!" -ForegroundColor Green

# 3. Apply Schema & Seed
Write-Host "[3/4] Running Prisma schema migrations and databases seeding..." -ForegroundColor Green
pnpm --filter api prisma db push --accept-data-loss
pnpm --filter api prisma db seed

if ($LASTEXITCODE -ne 0) {
    Write-Host "Error: Database schema updates or seeding failed." -ForegroundColor Red
    Exit 1
}
Write-Host "Database successfully migrated and seeded!" -ForegroundColor Green

# 4. Prompt to Launch Dev Servers
Write-Host "[4/4] Setup complete! Select which development server to run:" -ForegroundColor Green
Write-Host "  1) Launch all (NestJS API + Next.js User Web + Next.js Admin Web)"
Write-Host "  2) Launch NestJS API only"
Write-Host "  3) Launch Next.js User Portal only"
Write-Host "  4) Launch Next.js Admin Panel only"
Write-Host "  5) Exit setup"

$choice = Read-Host "Enter option (1-5)"

switch ($choice) {
    "1" {
        Write-Host "Launching all servers in parallel..." -ForegroundColor Indigo
        pnpm --parallel dev
    }
    "2" {
        Write-Host "Launching NestJS API..." -ForegroundColor Indigo
        pnpm --filter api dev
    }
    "3" {
        Write-Host "Launching Next.js User Portal..." -ForegroundColor Indigo
        pnpm --filter user-web dev
    }
    "4" {
        Write-Host "Launching Next.js Admin Console..." -ForegroundColor Indigo
        pnpm --filter admin-web dev
    }
    Default {
        Write-Host "Exiting bootstrapper. Containers remain active." -ForegroundColor Yellow
    }
}
