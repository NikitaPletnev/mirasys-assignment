#!/usr/bin/env bash
set -euo pipefail

# ========= Config =========
APP_NAME="mirasysprofiletree"
BUNDLE_ID_IOS="dev.mirasys.profiletree"
APPLICATION_ID_ANDROID="dev.mirasys.profiletree"
RN_TEMPLATE="react-native-template-typescript"
PKG="yarn" # or "npm"
NODE_MIN="18"

# ========= Helpers =========
need() { command -v "$1" >/dev/null 2>&1 || { echo "ERROR: '$1' not found"; exit 1; }; }
write() { # write <path> <heredoc-marker>
  local path="$1"; shift
  mkdir -p "$(dirname "$path")"
  cat > "$path"
  echo "  + $path"
}
appdir() { echo "$APP_NAME"; }

# ========= Pre-flight =========
need node; need npx; need git
echo "Node: $(node -v)"
git init >/dev/null 2>&1 || true

# ========= Create RN app =========
#echo "Creating React Native app '$APP_NAME'..."
#npx @react-native-community/cli@latest init "$APP_NAME" --template "$RN_TEMPLATE" --skip-install
#
#cd "$APP_NAME"

# ========= Package manager detect =========
if [[ "$PKG" == "yarn" ]]; then
  core_install() { yarn add "$@"; }
  dev_install() { yarn add -D "$@"; }
  run_cmd() { yarn "$@"; }
else
  core_install() { npm i "$@"; }
  dev_install() { npm i -D "$@"; }
  run_cmd() { npm run "$@"; }
fi

# ========= Core deps =========
echo "Installing dependencies..."
core_install \
  @apollo/client graphql \
  react-native-mmkv react-native-keychain \
  @react-navigation/native @react-navigation/native-stack @react-navigation/bottom-tabs \
  react-native-safe-area-context react-native-screens \
  react-native-svg react-native-gesture-handler

dev_install \
  @graphql-codegen/cli @graphql-codegen/typescript \
  @graphql-codegen/typescript-operations @graphql-codegen/typescript-graphql-request \
  @graphql-codegen/typescript-react-apollo \
  msw @mswjs/interceptors whatwg-fetch \
  @testing-library/react-native @testing-library/jest-native jest-environment-jsdom \
  jest jest-circus ts-jest identity-obj-proxy \
  detox \
  eslint @react-native/eslint-config eslint-config-prettier prettier \
  typescript

# ========= Rename app ids (android/ios minimal) =========
# Android
sed -i.bak "s/applicationId \".*\"/applicationId \"$APPLICATION_ID_ANDROID\"/g" android/app/build.gradle || true
# iOS (only display name for now)
plutil -replace CFBundleIdentifier -string "$BUNDLE_ID_IOS" ios/"$APP_NAME"/Info.plist 2>/dev/null || true

# ========= Scripts in package.json =========
node - <<'NODE'
const fs=require('fs'); const pkg=JSON.parse(fs.readFileSync('package.json','utf8'));
pkg.scripts = Object.assign(pkg.scripts||{},{
  "start":"react-native start",
  "android":"react-native run-android",
  "ios":"react-native run-ios",
  "clean":"rm -rf node_modules ios/Pods android/.gradle android/app/build .turbo .cache && yarn install",
  "lint":"eslint ./src --ext .ts,.tsx",
  "typecheck":"tsc --noEmit",
  "test":"jest",
  "test:watch":"jest --watch",
  "codegen":"graphql-codegen",
  "e2e:build":"detox build -c android.emu.release",
  "e2e:test":"detox test -c android.emu.release",
  "prepare":"husky install || true"
});
pkg.jest = {
  preset: "react-native",
  testEnvironment: "jsdom",
  setupFilesAfterEnv: ["<rootDir>/src/test/setup.ts"],
  moduleNameMapper: {
    "\\.(svg|png)$":"identity-obj-proxy",
    "^@/(.*)$":"<rootDir>/src/$1"
  },
  transformIgnorePatterns:[
    "node_modules/(?!(@react-native|react-native|react-native-mmkv|react-native-keychain|@react-navigation|react-native-svg)/)"
  ]
};
fs.writeFileSync('package.json',JSON.stringify(pkg,null,2));
NODE

