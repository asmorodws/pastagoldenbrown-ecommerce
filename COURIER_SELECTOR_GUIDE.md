#  Panduan Pemilihan Ekspedisi Pengiriman

##  Fitur Baru: Courier Selector

Sekarang customer dapat memilih ekspedisi mana saja yang ingin ditampilkan saat checkout, memberikan kontrol penuh untuk membandingkan harga dan layanan dari berbagai jasa pengiriman.

## 🚚 Daftar Ekspedisi yang Tersedia

Total **17 ekspedisi** terintegrasi dengan RajaOngkir V2 API:

| No | Kode | Nama Ekspedisi | Logo | Kategori |
|----|------|----------------|------|----------|
| 1 | `jne` | JNE | 🚛 | Populer |
| 2 | `sicepat` | SiCepat |  | Populer |
| 3 | `ide` | ID Express | 📮 | - |
| 4 | `sap` | SAP Express |  | - |
| 5 | `jnt` | J&T Express |  | Populer |
| 6 | `ninja` | Ninja Xpress | 🥷 | Populer |
| 7 | `tiki` | TIKI |  | Populer |
| 8 | `lion` | Lion Parcel | 🦁 | - |
| 9 | `anteraja` | AnterAja | 🚚 | Populer |
| 10 | `pos` | POS Indonesia | 📮 | Populer |
| 11 | `ncs` | NCS |  | - |
| 12 | `rex` | REX |  | - |
| 13 | `rpx` | RPX |  | - |
| 14 | `sentral` | Sentral Cargo | 🚚 | - |
| 15 | `star` | Star Cargo | ⭐ | - |
| 16 | `wahana` | Wahana |  | - |
| 17 | `dse` | DSE |  | - |

##  User Experience

### 1. Default Selection (Ekspedisi Populer)
Saat pertama kali masuk checkout, **7 ekspedisi populer** sudah terpilih:
- JNE
- SiCepat
- J&T Express
- Ninja Xpress
- TIKI
- AnterAja
- POS Indonesia

### 2. Memilih Ekspedisi Custom

#### Langkah-langkah:
1. Di halaman checkout, klik tombol **"Pilih Ekspedisi (7)"**
2. Panel pemilihan ekspedisi akan muncul
3. Klik pada logo ekspedisi untuk toggle on/off
4. Gunakan tombol cepat:
   - **Populer**: Pilih 7 ekspedisi populer
   - **Semua**: Pilih semua 17 ekspedisi

#### Visual Feedback:
- **Terpilih**: Logo berwarna dengan border tebal
- **Tidak terpilih**: Logo abu-abu dengan border tipis
- Counter di tombol menunjukkan jumlah ekspedisi terpilih

### 3. Real-time Update
Setiap kali ekspedisi dipilih/dibatalkan:
-  Auto-refresh biaya pengiriman
-  Hanya ekspedisi terpilih yang ditampilkan
-  Perubahan langsung terlihat tanpa reload

##  UI/UX Design

### Courier Selector Panel
```
┌─────────────────────────────────────────────────────┐
│ Pilih Ekspedisi              [Populer] [Semua]     │
├─────────────────────────────────────────────────────┤
│                                                      │
│  [🚛]    []    [📮]    []    []    [🥷]      │
│  JNE   SiCepat   IDE    SAP     J&T   Ninja        │
│                                                      │
│  []    [🦁]    [🚚]    [📮]    []    []      │
│  TIKI   Lion  AnterAja  POS    NCS     REX         │
│                                                      │
│  []    [🚚]    [⭐]    []    []               │
│  RPX  Sentral  Star  Wahana   DSE                  │
│                                                      │
├─────────────────────────────────────────────────────┤
│  Pilih ekspedisi yang ingin ditampilkan.         │
│    Minimal 1 ekspedisi harus dipilih.              │
└─────────────────────────────────────────────────────┘
```

