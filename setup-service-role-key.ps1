# ========================================
# SCRIPT TỰ ĐỘNG THÊM SUPABASE_SERVICE_ROLE_KEY VÀO .ENV
# ========================================

Write-Host "================================" -ForegroundColor Cyan
Write-Host "SETUP SUPABASE SERVICE ROLE KEY" -ForegroundColor Cyan
Write-Host "================================`n" -ForegroundColor Cyan

$envPath = Join-Path $PSScriptRoot ".env"

# Kiểm tra file .env có tồn tại không
if (-not (Test-Path $envPath)) {
    Write-Host "❌ Error: File .env not found at: $envPath" -ForegroundColor Red
    Write-Host "`nPlease create .env file first or copy from .env.example" -ForegroundColor Yellow
    exit 1
}

# Đọc nội dung file .env
$envContent = Get-Content $envPath -Raw

# Kiểm tra xem SUPABASE_SERVICE_ROLE_KEY đã tồn tại chưa
if ($envContent -match "SUPABASE_SERVICE_ROLE_KEY=") {
    Write-Host "⚠️  SUPABASE_SERVICE_ROLE_KEY already exists in .env file" -ForegroundColor Yellow
    Write-Host "`nCurrent value preview:" -ForegroundColor Gray

    # Extract and show preview (first 50 chars only for security)
    if ($envContent -match "SUPABASE_SERVICE_ROLE_KEY=([^\r\n]+)") {
        $currentKey = $matches[1]
        if ($currentKey.Length -gt 50) {
            $preview = $currentKey.Substring(0, 50) + "..."
        } else {
            $preview = $currentKey
        }
        Write-Host "SUPABASE_SERVICE_ROLE_KEY=$preview" -ForegroundColor Gray
    }

    Write-Host "`nDo you want to replace it? (y/N): " -ForegroundColor Yellow -NoNewline
    $replace = Read-Host

    if ($replace -ne "y" -and $replace -ne "Y") {
        Write-Host "`n✅ Keeping existing key. Exiting..." -ForegroundColor Green
        exit 0
    }
}

Write-Host "`n📋 Instructions:" -ForegroundColor Cyan
Write-Host "1. Go to: https://supabase.com/dashboard" -ForegroundColor White
Write-Host "2. Select your project: ahtvzqtykrenluzwajee" -ForegroundColor White
Write-Host "3. Navigate to: Settings → API" -ForegroundColor White
Write-Host "4. Find 'Project API keys' section" -ForegroundColor White
Write-Host "5. Copy the 'service_role' key (the secret one)" -ForegroundColor White

Write-Host "`n🔑 Please paste your SUPABASE_SERVICE_ROLE_KEY here:" -ForegroundColor Green
Write-Host "(Input will be hidden for security)" -ForegroundColor Gray

# Read sensitive input (hidden)
$serviceRoleKey = Read-Host -AsSecureString
$BSTR = [System.Runtime.InteropServices.Marshal]::SecureStringToBSTR($serviceRoleKey)
$serviceRoleKeyPlain = [System.Runtime.InteropServices.Marshal]::PtrToStringAuto($BSTR)

# Validate input
if ([string]::IsNullOrWhiteSpace($serviceRoleKeyPlain)) {
    Write-Host "`n❌ Error: Service role key cannot be empty!" -ForegroundColor Red
    exit 1
}

if ($serviceRoleKeyPlain.Length -lt 50) {
    Write-Host "`n⚠️  Warning: Key seems too short. Are you sure it's correct? (y/N): " -ForegroundColor Yellow -NoNewline
    $confirm = Read-Host
    if ($confirm -ne "y" -and $confirm -ne "Y") {
        Write-Host "`n❌ Aborted." -ForegroundColor Red
        exit 1
    }
}

# Add or replace SUPABASE_SERVICE_ROLE_KEY
$newLine = "`nSUPABASE_SERVICE_ROLE_KEY=$serviceRoleKeyPlain"

if ($envContent -match "SUPABASE_SERVICE_ROLE_KEY=") {
    # Replace existing
    $envContent = $envContent -replace "SUPABASE_SERVICE_ROLE_KEY=[^\r\n]*", "SUPABASE_SERVICE_ROLE_KEY=$serviceRoleKeyPlain"
    Write-Host "`n✅ Updated SUPABASE_SERVICE_ROLE_KEY in .env" -ForegroundColor Green
} else {
    # Add new (after NEXT_PUBLIC_SUPABASE_ANON_KEY if possible)
    if ($envContent -match "(NEXT_PUBLIC_SUPABASE_ANON_KEY=[^\r\n]+)") {
        $envContent = $envContent -replace "(NEXT_PUBLIC_SUPABASE_ANON_KEY=[^\r\n]+)", "`$1$newLine"
    } else {
        # Fallback: append to end
        $envContent += $newLine
    }
    Write-Host "`n✅ Added SUPABASE_SERVICE_ROLE_KEY to .env" -ForegroundColor Green
}

# Write back to file
Set-Content -Path $envPath -Value $envContent -NoNewline

Write-Host "`n✅ Done! Your .env file has been updated." -ForegroundColor Green
Write-Host "`n⚠️  IMPORTANT SECURITY NOTES:" -ForegroundColor Yellow
Write-Host "1. NEVER commit .env to git" -ForegroundColor White
Write-Host "2. NEVER share your service_role key" -ForegroundColor White
Write-Host "3. This key has FULL access to your database" -ForegroundColor White
Write-Host "4. Keep .env in .gitignore" -ForegroundColor White

Write-Host "`n🔄 Next steps:" -ForegroundColor Cyan
Write-Host "1. Run SQL script: database/fix-rls-policies.sql in Supabase SQL Editor" -ForegroundColor White
Write-Host "2. Restart your dev server: npm run dev" -ForegroundColor White
Write-Host "3. Try registration again at: http://localhost:3000/register" -ForegroundColor White

Write-Host "`n================================" -ForegroundColor Cyan

