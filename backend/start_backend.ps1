Push-Location $PSScriptRoot

Write-Host "Ensuring GEMINI_API_KEY is set for this session" -ForegroundColor Green
$env:GEMINI_API_KEY="your-gemini-api-key"

Write-Host "Launching Gemini API backend..." -ForegroundColor Green
python ai_api.py

Pop-Location
