# 📱 Mirasys Profile Tree App

A **React Native (TypeScript)** application that connects to the [Mirasys GraphQL API](https://router.mirasys.dev/)  
to display a **Profile Tree** with paginated items (folders, video channels, and digital IOs).  
This project was created as part of a technical assignment to demonstrate React Native architecture, GraphQL integration,  
infinite scrolling, pagination, and robust TypeScript structure.

---

## 🚀 Features

- 🔐 **Login screen** — Authenticate with provided Mirasys credentials  
- 🌳 **Profile Tree view** — Display root nodes, 50 items per page  
- 🔄 **Infinite scroll** — Automatically load more items on scroll  
- 📂 **Expandable folders** — Fetch and show child nodes dynamically  
- 🧩 **Node types** — Different icons for Folder / Video / Digital IO  
- ⏳ **Loading states** — Spinner during data fetch  
- ⚠️ **Error handling** — Clear, user-friendly messages  
- 👤 **Account screen** — Logout functionality  
- 🧪 **Bonus:** Jest tests + GitHub CI for lint/tests

---

## 🧩 Tech Stack

- **React Native 0.76.1**
- **TypeScript**
- **Apollo Client / GraphQL Code Generator**
- **React Navigation**
- **React Query / Zustand** (local state)
- **Jest** for testing
- **ESLint + Prettier**
- **GitHub Actions CI**

---

## 🧱 Project Structure

```
src/
├── app/
│   ├── App.tsx                 # Root entry point
│   ├── navigation/             # Stack/Tab navigation setup
│   ├── providers/              # Apollo, Auth, Navigation providers
│
├── features/
│   ├── auth/                   # Login logic, token storage
│   ├── profile-tree/           # Profile tree core logic
│   │   ├── components/         # UI components (node list, icons, etc.)
│   │   ├── graphql/
│   │   │   ├── queries/        # .graphql query files
│   │   │   └── generated/      # Auto-generated codegen output
│   │   └── hooks/              # Custom hooks for GraphQL fetching
│   └── account/                # Logout and account info
│
├── shared/
│   ├── components/             # Common UI components (Loader, Error)
│   ├── hooks/                  # Shared hooks
│   ├── services/               # API and auth helpers
│   └── utils/                  # Helpers, constants
│
└── assets/                     # Icons, images, fonts
```

---

## ⚙️ Prerequisites

Make sure you have installed:

- Node.js ≥ **18**
- npm ≥ **9**
- **Java 17** (required for Android build)
- **Android Studio SDK** or **Xcode**
- **CocoaPods** (`brew install cocoapods`)

---

## 🧰 Installation

Clone and install dependencies:

```bash
git clone https://github.com/<your-username>/mirasys-profile-tree.git
cd mirasys-profile-tree
npm install
```

Create `.env` file:

```bash
cp .env.sample .env
```

Fill in credentials:

```env
GRAPHQL_URL=https://router.mirasys.dev/graphql
IAM_URL=https://iam.mirasys.dev
IAM_CLIENT_ID=test1
IAM_CLIENT_SECRET=54531d91cbf334fc4922b150cb25ea4b
```

---

## 🧬 Generate GraphQL Types

To generate TypeScript hooks and schema types:

```bash
npx graphql-codegen
```

If authentication is needed for schema introspection, add this to `codegen.yml`:

```yaml
schema:
  - https://router.mirasys.dev/graphql:
      headers:
        Authorization: "Bearer <ACCESS_TOKEN>"
```

---

## ▶️ Running the App

### 1. Start Metro Bundler
```bash
npm start
```

### 2. Run on Android
```bash
npm run android -- --active-arch-only
```

### 3. Run on iOS
```bash
cd ios && pod install && cd ..
npm run ios -- --no-packager
```

> ⚠️ Do **not** use `sudo` for React Native commands — it breaks permissions.

---

## 🧪 Testing & Linting

Run unit tests:
```bash
npm test
```

Lint the project:
```bash
npm run lint
```

---

## 📦 Build APK (Android)

```bash
cd android
./gradlew assembleRelease
```

Output path:
```
android/app/build/outputs/apk/release/app-release.apk
```

---

## 🔄 Continuous Integration (GitHub Actions)

The repository includes `.github/workflows/ci.yml` to run:
- ✅ ESLint checks  
- ✅ Jest unit tests  
- ✅ TypeScript build validation

---

## 🧭 API Reference

### Authentication Endpoint
```
POST https://iam.mirasys.dev/auth/generate-token
```
Request:
```json
{
  "username": "test1",
  "password": "54531d91cbf334fc4922b150cb25ea4b",
  "clientId": "test1",
  "clientSecret": "54531d91cbf334fc4922b150cb25ea4b"
}
```

### GraphQL Endpoint
```
https://router.mirasys.dev/graphql
```

Example query:
```graphql
query ListProfileNodes($first: Int, $after: String, $where: ProfileNodeFilterInput) {
  listProfileNodes(first: $first, after: $after, where: $where) {
    nodes {
      id
      name
      kind
      parentNodeId
      ... on VideoChannelNode { componentId }
      ... on DigitalInputNode { componentId }
      ... on DigitalOutputNode { componentId }
    }
    pageInfo {
      hasNextPage
      endCursor
    }
  }
}
```

---

## 🧠 Implementation Notes

- Infinite scroll uses React Native `FlatList` with `onEndReached`.
- Pagination is based on `pageInfo.endCursor` and `hasNextPage`.
- Each folder node lazily loads children on expand.
- Apollo Client normalizes and caches GraphQL data.
- Login token stored securely with `@react-native-keychain`.

---

## 👤 Author

**Nikita Pletnev**  
Frontend / Full-Stack Developer  
🌍 [LinkedIn](https://www.linkedin.com/in/nikita-pletnev-421b14178/) • 💻 [GitHub](https://github.com/NikitaPletnev)

---

## 🪪 License

This project is provided for educational and evaluation purposes only.  
© 2025 Mirasys Assignment – All rights reserved.