### Color Coding
Setiap ekspedisi memiliki warna unik untuk mudah dibedakan:

| Ekspedisi | Background | Border |
|-----------|-----------|--------|
| JNE | `bg-red-50` | `border-red-200` |
| SiCepat | `bg-yellow-50` | `border-yellow-200` |
| ID Express | `bg-green-50` | `border-green-200` |
| SAP | `bg-purple-50` | `border-purple-200` |
| J&T | `bg-red-50` | `border-red-200` |
| Ninja | `bg-blue-50` | `border-blue-200` |
| TIKI | `bg-orange-50` | `border-orange-200` |
| Lion | `bg-yellow-50` | `border-yellow-200` |
| AnterAja | `bg-green-50` | `border-green-200` |
| POS | `bg-blue-50` | `border-blue-200` |
| NCS | `bg-slate-50` | `border-slate-200` |
| REX | `bg-indigo-50` | `border-indigo-200` |
| RPX | `bg-pink-50` | `border-pink-200` |
| Sentral | `bg-cyan-50` | `border-cyan-200` |
| Star | `bg-amber-50` | `border-amber-200` |
| Wahana | `bg-teal-50` | `border-teal-200` |
| DSE | `bg-violet-50` | `border-violet-200` |

##  Technical Implementation

### Component State
```typescript
const [selectedCouriers, setSelectedCouriers] = useState<string[]>([
  "jne", "sicepat", "jnt", "ninja", "tiki", "anteraja", "pos"
])
const [showCourierSelector, setShowCourierSelector] = useState(false)
```

### API Request
```typescript
// Courier list dari selected couriers
const courierList = selectedCouriers.join(":")
// Example: "jne:sicepat:jnt:ninja:tiki:anteraja:pos"

const response = await fetch("/api/rajaongkir/cost", {
  method: "POST",
  body: JSON.stringify({
    courier: courierList, // Dynamic based on selection
    // ... other params
  }),
})
```

### Auto-refresh on Selection Change
```typescript
useEffect(() => {
  if (destinationCityId && totalWeight > 0 && selectedCouriers.length > 0) {
    fetchShippingCosts()
  }
}, [destinationCityId, destinationDistrictId, totalWeight, selectedCouriers])
```

## 🔒 Validation & Safety

### Rules:
1. **Minimal 1 ekspedisi** harus dipilih
2. Tidak bisa unselect semua ekspedisi
3. Auto-refresh hanya jika ada ekspedisi terpilih
4. Loading state saat fetching data baru

### Error Handling:
```typescript
if (selectedCouriers.length === 0) {
  return (
    <div className="bg-amber-50 border-2 border-amber-200 rounded-xl p-6">
      <AlertCircle className="w-12 h-12 text-amber-600 mx-auto mb-3" />
      <p className="text-amber-800 font-medium">
        Silakan pilih minimal 1 ekspedisi
      </p>
    </div>
  )
}
```

##  Use Cases

### 1. Budget-Conscious Customer
Pilih hanya ekspedisi ekonomis:
- POS Indonesia
- Wahana
- NCS

### 2. Speed Priority Customer
Pilih ekspedisi dengan layanan same-day/next-day:
- JNE
- SiCepat
- Ninja Xpress
- AnterAja

### 3. Regional Preference
Pilih berdasarkan coverage area terbaik di daerah tertentu:
- Jakarta: JNE, SiCepat, Ninja
- Luar Jawa: J&T, POS, TIKI

### 4. Compare All Options
Klik "Semua" untuk melihat harga dari 17 ekspedisi sekaligus

## 🎁 Benefits

### For Customers:
 **Fleksibilitas**: Pilih ekspedisi sesuai preferensi  
 **Transparansi**: Bandingkan harga dari berbagai ekspedisi  
 **Kontrol**: Kurangi clutter dengan hanya menampilkan yang relevan  
 **Efisiensi**: Loading lebih cepat jika hanya pilih beberapa ekspedisi  