# ========= TSConfig tweak =========
node - <<'NODE'
const fs=require('fs'); const ts=JSON.parse(fs.readFileSync('tsconfig.json','utf8'));
ts.compilerOptions.baseUrl=".";
ts.compilerOptions.paths={"@/*":["src/*"]};
fs.writeFileSync('tsconfig.json',JSON.stringify(ts,null,2));
NODE

# ========= Root dotfiles =========
write ".editorconfig" <<'EOF'
root = true
[*]
end_of_line = lf
insert_final_newline = true
charset = utf-8
indent_style = space
indent_size = 2
EOF

write ".gitattributes" <<'EOF'
*.pbxproj -text
*.png binary
*.jpg binary
EOF

write ".prettierrc" <<'EOF'
{
  "singleQuote": true,
  "trailingComma": "all",
  "printWidth": 100,
  "semi": true
}
EOF

write ".eslintrc.js" <<'EOF'
module.exports = {
  root: true,
  extends: ['@react-native', 'prettier'],
  parserOptions: { ecmaVersion: 2022, sourceType: 'module' },
  rules: { 'no-console': 'warn' }
};
EOF

write ".gitignore" <<'EOF'
node_modules
android/app/build
android/.gradle
ios/Pods
*.iml
.DS_Store
.env
EOF

write ".env.sample" <<'EOF'
# Copy to .env and fill values
GRAPHQL_URL=https://router.mirasys.dev/graphql
IAM_URL=https://iam.mirasys.dev
IAM_CLIENT_ID=YOUR_CLIENT_ID
IAM_CLIENT_SECRET=YOUR_CLIENT_SECRET
EOF

# ========= Source tree & baseline code =========
mkdir -p src

# --- app/App.tsx ---
write "src/app/App.tsx" <<'EOF'
import React from 'react';
import { NavigationProvider } from './providers/NavigationProvider';
import { ApolloGraphQLProvider } from './providers/ApolloProvider';
import { AuthProvider } from './providers/AuthProvider';
import { ThemeProvider } from './providers/ThemeProvider';
import { ToastProvider } from './providers/ToastProvider';

export default function App() {
  return (
    <ThemeProvider>
      <ToastProvider>
        <AuthProvider>
          <ApolloGraphQLProvider>
            <NavigationProvider />
          </ApolloGraphQLProvider>
        </AuthProvider>
      </ToastProvider>
    </ThemeProvider>
  );
}
EOF

# --- entry index.tsx switch to app/App.tsx ---
write "index.js" <<'EOF'
/**
 * RN entry. Wraps src/app/App.
 */
import {AppRegistry} from 'react-native';
import App from './src/app/App';
import {name as appName} from './app.json';
AppRegistry.registerComponent(appName, () => App);
EOF

# Providers
write "src/app/providers/NavigationProvider.tsx" <<'EOF'
import React from 'react';
import { NavigationContainer, DefaultTheme } from '@react-navigation/native';
import RootNavigator from '../navigation/RootNavigator';

const DarkTheme = {
  ...DefaultTheme,
  colors: { ...DefaultTheme.colors, background: '#000', card: '#000', text: '#fff', primary: '#84f16a' }
};

export const NavigationProvider = () => (
  <NavigationContainer theme={DarkTheme}>
    <RootNavigator />
  </NavigationContainer>
);
export default NavigationProvider;
EOF

write "src/app/providers/ApolloProvider.tsx" <<'EOF'
import React, { PropsWithChildren, useMemo } from 'react';
import { ApolloClient, ApolloProvider, InMemoryCache, HttpLink, from } from '@apollo/client';
import { authLink } from '@/lib/apollo/links/authLink';
import { errorLink } from '@/lib/apollo/links/errorLink';
import { retryLink } from '@/lib/apollo/links/retryLink';
import { typePolicies } from '@/features/profile-tree/cache/typePolicies';

const GRAPHQL_URL = process.env.GRAPHQL_URL || 'https://router.mirasys.dev/graphql';

