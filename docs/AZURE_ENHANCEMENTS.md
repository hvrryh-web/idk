# Azure Web Application Enhancements

## Overview

This document describes free Azure services and features that can enhance the WuXuxian TTRPG web application. These enhancements focus on monitoring, performance, security, and user experience improvements available in Azure's free tier.

## Recommended Azure Services

### 1. Azure Application Insights (Free Tier)

**Purpose:** Application Performance Monitoring (APM) and telemetry

**Features Available Free:**
- 5GB/month data ingestion
- 90-day data retention
- Real-time metrics
- Error tracking and diagnostics
- User session tracking
- Performance monitoring

**Implementation:**

Add to `frontend/src/main.tsx`:
```typescript
import { ApplicationInsights } from '@microsoft/applicationinsights-web';

const appInsights = new ApplicationInsights({
  config: {
    connectionString: process.env.VITE_APPINSIGHTS_CONNECTION_STRING,
    enableAutoRouteTracking: true,
    enableCorsCorrelation: true,
  }
});

if (process.env.VITE_APPINSIGHTS_CONNECTION_STRING) {
  appInsights.loadAppInsights();
  appInsights.trackPageView();
}
```

Add to `backend/app/main.py`:
```python
from opencensus.ext.azure.log_exporter import AzureLogHandler
from opencensus.ext.azure.trace_exporter import AzureExporter
from opencensus.trace.samplers import ProbabilitySampler

# Configure if connection string is available
if os.getenv('APPLICATIONINSIGHTS_CONNECTION_STRING'):
    logger.addHandler(AzureLogHandler(
        connection_string=os.environ['APPLICATIONINSIGHTS_CONNECTION_STRING']
    ))
```

**Benefits:**
- Track frontend errors and crashes
- Monitor API response times
- Identify performance bottlenecks
- User behavior analytics
- Real-time alerting

---

### 2. Azure Static Web Apps (Free Tier)

**Purpose:** Host the React frontend with global CDN

**Features Available Free:**
- 100GB bandwidth/month
- 2 custom domains
- Free SSL certificates
- Integrated CI/CD with GitHub Actions
- Staging environments
- Global CDN distribution

**Implementation:**

Create `.github/workflows/azure-static-web-apps.yml`:
```yaml
name: Azure Static Web Apps CI/CD

on:
  push:
    branches:
      - main
  pull_request:
    types: [opened, synchronize, reopened, closed]
    branches:
      - main

jobs:
  build_and_deploy_job:
    if: github.event_name == 'push' || (github.event_name == 'pull_request' && github.event.action != 'closed')
    runs-on: ubuntu-latest
    name: Build and Deploy Job
    steps:
      - uses: actions/checkout@v4
      - name: Build And Deploy
        uses: Azure/static-web-apps-deploy@v1
        with:
          azure_static_web_apps_api_token: ${{ secrets.AZURE_STATIC_WEB_APPS_API_TOKEN }}
          repo_token: ${{ secrets.GITHUB_TOKEN }}
          action: "upload"
          app_location: "/frontend"
          output_location: "dist"
```

**Benefits:**
- Zero-config deployment
- Automatic HTTPS
- Global edge distribution
- Pull request previews
- Integrated authentication

---

### 3. Azure SignalR Service (Free Tier)

**Purpose:** Real-time WebSocket communication for VTT

**Features Available Free:**
- 20 concurrent connections
- 20,000 messages/day
- Managed WebSocket infrastructure

**Implementation:**

Backend integration:
```python
from azure.messaging.webpubsubservice import WebPubSubServiceClient

# In VTT routes
async def broadcast_game_state(state: dict):
    if os.getenv('AZURE_SIGNALR_CONNECTION_STRING'):
        client = WebPubSubServiceClient.from_connection_string(
            os.environ['AZURE_SIGNALR_CONNECTION_STRING'],
            hub='wuxuxian-vtt'
        )
        client.send_to_all(json.dumps(state))
```

Frontend integration:
```typescript
import { WebPubSubClient } from '@azure/web-pubsub-client';

const client = new WebPubSubClient(negotiateUrl);
client.on('message', (e) => {
  updateGameState(JSON.parse(e.message));
});
```

**Benefits:**
- Managed WebSocket scaling
- Automatic reconnection
- Cross-region redundancy
- No server management

---

### 4. Azure Blob Storage (Free Tier via Azure Free Account)

**Purpose:** Store generated assets and user uploads

**Features Available Free:**
- 5GB Blob storage
- 20,000 read operations/month
- 10,000 write operations/month

**Implementation:**