### For Store Owner:
 **Better UX**: Customer tidak overwhelmed dengan terlalu banyak opsi  
 **Customizable**: Default selection bisa disesuaikan dengan bisnis  
 **Analytics Ready**: Bisa track ekspedisi mana yang paling sering dipilih  
 **Cost Optimization**: Bisa promote ekspedisi dengan komisi lebih tinggi  

##  Future Enhancements

### Planned Features:
1. **Saved Preferences**: Remember customer's courier preference
2. **Smart Recommendations**: Suggest courier based on destination
3. **Price Sorting**: Auto-sort by cheapest/fastest
4. **Service Level Filter**: Express only, regular only, etc.
5. **Courier Rating**: Show customer ratings for each courier
6. **Promo Badge**: Highlight couriers with current promotions

### Possible Integrations:
- [ ] Save preference to user profile
- [ ] A/B testing different default selections
- [ ] Track conversion rate per courier
- [ ] Admin panel to set default couriers

##  Responsive Design

### Desktop (Grid 6 columns):
```
[JNE] [SiCepat] [IDE] [SAP] [J&T] [Ninja]
[TIKI] [Lion] [AnterAja] [POS] [NCS] [REX]
[RPX] [Sentral] [Star] [Wahana] [DSE]
```

### Tablet (Grid 4 columns):
```
[JNE] [SiCepat] [IDE] [SAP]
[J&T] [Ninja] [TIKI] [Lion]
[AnterAja] [POS] [NCS] [REX]
[RPX] [Sentral] [Star] [Wahana]
[DSE]
```

### Mobile (Grid 2 columns):
```
[JNE]      [SiCepat]
[IDE]      [SAP]
[J&T]      [Ninja]
...
```

##  Testing Scenarios

### Test Case 1: Default Selection
1. Go to checkout
2. Verify 7 popular couriers are selected
3. Verify shipping costs show for all 7

### Test Case 2: Custom Selection
1. Click "Pilih Ekspedisi"
2. Unselect all, select only JNE
3. Verify only JNE shipping options appear
4. Verify loading state during re-fetch

### Test Case 3: Quick Select Buttons
1. Click "Populer" → Verify 7 couriers selected
2. Click "Semua" → Verify all 17 selected
3. Verify costs update correctly

### Test Case 4: Minimum Selection
1. Try to unselect last remaining courier
2. Verify it stays selected (min 1 rule)
3. Verify no error occurs

### Test Case 5: Mobile Responsiveness
1. Test on mobile viewport
2. Verify 2-column grid layout
3. Verify buttons are tappable
4. Verify panel scrolls properly

##  Documentation for Developers

### Adding New Courier
Edit `AVAILABLE_COURIERS` array:
```typescript
{ 
  code: "newcourier", 
  name: "New Courier", 
  logo: "", 
  color: "bg-rose-50 border-rose-200" 
}
```

### Changing Default Selection
```typescript
const [selectedCouriers, setSelectedCouriers] = useState<string[]>([
  "your", "preferred", "couriers", "here"
])
```

### Customizing Quick Select
```typescript
const selectEconomyCouriers = () => {
  setSelectedCouriers(["pos", "wahana", "ncs"])
}
```

##  Summary

Fitur **Courier Selector** memberikan pengalaman checkout yang lebih personal dan efisien dengan:

1.  **17 ekspedisi terintegrasi**
2.  **Visual selector dengan logo & warna**
3.  **Quick select buttons (Populer/Semua)**
4.  **Real-time update biaya pengiriman**
5.  **Responsive design (desktop/tablet/mobile)**
6.  **Smart validation (min 1 courier)**
7.  **Default populer couriers untuk kemudahan**

Customer sekarang punya **kontrol penuh** untuk memilih dan membandingkan harga dari ekspedisi yang mereka percaya dan inginkan! 🎊

---

**Version**: 1.0  
**Last Updated**: 2024  
**Status**:  Production Ready
