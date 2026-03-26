import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Home from "./pages/Home";
import LiveSpeaker from "./pages/LiveSpeaker";
import Pronouncer from "./pages/Pronouncer";
import HearAndType from "./pages/HearAndType";
import Mistakes from "./pages/Mistakes";
import Dueling from "./pages/Dueling";
import DuelingChallenge from "./pages/DuelingChallenge";
import Profile from "./pages/Profile";
import Login from "./pages/Login";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/live-speaker" element={<LiveSpeaker />} />
          <Route path="/pronouncer" element={<Pronouncer />} />
          <Route path="/hear-and-type" element={<HearAndType />} />
          <Route path="/mistakes" element={<Mistakes />} />
          <Route path="/dueling" element={<Dueling />} />
          <Route path="/dueling/challenge/:id" element={<DuelingChallenge />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/login" element={<Login />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