export const ApolloGraphQLProvider = ({ children }: PropsWithChildren) => {
  const client = useMemo(() => {
    const httpLink = new HttpLink({ uri: GRAPHQL_URL });
    return new ApolloClient({
      link: from([errorLink, retryLink, authLink, httpLink]),
      cache: new InMemoryCache({ typePolicies }),
      defaultOptions: { watchQuery: { fetchPolicy: 'cache-and-network' } }
    });
  }, []);
  return <ApolloProvider client={client}>{children}</ApolloProvider>;
};
EOF

write "src/app/providers/AuthProvider.tsx" <<'EOF'
import React, { createContext, useContext, useEffect, useState } from 'react';
import * as Keychain from 'react-native-keychain';

type AuthContextType = {
  token: string | null;
  setToken: (t: string | null) => void;
  logout: () => Promise<void>;
};
const AuthContext = createContext<AuthContextType>({ token: null, setToken: () => {}, logout: async () => {} });

export const AuthProvider: React.FC<React.PropsWithChildren> = ({ children }) => {
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      const creds = await Keychain.getGenericPassword();
      if (creds) setToken(creds.password);
    })();
  }, []);

  const logout = async () => {
    await Keychain.resetGenericPassword();
    setToken(null);
  };

  return <AuthContext.Provider value={{ token, setToken, logout }}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);
EOF

write "src/app/providers/ToastProvider.tsx" <<'EOF'
import React from 'react';
import { View } from 'react-native';
export const ToastProvider: React.FC<React.PropsWithChildren> = ({ children }) => <View style={{ flex: 1 }}>{children}</View>;
EOF

write "src/app/providers/ThemeProvider.tsx" <<'EOF'
import React from 'react';
import { StatusBar } from 'react-native';
export const ThemeProvider: React.FC<React.PropsWithChildren> = ({ children }) => {
  return <>
    <StatusBar barStyle="light-content" backgroundColor="#000" />
    {children}
  </>;
};
EOF

# Navigation
write "src/app/navigation/RootNavigator.tsx" <<'EOF'
import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import AuthStack from './AuthStack';
import AppTabs from './AppTabs';
import { useAuth } from '../providers/AuthProvider';

const Stack = createNativeStackNavigator();

export default function RootNavigator() {
  const { token } = useAuth();
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {token ? <Stack.Screen name="App" component={AppTabs} /> : <Stack.Screen name="Auth" component={AuthStack} />}
    </Stack.Navigator>
  );
}
EOF

write "src/app/navigation/AuthStack.tsx" <<'EOF'
import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LoginScreen from '@/screens/Login/LoginScreen';
const Stack = createNativeStackNavigator();
export default function AuthStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} />
    </Stack.Navigator>
  );
}
EOF

write "src/app/navigation/AppTabs.tsx" <<'EOF'
import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import TreeScreen from '@/screens/Tree/TreeScreen';
import AccountScreen from '@/screens/Account/AccountScreen';
import { Text } from 'react-native';

const Tabs = createBottomTabNavigator();
export default function AppTabs() {
  return (
    <Tabs.Navigator screenOptions={{ headerStyle: { backgroundColor: '#000' }, headerTintColor: '#fff', tabBarStyle: { backgroundColor: '#000' }, tabBarActiveTintColor: '#84f16a', tabBarInactiveTintColor: '#aaa' }}>
      <Tabs.Screen name="Tree" component={TreeScreen} options={{ title: 'Profile Tree', tabBarIcon: () => <Text>🌿</Text> }} />
      <Tabs.Screen name="Account" component={AccountScreen} options={{ tabBarIcon: () => <Text>👤</Text> }} />
    </Tabs.Navigator>
  );
}
EOF

# Screens
write "src/screens/Login/LoginScreen.tsx" <<'EOF'
import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import * as Keychain from 'react-native-keychain';
import { useAuth } from '@/app/providers/AuthProvider';
import { generateToken } from '@/features/auth/api/iam.client';

