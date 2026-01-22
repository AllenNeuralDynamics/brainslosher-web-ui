import { BrowserRouter } from "react-router-dom";
import { AppRouter } from "./router.tsx";
import { AppProvider } from "./provider.tsx";
import MainLayout from "@/components/layouts/MainLayout.tsx";
import { GlobalApiError } from "@/components/globalApiError/GlobalApiError.tsx";

const App = () => {
  return (
    <GlobalApiError>
      <AppProvider>
        <BrowserRouter>
          <MainLayout>
            <AppRouter />
          </MainLayout>
        </BrowserRouter>
      </AppProvider>
    </GlobalApiError>
  );
};

export default App;
