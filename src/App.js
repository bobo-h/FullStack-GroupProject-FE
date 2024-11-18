import "bootstrap/dist/css/bootstrap.min.css";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import AppLayout from "./Layout/AppLayout";
import AppRouter from "./routes/AppRouter";
import ToastMessage from "./common/components/ToastMessage";
import "./assets/fonts.css";

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <div style={{ fontFamily: "HakgyoansimBunpilR" }}>
        <ToastMessage />
        <AppLayout>
          <AppRouter />
        </AppLayout>
      </div>
    </QueryClientProvider>
  );
}

export default App;