export default function LoginScreen() {
  const { setToken } = useAuth();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [busy, setBusy] = useState(false);
  const onLogin = async () => {
    try {
      setBusy(true);
      const token = await generateToken(username, password);
      await Keychain.setGenericPassword('token', token);
      setToken(token);
    } catch (e) {
      console.warn('Login failed', e);
    } finally { setBusy(false); }
  };
  return (
    <View style={s.root}>
      <Text style={s.logo}>MIRASYS</Text>
      <TextInput style={s.input} placeholder="Username" placeholderTextColor="#666" onChangeText={setUsername} />
      <TextInput style={s.input} placeholder="Password" placeholderTextColor="#666" secureTextEntry onChangeText={setPassword} />
      <TouchableOpacity style={[s.btn, busy && { opacity: 0.7 }]} disabled={busy} onPress={onLogin}>
        <Text style={s.btnText}>{busy ? '...' : 'Login'}</Text>
      </TouchableOpacity>
    </View>
  );
}
const s = StyleSheet.create({
  root:{ flex:1, backgroundColor:'#000', padding:24, justifyContent:'center' },
  logo:{ color:'#84f16a', fontSize:28, marginBottom:24, fontWeight:'700' },
  input:{ backgroundColor:'#111', color:'#fff', padding:12, borderRadius:8, marginBottom:12, borderWidth:1, borderColor:'#222' },
  btn:{ backgroundColor:'#84f16a', padding:14, borderRadius:8, alignItems:'center' },
  btnText:{ color:'#000', fontWeight:'700' }
});
EOF

write "src/screens/Tree/TreeScreen.tsx" <<'EOF'
import React, { useCallback } from 'react';
import { View, Text, FlatList, ActivityIndicator } from 'react-native';
import { useListProfileNodesQuery } from '@/features/profile-tree/graphql/generated/graphql';
import NodeRow from './components/NodeRow';

export default function TreeScreen() {
  const { data, loading, fetchMore } = useListProfileNodesQuery({
    variables:{ first:50, order:[{ name:'ASC' }] }
  });

  const nodes = data?.listProfileNodes?.nodes ?? [];
  const pageInfo = data?.listProfileNodes?.pageInfo;

  const onEnd = useCallback(() => {
    if (pageInfo?.hasNextPage) {
      fetchMore({ variables: { after: pageInfo.endCursor, first: 50 } });
    }
  }, [pageInfo, fetchMore]);

  return (
    <View style={{ flex:1, backgroundColor:'#000' }}>
      {loading && nodes.length===0 ? <ActivityIndicator style={{ marginTop:24 }} /> : (
        <FlatList
          data={nodes}
          keyExtractor={(it)=>it.id}
          renderItem={({item})=> <NodeRow node={item} />}
          onEndReachedThreshold={0.5}
          onEndReached={onEnd}
        />
      )}
    </View>
  );
}
EOF

write "src/screens/Tree/components/NodeRow.tsx" <<'EOF'
import React, { useState } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import NodeChildrenList from './NodeChildrenList';
import NodeIcon from './NodeIcon';
import { ListProfileNodesQuery } from '@/features/profile-tree/graphql/generated/graphql';

type Node = NonNullable<ListProfileNodesQuery['listProfileNodes']>['nodes'][number];

export default function NodeRow({ node }: { node: Node }) {
  const [open, setOpen] = useState(false);
  const isFolder = node.kind === 'FOLDER';

  return (
    <View>
      <TouchableOpacity onPress={() => isFolder && setOpen((v) => !v)} style={{ padding:12, flexDirection:'row', alignItems:'center' }}>
        <NodeIcon kind={node.kind} />
        <Text style={{ color:'#fff', marginLeft:8, flex:1 }}>{node.name}</Text>
        {isFolder ? <Text style={{ color:'#84f16a' }}>{open? '▾':'▸'}</Text> : null}
      </TouchableOpacity>
      {open && isFolder && <NodeChildrenList parentId={node.id} />}
    </View>
  );
}
EOF

write "src/screens/Tree/components/NodeChildrenList.tsx" <<'EOF'
import React, { useCallback } from 'react';
import { View, FlatList, ActivityIndicator } from 'react-native';
import { useListProfileNodesQuery } from '@/features/profile-tree/graphql/generated/graphql';
import NodeRow from './NodeRow';

