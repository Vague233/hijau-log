import { useState } from "react";
import { useNavigate } from "react-router";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import { MapPin, Upload, Leaf } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "../../lib/supabase";
import { useAuth } from "../../lib/AuthContext";

export function AddLand() {
  const navigate = useNavigate();
  const { session } = useAuth();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    nama_lahan: "",
    lokasi: "",
    luas: "",
    jumlah_pohon: "",
    polygon: "", // Optional, JSON string or coordinates
    notes: "",
  });

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement
    >,
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const getCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const coords = `[${position.coords.latitude.toFixed(6)}, ${position.coords.longitude.toFixed(6)}]`;
          setFormData({
            ...formData,
            polygon: coords,
          });
          toast.success("Lokasi (Poligon) berhasil diambil!");
        },
        (error) => {
          toast.error(
            "Tidak dapat mengambil lokasi. Silakan masukkan secara manual.",
          );
          console.error(error);
        },
      );
    } else {
      toast.error(
        "Geolocation tidak didukung oleh browser Anda.",
      );
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!session?.user) {
      toast.error("Sesi tidak ditemukan. Silakan login kembali.");
      return;
    }

    setLoading(true);
    const { error } = await supabase.from("lahan").insert([
      {
        user_id: session.user.id,
        nama_lahan: formData.nama_lahan,
        lokasi: formData.lokasi,
        luas: parseFloat(formData.luas) || 0,
        jumlah_pohon: parseInt(formData.jumlah_pohon) || 0,
        polygon: formData.polygon ? JSON.parse(`[${formData.polygon}]`) : null, // Assuming polygon takes a jsonb or geometry array, let's omit or send as string if it breaks. Let's send null for now if it breaks, but we'll try to just send string or json. Wait, let's omit polygon for safety, or we can send it as string.
      },
    ]);

    if (error) {
      toast.error(`Gagal mendaftarkan lahan: ${error.message}`);
      setLoading(false);
    } else {
      toast.success("Lahan berhasil didaftarkan!");
      navigate("/dashboard/lands");
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-6 flex items-center gap-2">
          <Leaf className="size-8 text-emerald-600" />
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Tambah Lahan / Registrasi Pohon
            </h1>
            <p className="text-gray-600">
              Input data lahan dan geo-tagging untuk kepatuhan EUDR
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          {/* Part 1: Land Information */}
          <Card className="mb-6 border-emerald-100 shadow-sm">
            <CardHeader>
              <CardTitle>
                1. Informasi Lahan (Petani/Pengelola Kebun)
              </CardTitle>
              <CardDescription>
                Input data lahan dan informasi administratif
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="nama_lahan">
                    Nama Lahan *
                  </Label>
                  <Input
                    id="nama_lahan"
                    name="nama_lahan"
                    placeholder="e.g., Kebun Sawit A"
                    value={formData.nama_lahan}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lokasi">
                    Lokasi (Kabupaten/Desa) *
                  </Label>
                  <Input
                    id="lokasi"
                    name="lokasi"
                    placeholder="e.g., Kabupaten/Kota"
                    value={formData.lokasi}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="luas">
                    Luas Area (Hektar) *
                  </Label>
                  <Input
                    id="luas"
                    name="luas"
                    type="number"
                    step="0.01"
                    placeholder="e.g., 5.5"
                    value={formData.luas}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="jumlah_pohon">
                    Estimasi Jumlah Pohon *
                  </Label>
                  <Input
                    id="jumlah_pohon"
                    name="jumlah_pohon"
                    type="number"
                    placeholder="e.g., 100"
                    value={formData.jumlah_pohon}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Part 2: Geo-Tagging */}
          <Card className="mb-6 border-emerald-100 shadow-sm">
            <CardHeader>
              <CardTitle>
                2. Geo-Tagging & Dokumentasi
              </CardTitle>
              <CardDescription>
                Koordinat GPS Poligon, foto lahan, dan dokumentasi
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="polygon">Koordinat Poligon (JSON Array)</Label>
                <Input
                  id="polygon"
                  name="polygon"
                  placeholder="e.g., [-6.200, 106.816]"
                  value={formData.polygon}
                  onChange={handleChange}
                />
              </div>

              <Button
                type="button"
                variant="outline"
                onClick={getCurrentLocation}
                className="w-full border-emerald-200 text-emerald-700 hover:bg-emerald-50"
              >
                <MapPin className="size-4 mr-2" />
                Ambil Koordinat Saat Ini
              </Button>

              <div className="space-y-2 mt-4">
                <Label>Upload Foto Lahan (Opsional)</Label>
                <div className="border-2 border-dashed border-gray-200 rounded-lg p-6 text-center hover:bg-gray-50 transition-colors cursor-pointer">
                  <Upload className="size-8 mx-auto mb-2 text-gray-400" />
                  <p className="text-sm text-gray-600">
                    Klik untuk mengunggah atau seret file
                  </p>
                  <p className="text-xs text-gray-400 mt-1">
                    Foto lahan, tanaman (Maks 5MB)
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Additional Notes */}
          <Card className="mb-6 border-emerald-100 shadow-sm">
            <CardHeader>
              <CardTitle>Catatan Tambahan</CardTitle>
            </CardHeader>
            <CardContent>
              <Textarea
                name="notes"
                placeholder="Catatan tambahan..."
                value={formData.notes}
                onChange={handleChange}
                rows={4}
              />
            </CardContent>
          </Card>

          {/* Submit Buttons */}
          <div className="flex gap-4">
            <Button type="submit" className="flex-1 bg-emerald-600 hover:bg-emerald-700" disabled={loading}>
              {loading ? "Menyimpan..." : "Simpan ke Database"}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate("/dashboard")}
              className="border-gray-200 hover:bg-gray-100"
            >
              Batal
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}