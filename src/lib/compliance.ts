export interface LandForCompliance {
  luas: number;
  polygon: any;
  dokumen_legalitas: string | null;
  bebas_deforestasi: boolean;
  jenis_komoditas: string | null;
  nama_ilmiah: string | null;
}

export function isLandCompliant(land: LandForCompliance): boolean {
  const isPolygonValid = land.luas > 4 
    ? (Array.isArray(land.polygon) && land.polygon.length >= 3)
    : (Array.isArray(land.polygon) && land.polygon.length >= 1);
  
  const isDocUploaded = !!land.dokumen_legalitas;
  const isDeforestationFree = !!land.bebas_deforestasi;
  const isSpeciesFilled = !!land.jenis_komoditas && !!land.nama_ilmiah;

  return isPolygonValid && isDocUploaded && isDeforestationFree && isSpeciesFilled;
}
