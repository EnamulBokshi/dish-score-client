# Quick Reference Guide - Unified Review API

## 📋 Quick Code Changes

### 1. Service Layer - `unified.client.ts`

#### Old Implementation ❌
```typescript
export interface IUnifiedCreatePayload {
  restaurant: {
    data: {
      name: string;
      // ... all required fields
    };
  };
  dish: {
    data: {
      // ... all required fields
    };
  };
  review: { /* ... */ };
}
// Always created both restaurant and dish
```

#### New Implementation ✅
```typescript
export interface IUnifiedCreatePayload {
  restaurantId?: string;  // NEW: Option to use existing
  restaurant?: {          // NEW: Now optional
    data?: { /* ... */ };
    images?: string[];
  };
  dishId?: string;        // NEW: Option to use existing
  dish?: {               // NEW: Now optional
    data?: { /* ... */ };
    images?: string[];
  };
  review: { /* ... */ };  // Always required
}
```

---

### 2. Dialog Component - Key Changes

#### State Management
```typescript
// NEW: Mode selection states
type RestaurantMode = "create" | "select";
type DishMode = "create" | "select";

const [restaurantMode, setRestaurantMode] = useState<RestaurantMode>("create");
const [selectedRestaurantId, setSelectedRestaurantId] = useState<string>("");
const [dishMode, setDishMode] = useState<DishMode>("create");
const [selectedDishId, setSelectedDishId] = useState<string>("");
```

#### Data Fetching (NEW)
```typescript
import { getRestaurants } from "@/services/restaurant.services";
import { getDishes } from "@/services/dish.services";

// Fetch restaurants when select mode is active
const { data: restaurantsResponse, isLoading: restaurantsLoading } = useQuery({
  queryKey: ["restaurants-for-review"],
  queryFn: () => getRestaurants("limit=50&sortBy=createdAt&sortOrder=desc"),
  enabled: open && restaurantMode === "select",
});

// Similar for dishes
const { data: dishesResponse, isLoading: dishesLoading } = useQuery({
  queryKey: ["dishes-for-review"],
  queryFn: () => getDishes("limit=50&sortBy=createdAt&sortOrder=desc"),
  enabled: open && dishMode === "select",
});
```

#### Payload Building Logic (NEW)
```typescript
// Build restaurant payload based on mode
let restaurantPayload: { restaurantId?: string; restaurant?: any } = {};
if (restaurantMode === "select") {
  if (!selectedRestaurantId) throw new Error("Please select a restaurant");
  restaurantPayload.restaurantId = selectedRestaurantId;
} else {
  // Validate and build restaurant data from form
  restaurantPayload.restaurant = {
    data: {
      name: restaurantName,
      description: formState.restaurantDescription.trim() || undefined,
      address: restaurantAddress,
      // ... other fields
    },
  };
}

// Similar logic for dish...

// Combine both
const payload: IUnifiedCreatePayload = {
  ...restaurantPayload,
  ...dishPayload,
  review: { data: { rating, comment, tags } },
};
```

#### UI Structure (Updated)
```typescript
// Restaurant Section
<SectionFrame title="1) Restaurant" description="Create new or select existing">
  <Select value={restaurantMode} onValueChange={setRestaurantMode}>
    <SelectItem value="create">Create New Restaurant</SelectItem>
    <SelectItem value="select">Select Existing Restaurant</SelectItem>
  </Select>
  
  {restaurantMode === "select" ? (
    // Show dropdown with restaurants
    <Select value={selectedRestaurantId} onValueChange={setSelectedRestaurantId}>
      {restaurants.map(r => <SelectItem key={r.id} value={r.id}>{r.name} ({r.city})</SelectItem>)}
    </Select>
  ) : (
    // Show form fields
    <>
      <Input placeholder="Restaurant Name *" />
      <Input placeholder="Address *" />
      {/* ... other fields */}
    </>
  )}
</SectionFrame>

// Similar for Dish Section...

// Review Section (Always the same)
<SectionFrame title="3) Review" description="Add rating, comment and images">
  {/* Rating select, comment textarea, image upload */}
</SectionFrame>
```

---

## 🔄 Workflow Comparison

### Before (Always Create)
```
User Input → Validate → Create Restaurant
                     → Create Dish
                     → Create Review
                     → Return Success
```

### After (Create OR Select)
```
User Input → Select Mode → Build Appropriate Payload
          ├─ Restaurant: create?  → Validate form data
          │                      → OR use restaurant ID
          │
          ├─ Dish:      create?  → Validate form data
          │                      → OR use dish ID
          │
          └─ Send Payload to API
             → Server handles logic
             → Return Success
```

---

## 🎯 Real-World Usage Examples

### Example 1: New Everything
```javascript
// User selects:
// Restaurant Mode: "Create New"  
// Dish Mode: "Create New"
// Then fills form and submits

// Payload sent:
{
  restaurant: {
    data: {
      name: "Pizza Palace",
      address: "123 Main St",
      city: "New York",
      state: "NY",
      road: "Main Street",
      location: { lat: 40.7128, lng: -74.0060 },
      // ... more fields
    }
  },
  dish: {
    data: {
      name: "Margherita",
      ingredients: ["dough", "tomato", "mozzarella"],
      price: 15.99,
      // ... more fields
    }
  },
  review: {
    data: {
      rating: 5,
      comment: "Amazing!",
      tags: ["must-try"]
    }
  }
}
```

