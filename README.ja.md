# TypeScript + Express + OpenTelemetry + Cloud Run サンプル

このプロジェクトは、TypeScript + Express を使用して Google Cloud Run にデプロイし、OpenTelemetry によるトレースと Cloud Logging への構造化ログ出力を行う Hello World サンプルです。インフラ構成は Terraform により管理されます。ローカル実行時には Docker Compose によりログを標準出力に出力しながら動作確認が可能です。

---

## 💡 構成技術

- TypeScript + Express
- OpenTelemetry（Google Cloud Exporter）
- Cloud Run（パブリックアクセス）
- Cloud Logging（構造化ログ）
- Terraform（インフラ構成管理）
- Docker Compose（ローカル動作確認）

---

## 📁 ディレクトリ構成（予定）

```
.
├── src/                  # Express アプリケーション本体
│   └── index.ts
├── Dockerfile            # Cloud Run 用 Dockerfile
├── compose.yaml          # ローカル実行用 Docker Compose 設定
├── terraform/            # Terraform 設定ファイル群
│   ├── main.tf
│   └── variables.tf
├── tsconfig.json         # TypeScript 設定
├── package.json
└── README.md             # このドキュメント
```

---

## 🚀 利用手順

### 1. 前提条件

- GCP プロジェクト作成済み（プロジェクト ID を `YOUR_GCP_PROJECT_ID` に置換）
- 以下のツールがローカルにインストールされていること：
  - `gcloud`
  - `terraform`
  - `docker`
  - `docker-compose`

### 2. アプリケーションのビルドとデプロイ（GCP 環境）

```bash
# Docker イメージのビルド
$ docker build -t gcr.io/YOUR_GCP_PROJECT_ID/hello-app .

# GCR へ push
$ docker push gcr.io/YOUR_GCP_PROJECT_ID/hello-app
```

### 3. Terraform による Cloud Run デプロイ

```bash
$ cd terraform
$ terraform init
$ terraform apply -var="project_id=YOUR_GCP_PROJECT_ID"
```

> Cloud Run サービスがパブリックアクセス可能な状態でデプロイされます。

### 4. ローカルでの動作確認

Docker Compose を使ってローカル実行が可能です。ローカル実行時には OpenTelemetry のエクスポーターを標準出力に切り替えてログを確認できます。

```bash
$ docker-compose up --build
```

`http://localhost:8080` にアクセスすると、"Hello World" のレスポンスと共に、標準出力に構造化ログおよびトレース情報が出力されます。

---

## 🔍 アプリの動作概要（最小サンプル）

```ts
// src/index.ts
import express from "express";
const app = express();
app.get("/", (_req, res) => res.send("Hello World"));
app.listen(process.env.PORT || 8080);
```

> OpenTelemetry の初期化・設定・エクスポーター接続などの実装は、コーディングエージェントによって記述されます。
> ローカルと Cloud Run でエクスポーターを切り替えられるようにする設計を推奨します。

---

## ☁️ Terraform 設定例（抜粋）

```hcl
resource "google_cloud_run_service" "default" {
  name     = "hello-app"
  location = "us-central1"

  template {
    spec {
      containers {
        image = "gcr.io/${var.project_id}/hello-app"
        ports {
          container_port = 8080
        }
      }
    }
  }

  traffics {
    percent         = 100
    latest_revision = true
  }
}

resource "google_cloud_run_service_iam_member" "invoker" {
  service  = google_cloud_run_service.default.name
  location = google_cloud_run_service.default.location
  role     = "roles/run.invoker"
  member   = "allUsers"
}
```

---

## 🔖 補足情報

- ログは Cloud Logging 上で構造化形式（JSON）で出力され、trace ID と紐付けられます。
- トレースは Cloud Trace コンソールで確認可能です。
- Terraform では Docker イメージのビルド処理までは行わない構成です。
- ローカルでは `ConsoleSpanExporter` などを使って標準出力にトレースを確認できます。
