#  Variant Image Switching - Manual Testing Guide

##  Pre-requisites
- Dev server running: `npm run dev`
- Database seeded with products that have multiple variants
- Browser console open (F12) for debug logs

##  Test Cases

### Test 1: Initial Load - Default Variant Image
**Steps:**
1. Navigate to any product page with multiple variants (e.g., `/products/pasta-cokelat-blackforest`)
2. Observe the main product image when page loads

**Expected Result:**
-  Main image displays the first available variant's image (variant with stock > 0)
-  Console shows: ` Switching to variant image: 30g /assets/products/30g/Cokelat Blackforest.png`
-  The variant button for default variant is highlighted (blue background)

**Pass Criteria:**
- Image matches the selected variant (30g shows 30g image)
- No placeholder or wrong image displayed

---

### Test 2: Click Different Variant - Image Changes
**Steps:**
1. From Test 1, click on the "100g" variant button
2. Observe main image changes

**Expected Result:**
-  Main image immediately changes to 100g variant image
-  Console shows: ` Variant clicked: 100g Image: /assets/products/100g/Cokelat Blackforest.png`
-  Console shows: ` Switching to variant image: 100g /assets/products/100g/Cokelat Blackforest.png`
-  Variant button highlights correctly
-  Price updates if variant has different price

**Pass Criteria:**
- Image transition is smooth (no flickering)
- Correct image is displayed
- All state (price, stock, variant selection) is synchronized

---

### Test 3: Multiple Variant Switches
**Steps:**
1. Click 30g variant
2. Wait 1 second
3. Click 100g variant
4. Wait 1 second
5. Click 30g again

**Expected Result:**
-  Each click triggers image change
-  No lag or delay
-  Console logs show each switch
-  Image always matches selected variant

**Pass Criteria:**
- State consistency maintained
- No race conditions or stale state

---

### Test 4: Manual Thumbnail Click (Optional)
**Steps:**
1. Click on a thumbnail image below the main image
2. Then click a different variant button

**Expected Result:**
-  Thumbnail click changes main image
-  Variant click overrides thumbnail selection and shows variant image
-  useEffect synchronization works correctly

**Pass Criteria:**
- Variant selection always takes priority
- Manual thumbnail selection is overridden by variant

---

### Test 5: Product with Single Variant
**Steps:**
1. Navigate to a product with only one variant (e.g., `/products/pasta-susu`)
2. Observe initial load

**Expected Result:**
-  Image displays correctly
-  No variant buttons to click (or only one variant)
-  No console errors

**Pass Criteria:**
- Works gracefully with single variant
- No undefined errors

---

### Test 6: Variant Without Image
**Steps:**
1. Find or create a variant without an image field
2. Click that variant

**Expected Result:**
-  Console shows: ` Variant image not found in images array: null`
-  Image stays on current/default image
-  No crash or error

**Pass Criteria:**
- Graceful degradation
- No breaking errors

---

### Test 7: Network Delay Simulation
**Steps:**
1. Open Network tab in DevTools
2. Set throttling to "Slow 3G"
3. Refresh product page
4. Click variant button immediately after load

**Expected Result:**
-  Variant click queued until product loads
-  No race condition errors
-  Image updates correctly after product loads

**Pass Criteria:**
- Handles async loading gracefully
- State management is consistent

---

## 🐛 Debugging Console Logs

When testing, you should see these console logs:

```
 Variant clicked: 100g Image: /assets/products/100g/Cokelat Blackforest.png
 Switching to variant image: 100g /assets/products/100g/Cokelat Blackforest.png
```

If you see:
```
 Variant image not found in images array: /path/to/image.png
```
This means the variant's image path doesn't match any image in the product's images array.

---

##  Troubleshooting

### Issue: Image doesn't change when clicking variant
**Check:**
1. Variant has `image` field populated in database
2. Image path in variant matches path in product.images array
3. Console logs show the switching attempt
4. No JavaScript errors in console

**Solution:**
- Verify seed data has correct image paths
- Check if images array includes all variant images

---

### Issue: Wrong image shows on initial load
**Check:**
1. Default variant is being selected correctly (first with stock)
2. useEffect runs after product loads
3. selectedImageIndex updates

**Solution:**
- Check useEffect dependency array
- Verify images array is parsed correctly

---

### Issue: Console shows warnings about image not found
**Check:**
1. Product.images JSON string format
2. Variant.image path format
3. Path consistency (case-sensitive, spaces, encoding)

**Solution:**
- Run seed script to ensure data consistency
- Verify image paths match exactly

---

##  Success Criteria

All tests must pass with:
-  No console errors
-  Smooth image transitions
-  Correct image displayed for each variant
-  State synchronization (price, stock, variant) maintained
-  Works on all product types (single/multiple variants)
-  Graceful handling of edge cases

---

##  Test Report Template

```
Date: ___________
Tester: ___________

Test 1 (Initial Load): ☐ PASS ☐ FAIL
Notes: _________________________________

Test 2 (Variant Switch): ☐ PASS ☐ FAIL
Notes: _________________________________

Test 3 (Multiple Switches): ☐ PASS ☐ FAIL
Notes: _________________________________

Test 4 (Thumbnail Click): ☐ PASS ☐ FAIL
Notes: _________________________________

Test 5 (Single Variant): ☐ PASS ☐ FAIL
Notes: _________________________________

Test 6 (No Image): ☐ PASS ☐ FAIL
Notes: _________________________________

Test 7 (Network Delay): ☐ PASS ☐ FAIL
Notes: _________________________________

Overall: ☐ ALL PASS ☐ SOME FAILURES
```

---

##  Quick Test Products

Use these products for quick testing:
- `/products/pasta-cokelat-blackforest` - 2 variants (30g, 100g)
- `/products/pasta-pandan` - 3 variants (30g, 100g, 1kg)
- `/products/pasta-susu` - 1 variant (30g)

---

##  Implementation Details

The mechanism works as follows:

1. **Initial Load:**
   - Product data fetched from API
   - Default variant selected (first with stock > 0)
   - `selectedVariant` state updated

2. **useEffect Synchronization:**
   - Watches `selectedVariant` and `images` dependencies
   - When variant changes, finds matching image in images array
   - Updates `selectedImageIndex` to display correct image

3. **Variant Click:**
   - Updates `selectedVariant` state
   - useEffect automatically triggers image sync
   - No manual image index manipulation needed

4. **Benefits:**
   - Separation of concerns (variant selection vs image display)
   - Automatic synchronization via useEffect
   - Predictable state management
   - Easy debugging with console logs
