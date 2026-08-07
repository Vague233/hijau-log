import { useState, useEffect } from "react";
import { Link } from "react-router";
import { 
  Trees, 
  PlusCircle, 
  FileSpreadsheet, 
  ShieldCheck, 
  ChevronRight,
  MapPin,
  AlertTriangle,
  CheckCircle2,
  ArrowRight,
  FileCheck,
  Compass,
  Sparkles,
  Layers,
  ArrowUpRight
} from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { supabase } from "../../lib/supabase";
import { isLandCompliant } from "../../lib/compliance";

interface Land {
  id: string;
  nama_lahan: string;
  lokasi: string;
  luas: number;
  jumlah_pohon: number;
  polygon: any;
  created_at: string;
  jenis_komoditas?: string;
  nama_ilmiah?: string;
  dokumen_legalitas?: string;
  bebas_deforestasi?: boolean;
}

export function DashboardOverview() {
  const [lands, setLands] = useState<Land[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLands = async () => {
      try {
        const { data, error } = await supabase
          .from("lahan")
          .select("*")
          .order("created_at", { ascending: false });

        if (error) throw error;
        setLands(data || []);
      } catch (err: any) {
        console.error("Error fetching lands for overview:", err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchLands();
  }, []);

  const totalTrees = lands.reduce((acc, land) => acc + (land.jumlah_pohon || 0), 0);
  const totalArea = lands.reduce((acc, land) => acc + (land.luas || 0), 0);
  const compliantLandsCount = lands.filter(isLandCompliant).length;
  const compliancePercentage = lands.length > 0 ? Math.round((compliantLandsCount / lands.length) * 100) : 0;

  const recentLands = lands.slice(0, 5);

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto space-y-6 animate-pulse">
        <div className="h-36 bg-white/5 rounded-3xl border border-white/10"></div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="h-36 bg-white/5 rounded-3xl border border-white/10"></div>
          <div className="h-36 bg-white/5 rounded-3xl border border-white/10"></div>
          <div className="h-36 bg-white/5 rounded-3xl border border-white/10"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-8 relative font-sans">
      {/* Background Ambient Glow Accents for Enhanced Glassmorphism */}
      <div className="absolute -top-20 -left-20 w-96 h-96 bg-emerald-500/15 rounded-full blur-[100px] pointer-events-none"></div>
      <div className="absolute top-1/3 -right-20 w-96 h-96 bg-teal-500/10 rounded-full blur-[120px] pointer-events-none"></div>

      {/* Header Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-slate-900/60 backdrop-blur-2xl border border-emerald-500/30 p-6 md:p-8 shadow-[0_8px_32px_0_rgba(0,0,0,0.5)] group hover:border-emerald-500/50 transition-all duration-300">
        {/* Subtle inner background gradient */}
        <div className="absolute inset-0 bg-gradient-to-r from-emerald-950/40 via-emerald-900/10 to-transparent pointer-events-none"></div>
        
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex-1 min-w-0 space-y-2">
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-mono uppercase tracking-wider font-semibold bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 shadow-inner">
                <Sparkles className="size-3 text-emerald-400 animate-pulse" />
                SaaS Traceability Workspace
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight text-white font-sans">
              Ringkasan Kepatuhan EUDR
            </h1>
            <p className="text-sm text-white/70 font-outfit max-w-xl leading-relaxed">
              Pantau statistik geolokasi bidang lahan, jumlah pohon terdaftar, dan pemenuhan regulasi uji tuntas secara real-time.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 shrink-0 md:ml-auto">
            <Link to="/dashboard/add-land">
              <Button className="w-full sm:w-auto bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-400 hover:to-emerald-500 text-white font-semibold rounded-full px-6 py-2.5 text-sm shadow-lg shadow-emerald-950/60 hover:shadow-emerald-500/20 hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 border border-emerald-400/30 flex items-center justify-center">
                <PlusCircle className="size-4 mr-2" />
                Tambah Lahan
              </Button>
            </Link>
            <Link to="/dashboard/export">
              <Button variant="outline" className="w-full sm:w-auto bg-white/10 hover:bg-white/15 text-white font-medium border border-white/20 hover:border-emerald-400/40 rounded-full px-6 py-2.5 text-sm backdrop-blur-md hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 flex items-center justify-center">
                <FileSpreadsheet className="size-4 mr-2 text-emerald-400" />
                Laporan EUDR
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Onboarding Wizard Checklist (for new users or when compliance < 100%) */}
      {compliancePercentage < 100 && (
        <Card className="relative overflow-hidden bg-slate-900/60 backdrop-blur-2xl border border-white/15 text-white shadow-[0_8px_32px_0_rgba(0,0,0,0.5)] rounded-3xl">
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-emerald-500 via-teal-400 to-emerald-600"></div>
          <CardHeader className="pb-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center gap-2.5 text-emerald-400">
                <div className="p-2 bg-emerald-500/15 rounded-xl border border-emerald-500/30">
                  <Compass className="size-5" />
                </div>
                <div>
                  <span className="text-[11px] font-mono uppercase tracking-wider font-bold text-emerald-400 block">
                    Panduan Mulai Cepat Eksportir
                  </span>
                  <CardTitle className="text-xl font-bold tracking-tight text-white font-sans mt-0.5">
                    Alur Persiapan Ekspor Uni Eropa (EUDR)
                  </CardTitle>
                </div>
              </div>
              <span className="text-xs font-mono font-semibold bg-emerald-500/15 text-emerald-300 px-3.5 py-1.5 rounded-full border border-emerald-500/30 self-start sm:self-center shadow-inner">
                Progres: {lands.length === 0 ? "0/3 Langkah" : compliantLandsCount < lands.length ? "2/3 Langkah" : "3/3 Langkah"}
              </span>
            </div>
            <CardDescription className="text-white/70 text-xs font-outfit mt-1">
              Ikuti 3 langkah mudah di bawah ini untuk memastikan produk hasil lahan Anda lolos uji tuntas EUDR sebelum dikirim ke Eropa.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-1">
              {/* Step 1 */}
              <div className={`p-4 rounded-2xl border transition-all duration-300 flex flex-col justify-between ${lands.length > 0 ? 'bg-emerald-950/40 border-emerald-500/30 shadow-md shadow-emerald-950/30' : 'bg-white/[0.04] border-white/10 hover:border-white/20'}`}>
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="size-8 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 font-mono text-xs flex items-center justify-center font-bold shadow-inner">
                      1
                    </span>
                    {lands.length > 0 ? (
                      <span className="text-[10px] font-mono bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 px-2.5 py-1 rounded-full flex items-center gap-1 font-semibold">
                        <CheckCircle2 className="size-3 text-emerald-400" /> Selesai
                      </span>
                    ) : (
                      <span className="text-[10px] font-mono bg-amber-500/20 text-amber-300 border border-amber-500/40 px-2.5 py-1 rounded-full font-semibold">
                        Perlu Tindakan
                      </span>
                    )}
                  </div>
                  <h4 className="font-bold text-sm text-white mb-1 font-sans">Tambah Bidang Lahan</h4>
                  <p className="text-xs text-white/60 font-outfit mb-4 leading-relaxed">
                    Registrasikan lokasi kebun, luas hektar, dan pemetaan poligon geolokasi.
                  </p>
                </div>
                <Link to="/dashboard/add-land">
                  <Button size="sm" className="w-full text-xs font-semibold bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl shadow-md transition-all">
                    Tambah Lahan <ArrowRight className="size-3.5 ml-1.5" />
                  </Button>
                </Link>
              </div>

              {/* Step 2 */}
              <div className={`p-4 rounded-2xl border transition-all duration-300 flex flex-col justify-between ${compliantLandsCount > 0 ? 'bg-emerald-950/40 border-emerald-500/30 shadow-md shadow-emerald-950/30' : 'bg-white/[0.04] border-white/10 hover:border-white/20'}`}>
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="size-8 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 font-mono text-xs flex items-center justify-center font-bold shadow-inner">
                      2
                    </span>
                    {compliantLandsCount === lands.length && lands.length > 0 ? (
                      <span className="text-[10px] font-mono bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 px-2.5 py-1 rounded-full flex items-center gap-1 font-semibold">
                        <CheckCircle2 className="size-3 text-emerald-400" /> Selesai
                      </span>
                    ) : (
                      <span className="text-[10px] font-mono bg-amber-500/20 text-amber-300 border border-amber-500/40 px-2.5 py-1 rounded-full font-semibold">
                        Perlu Perhatian
                      </span>
                    )}
                  </div>
                  <h4 className="font-bold text-sm text-white mb-1 font-sans">Lengkapi Sertifikasi Legalitas</h4>
                  <p className="text-xs text-white/60 font-outfit mb-4 leading-relaxed">
                    Unggah dokumen legal (SHM/SKT) & nyatakan deklarasi bebas deforestasi.
                  </p>
                </div>
                <Link to="/dashboard/lands">
                  <Button size="sm" variant="outline" className="w-full text-xs font-medium border-white/20 text-white hover:bg-white/10 bg-transparent rounded-xl transition-all">
                    Cek Database Lahan <ChevronRight className="size-3.5 ml-1 text-emerald-400" />
                  </Button>
                </Link>
              </div>

              {/* Step 3 */}
              <div className={`p-4 rounded-2xl border transition-all duration-300 flex flex-col justify-between ${compliancePercentage === 100 ? 'bg-emerald-950/40 border-emerald-500/30 shadow-md shadow-emerald-950/30' : 'bg-white/[0.04] border-white/10 hover:border-white/20'}`}>
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="size-8 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 font-mono text-xs flex items-center justify-center font-bold shadow-inner">
                      3
                    </span>
                    {compliancePercentage === 100 ? (
                      <span className="text-[10px] font-mono bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 px-2.5 py-1 rounded-full flex items-center gap-1 font-semibold">
                        <CheckCircle2 className="size-3 text-emerald-400" /> Siap Ekspor
                      </span>
                    ) : (
                      <span className="text-[10px] font-mono bg-white/10 text-white/60 border border-white/10 px-2.5 py-1 rounded-full font-semibold">
                        Belum Siap
                      </span>
                    )}
                  </div>
                  <h4 className="font-bold text-sm text-white mb-1 font-sans">Generate Berkas DDS & QR Code</h4>
                  <p className="text-xs text-white/60 font-outfit mb-4 leading-relaxed">
                    Unduh berkas Uji Tuntas (DDS) & ekspor format JSON/CSV EUDR.
                  </p>
                </div>
                <Link to="/dashboard/export">
                  <Button size="sm" variant="outline" className="w-full text-xs font-medium border-white/20 text-white hover:bg-white/10 bg-transparent rounded-xl transition-all">
                    Buka Fitur Ekspor <FileCheck className="size-3.5 ml-1.5 text-emerald-400" />
                  </Button>
                </Link>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* 3 Metric Tiles */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Metric 1 */}
        <Card className="bg-slate-900/60 backdrop-blur-2xl border border-white/15 shadow-[0_8px_32px_0_rgba(0,0,0,0.5)] text-white rounded-3xl hover:border-emerald-500/40 transition-all duration-300 group">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-semibold font-sans uppercase tracking-wider text-white/60">
              Total Bidang Lahan
            </CardTitle>
            <div className="p-3 bg-emerald-500/15 rounded-2xl text-emerald-400 border border-emerald-500/30 group-hover:scale-110 group-hover:border-emerald-400/50 transition-all shadow-md">
              <Trees className="size-5" />
            </div>
          </CardHeader>
          <CardContent className="space-y-1">
            <div className="text-3xl lg:text-4xl font-extrabold text-white font-sans tracking-tight">
              {lands.length}
            </div>
            <p className="text-xs text-white/60 font-outfit">
              Total Luas: <span className="text-emerald-400 font-mono font-semibold">{totalArea.toFixed(2)} Ha</span>
            </p>
          </CardContent>
        </Card>

        {/* Metric 2 */}
        <Card className="bg-slate-900/60 backdrop-blur-2xl border border-white/15 shadow-[0_8px_32px_0_rgba(0,0,0,0.5)] text-white rounded-3xl hover:border-emerald-500/40 transition-all duration-300 group">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-semibold font-sans uppercase tracking-wider text-white/60">
              Estimasi Pohon Terdaftar
            </CardTitle>
            <div className="p-3 bg-emerald-500/15 rounded-2xl text-emerald-400 border border-emerald-500/30 group-hover:scale-110 group-hover:border-emerald-400/50 transition-all shadow-md">
              <Layers className="size-5" />
            </div>
          </CardHeader>
          <CardContent className="space-y-1">
            <div className="text-3xl lg:text-4xl font-extrabold text-white font-sans tracking-tight">
              {totalTrees.toLocaleString("id-ID")}
            </div>
            <p className="text-xs text-white/60 font-outfit">
              Tercatat dalam sistem keterlacakan
            </p>
          </CardContent>
        </Card>

        {/* Metric 3 */}
        <Card className="bg-slate-900/60 backdrop-blur-2xl border border-white/15 shadow-[0_8px_32px_0_rgba(0,0,0,0.5)] text-white rounded-3xl hover:border-emerald-500/40 transition-all duration-300 group">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-semibold font-sans uppercase tracking-wider text-white/60">
              Tingkat Kepatuhan EUDR
            </CardTitle>
            <div className="p-3 bg-emerald-500/15 rounded-2xl text-emerald-400 border border-emerald-500/30 group-hover:scale-110 group-hover:border-emerald-400/50 transition-all shadow-md">
              <ShieldCheck className="size-5" />
            </div>
          </CardHeader>
          <CardContent className="space-y-1">
            <div className={`text-3xl lg:text-4xl font-extrabold font-sans tracking-tight ${compliancePercentage === 100 ? 'text-emerald-400' : compliancePercentage >= 50 ? 'text-amber-400' : 'text-rose-400'}`}>
              {compliancePercentage}%
            </div>
            <p className="text-xs text-white/60 font-outfit">
              {compliantLandsCount} dari {lands.length} lahan memenuhi standar EUDR
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Recent Lands Table */}
      <Card className="bg-slate-900/60 backdrop-blur-2xl border border-white/15 shadow-[0_8px_32px_0_rgba(0,0,0,0.5)] text-white rounded-3xl overflow-hidden">
        <CardHeader className="flex flex-row items-center justify-between pb-4">
          <div>
            <CardTitle className="text-xl font-bold font-sans tracking-tight text-white">Database Lahan Terbaru</CardTitle>
            <CardDescription className="text-white/60 text-xs font-outfit mt-0.5">
              5 bidang lahan yang paling baru terdaftar di platform
            </CardDescription>
          </div>
          <Link to="/dashboard/lands">
            <Button variant="ghost" size="sm" className="text-emerald-400 hover:text-emerald-300 hover:bg-emerald-500/10 text-xs font-semibold rounded-xl">
              Lihat Semua <ChevronRight className="size-4 ml-1" />
            </Button>
          </Link>
        </CardHeader>
        <CardContent>
          {recentLands.length === 0 ? (
            <div className="text-center py-12 text-white/50 text-sm font-outfit space-y-3">
              <div className="p-4 bg-white/5 rounded-full w-fit mx-auto text-emerald-400 border border-white/10">
                <Trees className="size-8" />
              </div>
              <p className="text-white/80 font-medium">Belum ada lahan terdaftar</p>
              <p className="text-xs text-white/50 max-w-md mx-auto">
                Silakan tambahkan lahan pertama Anda untuk memulai pengumpulan koordinat geolokasi dan sertifikasi uji tuntas EUDR.
              </p>
              <Link to="/dashboard/add-land" className="inline-block mt-2">
                <Button className="bg-emerald-600 hover:bg-emerald-500 text-white rounded-full px-6 text-xs font-semibold shadow-md">
                  <PlusCircle className="size-4 mr-2" /> Tambah Lahan Pertama
                </Button>
              </Link>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="text-[11px] font-mono uppercase tracking-wider text-white/50 border-b border-white/10">
                  <tr>
                    <th className="py-3 px-4">Nama Lahan</th>
                    <th className="py-3 px-4">Lokasi</th>
                    <th className="py-3 px-4">Komoditas</th>
                    <th className="py-3 px-4">Luas (Ha)</th>
                    <th className="py-3 px-4">Status EUDR</th>
                    <th className="py-3 px-4 text-right">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5 font-outfit">
                  {recentLands.map((land) => {
                    const compliant = isLandCompliant(land);
                    return (
                      <tr key={land.id} className="hover:bg-white/[0.04] transition-colors">
                        <td className="py-3.5 px-4 font-semibold text-white font-sans">
                          {land.nama_lahan}
                        </td>
                        <td className="py-3.5 px-4 text-white/70">
                          <span className="flex items-center gap-1.5">
                            <MapPin className="size-3.5 text-emerald-400" />
                            {land.lokasi}
                          </span>
                        </td>
                        <td className="py-3.5 px-4 text-white/80">
                          {land.jenis_komoditas || "-"}
                        </td>
                        <td className="py-3.5 px-4 font-mono text-emerald-300 font-semibold">
                          {land.luas} Ha
                        </td>
                        <td className="py-3.5 px-4">
                          {compliant ? (
                            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 shadow-inner">
                              <CheckCircle2 className="size-3.5 text-emerald-400" /> Compliant
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-amber-500/15 text-amber-300 border border-amber-500/30 shadow-inner">
                              <AlertTriangle className="size-3.5 text-amber-400" /> Non-Compliant
                            </span>
                          )}
                        </td>
                        <td className="py-3.5 px-4 text-right">
                          <Link to={`/dashboard/land/${land.id}`}>
                            <Button size="sm" variant="ghost" className="h-8 px-3 text-xs text-white/80 hover:text-emerald-300 hover:bg-emerald-500/15 border border-transparent hover:border-emerald-500/30 rounded-xl transition-all">
                              Detail <ArrowUpRight className="size-3.5 ml-1 text-emerald-400" />
                            </Button>
                          </Link>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
