import { useState } from "react";
import { Link, useNavigate } from "react-router";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "./ui/card";
import { MapPin } from "lucide-react";
import { supabase } from "../../lib/supabase";
import { toast } from "sonner";

export function Register() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      toast.error("Kata sandi tidak cocok!");
      return;
    }

    setLoading(true);
    const { error } = await supabase.auth.signUp({
      email: formData.email,
      password: formData.password,
      options: {
        data: {
          full_name: formData.fullName,
        },
      },
    });

    if (error) {
      toast.error(error.message);
      setLoading(false);
    } else {
      toast.success("Pendaftaran berhasil! Silakan cek email atau langsung masuk.");
      navigate("/");
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
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
        {/* Back Button */}
        <Link to="/access" className="self-start mb-6 inline-flex items-center gap-2 text-white/50 hover:text-white transition-colors font-outfit text-sm px-4 py-2 rounded-full hover:bg-white/5">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m12 19-7-7 7-7"/><path d="M19 12H5"/></svg>
          Kembali ke Gerbang Akses
        </Link>

        <Card className="w-full bg-white/5 border-white/10 shadow-2xl backdrop-blur-md rounded-3xl overflow-hidden text-white">
          <CardHeader className="space-y-1 pt-8 pb-4">
            <div className="flex items-center justify-center mb-4">
              <div className="flex items-center gap-2 text-[var(--color-clay)]">
                <MapPin className="size-8" />
                <span className="text-2xl font-bold tracking-tight text-white">HijauLog</span>
              </div>
            </div>
            <CardTitle className="text-2xl text-center font-serif italic text-[var(--color-cream)]">Buat Akun</CardTitle>
            <CardDescription className="text-center text-white/60 font-outfit">
              Masukkan informasi Anda untuk bergabung dengan platform kami.
            </CardDescription>
          </CardHeader>
          <CardContent className="px-8 pb-8">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="fullName" className="text-white/80">Nama Lengkap</Label>
                <Input
                  id="fullName"
                  name="fullName"
                  placeholder="Nama Anda"
                  value={formData.fullName}
                  onChange={handleChange}
                  required
                  className="bg-white/5 border-white/10 text-white placeholder:text-white/30 focus-visible:ring-[var(--color-clay)]"
                />
              </div>
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
                  className="bg-white/5 border-white/10 text-white placeholder:text-white/30 focus-visible:ring-[var(--color-clay)]"
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
                  className="bg-white/5 border-white/10 text-white placeholder:text-white/30 focus-visible:ring-[var(--color-clay)]"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirmPassword" className="text-white/80">Konfirmasi Kata Sandi</Label>
                <Input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  placeholder="••••••••"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  required
                  className="bg-white/5 border-white/10 text-white placeholder:text-white/30 focus-visible:ring-[var(--color-clay)]"
                />
              </div>
              <Button type="submit" className="w-full bg-[var(--color-clay)] hover:bg-[#b05d43] text-white rounded-full py-6 mt-6 transition-all duration-300 hover:shadow-lg hover:shadow-[var(--color-clay)]/20" disabled={loading}>
                {loading ? "Memproses..." : "Daftar Sekarang"}
              </Button>
            </form>
          </CardContent>
          <CardFooter className="flex flex-col space-y-2 pb-8 bg-black/20 border-t border-white/5 pt-6">
            <div className="text-sm text-center text-white/60 font-outfit">
              Sudah punya akun?{" "}
              <Link to="/login" className="text-[var(--color-cream)] hover:text-white transition-colors hover:underline font-semibold">
                Masuk di sini
              </Link>
            </div>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}