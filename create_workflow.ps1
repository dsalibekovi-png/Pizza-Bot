$workflowJson = Get-Content 'C:\Users\Dav\Project X\workflow.json' -Raw

$headers = @{
    "X-N8N-API-KEY" = $env:N8N_API_KEY
    "Content-Type" = "application/json"
}

$url = "https://diavola.app.n8n.cloud/mcp-server/http/rest/workflows"

Write-Host "Creating workflow..." -ForegroundColor Cyan

try {
    $result = Invoke-RestMethod -Uri $url -Method POST -Headers $headers -Body $workflowJson -TimeoutSec 30
    Write-Host "✅ Workflow created successfully!" -ForegroundColor Green
    Write-Host "ID: $($result.id)"
    Write-Host "Name: $($result.name)"
} catch {
    Write-Host "❌ Error: $($_.Exception.Message)" -ForegroundColor Red
    if ($_.Exception.Response) {
        Write-Host "Response: $($_.Exception.Response.StatusCode)"
    }
}
