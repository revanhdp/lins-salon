import "server-only";
import { type Db, MongoClient, ObjectId } from "mongodb";
import type { FotoGaleri, JamOperasional, Kontak, TestimoniItem } from "@/data/salon";

const uri = process.env.MONGODB_URI ?? "mongodb://127.0.0.1:27017";
const dbName = process.env.MONGODB_DB ?? "lins_salon";

/** Dokumen tunggal `_id: "site"` berisi kontak dan jam operasional. */
export interface SettingsDoc {
  _id: string;
  kontak: Kontak;
  jamOperasional: JamOperasional[];
}

/** Satu layanan. Kategori diturunkan dengan mengelompokkan field `kategori`. */
export interface LayananDoc {
  kategori: string;
  urutan: number;
  nama: string;
  deskripsi: string;
  hargaMulai: number;
  durasi?: string;
}

export interface FotoDoc extends FotoGaleri {
  urutan: number;
}

export interface TestimoniDoc extends TestimoniItem {
  urutan: number;
}

export type OrderedCollection = "layanan" | "galeri" | "testimoni";

// Satu koneksi dipakai bersama (aman terhadap hot reload saat development).
const globalForMongo = globalThis as unknown as { _mongoClient?: Promise<MongoClient> };

function connect(): Promise<MongoClient> {
  if (!globalForMongo._mongoClient) {
    const pending = new MongoClient(uri, { serverSelectionTimeoutMS: 3000 }).connect();
    globalForMongo._mongoClient = pending;
    // Koneksi gagal tidak boleh tersimpan selamanya: coba lagi pada permintaan berikutnya.
    pending.catch(() => {
      if (globalForMongo._mongoClient === pending) globalForMongo._mongoClient = undefined;
    });
  }
  return globalForMongo._mongoClient;
}

export async function getDb(): Promise<Db> {
  return (await connect()).db(dbName);
}

export async function collections() {
  const db = await getDb();
  return {
    settings: db.collection<SettingsDoc>("settings"),
    layanan: db.collection<LayananDoc>("layanan"),
    galeri: db.collection<FotoDoc>("galeri"),
    testimoni: db.collection<TestimoniDoc>("testimoni"),
  };
}

export function toObjectId(id: string): ObjectId {
  if (!ObjectId.isValid(id)) throw new Error("ID tidak valid");
  return new ObjectId(id);
}

/** Urutan berikutnya (paling akhir) untuk koleksi berurutan. */
export async function nextUrutan(name: OrderedCollection): Promise<number> {
  const db = await getDb();
  const last = await db.collection(name).findOne({}, { sort: { urutan: -1 }, projection: { urutan: 1 } });
  return typeof last?.urutan === "number" ? last.urutan + 1 : 0;
}

/** Tukar posisi satu dokumen dengan tetangganya, lalu rapikan nomor urut. */
export async function moveDoc(name: OrderedCollection, id: string, direction: -1 | 1): Promise<void> {
  const col = (await getDb()).collection(name);
  const docs = await col.find({}, { projection: { _id: 1 } }).sort({ urutan: 1, _id: 1 }).toArray();
  const from = docs.findIndex((d) => d._id.equals(id));
  const to = from + direction;
  if (from < 0 || to < 0 || to >= docs.length) return;
  [docs[from], docs[to]] = [docs[to], docs[from]];
  await col.bulkWrite(
    docs.map((d, index) => ({ updateOne: { filter: { _id: d._id }, update: { $set: { urutan: index } } } })),
  );
}
