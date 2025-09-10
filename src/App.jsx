import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { CatalogueProvider } from "./context/CatalogueContext";
import { JewelleryProvider } from "./context/JewelleryContext";
import Login from "./components/Login";
import AdminDashboard from "./pages/AdminDashboard";
import UserDashboard from "./pages/UserDashboard";
import ItemDetail from "./pages/ItemDetail";
import { useAuth } from "./context/AuthContext";

function AppContent() {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-500"></div>
      </div>
    );
  }

  if (!user) {
    return <Login />;
  }

  return (
    <Routes>
      <Route
        path="/"
        element={user.role === "admin" ? <AdminDashboard /> : <UserDashboard />}
      />
      <Route path="/item/:id" element={<ItemDetail />} />
    </Routes>
  );
}

function App() {
  return (
    <AuthProvider>
      <CatalogueProvider>
        <JewelleryProvider>
          <Router>
            <AppContent />
          </Router>
        </JewelleryProvider>
      </CatalogueProvider>
    </AuthProvider>
  );
}

export default App;
