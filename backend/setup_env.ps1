Push-Location $PSScriptRoot

Write-Host "Setting up GEMINI_API_KEY..." -ForegroundColor Green

if ($env:GEMINI_API_KEY) {
    Write-Host "GEMINI_API_KEY is already set for this session." -ForegroundColor Yellow
    Write-Host "Current key prefix: $($env:GEMINI_API_KEY.Substring(0, 8))..." -ForegroundColor Gray
} else {
    Write-Host "GEMINI_API_KEY is not set. Run"
    Write-Host "  `$env:GEMINI_API_KEY='your-gemini-api-key'" -ForegroundColor Cyan
}

Write-Host "You can also set it permanently with:`n[Environment]::SetEnvironmentVariable('GEMINI_API_KEY', 'your-gemini-api-key', 'User')"
Write-Host "After setting the key, restart this script to ensure it is picked up." -ForegroundColor Green

Pop-Location
