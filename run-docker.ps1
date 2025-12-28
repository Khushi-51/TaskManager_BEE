<#
PowerShell helper to run the project's Docker Compose stack on Windows.
Usage: .\run-docker.ps1 -Port 3001
This script will:
 - Verify Docker is available
 - Ensure .env exists (copy from .env.example if missing)
 - Set PORT in .env (if provided)
 - Run `docker compose up --build -d`
 - Wait for the `app` container health to be 'healthy' (if healthcheck configured), or poll /healthz
 - Open browser to the configured PORT when ready
#>

param(
    [int]$Port = 3001,
    [int]$TimeoutSeconds = 120
)

function Fail([string]$msg) {
    Write-Error $msg
    exit 1
}

Write-Host "Checking Docker availability..."
try {
    docker --version | Out-Null
} catch {
    Fail "Docker CLI not found. Please install/start Docker Desktop and make sure 'docker' is on PATH."
}

# Ensure .env exists
if (-not (Test-Path -Path .env)) {
    if (Test-Path -Path .env.example) {
        Copy-Item .env.example .env
        Write-Host "Copied .env.example -> .env"
    } else {
        Fail ".env.example not found; please create a .env file from the example and set required values."
    }
}

# Ensure PORT is set in .env
$envContents = Get-Content .env -Raw
if ($envContents -notmatch '(^|\n)PORT=') {
    Add-Content -Path .env -Value "`nPORT=$Port"
    Write-Host "Added PORT=$Port to .env"
} else {
    # Replace existing PORT
    $newContents = $envContents -replace '(^|\n)PORT=\d+', "`$1PORT=$Port"
    Set-Content -Path .env -Value $newContents
    Write-Host "Updated PORT in .env to $Port"
}

# Bring down any existing stack to ensure clean start
Write-Host "Tearing down any existing Compose stack..."
docker compose down -v --remove-orphans | Out-Null

# Start up
Write-Host "Building and starting Compose stack (this may take a few minutes)..."
docker compose up --build -d
if ($LASTEXITCODE -ne 0) {
    Write-Error "docker compose up failed. Showing recent app logs to help debug..."
    docker compose logs --tail=200 app
    exit $LASTEXITCODE
}

# Get app container id
$appId = docker compose ps -q app
if (-not $appId) {
    Write-Error "App service container was not created. Showing compose ps and logs..."
    docker compose ps
    docker compose logs --tail=200 app
    exit 1
}

Write-Host "Waiting for app to become healthy (timeout: ${TimeoutSeconds}s)..."
$start = Get-Date
$healthy = $false
while ((Get-Date) -lt $start.AddSeconds($TimeoutSeconds)) {
    # Check if Health is configured
    $health = docker inspect --format '{{json .State.Health.Status}}' $appId 2>$null
    if ($health) {
        $h = $health.Trim('"')
        Write-Host "Container health: $h"
        if ($h -eq 'healthy') { $healthy = $true; break }
    } else {
        # fallback: call /healthz
        try {
            $resp = Invoke-WebRequest -UseBasicParsing -Uri "http://localhost:$Port/healthz" -Method GET -TimeoutSec 5 -ErrorAction Stop
            if ($resp.StatusCode -eq 200) { $healthy = $true; break }
        } catch {
            Write-Host ".healthz not ready yet..."
        }
    }
    Start-Sleep -Seconds 3
}

if (-not $healthy) {
    Write-Warning "App did not become healthy within timeout. Showing recent logs for debugging..."
    docker compose ps
    docker compose logs --tail=200 app
    exit 2
}

Write-Host "App is healthy — opening browser at http://localhost:$Port"
Start-Process "http://localhost:$Port"
Write-Host "Done. Use 'docker compose logs -f app' to stream logs, and 'docker compose down -v' to stop and remove volumes."