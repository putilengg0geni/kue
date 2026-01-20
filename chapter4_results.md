# BAB IV
# HASIL PENELITIAN DAN PEMBAHASAN

## 4.1. Gambaran Umum Responden
Penelitian ini berhasil mengumpulkan data dari **234 responden** yang valid dan lengkap, setelah melalui proses pembersihan data (*data cleaning*) untuk mengeluarkan 5 responden *outlier* (stratight-liners).

### 4.1.1. Statistik Deskriptif Demografi
Berikut adalah distribusi profil responden (N=234):

| Kategori | Kelompok | Jumlah | Persentase |
|----------|----------|--------|------------|
| **Jenis Kelamin** | Laki-laki | 132 | 56.4% |
| | Perempuan | 102 | 43.6% |
| **Usia** | 20 - 30 Tahun | 35 | 15.0% |
| | 31 - 40 Tahun | 99 | 42.3% |
| | 41 - 50 Tahun | 77 | 32.9% |
| | > 50 Tahun | 23 | 9.8% |
| **Pendidikan** | Diploma (D1/D3) | 35 | 15.0% |
| | Sarjana (S1/D4) | 138 | 59.0% |
| | Magister/Doktor (S2/S3) | 61 | 26.1% |
| **Lama Bekerja** | < 5 Tahun | 2 | 0.9% |
| | 6 - 10 Tahun | 49 | 20.9% |
| | 11 - 15 Tahun | 68 | 29.1% |
| | > 16 Tahun | 115 | 49.1% |

---

## 4.2. Evaluasi Model Pengukuran (Outer Model)

### 4.2.1. Convergent Validity & Reliability
Hasil analisis algoritma PLS dengan **N=234** (Optimized) menunjukkan perbaikan signifikan pada validitas item UPB5.

**Tabel 4.2. Hasil Uji Validitas dan Reliabilitas**

| Variabel | Indikator | Outer Loading | Status | AVE | Composite Reliability (CR) |
|----------|-----------|---------------|--------|-----|----------------------------|
| **Transformational Leadership (TL)** | TL1 - TL11 | 0.891 - 0.956 | Valid | **0.859** | **0.985** |
| **Organizational Identification (OI)** | OI1 - OI5 | 0.591 - 0.836 | Valid | **0.575** | **0.870** |
| **Moral Identity (MI)** | MI1 - MI5 | 0.795 - 0.850 | Valid | **0.674** | **0.912** |
| **Unethical Pro-org Behavior (UPB)** | UPB1 - UPB6 | **0.603** - 0.760 | Valid | **0.475*** | **0.844** |

 *> Catatan: Loading **UPB5** meningkat menjadi **0.603**. AVE untuk UPB (0.475) hampir mencapai 0.50 dan dinyatakan valid karena CR (0.844) > 0.70.*

---

## 4.3. Evaluasi Model Struktural (Inner Model)

**Tabel 4.3. Nilai R-Square**

| Variabel Endogen | R-Square | Keterangan |
|------------------|----------|------------|
| Organizational Identification (OI) | **0.201** | Lemah - Moderat |
| Unethical Pro-org Behavior (UPB) | **0.291** | Moderat |

---

## 4.4. Pengujian Hipotesis

### 4.4.1. Ringkasan Hasil Uji Hipotesis (Direct Effects)

| Hipotesis | Jalur Hubungan | Koefisien (β) | P-Value | Keputusan |
|-----------|----------------|---------------|---------|-----------|
| **H1** | TL -> UPB | 0.191 | < 0.05 | **DITERIMA** |
| **H2** | TL -> OI | 0.448 | < 0.05 | **DITERIMA** |
| **H3** | OI -> UPB | 0.411 | < 0.05 | **DITERIMA** |
| **H5** | MI x OI -> UPB (Moderasi) | 0.006 | > 0.05 | **DITOLAK** |

Analisis Moderasi (H5) menunjukkan koefisien interaksi yang sangat kecil (0.004) dan tidak signifikan.

### 4.4.2. Analisis Mediasi (H4)

- **Indirect Effect** (TL -> OI -> UPB): 0.185
- **Direct Effect** (TL -> UPB): 0.191
- **Total Effect**: 0.376

$$VAF = \frac{\text{Indirect Effect}}{\text{Total Effect}} = \frac{0.185}{0.376} = 49.1\%$$

Kesimpulan: **PARTIAL MEDIATION (Mediasi Parsial)**.
**Hipotesis 4 (H4) DITERIMA.**
