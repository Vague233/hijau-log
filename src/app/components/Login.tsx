import { useState } from "react";
import { Link, useNavigate } from "react-router";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { MapPin } from "lucide-react";
import { supabase } from "../../lib/supabase";
import { toast } from "sonner";

export function Login() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({
      email: formData.email,
      password: formData.password,
    });

    if (error) {
      toast.error(error.message);
      setLoading(false);
    } else {
      toast.success("Login berhasil!");
      navigate("/");
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div className="relative min-h-[100dvh] flex items-center justify-center overflow-hidden font-sans pt-24 pb-12 px-4">
      {/* Background Image with Gradient Overlay */}
      <div className="absolute inset-0 z-0 animate-in fade-in duration-1000">
        <img 
          src="https://images.unsplash.com/photo-1448375240586-882707db888b?q=80&w=2000&auto=format&fit=crop" 
          alt="Dark Forest" 
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-[#2E4036]/90 to-black/80 backdrop-blur-sm"></div>
      </div>

      <div className="relative z-10 w-full max-w-md animate-in fade-in slide-in-from-bottom-8 duration-700 flex flex-col items-center">
        <Card className="w-full bg-white/5 border-white/10 shadow-2xl backdrop-blur-md rounded-3xl overflow-hidden text-white">
          <CardHeader className="space-y-1 pt-8 pb-4">
            <div className="flex items-center justify-center mb-4">
              <div className="flex items-center gap-2 text-[var(--color-moss)]">
                <MapPin className="size-8" />
                <span className="text-2xl font-bold tracking-tight text-white">HijauLog</span>
              </div>
            </div>
            <CardTitle className="text-2xl text-center font-serif italic text-[var(--color-cream)]">
              Selamat Datang Kembali
            </CardTitle>
            <CardDescription className="text-center text-white/60 font-outfit">
              Masukkan kredensial Anda untuk mengakses instrumen telemetri.
            </CardDescription>
          </CardHeader>
          <CardContent className="px-8 pb-8">
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-white/80">Email</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="anda@contoh.com"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="bg-white/5 border-white/10 text-white placeholder:text-white/30 focus-visible:ring-[var(--color-moss)]"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password" className="text-white/80">Kata Sandi</Label>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  className="bg-white/5 border-white/10 text-white placeholder:text-white/30 focus-visible:ring-[var(--color-moss)]"
                />
              </div>
              <Button type="submit" className="w-full bg-[var(--color-moss)] hover:bg-[#3A4F41] text-white rounded-full py-6 mt-4 transition-all duration-300 hover:shadow-lg hover:shadow-[var(--color-moss)]/20" disabled={loading}>
                {loading ? "Memproses..." : "Masuk ke Sistem"}
              </Button>
            </form>
          </CardContent>
          <CardFooter className="flex flex-col space-y-2 pb-8 bg-black/20 border-t border-white/5 pt-6">
            <div className="text-sm text-center text-white/60 font-outfit">
              Belum memiliki akses?{" "}
              <Link
                to="/register"
                className="text-[var(--color-cream)] hover:text-white transition-colors hover:underline font-semibold"
              >
                Daftar di sini
              </Link>
            </div>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}