import { BrowserRouter, Routes, Route } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "react-hot-toast";
import { Header, ErrorBoundary } from "@/components";
import {
  HomePage,
  RepositoryDetailsPage,
  FavoritesPage,
  LoginPage,
  SignupPage,
  DashboardPage,
} from "@/pages";
import { AuthProvider } from "@/context/AuthContext";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 2,
      refetchOnWindowFocus: false,
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <BrowserRouter>
          <ErrorBoundary>
            <div className="min-h-screen bg-background">
              <Header />
              <main>
                <Routes>
                  <Route path="/" element={<HomePage />} />
                  <Route path="/login" element={<LoginPage />} />
                  <Route path="/signup" element={<SignupPage />} />
                  <Route path="/dashboard" element={<DashboardPage />} />
                  <Route
                    path="/repo/:owner/:repo"
                    element={<RepositoryDetailsPage />}
                  />
                  <Route path="/favorites" element={<FavoritesPage />} />
                </Routes>
              </main>
            </div>
          </ErrorBoundary>
        </BrowserRouter>
        <Toaster position="top-right" />
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