export default function NodeChildrenList({ parentId }: { parentId: string }) {
  const { data, loading, fetchMore } = useListProfileNodesQuery({
    variables:{ first:50, where:{ parentNodeId:{ eq: parentId } } }
  });
  const nodes = data?.listProfileNodes?.nodes ?? [];
  const pageInfo = data?.listProfileNodes?.pageInfo;

  const onEnd = useCallback(() => {
    if (pageInfo?.hasNextPage) {
      fetchMore({ variables: { after: pageInfo.endCursor, first: 50, where:{ parentNodeId:{ eq: parentId } } } });
    }
  }, [pageInfo, fetchMore, parentId]);

  if (loading && nodes.length===0) return <ActivityIndicator style={{ marginLeft:16 }} />;
  return (
    <View style={{ marginLeft:16 }}>
      <FlatList data={nodes} keyExtractor={(it)=>it.id} renderItem={({item})=> <NodeRow node={item} />} onEndReached={onEnd} onEndReachedThreshold={0.5}/>
    </View>
  );
}
EOF

write "src/screens/Tree/components/NodeIcon.tsx" <<'EOF'
import React from 'react';
import { Text } from 'react-native';
export default function NodeIcon({ kind }:{ kind: string }) {
  if (kind === 'FOLDER') return <Text style={{ color:'#fff' }}>📁</Text>;
  if (kind === 'VIDEO_CHANNEL') return <Text style={{ color:'#fff' }}>🎥</Text>;
  if (kind === 'DIGITAL_INPUT' || kind === 'DIGITAL_OUTPUT') return <Text style={{ color:'#fff' }}>🔌</Text>;
  return <Text style={{ color:'#fff' }}>📄</Text>;
}
EOF

write "src/screens/Account/AccountScreen.tsx" <<'EOF'
import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { useAuth } from '@/app/providers/AuthProvider';

export default function AccountScreen() {
  const { logout } = useAuth();
  return (
    <View style={{ flex:1, backgroundColor:'#000', padding:16 }}>
      <Text style={{ color:'#84f16a', fontSize:22, marginBottom:16 }}>Account</Text>
      <TouchableOpacity onPress={logout} style={{ backgroundColor:'#111', padding:12, borderRadius:8, borderColor:'#333', borderWidth:1 }}>
        <Text style={{ color:'#fff' }}>Logout</Text>
      </TouchableOpacity>
    </View>
  );
}
EOF

# Features: auth
write "src/features/auth/api/iam.client.ts" <<'EOF'
import { IAM_URL, IAM_CLIENT_ID, IAM_CLIENT_SECRET } from '@/lib/network/endpoints';

export async function generateToken(username: string, password: string): Promise<string> {
  const url = `${IAM_URL}/auth/generate-token`;
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ username, password, clientId: IAM_CLIENT_ID, clientSecret: IAM_CLIENT_SECRET })
  });
  if (!res.ok) throw new Error(`IAM ${res.status}`);
  const data = await res.json();
  return data.accessToken ?? data.token ?? '';
}
EOF

# Features: profile-tree GraphQL
write "src/features/profile-tree/graphql/fragments.graphql" <<'EOF'
fragment NodeBase on ProfileTreeNode {
  id
  name
  kind
  parentNodeId
}
EOF

write "src/features/profile-tree/graphql/listProfileNodes.graphql" <<'EOF'
query ListProfileNodes($first: Int, $after: String, $where: ProfileNodeFilterInput, $order: [ProfileNodeSortInput!]) {
  listProfileNodes(first: $first, after: $after, where: $where, order: $order) {
    nodes {
      ...NodeBase
      ... on VideoChannelNode { componentId }
      ... on DigitalInputNode { componentId }
      ... on DigitalOutputNode { componentId }
    }
    pageInfo { hasNextPage endCursor }
  }
}
EOF

write "codegen.yml" <<'EOF'
schema:
  - ${GRAPHQL_URL}
documents:
  - "src/features/profile-tree/graphql/**/*.graphql"
generates:
  src/features/profile-tree/graphql/generated/:
    preset: client
    plugins:
      - typescript
      - typescript-operations
      - typescript-react-apollo
    config:
      withHooks: true
      scalars:
        Long: number
        DateTime: string
EOF

# cache type policies
write "src/features/profile-tree/cache/typePolicies.ts" <<'EOF'
import { TypePolicies } from '@apollo/client';

