Push-Location $PSScriptRoot

Write-Host "Setting up GEMINI API Key" -ForegroundColor Green
Write-Host ""

$currentKey = [System.Environment]::GetEnvironmentVariable('GEMINI_API_KEY', 'User')
if ($currentKey) {
    Write-Host "GEMINI_API_KEY is already configured." -ForegroundColor Yellow
    Write-Host "Current key prefix: $($currentKey.Substring(0, 7))..." -ForegroundColor Gray
    Write-Host "To change it, run this script again and provide a new key." -ForegroundColor Cyan
} else {
    Write-Host "No GEMINI_API_KEY detected." -ForegroundColor Red
    Write-Host "Visit https://developers.generativeai.google/api/ to create a key." -ForegroundColor Cyan
    $apiKey = Read-Host "Enter your GEMINI_API_KEY"

    if ($apiKey) {
        [System.Environment]::SetEnvironmentVariable('GEMINI_API_KEY', $apiKey, 'User')
        Write-Host "GEMINI_API_KEY saved successfully!" -ForegroundColor Green
        Write-Host "Restart your terminal before running the backend." -ForegroundColor Yellow
    } else {
        Write-Host "No key entered. The backend will run in test mode." -ForegroundColor Red
    }
}

Write-Host ""
Write-Host "Press any key to continue..."
$null = $Host.UI.RawUI.ReadKey('NoEcho,IncludeKeyDown')
Pop-Location
