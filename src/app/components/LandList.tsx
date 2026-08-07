import { useState, useEffect } from "react";
import { Link } from "react-router";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { MapPin, Trees, QrCode, Eye, Leaf, Maximize, CheckCircle2, AlertTriangle, FileText } from "lucide-react";
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
    <div className="max-w-6xl mx-auto space-y-6 text-white font-sans">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-emerald-500/10 rounded-2xl border border-emerald-500/20 text-emerald-400 hidden md:block">
            <Trees className="size-6" />
          </div>
          <div>
            <h1 className="text-2xl md:text-3xl font-serif font-bold text-white">Database Lahan Kepatuhan</h1>
            <p className="text-white/70 text-xs font-outfit">Daftar bidang lahan terdaftar & indikator status kepatuhan EUDR</p>
          </div>
        </div>
        <Link to="/dashboard/add-land">
          <Button className="bg-emerald-600 hover:bg-emerald-700 text-white rounded-full px-5 text-xs shadow-lg shadow-emerald-950/50">
            <MapPin className="size-4 mr-2" />
            Tambah Lahan Baru
          </Button>
        </Link>
      </div>

      {loading ? (
        <Card className="bg-white/5 backdrop-blur-lg border-white/10 shadow-xl text-white">
          <CardContent className="py-12 text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-400 mx-auto mb-4"></div>
            <p className="text-white/70 text-sm font-outfit">Memuat data lahan...</p>
          </CardContent>
        </Card>
      ) : lands.length === 0 ? (
        <Card className="bg-white/5 backdrop-blur-lg border-white/10 shadow-xl text-white">
          <CardContent className="py-12 text-center">
            <MapPin className="size-12 mx-auto mb-4 text-emerald-400/50" />
            <h3 className="text-xl mb-2 font-serif text-white">Belum Ada Lahan Terdaftar</h3>
            <p className="text-white/70 mb-6 text-sm font-outfit">Mulai dengan mendaftarkan bidang lahan pertama Anda untuk audit geolokasi.</p>
            <Link to="/dashboard/add-land">
              <Button className="bg-emerald-600 hover:bg-emerald-700 text-white rounded-full px-6 text-sm">Tambah Lahan Baru</Button>
            </Link>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {lands.map((land) => {
            const compliant = isLandCompliant(land);

            // Deteksi syarat yang belum terpenuhi untuk tooltip/badge penjelasan
            const missingItems: string[] = [];
            if (land.luas > 4 && (!Array.isArray(land.polygon) || land.polygon.length < 3)) {
              missingItems.push("Poligon < 3 titik (Lahan > 4 Ha wajib poligon)");
            } else if (land.luas <= 4 && (!Array.isArray(land.polygon) || land.polygon.length < 1)) {
              missingItems.push("Titik koordinat geolokasi belum diisi");
            }
            if (!land.dokumen_legalitas) missingItems.push("Dokumen legalitas lahan belum diunggah");
            if (!land.bebas_deforestasi) missingItems.push("Deklarasi bebas deforestasi belum disetujui");
            if (!land.jenis_komoditas || !land.nama_ilmiah) missingItems.push("Nama spesies komoditas resmi belum diisi");

            return (
              <Card key={land.id} className="hover:shadow-2xl transition-all bg-white/5 backdrop-blur-lg border-white/10 shadow-xl text-white flex flex-col justify-between">
                <CardHeader className="pb-3">
                  <div className="flex justify-between items-start gap-3">
                    <div className="flex-1">
                      <div className="mb-2">
                        {compliant ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-mono font-medium bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                            <CheckCircle2 className="size-3 text-emerald-400" /> EUDR Compliant
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-mono font-medium bg-amber-500/20 text-amber-300 border border-amber-500/30" title={missingItems.join(", ")}>
                            <AlertTriangle className="size-3 text-amber-400" /> Non-Compliant ({missingItems.length} Syarat Belum)
                          </span>
                        )}
                      </div>
                      <CardTitle className="text-lg font-serif text-white">{land.nama_lahan}</CardTitle>
                      <CardDescription className="mt-0.5 text-white/70 text-xs flex items-center gap-1">
                        <MapPin className="size-3 text-emerald-400" /> {land.lokasi}
                      </CardDescription>
                    </div>
                    {land.foto ? (
                      <img src={land.foto} alt="Foto Lahan" className="w-16 h-16 object-cover rounded-xl border border-white/10 flex-shrink-0" />
                    ) : (
                      <div className="w-16 h-16 bg-white/5 rounded-xl border border-white/10 flex items-center justify-center flex-shrink-0">
                        <MapPin className="size-6 text-white/30" />
                      </div>
                    )}
                  </div>
                </CardHeader>

                <CardContent className="space-y-4 pt-0">
                  <div className="space-y-2 text-xs font-outfit bg-white/5 p-3 rounded-xl border border-white/5">
                    <div className="flex items-center justify-between text-white/80">
                      <span className="flex items-center gap-1.5 text-white/60">
                        <Maximize className="size-3.5 text-emerald-400" /> Luas Area:
                      </span>
                      <span className="font-mono text-emerald-300 font-semibold">{land.luas} Ha</span>
                    </div>

                    <div className="flex items-center justify-between text-white/80">
                      <span className="flex items-center gap-1.5 text-white/60">
                        <Leaf className="size-3.5 text-emerald-400" /> Komoditas:
                      </span>
                      <span>{land.jenis_komoditas || "-"}</span>
                    </div>

                    <div className="flex items-center justify-between text-white/80">
                      <span className="flex items-center gap-1.5 text-white/60">
                        <Trees className="size-3.5 text-emerald-400" /> Est. Pohon:
                      </span>
                      <span className="font-mono">{land.jumlah_pohon ? land.jumlah_pohon.toLocaleString("id-ID") : "-"}</span>
                    </div>

                    <div className="flex items-center justify-between text-white/80">
                      <span className="flex items-center gap-1.5 text-white/60">
                        <FileText className="size-3.5 text-emerald-400" /> Dokumen Legal:
                      </span>
                      <span>{land.dokumen_legalitas ? <span className="text-emerald-400">Ada (Teraplikasi)</span> : <span className="text-amber-400">Belum Ada</span>}</span>
                    </div>
                  </div>

                  {/* Warning Details box if Non-Compliant */}
                  {!compliant && missingItems.length > 0 && (
                    <div className="p-2.5 bg-amber-500/10 rounded-xl border border-amber-500/20 text-[11px] text-amber-200/90 font-outfit space-y-1">
                      <span className="font-semibold text-amber-300 block">Kekurangan Syarat EUDR:</span>
                      <ul className="list-disc list-inside space-y-0.5">
                        {missingItems.map((item, idx) => (
                          <li key={idx} className="line-clamp-1">{item}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  <div className="pt-2 flex gap-2">
                    <Link to={`/dashboard/land/${land.id}`} className="flex-1">
                      <Button variant="outline" className="w-full border-white/20 text-white hover:bg-white/10 bg-transparent rounded-xl text-xs" size="sm">
                        <Eye className="size-3.5 mr-1.5" /> Detail
                      </Button>
                    </Link>
                    <Link to={`/dashboard/land/${land.id}/qr`} className="flex-1">
                      <Button className="w-full bg-emerald-600 hover:bg-emerald-700 text-white border-0 rounded-xl text-xs" size="sm">
                        <QrCode className="size-3.5 mr-1.5" /> Kode QR
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