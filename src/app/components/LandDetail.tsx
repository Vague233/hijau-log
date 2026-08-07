import { useState, useEffect } from "react";
import { useParams, Link } from "react-router";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { MapPin, Calendar, FileText, ArrowLeft, QrCode, Trees, Leaf } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { supabase } from "../../lib/supabase";
import { toast } from "sonner";

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

export function LandDetail() {
  const { id } = useParams();
  const [land, setLand] = useState<Land | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLand = async () => {
      if (!id) return;
      try {
        const { data, error } = await supabase
          .from("lahan")
          .select("*")
          .eq("id", id)
          .single();

        if (error) throw error;
        setLand(data);
      } catch (error: any) {
        toast.error(`Gagal memuat detail lahan: ${error.message}`);
      } finally {
        setLoading(false);
      }
    };

    fetchLand();
  }, [id]);

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto py-12">
        <Card className="bg-white/5 backdrop-blur-xl border-white/10 shadow-2xl text-white">
          <CardContent className="py-12 text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-400 mx-auto mb-4"></div>
            <p className="text-white/70 font-outfit">Memuat detail lahan...</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!land) {
    return (
      <div className="max-w-md mx-auto py-12">
        <Card className="bg-white/5 backdrop-blur-xl border-white/10 shadow-2xl text-white">
          <CardContent className="py-12 text-center">
            <p className="text-white/90 mb-6 font-outfit text-lg">Data lahan tidak ditemukan</p>
            <Link to="/dashboard/lands">
              <Button className="bg-emerald-600 hover:bg-emerald-700 text-white rounded-full px-8 transition-colors">Kembali ke Database</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-8 max-w-5xl mx-auto space-y-8 font-sans">
      <div>
        <div className="mb-6 -ml-4">
          <Link to="/dashboard/lands">
            <Button variant="ghost" className="text-white/70 hover:text-white hover:bg-white/10 rounded-[1rem] px-4 py-2 h-auto font-outfit">
              <ArrowLeft className="size-4 mr-2" />
              Kembali ke Daftar Lahan
            </Button>
          </Link>
        </div>

        <div className="mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-emerald-500/10 rounded-2xl border border-emerald-500/20 backdrop-blur-md hidden sm:flex">
                <Leaf className="size-8 text-emerald-400" />
              </div>
              <div>
                <h1 className="text-3xl md:text-4xl font-serif font-bold text-white mb-1">{land.nama_lahan}</h1>
                <p className="text-white/60 flex items-center gap-2 font-outfit text-sm">
                  <MapPin className="size-4" />
                  {land.lokasi}
                </p>
              </div>
            </div>
            <Link to={`/dashboard/land/${id}/qr`}>
              <Button className="bg-emerald-600 hover:bg-emerald-700 text-white border-0 shadow-lg shadow-emerald-900/50 rounded-full px-6 transition-all duration-300">
                <QrCode className="size-4 mr-2" />
                Buat Kode QR
              </Button>
            </Link>
          </div>

          <Tabs defaultValue="overview" className="space-y-6">
            <TabsList className="grid w-full grid-cols-2 h-14 bg-white/[0.03] backdrop-blur-[40px] border border-white/10 rounded-[2rem] p-1 shadow-2xl">
              <TabsTrigger value="overview" className="data-[state=active]:bg-white/10 data-[state=active]:text-white data-[state=active]:shadow-sm text-white/60 font-medium rounded-full transition-all duration-300">Overview Lahan</TabsTrigger>
              <TabsTrigger value="compliance" className="data-[state=active]:bg-white/10 data-[state=active]:text-white data-[state=active]:shadow-sm text-white/60 font-medium rounded-full transition-all duration-300">Kepatuhan EUDR</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-6">
              <Card className="bg-white/[0.03] backdrop-blur-[40px] border-white/10 shadow-2xl rounded-[2.5rem] overflow-hidden text-white">
                <CardHeader>
                  <CardTitle className="font-serif text-2xl">Informasi Lahan</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-1">
                      <p className="text-sm font-mono tracking-widest text-emerald-400/80 uppercase">Nama Lahan</p>
                      <p className="font-medium text-lg text-white font-outfit">{land.nama_lahan}</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm font-mono tracking-widest text-emerald-400/80 uppercase">Lokasi</p>
                      <p className="font-medium text-lg text-white font-outfit">{land.lokasi}</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm font-mono tracking-widest text-emerald-400/80 uppercase">Komoditas & Spesies</p>
                      <p className="font-medium text-lg text-white font-outfit">
                        {land.jenis_komoditas || "-"} <span className="text-sm italic text-white/50">({land.nama_ilmiah || "-"})</span>
                      </p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm font-mono tracking-widest text-emerald-400/80 uppercase">Tanggal Panen</p>
                      <p className="font-medium text-lg text-white font-outfit">
                        {land.tanggal_panen ? new Date(land.tanggal_panen).toLocaleDateString("id-ID", { year: "numeric", month: "long", day: "numeric" }) : "-"}
                      </p>
                    </div>
                    {land.luas != null && (
                      <div className="space-y-1">
                        <p className="text-sm font-mono tracking-widest text-emerald-400/80 uppercase">Luas Area</p>
                        <p className="font-medium text-lg text-white font-outfit flex items-center gap-2">
                          {land.luas} Hektar
                        </p>
                      </div>
                    )}
                    {land.jumlah_pohon != null && (
                      <div className="space-y-1">
                        <p className="text-sm font-mono tracking-widest text-emerald-400/80 uppercase">Estimasi Pohon</p>
                        <p className="font-medium text-lg text-white font-outfit flex items-center gap-2">
                          <Trees className="size-4 text-white/50" />
                          {land.jumlah_pohon} Pohon
                        </p>
                      </div>
                    )}
                    <div className="space-y-1">
                      <p className="text-sm font-mono tracking-widest text-emerald-400/80 uppercase">Tanggal Terdaftar</p>
                      <p className="font-medium text-lg text-white font-outfit">
                        {new Date(land.created_at).toLocaleDateString("id-ID", {
                          year: "numeric",
                          month: "long",
                          day: "numeric"
                        })}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {land.foto && (
                <Card className="bg-white/[0.03] backdrop-blur-[40px] border-white/10 shadow-2xl rounded-[2.5rem] overflow-hidden text-white">
                  <CardHeader>
                    <CardTitle className="font-serif text-2xl">Foto Lahan</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="relative group overflow-hidden rounded-2xl border border-white/10">
                      <img src={land.foto} alt="Foto Lahan" className="w-full max-h-96 object-cover transition-transform duration-700 group-hover:scale-105" />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    </div>
                  </CardContent>
                </Card>
              )}

              <Card className="bg-white/[0.03] backdrop-blur-[40px] border-white/10 shadow-2xl rounded-[2.5rem] overflow-hidden text-white">
                <CardHeader>
                  <CardTitle className="font-serif text-2xl">Data Geo-Lokasi (Poligon)</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {land.polygon ? (
                    <div className="bg-black/40 rounded-2xl p-6 text-center border border-white/10 relative overflow-hidden group">
                      <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                      <MapPin className="size-8 mx-auto mb-4 text-emerald-400" />
                      <p className="text-sm text-white/60 mb-3 font-outfit">
                        Data Koordinat Tersimpan:
                      </p>
                      <p className="font-mono text-sm text-emerald-300 bg-black/60 p-4 rounded-xl border border-white/5 break-all shadow-inner">
                        {typeof land.polygon === 'string' ? land.polygon : JSON.stringify(land.polygon)}
                      </p>
                    </div>
                  ) : (
                    <div className="bg-black/40 rounded-2xl p-8 text-center border border-white/10">
                      <MapPin className="size-8 mx-auto mb-4 text-white/20" />
                      <p className="text-white/50 font-outfit">Data koordinat poligon tidak tersedia.</p>
                    </div>
                  )}
                </CardContent>
              </Card>
          </TabsContent>

          <TabsContent value="compliance" className="space-y-6">
            <Card className="bg-white/[0.03] backdrop-blur-[40px] border-white/10 shadow-2xl rounded-[2.5rem] overflow-hidden text-white">
                <CardHeader>
                  <CardTitle className="font-serif text-2xl text-emerald-400">Status Kepatuhan EUDR</CardTitle>
                  <CardDescription className="text-white/60 font-outfit">
                    Pengecekan Kepatuhan Regulasi Deforestasi Uni Eropa (EUDR)
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-4 bg-black/40 rounded-xl border border-emerald-500/20 backdrop-blur-sm">
                      <span className="text-sm font-medium text-white/90">Data Geo-lokasi (Poligon)</span>
                      <span className={`font-medium ${land.polygon && Array.isArray(land.polygon) && land.polygon.length >= 3 ? 'text-emerald-400' : 'text-amber-400'}`}>
                        {land.polygon && Array.isArray(land.polygon) && land.polygon.length >= 3 ? "✓ Lengkap (Poligon)" : land.polygon ? "⚠ Titik (Bukan Poligon)" : "⚠ Tidak Ada"}
                      </span>
                    </div>
                    <div className="flex items-center justify-between p-4 bg-black/40 rounded-xl border border-emerald-500/20 backdrop-blur-sm">
                      <span className="text-sm font-medium text-white/90">Luas Lahan</span>
                      <span className={`font-medium ${land.luas > 0 ? 'text-emerald-400' : 'text-amber-400'}`}>
                        {land.luas > 0 ? "✓ Lengkap" : "⚠ Tidak Ada"}
                      </span>
                    </div>
                    <div className="flex items-center justify-between p-4 bg-black/40 rounded-xl border border-emerald-500/20 backdrop-blur-sm">
                      <span className="text-sm font-medium text-white/90">Dokumen Legalitas</span>
                      <span className={`font-medium ${!land.dokumen_legalitas ? 'text-red-400' : (land.status_verifikasi === 'pending' || !land.status_verifikasi) ? 'text-amber-400' : 'text-emerald-400'}`}>
                        {!land.dokumen_legalitas ? "⚠ Tidak Ada" : (land.status_verifikasi === 'pending' || !land.status_verifikasi) ? "⏳ Sedang Diverifikasi" : "✓ Tersedia & Valid"}
                      </span>
                    </div>
                    <div className="flex items-center justify-between p-4 bg-black/40 rounded-xl border border-emerald-500/20 backdrop-blur-sm">
                      <span className="text-sm font-medium text-white/90">Deklarasi Bebas Deforestasi</span>
                      <span className={`font-medium ${!land.bebas_deforestasi ? 'text-red-400' : (land.status_verifikasi === 'pending' || !land.status_verifikasi) ? 'text-amber-400' : 'text-emerald-400'}`}>
                        {!land.bebas_deforestasi ? "⚠ Belum Disetujui" : (land.status_verifikasi === 'pending' || !land.status_verifikasi) ? "⏳ Sedang Diverifikasi" : "✓ Disetujui"}
                      </span>
                    </div>
                    <div className="flex items-center justify-between p-4 bg-emerald-500/10 rounded-xl border border-emerald-500/30 backdrop-blur-sm">
                      <span className="text-sm font-medium text-emerald-100">QR Code Sistem Keterlacakan</span>
                      <Link to={`/dashboard/land/${id}/qr`}>
                        <span className="text-emerald-400 font-bold hover:text-emerald-300 transition-colors flex items-center gap-1">
                          Lihat QR <ArrowLeft className="size-4 rotate-180" />
                        </span>
                      </Link>
                    </div>
                  </div>

                  <div className="pt-6 border-t border-white/10 mt-6">
                    <h4 className="font-serif text-lg text-white/90 mb-4">Persyaratan Dokumen EUDR:</h4>
                    <ul className="text-sm text-white/60 space-y-3 font-outfit">
                      <li className="flex items-start gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 mt-1.5"></div>
                        Pernyataan Uji Tuntas (Due Diligence Statement - DDS)
                      </li>
                      <li className="flex items-start gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 mt-1.5"></div>
                        Bukti legalitas lahan (Sertifikat/SKT)
                      </li>
                      <li className="flex items-start gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 mt-1.5"></div>
                        Data koordinat poligon akurasi tinggi
                      </li>
                      <li className="flex items-start gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 mt-1.5"></div>
                        Informasi waktu panen / produksi
                      </li>
                    </ul>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
    </div>
  );
}
