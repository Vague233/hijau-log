import { useState, useEffect } from "react";
import { Link } from "react-router";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { MapPin, Trees, QrCode, Eye, Leaf, Maximize, CheckCircle2, AlertTriangle, FileText, ChevronRight, PlusCircle, Clock } from "lucide-react";
import { supabase } from "../../lib/supabase";
import { useAuth } from "../../lib/AuthContext";
import { toast } from "sonner";
import { isLandCompliant } from "../../lib/compliance";

interface Land {
  id: string;
  nama_lahan: string;
  lokasi: string;
  luas: number;
  jumlah_pohon: number;
  polygon: any;
  created_at: string;
  foto?: string;
  tanggal_panen?: string;
  jenis_komoditas?: string;
  nama_ilmiah?: string;
  dokumen_legalitas?: string;
  bebas_deforestasi?: boolean;
  status_verifikasi?: string;
}

export function LandList() {
  const { session } = useAuth();
  const [lands, setLands] = useState<Land[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLands = async () => {
      if (!session?.user) return;
      
      try {
        const { data, error } = await supabase
          .from("lahan")
          .select("*")
          .eq('user_id', session.user.id)
          .order('created_at', { ascending: false });

        if (error) throw error;
        setLands(data || []);
      } catch (error: any) {
        toast.error(`Gagal memuat data: ${error.message}`);
      } finally {
        setLoading(false);
      }
    };

    fetchLands();
  }, [session]);

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Header Banner - Pure Neutral Glassmorphism */}
      <div className="relative overflow-hidden p-8 md:p-12 bg-white/[0.03] backdrop-blur-[40px] border border-white/10 rounded-[2.5rem] shadow-2xl">
        <div className="relative z-10 flex flex-col md:flex-row md:items-end justify-between gap-8">
          <div className="flex-1 min-w-0">
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 border border-white/20 text-[10px] font-mono uppercase tracking-[0.2em] text-white font-semibold mb-6 shadow-lg backdrop-blur-md">
              SaaS Traceability Workspace
            </span>
            <h1 className="text-4xl md:text-6xl font-sans font-bold text-white mb-5 tracking-tight">
              Database Lahan.
            </h1>
            <p className="text-sm md:text-base text-white/60 font-outfit max-w-2xl leading-relaxed">
              Daftar seluruh bidang lahan terdaftar beserta status kepatuhan EUDR. Kelola geolokasi, data pohon, dan dokumen legalitas di sini.
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 shrink-0">
            <Link to="/dashboard/add-land" className="w-full sm:w-auto">
              <Button className="w-full h-12 bg-emerald-500 hover:bg-emerald-400 text-black font-semibold rounded-2xl px-6 text-sm font-sans tracking-wide shadow-[0_0_20px_-5px_rgba(16,185,129,0.5)] transition-all">
                <PlusCircle className="size-4 mr-2.5" />
                Tambah Lahan
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-pulse">
           <div className="h-[26rem] bg-white/[0.03] backdrop-blur-[40px] rounded-[2.5rem] border border-white/10"></div>
           <div className="h-[26rem] bg-white/[0.03] backdrop-blur-[40px] rounded-[2.5rem] border border-white/10"></div>
           <div className="h-[26rem] bg-white/[0.03] backdrop-blur-[40px] rounded-[2.5rem] border border-white/10"></div>
        </div>
      ) : lands.length === 0 ? (
        <Card className="bg-white/[0.03] backdrop-blur-[40px] border-white/10 shadow-2xl text-white rounded-[2.5rem] overflow-hidden">
          <CardContent className="py-20 text-center">
            <div className="p-6 bg-white/5 backdrop-blur-md rounded-3xl w-fit mx-auto text-white border border-white/10 mb-8 shadow-inner">
                <Trees className="size-12 opacity-50" />
            </div>
            <h3 className="text-2xl font-sans font-bold text-white mb-3 tracking-tight">Belum Ada Lahan Terdaftar</h3>
            <p className="text-sm text-white/40 max-w-md mx-auto leading-relaxed mb-8">
                Mulai dengan mendaftarkan bidang lahan pertama Anda untuk audit geolokasi.
            </p>
            <Link to="/dashboard/add-land">
              <Button className="bg-emerald-500 hover:bg-emerald-400 text-black font-semibold rounded-2xl px-8 h-12 text-sm transition-all shadow-lg">
                  <PlusCircle className="size-4 mr-2.5" /> Registrasi Lahan
              </Button>
            </Link>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {lands.map((land) => {
            const compliant = isLandCompliant(land);

            const missingItems: string[] = [];
            if (land.luas > 4 && (!Array.isArray(land.polygon) || land.polygon.length < 3)) {
              missingItems.push("Poligon < 3 titik");
            } else if (land.luas <= 4 && (!Array.isArray(land.polygon) || land.polygon.length < 1)) {
              missingItems.push("Geolokasi belum diisi");
            }
            if (!land.dokumen_legalitas) missingItems.push("Legalitas belum ada");
            if (!land.bebas_deforestasi) missingItems.push("Bebas deforestasi belum");
            if (!land.jenis_komoditas || !land.nama_ilmiah) missingItems.push("Komoditas belum lengkap");

            return (
              <Card key={land.id} className="group hover:shadow-2xl transition-all duration-500 bg-white/[0.03] backdrop-blur-[40px] border-white/10 shadow-xl text-white rounded-[2.5rem] overflow-hidden flex flex-col justify-between">
                <CardHeader className="p-6 border-b border-white/5">
                  <div className="flex justify-between items-start gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="mb-4">
                        {compliant ? (
                          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[10px] font-mono uppercase tracking-widest bg-emerald-500 text-black font-semibold">
                            <CheckCircle2 className="size-3.5" /> Compliant
                          </span>
                        ) : (land.status_verifikasi === 'pending' || !land.status_verifikasi) ? (
                          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[10px] font-mono uppercase tracking-widest bg-amber-500 text-black font-semibold">
                            <Clock className="size-3.5" /> Pending Verification
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[10px] font-mono uppercase tracking-widest bg-white/10 text-white border border-white/20">
                            <AlertTriangle className="size-3.5" /> Non-Compliant
                          </span>
                        )}
                      </div>
                      <CardTitle className="text-xl font-sans font-bold text-white tracking-tight truncate">{land.nama_lahan}</CardTitle>
                      <CardDescription className="mt-2 text-white/50 text-sm font-outfit flex items-center gap-1.5 truncate">
                        <MapPin className="size-3.5 opacity-70" /> {land.lokasi}
                      </CardDescription>
                    </div>
                    {land.foto ? (
                      <img src={land.foto} alt="Foto Lahan" className="w-16 h-16 object-cover rounded-2xl border border-white/10 flex-shrink-0" />
                    ) : (
                      <div className="w-16 h-16 bg-white/5 rounded-2xl border border-white/10 flex items-center justify-center flex-shrink-0">
                        <MapPin className="size-6 text-white/30" />
                      </div>
                    )}
                  </div>
                </CardHeader>

                <CardContent className="p-6 flex-1 flex flex-col">
                  <div className="space-y-3 flex-1">
                    <div className="flex items-center justify-between text-sm font-outfit text-white/80 border-b border-white/5 pb-3">
                      <span className="flex items-center gap-2 text-white/50">
                        <Maximize className="size-4" /> Luas Area
                      </span>
                      <span className="font-mono bg-white/10 px-2 py-1 rounded-md text-white border border-white/10">{land.luas} Ha</span>
                    </div>

                    <div className="flex items-center justify-between text-sm font-outfit text-white/80 border-b border-white/5 pb-3">
                      <span className="flex items-center gap-2 text-white/50">
                        <Leaf className="size-4" /> Komoditas
                      </span>
                      <span className="truncate max-w-[120px]">{land.jenis_komoditas || "-"}</span>
                    </div>

                    <div className="flex items-center justify-between text-sm font-outfit text-white/80 border-b border-white/5 pb-3">
                      <span className="flex items-center gap-2 text-white/50">
                        <Trees className="size-4" /> Est. Pohon
                      </span>
                      <span className="font-mono">{land.jumlah_pohon ? land.jumlah_pohon.toLocaleString("id-ID") : "-"}</span>
                    </div>
                  </div>

                  {!compliant && missingItems.length > 0 && (
                    <div className="mt-4 p-4 bg-white/5 rounded-2xl border border-white/10 text-xs font-outfit space-y-2">
                      <span className="font-semibold text-white/70 block uppercase tracking-wider font-mono text-[10px]">Syarat Belum Terpenuhi:</span>
                      <ul className="list-none space-y-1">
                        {missingItems.map((item, idx) => (
                          <li key={idx} className="text-white/50 flex items-start gap-2">
                            <span className="text-white/20 mt-0.5">•</span> 
                            <span className="line-clamp-1">{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  <div className="pt-6 mt-auto flex gap-3">
                    <Link to={`/dashboard/land/${land.id}`} className="flex-1">
                      <Button variant="outline" className="w-full h-10 border-white/20 text-white hover:bg-white/10 hover:text-white bg-transparent rounded-xl text-xs font-sans font-semibold transition-all">
                        <Eye className="size-3.5 mr-2" /> Detail
                      </Button>
                    </Link>
                    <Link to={`/dashboard/land/${land.id}/qr`} className="flex-[0.5]">
                      <Button className="w-full h-10 bg-white hover:bg-gray-200 text-black border-0 rounded-xl text-xs font-sans font-semibold transition-all">
                        <QrCode className="size-4" />
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}