```python
from azure.storage.blob import BlobServiceClient

def upload_generated_asset(file_path: str, asset_type: str) -> str:
    if os.getenv('AZURE_STORAGE_CONNECTION_STRING'):
        blob_service = BlobServiceClient.from_connection_string(
            os.environ['AZURE_STORAGE_CONNECTION_STRING']
        )
        container = blob_service.get_container_client('assets')
        blob_name = f"{asset_type}/{os.path.basename(file_path)}"
        
        with open(file_path, 'rb') as data:
            container.upload_blob(name=blob_name, data=data, overwrite=True)
        
        return f"https://{account}.blob.core.windows.net/assets/{blob_name}"
    return file_path  # Fallback to local
```

**Benefits:**
- Durable asset storage
- CDN integration
- Automatic tiering
- Geo-redundancy options

---

### 5. Azure Key Vault (Free Operations)

**Purpose:** Secure secrets management

**Features Available Free:**
- 10,000 operations/month (standard keys)
- Secure secret storage
- Access policy management

**Implementation:**

```python
from azure.keyvault.secrets import SecretClient
from azure.identity import DefaultAzureCredential

def get_secret(name: str) -> str:
    if os.getenv('AZURE_KEYVAULT_URL'):
        credential = DefaultAzureCredential()
        client = SecretClient(
            vault_url=os.environ['AZURE_KEYVAULT_URL'],
            credential=credential
        )
        return client.get_secret(name).value
    return os.getenv(name, '')
```

**Benefits:**
- Centralized secret management
- Audit logging
- Automatic rotation
- RBAC integration

---

### 6. Azure Monitor Alerts (Free Tier)

**Purpose:** Automated alerting for issues

**Features Available Free:**
- 1,000 email alerts/month
- 100 SMS alerts/month
- Metric-based alerting
- Log-based alerting

**Alert Examples:**
```json
{
  "alerts": [
    {
      "name": "High Error Rate",
      "condition": "error_count > 10 in 5 minutes",
      "action": "email:team@example.com"
    },
    {
      "name": "API Latency",
      "condition": "avg_response_time > 2000ms",
      "action": "email:ops@example.com"
    },
    {
      "name": "Combat Session Failures",
      "condition": "combat_errors > 5 in 1 hour",
      "action": "email:dev@example.com"
    }
  ]
}
```

---

## Configuration Setup

### Environment Variables

Add these to your deployment configuration:

```bash
# Azure Application Insights
APPLICATIONINSIGHTS_CONNECTION_STRING=InstrumentationKey=xxx;IngestionEndpoint=https://xxx

# Azure SignalR
AZURE_SIGNALR_CONNECTION_STRING=Endpoint=https://xxx;AccessKey=xxx

# Azure Storage
AZURE_STORAGE_CONNECTION_STRING=DefaultEndpointsProtocol=https;AccountName=xxx

# Azure Key Vault
AZURE_KEYVAULT_URL=https://xxx.vault.azure.net/
```

### Local Development

For local development without Azure:
```bash
# .env.local
VITE_APPINSIGHTS_CONNECTION_STRING=
AZURE_SIGNALR_CONNECTION_STRING=
AZURE_STORAGE_CONNECTION_STRING=
```

The application gracefully falls back to local alternatives when Azure services are not configured.

---

## Implementation Priority

| Service | Priority | Effort | Impact |
|---------|----------|--------|--------|
| Application Insights | HIGH | Low | High |
| Static Web Apps | HIGH | Low | High |
| SignalR Service | MEDIUM | Medium | High |
| Blob Storage | MEDIUM | Low | Medium |
| Key Vault | LOW | Low | Medium |
| Monitor Alerts | MEDIUM | Low | Medium |

---

## Cost Considerations

All recommended services have free tiers sufficient for development and small-scale production:

| Service | Free Tier Limit | Est. Cost if Exceeded |
|---------|-----------------|----------------------|
| Application Insights | 5GB/month | $2.30/GB |
| Static Web Apps | 100GB bandwidth | $0.15/GB |
| SignalR | 20 connections | $1.61/unit/day |
| Blob Storage | 5GB | $0.02/GB/month |
| Key Vault | 10K operations | $0.03/10K ops |

**Recommendation:** Start with free tier and monitor usage. Set up billing alerts at 80% of free quota.

---

## Next Steps

1. Create Azure Free Account (if not exists)
2. Set up Application Insights resource
3. Configure Static Web Apps deployment
4. Add frontend telemetry
5. Set up monitor alerts
6. Document production configuration

---

**Document Version:** 1.0
**Last Updated:** 2024-12-13