### Example 2: Existing Restaurant, New Dish
```javascript
// User selects:
// Restaurant Mode: "Select Existing" → Chooses "Pizza Palace"
// Dish Mode: "Create New"

// Payload sent:
{
  restaurantId: "restaurant-uuid-123",  // Just the ID
  dish: {
    data: {
      name: "Pepperoni",
      ingredients: ["dough", "tomato", "mozzarella", "pepperoni"],
      price: 17.99,
      // ... more fields
    }
  },
  review: {
    data: {
      rating: 4,
      comment: "Good pepperoni",
      tags: ["spicy"]
    }
  }
}
```

### Example 3: Both Existing
```javascript
// User selects:
// Restaurant Mode: "Select Existing" → "Pizza Palace"
// Dish Mode: "Select Existing" → "Margherita"

// Payload sent:
{
  restaurantId: "restaurant-uuid-123",
  dishId: "dish-uuid-456",
  review: {
    data: {
      rating: 5,
      comment: "Still amazing!",
      tags: ["must-try", "best"]
    }
  }
}
```

---

## 📊 Validation Matrix

| Restaurant | Dish | Valid | Reason |
|-----------|------|-------|--------|
| Create (filled) | Create (filled) | ✅ | Both have data |
| Create (filled) | Existing (selected) | ✅ | Mix is allowed |
| Create (empty) | Create (filled) | ❌ | Restaurant missing |
| Existing (selected) | Create (filled) | ✅ | Mix is allowed |
| Existing (none) | Create (filled) | ❌ | No restaurant selection |
| Existing (selected) | Existing (selected) | ✅ | Both IDs provided |
| Existing (selected) | Create (empty) | ❌ | Dish missing |
| Any | Any (missing review) | ❌ | Review always required |

---

## 🔧 Configuration Options

### API Limits (Configurable)
```typescript
// In component - these can be tweaked
const { data: restaurantsResponse } = useQuery({
  queryFn: () => getRestaurants("limit=50&sortBy=createdAt&sortOrder=desc"),
  //                             ^^^^^^ Change this to increase/decrease options
});

const { data: dishesResponse } = useQuery({
  queryFn: () => getDishes("limit=50&sortBy=createdAt&sortOrder=desc"),
  //                        ^^^^^^ Change this
});
```

### Image Limits (Existing, No Change)
```typescript
<ImageDropzone
  title="Restaurant Images"
  maxFiles={10}  // Can be adjusted per section
/>

<ImageDropzone
  title="Dish Images"
  maxFiles={5}   // Different limit per section
/>

<ImageDropzone
  title="Review Images"
  maxFiles={5}
/>
```

---

## 🚨 Error Handling Examples

### Client-Side Errors
```typescript
// Mode-specific validation
if (restaurantMode === "select" && !selectedRestaurantId) {
  throw new Error("Please select a restaurant");
}

if (restaurantMode === "create" && !restaurantName) {
  throw new Error("Restaurant name is required");
}

// Always-required validation
if (!Number.isInteger(rating) || rating < 1 || rating > 5) {
  throw new Error("Rating must be an integer between 1 and 5");
}
```

### Server-Side Enforcement (Zod Schema)
```typescript
// Backend validates
.refine(
  (data) => data.restaurantId || (data.restaurant?.data),
  {
    message: "Either restaurantId or restaurant.data is required",
    path: ["restaurant"],
  }
)
.refine(
  (data) => data.dishId || (data.dish?.data),
  {
    message: "Either dishId or dish.data is required",
    path: ["dish"],
  }
)
```

---

## 📱 UI States

### Loading State
```typescript
{restaurantsLoading ? (
  <div className="flex items-center justify-center py-4">
    <Loader2 className="h-5 w-5 animate-spin" />
  </div>
) : (
  // Show dropdown
)}
```

### Empty State
```typescript
{restaurants.length === 0 ? (
  <div className="rounded-md border border-dashed ... text-muted-foreground">
    No restaurants available
  </div>
) : (
  // Show options
)}
```

### Form Reset After Submit
```typescript
onSuccess: () => {
  setOpen(false);
  setFormState(initialFormState);
  setRestaurantImages([]);
  setDishImages([]);
  setReviewImages([]);
  setSelectedRestaurantId("");    // Clear selection
  setSelectedDishId("");           // Clear selection
  setRestaurantMode("create");     // Reset to default
  setDishMode("create");           // Reset to default
  router.refresh();
}
```

---

## 💡 Pro Tips

1. **Testing**: Test all 4 combinations:
   - Create + Create
   - Create + Select
   - Select + Create
   - Select + Select

2. **Performance**: Data is lazy-loaded only when needed
   - Restaurants load only if select mode active
   - Dishes load only if select mode active

3. **Caching**: React Query handles cache invalidation automatically
   - No manual cache clearing needed
   - Cache expires based on stale time

4. **Accessibility**: All selects and inputs have proper labels
   - Screen readers will work correctly
   - Keyboard navigation supported

5. **Mobile**: Component is fully responsive
   - Works on small screens
   - Touch-friendly dropdowns

---

## 📞 Troubleshooting

### Issue: Data not loading when select mode active
**Solution**: Check network tab, ensure limit=50 shows results

### Issue: Form fields still showing in select mode
**Solution**: Check state - `restaurantMode` might not be "select"

### Issue: Images not uploading
**Solution**: Verify file types (must be image/*), check size limits

### Issue: "Please select a restaurant" error
**Solution**: Make sure selection dropdown is showing and user selected item

### Issue: Getting sync function error
**Solution**: Ensure `getRestaurants` and `getDishes` are imported correctly from services
