import { Layout } from "@/components/layout/Layout";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

export default function Admin() {
  const { isAdmin, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && !isAdmin) {
      navigate("/");
    }
  }, [isAdmin, loading, navigate]);

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-2">Admin Panel</h1>
        <p className="text-muted-foreground mb-8">Manage users and opportunities</p>
        <div className="glass rounded-2xl p-12 text-center">
          <p className="text-muted-foreground">Admin features coming soon!</p>
        </div>
      </div>
    </Layout>
  );
}