export const typePolicies: TypePolicies = {
  Query: {
    fields: {
      listProfileNodes: {
        keyArgs: ["where", "order"],
        merge(existing = { nodes: [], pageInfo: {} }, incoming) {
          const nodes = [...(existing.nodes||[]), ...(incoming.nodes||[])];
          return { ...incoming, nodes };
        }
      }
    }
  }
};
EOF

# lib/apollo links
write "src/lib/apollo/links/authLink.ts" <<'EOF'
import { setContext } from '@apollo/client/link/context';
import * as Keychain from 'react-native-keychain';

export const authLink = setContext(async (_, { headers }) => {
  const creds = await Keychain.getGenericPassword();
  const token = creds?.password;
  return { headers: { ...headers, ...(token ? { Authorization: `Bearer ${token}` } : {}) } };
});
EOF

write "src/lib/apollo/links/errorLink.ts" <<'EOF'
import { onError } from '@apollo/client/link/error';

export const errorLink = onError(({ graphQLErrors, networkError }) => {
  if (graphQLErrors) graphQLErrors.forEach(e => console.warn('[GraphQL]', e.message));
  if (networkError) console.warn('[Network]', networkError.message);
});
EOF

write "src/lib/apollo/links/retryLink.ts" <<'EOF'
import { RetryLink } from '@apollo/client/link/retry';
export const retryLink = new RetryLink({ attempts: { max: 2 } });
EOF

# lib/network
write "src/lib/network/endpoints.ts" <<'EOF'
export const GRAPHQL_URL = process.env.GRAPHQL_URL || 'https://router.mirasys.dev/graphql';
export const IAM_URL = process.env.IAM_URL || 'https://iam.mirasys.dev';
export const IAM_CLIENT_ID = process.env.IAM_CLIENT_ID || '';
export const IAM_CLIENT_SECRET = process.env.IAM_CLIENT_SECRET || '';
EOF

# test setup
write "src/test/setup.ts" <<'EOF'
import '@testing-library/jest-native/extend-expect';
EOF

# simple test
write "src/screens/Tree/TreeScreen.test.tsx" <<'EOF'
import React from 'react';
import { render } from '@testing-library/react-native';
import TreeScreen from './TreeScreen';
test('renders tree screen container', () => {
  const { toJSON } = render(<TreeScreen />);
  expect(toJSON()).toBeTruthy();
});
EOF

# GitHub CI
write ".github/workflows/ci.yml" <<'EOF'
name: CI
on: [push, pull_request]
jobs:
  lint-test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with: { node-version: '18' }
      - run: corepack enable
      - run: yarn install --frozen-lockfile
      - run: yarn typecheck
      - run: yarn lint
      - run: yarn test --ci
EOF

# Fastlane skeleton
write "fastlane/Fastfile" <<'EOF'
default_platform(:android)
platform :android do
  desc "Build release APK"
  lane :build do
    gradle(task: "assembleRelease")
  end
end
EOF

write "fastlane/Appfile" <<'EOF'
json_key_file("play-credentials.json")
EOF

# Detox config
write ".detoxrc.json" <<'EOF'
{
  "testRunner": "jest",
  "runnerConfig": "e2e/init.js",
  "apps": {
    "android.emu.release": {
      "type": "android.apk",
      "binaryPath": "android/app/build/outputs/apk/release/app-release.apk",
      "build": "cd android && ./gradlew assembleRelease && cd .."
    }
  },
  "devices": {
    "android.emu": { "type": "android.emulator", "device": { "avdName": "Pixel_5_API_34" } }
  },
  "configurations": {
    "android.emu.release": { "device": "android.emu", "app": "android.emu.release" }
  }
}
EOF

write "e2e/init.js" <<'EOF'
const detox = require('detox');
const { detox: config } = require('../package.json');
beforeAll(async () => { await detox.init(); }, 300000);
afterAll(async () => { await detox.cleanup(); });
EOF

# README minimal
write "README.md" <<'EOF'
# Mirasys Profile Tree (React Native + TypeScript)

## Quick start
```bash
cp .env.sample .env
yarn install
yarn codegen
yarn android   # or yarn ios
