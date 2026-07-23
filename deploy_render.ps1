# Planova Render Deployment Script
# This script prompts for your Render API Token and programmatically deploys the blueprint stack to Render.

Write-Host "=========================================" -ForegroundColor Indigo
Write-Host "     PLANOVA RENDER DEPLOYMENT           " -ForegroundColor Indigo
Write-Host "=========================================" -ForegroundColor Indigo

# 1. Prompt for API Token
$apiKey = Read-Host "Enter your Render API Token (from dashboard Account Settings)"
if ([string]::IsNullOrEmpty($apiKey)) {
    Write-Host "Error: Render API Token is required." -ForegroundColor Red
    Exit 1
}

$headers = @{
    "Authorization" = "Bearer $apiKey"
    "Accept"        = "application/json"
    "Content-Type"  = "application/json"
}

# 2. Get GitHub Repository link from Render
Write-Host "Fetching connected GitHub repositories..." -ForegroundColor Green
try {
    $reposResponse = Invoke-RestMethod -Uri "https://api.render.com/v1/owner/repos" -Headers $headers -Method Get
} catch {
    Write-Host "Error connecting to Render API. Please verify your API token." -ForegroundColor Red
    Write-Host $_.Exception.Message -ForegroundColor Red
    Exit 1
}

# Filter for Planova repo
$planovaRepo = $reposResponse | Where-Object { $_.name -match "Planova" }

if ($null -eq $planovaRepo) {
    Write-Host "No connected repository named 'Planova' found in your Render account." -ForegroundColor Yellow
    Write-Host "Please ensure you have linked your GitHub account under Render -> Account Settings -> Connected Accounts." -ForegroundColor Yellow
    Exit 1
}

Write-Host "Found connected repository: $($planovaRepo.fullName)" -ForegroundColor Green

# 3. Create Blueprint deployment
$body = @{
    name = "planova-backend-stack"
    repo = $planovaRepo.gitUrl
    branch = "main"
    filePath = "render.yaml"
} | ConvertTo-Json

Write-Host "Triggering Blueprint deployment on Render..." -ForegroundColor Green
try {
    $blueprintResponse = Invoke-RestMethod -Uri "https://api.render.com/v1/blueprints" -Headers $headers -Method Post -Body $body
    Write-Host "Blueprint instance successfully created!" -ForegroundColor Green
    Write-Host "Stack Name: $($blueprintResponse.name)" -ForegroundColor Green
    Write-Host "Build Status: $($blueprintResponse.status)" -ForegroundColor Green
    Write-Host "Visit the Render Dashboard to check build logs." -ForegroundColor Green
} catch {
    Write-Host "Failed to create Blueprint deployment." -ForegroundColor Red
    Write-Host $_.Exception.Message -ForegroundColor Red
    Exit 1
}
