import { DashboardLayout } from "@/components/DashboardLayout";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

const PlaceholderIndex = () => (
  <DashboardLayout>
    <div className="page-container flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-2xl font-semibold text-foreground mb-2">Welcome</h1>
        <Link to="/" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground">
          Go to Dashboard <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    </div>
  </DashboardLayout>
);

const Index = PlaceholderIndex;
export default Index;
