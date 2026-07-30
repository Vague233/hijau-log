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
  polygon: string;
  created_at: string;
  foto?: string;
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
      <div className="container mx-auto px-4 py-8">
        <Card className="border-emerald-100 shadow-sm">
          <CardContent className="py-12 text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Memuat detail lahan...</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!land) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card className="border-emerald-100 shadow-sm">
          <CardContent className="py-12 text-center">
            <p>Data lahan tidak ditemukan</p>
            <Link to="/dashboard/lands">
              <Button className="mt-4 bg-emerald-600 hover:bg-emerald-700">Kembali ke Daftar</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-6 flex flex-col sm:flex-row sm:items-center gap-4">
          <Link to="/dashboard/lands">
            <Button variant="outline" size="sm" className="border-emerald-200 text-emerald-700 hover:bg-emerald-50">
              <ArrowLeft className="size-4 mr-2" />
              Kembali
            </Button>
          </Link>
          <div className="flex-1 flex items-center gap-2">
            <Leaf className="size-8 text-emerald-600 hidden sm:block" />
            <div>
              <h1 className="text-3xl font-bold text-gray-900">{land.nama_lahan}</h1>
              <p className="text-gray-600">{land.lokasi}</p>
            </div>
          </div>
          <Link to={`/dashboard/land/${id}/qr`}>
            <Button className="bg-emerald-600 hover:bg-emerald-700">
              <QrCode className="size-4 mr-2" />
              Buat Kode QR
            </Button>
          </Link>
        </div>

        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="overview">Overview Lahan</TabsTrigger>
            <TabsTrigger value="compliance">Kepatuhan EUDR</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <Card className="border-emerald-100 shadow-sm">
              <CardHeader>
                <CardTitle>Informasi Lahan</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Nama Lahan</p>
                    <p className="font-medium text-lg text-gray-900">{land.nama_lahan}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Lokasi</p>
                    <p className="font-medium text-lg text-gray-900">{land.lokasi}</p>
                  </div>
                  {land.luas != null && (
                    <div>
                      <p className="text-sm text-gray-500 mb-1">Luas Area</p>
                      <p className="font-medium text-lg text-gray-900">{land.luas} Hektar</p>
                    </div>
                  )}
                  {land.jumlah_pohon != null && (
                    <div>
                      <p className="text-sm text-gray-500 mb-1">Estimasi Jumlah Pohon</p>
                      <p className="font-medium text-lg text-gray-900">{land.jumlah_pohon} Pohon</p>
                    </div>
                  )}
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Tanggal Terdaftar</p>
                    <p className="font-medium text-lg text-gray-900">
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
              <Card className="border-emerald-100 shadow-sm">
                <CardHeader>
                  <CardTitle>Foto Lahan</CardTitle>
                </CardHeader>
                <CardContent>
                  <img src={land.foto} alt="Foto Lahan" className="w-full max-h-96 object-cover rounded-lg border border-gray-200" />
                </CardContent>
              </Card>
            )}

            <Card className="border-emerald-100 shadow-sm">
              <CardHeader>
                <CardTitle>Data Geo-Lokasi (Poligon)</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {land.polygon ? (
                  <div className="bg-emerald-50 rounded-lg p-6 text-center border border-emerald-100">
                    <MapPin className="size-8 mx-auto mb-3 text-emerald-600" />
                    <p className="text-sm text-emerald-800 mb-2">
                      Data Koordinat Tersimpan:
                    </p>
                    <p className="font-mono text-sm text-gray-700 bg-white p-2 rounded border break-all">
                      {land.polygon}
                    </p>
                  </div>
                ) : (
                  <div className="bg-gray-50 rounded-lg p-6 text-center border border-gray-200">
                    <p className="text-gray-500">Data koordinat poligon tidak tersedia.</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="compliance" className="space-y-6">
            <Card className="border-emerald-100 shadow-sm">
              <CardHeader>
                <CardTitle>Status Kepatuhan EUDR</CardTitle>
                <CardDescription>
                  Pengecekan Kepatuhan Regulasi Deforestasi Uni Eropa (EUDR)
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg border border-green-100">
                    <span className="text-sm font-medium text-green-900">Data Geo-lokasi (Poligon)</span>
                    <span className="text-green-600 font-medium">
                      {land.polygon ? "✓ Lengkap" : "⚠ Tidak Ada"}
                    </span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg border border-green-100">
                    <span className="text-sm font-medium text-green-900">Luas Lahan</span>
                    <span className="text-green-600 font-medium">
                      {land.luas > 0 ? "✓ Lengkap" : "⚠ Tidak Ada"}
                    </span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-emerald-50 rounded-lg border border-emerald-100">
                    <span className="text-sm font-medium text-emerald-900">QR Code Sistem Keterlacakan</span>
                    <Link to={`/dashboard/land/${id}/qr`}>
                      <span className="text-emerald-700 font-bold hover:underline">
                        Lihat QR →
                      </span>
                    </Link>
                  </div>
                </div>

                <div className="pt-6 border-t mt-6">
                  <h4 className="font-bold text-gray-900 mb-3">Persyaratan Dokumen EUDR:</h4>
                  <ul className="text-sm text-gray-700 space-y-2 list-disc list-inside">
                    <li>Pernyataan Uji Tuntas (Due Diligence Statement - DDS)</li>
                    <li>Bukti legalitas lahan (Sertifikat/SKT)</li>
                    <li>Data koordinat poligon akurasi tinggi</li>
                    <li>Informasi waktu panen / produksi</li>
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
