import "bootstrap/dist/css/bootstrap.min.css";
import AppLayout from "./Layout/AppLayout";
import AppRouter from "./routes/AppRouter";
import "./assets/fonts.css";

function App() {
  return (
    <div style={{ fontFamily: "HakgyoansimBunpilR" }}>
      <AppLayout>
        <AppRouter />
      </AppLayout>
    </div>
  );
}

export default App;
