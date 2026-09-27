import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';

import {
  ActivityIndicator,
  Alert,
  FlatList,
  Pressable,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Switch,
  Text,
  TextInput,
  View,
} from 'react-native';

import users from './src/data/users';
import menuData from './src/data/menu';

/* =========================================================
   AUTH CONTEXT
========================================================= */

const AuthContext = createContext(null);

function AuthProvider({ children }) {
  const [user, setUser] = useState(null);

  const login = (loggedInUser) => {
    setUser(loggedInUser);
  };

  const logout = () => {
    setUser(null);
  };

  const value = useMemo(
    () => ({
      user,
      login,
      logout,
    }),
    [user]
  );

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error(
      'useAuth must be used inside AuthProvider'
    );
  }

  return context;
}

/* =========================================================
   THEME CONTEXT
========================================================= */

const ThemeContext = createContext(null);

function ThemeProvider({ children }) {
  const [isDark, setIsDark] = useState(false);

  const toggleTheme = () => {
    setIsDark((value) => !value);
  };

  return (
    <ThemeContext.Provider
      value={{
        isDark,
        toggleTheme,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
}

function useTheme() {
  const context = useContext(ThemeContext);

  if (!context) {
    throw new Error(
      'useTheme must be used inside ThemeProvider'
    );
  }

  return context;
}

/* =========================================================
   CART CONTEXT
========================================================= */

const CartContext = createContext(null);

function CartProvider({ children }) {
  const [items, setItems] = useState([]);
  const [promoCode, setPromoCode] = useState('');
  const [discountPercent, setDiscountPercent] =
    useState(0);

  const addItem = (item) => {
    setItems((currentItems) => {
      const existing = currentItems.find(
        (x) => x.id === item.id
      );

      if (existing) {
        return currentItems.map((x) =>
          x.id === item.id
            ? {
                ...x,
                quantity: x.quantity + 1,
              }
            : x
        );
      }

      return [
        ...currentItems,
        {
          ...item,
          quantity: 1,
          note: '',
        },
      ];
    });
  };

  const increment = (id) => {
    setItems((currentItems) =>
      currentItems.map((item) =>
        item.id === id
          ? {
              ...item,
              quantity: item.quantity + 1,
            }
          : item
      )
    );
  };

  const decrement = (id) => {
    setItems((currentItems) =>
      currentItems
        .map((item) =>
          item.id === id
            ? {
                ...item,
                quantity: item.quantity - 1,
              }
            : item
        )
        .filter((item) => item.quantity > 0)
    );
  };

  const removeItem = (id) => {
    setItems((currentItems) =>
      currentItems.filter((item) => item.id !== id)
    );
  };

  const clearCart = () => {
    setItems([]);
    setPromoCode('');
    setDiscountPercent(0);
  };

  const applyPromo = (code) => {
    const normalized = code.trim().toUpperCase();

    if (normalized === 'WELCOME10') {
      setPromoCode(normalized);
      setDiscountPercent(10);
      return true;
    }

    if (normalized === 'FEAST20') {
      setPromoCode(normalized);
      setDiscountPercent(20);
      return true;
    }

    return false;
  };

  return (
    <CartContext.Provider
      value={{
        items,
        promoCode,
        discountPercent,
        addItem,
        increment,
        decrement,
        removeItem,
        clearCart,
        applyPromo,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

function useCart() {
  const context = useContext(CartContext);

  if (!context) {
    throw new Error(
      'useCart must be used inside CartProvider'
    );
  }

  return context;
}

/* =========================================================
   ORDER CONTEXT
========================================================= */

const OrderContext = createContext(null);

function OrderProvider({ children }) {
  const [orders, setOrders] = useState([]);

  const placeOrder = (order) => {
    const newOrder = {
      ...order,
      id: `ORD-${Date.now().toString().slice(-6)}`,
      status: 'Pending',
      timestamp: Date.now(),
    };

    setOrders((currentOrders) => [
      newOrder,
      ...currentOrders,
    ]);

    return newOrder;
  };

  useEffect(() => {
    if (orders.length === 0) {
      return;
    }

    const timer = setInterval(() => {
      setOrders((currentOrders) =>
        currentOrders.map((order) => {
          const age =
            (Date.now() - order.timestamp) / 1000;

          let status = 'Pending';

          if (age >= 30) {
            status = 'Served';
          } else if (age >= 20) {
            status = 'Ready';
          } else if (age >= 10) {
            status = 'Preparing';
          }

          return {
            ...order,
            status,
          };
        })
      );
    }, 1000);

    return () => clearInterval(timer);
  }, [orders.length]);

  return (
    <OrderContext.Provider
      value={{
        orders,
        placeOrder,
      }}
    >
      {children}
    </OrderContext.Provider>
  );
}

function useOrders() {
  const context = useContext(OrderContext);

  if (!context) {
    throw new Error(
      'useOrders must be used inside OrderProvider'
    );
  }

  return context;
}

/* =========================================================
   LOCAL MENU DATA
   Pakistani restaurant menu
========================================================= */

const fallbackMenu = [
  {
    id: 1,
    name: 'Chicken Biryani',
    description:
      'Aromatic basmati rice with spicy chicken and traditional Pakistani spices.',
    price: 450,
    category: 'Main',
    isSpecial: true,
    isAvailable: true,
  },
  {
    id: 2,
    name: 'Beef Biryani',
    description:
      'Fragrant basmati rice cooked with tender beef and biryani masala.',
    price: 520,
    category: 'Main',
    isSpecial: false,
    isAvailable: true,
  },
  {
    id: 3,
    name: 'Chicken Karahi',
    description:
      'Traditional Pakistani chicken karahi with tomatoes, ginger and green chilies.',
    price: 850,
    category: 'Main',
    isSpecial: true,
    isAvailable: true,
  },
  {
    id: 4,
    name: 'Beef Nihari',
    description:
      'Slow-cooked beef stew served with traditional spices.',
    price: 650,
    category: 'Main',
    isSpecial: false,
    isAvailable: true,
  },
  {
    id: 5,
    name: 'Chicken Handi',
    description:
      'Creamy chicken handi cooked with tomatoes and aromatic spices.',
    price: 900,
    category: 'Main',
    isSpecial: false,
    isAvailable: true,
  },
  {
    id: 6,
    name: 'Seekh Kebab',
    description:
      'Juicy minced beef kebabs grilled with Pakistani spices.',
    price: 550,
    category: 'Starters',
    isSpecial: false,
    isAvailable: true,
  },
  {
    id: 7,
    name: 'Chicken Tikka',
    description:
      'Charcoal grilled chicken pieces marinated in traditional spices.',
    price: 600,
    category: 'Starters',
    isSpecial: true,
    isAvailable: true,
  },
  {
    id: 8,
    name: 'Samosa',
    description:
      'Crispy pastry filled with spicy potato and peas.',
    price: 120,
    category: 'Starters',
    isSpecial: false,
    isAvailable: true,
  },
  {
    id: 9,
    name: 'Pakora',
    description:
      'Crispy mixed vegetable fritters with gram flour.',
    price: 180,
    category: 'Starters',
    isSpecial: false,
    isAvailable: true,
  },
  {
    id: 10,
    name: 'Gulab Jamun',
    description:
      'Soft milk dumplings soaked in sweet sugar syrup.',
    price: 220,
    category: 'Desserts',
    isSpecial: false,
    isAvailable: true,
  },
  {
    id: 11,
    name: 'Kheer',
    description:
      'Traditional Pakistani rice pudding with cardamom and nuts.',
    price: 250,
    category: 'Desserts',
    isSpecial: true,
    isAvailable: true,
  },
  {
    id: 12,
    name: 'Gajar Ka Halwa',
    description:
      'Traditional carrot dessert prepared with milk and nuts.',
    price: 280,
    category: 'Desserts',
    isSpecial: false,
    isAvailable: true,
  },
  {
    id: 13,
    name: 'Fresh Lime',
    description:
      'Refreshing freshly squeezed lime drink.',
    price: 180,
    category: 'Drinks',
    isSpecial: false,
    isAvailable: true,
  },
  {
    id: 14,
    name: 'Mango Lassi',
    description:
      'Creamy yogurt drink blended with sweet Pakistani mangoes.',
    price: 250,
    category: 'Drinks',
    isSpecial: true,
    isAvailable: true,
  },
  {
    id: 15,
    name: 'Chai',
    description:
      'Traditional Pakistani milk tea with cardamom.',
    price: 150,
    category: 'Drinks',
    isSpecial: false,
    isAvailable: true,
  },
];

/* =========================================================
   LOGIN
========================================================= */

function LoginScreen() {
  const { login } = useAuth();
  const { isDark } = useTheme();

  const [signup, setSignup] = useState(false);

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] =
    useState('');

  const [role, setRole] = useState('customer');
  const [showPassword, setShowPassword] =
    useState(false);
  const [isSubmitting, setIsSubmitting] =
    useState(false);

  const background = isDark
    ? '#111827'
    : '#f5f7fb';

  const card = isDark
    ? '#1f2937'
    : '#ffffff';

  const text = isDark
    ? '#ffffff'
    : '#111827';

  const muted = '#6b7280';

  const submit = async () => {
    if (!email.trim() || !password.trim()) {
      Alert.alert(
        'Missing information',
        'Please enter email and password.'
      );
      return;
    }

    if (signup) {
      if (!name.trim()) {
        Alert.alert(
          'Missing information',
          'Please enter your name.'
        );
        return;
      }

      if (
        password.length < 8 ||
        !/\d/.test(password)
      ) {
        Alert.alert(
          'Invalid password',
          'Password must contain at least 8 characters and 1 digit.'
        );
        return;
      }

      if (password !== confirmPassword) {
        Alert.alert(
          'Password mismatch',
          'Passwords do not match.'
        );
        return;
      }
    }

    setIsSubmitting(true);

    await new Promise((resolve) =>
      setTimeout(resolve, 1000)
    );

    const foundUser = users.find(
      (item) =>
        item.email.toLowerCase() ===
          email.trim().toLowerCase() &&
        item.password === password
    );

    setIsSubmitting(false);

    if (foundUser) {
      login(foundUser);
      return;
    }

    if (signup) {
      login({
        id: Date.now(),
        name: name.trim(),
        email: email.trim(),
        password,
        role,
      });

      return;
    }

    Alert.alert(
      'Login failed',
      'Use the demo credentials shown below.'
    );
  };

  return (
    <SafeAreaView
      style={[
        styles.container,
        {
          backgroundColor: background,
        },
      ]}
    >
      <StatusBar
        barStyle={
          isDark
            ? 'light-content'
            : 'dark-content'
        }
      />

      <ScrollView
        contentContainerStyle={
          styles.loginContainer
        }
      >
        <View
          style={[
            styles.loginCard,
            {
              backgroundColor: card,
            },
          ]}
        >
          <Text
            style={[
              styles.title,
              { color: text },
            ]}
          >
            🍽️ Pakistani Restaurant
          </Text>

          <Text
            style={[
              styles.subtitle,
              { color: muted },
            ]}
          >
            {signup
              ? 'Create your account'
              : 'Welcome back'}
          </Text>

          {signup && (
            <TextInput
              value={name}
              onChangeText={setName}
              placeholder="Full name"
              placeholderTextColor={muted}
              style={[
                styles.input,
                { color: text },
              ]}
            />
          )}

          <TextInput
            value={email}
            onChangeText={setEmail}
            placeholder="Email"
            placeholderTextColor={muted}
            autoCapitalize="none"
            keyboardType="email-address"
            style={[
              styles.input,
              { color: text },
            ]}
          />

          <TextInput
            value={password}
            onChangeText={setPassword}
            placeholder="Password"
            placeholderTextColor={muted}
            secureTextEntry={!showPassword}
            style={[
              styles.input,
              { color: text },
            ]}
          />

          {signup && (
            <>
              <TextInput
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                placeholder="Confirm password"
                placeholderTextColor={muted}
                secureTextEntry={!showPassword}
                style={[
                  styles.input,
                  { color: text },
                ]}
              />

              <Text
                style={[
                  styles.label,
                  { color: text },
                ]}
              >
                Account Role
              </Text>

              <View style={styles.roleRow}>
                <Pressable
                  onPress={() =>
                    setRole('customer')
                  }
                  style={[
                    styles.roleButton,
                    role === 'customer' &&
                      styles.selectedRole,
                  ]}
                >
                  <Text style={styles.roleText}>
                    Customer
                  </Text>
                </Pressable>

                <Pressable
                  onPress={() =>
                    setRole('manager')
                  }
                  style={[
                    styles.roleButton,
                    role === 'manager' &&
                      styles.selectedRole,
                  ]}
                >
                  <Text style={styles.roleText}>
                    Manager
                  </Text>
                </Pressable>
              </View>
            </>
          )}

          <View style={styles.switchRow}>
            <Text style={{ color: text }}>
              Show password
            </Text>

            <Switch
              value={showPassword}
              onValueChange={setShowPassword}
            />
          </View>

          <Pressable
            disabled={isSubmitting}
            onPress={submit}
            style={styles.primaryButton}
          >
            {isSubmitting ? (
              <ActivityIndicator
                color="#ffffff"
              />
            ) : (
              <Text
                style={
                  styles.primaryButtonText
                }
              >
                {signup
                  ? 'Create Account'
                  : 'Login'}
              </Text>
            )}
          </Pressable>

          <Pressable
            onPress={() =>
              setSignup((value) => !value)
            }
          >
            <Text style={styles.linkText}>
              {signup
                ? 'Already have an account? Login'
                : 'Create a new account'}
            </Text>
          </Pressable>

          {!signup && (
            <View style={styles.demoBox}>
              <Text
                style={[
                  styles.demoTitle,
                  { color: text },
                ]}
              >
                Demo Credentials
              </Text>

              <Text style={{ color: muted }}>
                Customer
              </Text>

              <Text style={{ color: muted }}>
                customer@example.com
              </Text>

              <Text style={{ color: muted }}>
                Customer123
              </Text>

              <View style={{ height: 10 }} />

              <Text style={{ color: muted }}>
                Manager
              </Text>

              <Text style={{ color: muted }}>
                manager@example.com
              </Text>

              <Text style={{ color: muted }}>
                Manager123
              </Text>
            </View>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

/* =========================================================
   MENU
========================================================= */

function MenuScreen() {
  const { addItem } = useCart();
  const { isDark } = useTheme();

  const [search, setSearch] = useState('');
  const [category, setCategory] =
    useState('All');

  const sourceMenu =
    Array.isArray(menuData) &&
    menuData.length >= 10
      ? menuData
      : fallbackMenu;

  const categories = [
    'All',
    'Starters',
    'Main',
    'Desserts',
    'Drinks',
  ];

  const filteredMenu = sourceMenu.filter(
    (item) => {
      const categoryMatch =
        category === 'All' ||
        item.category === category;

      const searchMatch =
        item.name
          .toLowerCase()
          .includes(search.toLowerCase()) ||
        item.description
          .toLowerCase()
          .includes(search.toLowerCase());

      return (
        categoryMatch && searchMatch
      );
    }
  );

  const background = isDark
    ? '#111827'
    : '#f5f7fb';

  const text = isDark
    ? '#ffffff'
    : '#111827';

  return (
    <SafeAreaView
      style={[
        styles.container,
        {
          backgroundColor: background,
        },
      ]}
    >
      <View style={styles.menuHeader}>
        <View>
          <Text
            style={[
              styles.screenTitle,
              { color: text },
            ]}
          >
            Our Menu
          </Text>

          <Text
            style={styles.headerSubtitle}
          >
            Pakistani & Continental Cuisine
          </Text>
        </View>

        <Text
          style={[
            styles.countText,
            { color: text },
          ]}
        >
          {filteredMenu.length}
        </Text>
      </View>

      <TextInput
        value={search}
        onChangeText={setSearch}
        placeholder="🔍 Search food..."
        placeholderTextColor="#9ca3af"
        style={styles.searchInput}
      />

      {/* COMPACT CATEGORY CHIPS */}

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={
          styles.categoryContainer
        }
      >
        {categories.map((item) => (
          <Pressable
            key={item}
            onPress={() =>
              setCategory(item)
            }
            style={[
              styles.categoryChip,
              category === item &&
                styles.activeCategoryChip,
            ]}
          >
            <Text
              style={[
                styles.categoryChipText,
                category === item &&
                  styles.activeCategoryText,
              ]}
            >
              {item}
            </Text>
          </Pressable>
        ))}
      </ScrollView>

      <FlatList
        data={filteredMenu}
        keyExtractor={(item) =>
          String(item.id)
        }
        contentContainerStyle={
          styles.menuList
        }
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => (
          <View
            style={[
              styles.menuCard,
              {
                backgroundColor:
                  isDark
                    ? '#1f2937'
                    : '#ffffff',
                opacity:
                  item.isAvailable === false
                    ? 0.5
                    : 1,
              },
            ]}
          >
            <View
              style={
                styles.menuCardContent
              }
            >
              <View
                style={
                  styles.menuTitleRow
                }
              >
                <Text
                  style={[
                    styles.menuName,
                    { color: text },
                  ]}
                >
                  {item.name}
                </Text>

                {item.isSpecial && (
                  <Text
                    style={styles.specialBadge}
                  >
                    SPECIAL
                  </Text>
                )}
              </View>

              <Text
                style={[
                  styles.menuDescription,
                  {
                    color: isDark
                      ? '#9ca3af'
                      : '#6b7280',
                  },
                ]}
              >
                {item.description}
              </Text>

              <View
                style={
                  styles.menuBottomRow
                }
              >
                <Text
                  style={styles.price}
                >
                  PKR{' '}
                  {Number(
                    item.price
                  ).toLocaleString()}
                </Text>

                <Pressable
                  disabled={
                    item.isAvailable ===
                    false
                  }
                  onPress={() => {
                    addItem(item);

                    Alert.alert(
                      'Added to Cart',
                      `${item.name} has been added to your cart.`
                    );
                  }}
                  style={[
                    styles.addButton,
                    item.isAvailable ===
                      false &&
                      styles.disabledButton,
                  ]}
                >
                  <Text
                    style={
                      styles.addButtonText
                    }
                  >
                    {item.isAvailable ===
                    false
                      ? 'Unavailable'
                      : '+ Add'}
                  </Text>
                </Pressable>
              </View>
            </View>
          </View>
        )}
        ListEmptyComponent={
          <View
            style={styles.emptyBox}
          >
            <Text
              style={[
                styles.emptyText,
                { color: text },
              ]}
            >
              No food found
            </Text>

            <Text
              style={styles.emptySubtext}
            >
              Try another search or category.
            </Text>
          </View>
        }
      />
    </SafeAreaView>
  );
}

/* =========================================================
   CART
========================================================= */

function CartScreen({
  onOrderPlaced,
}) {
  const {
    items,
    increment,
    decrement,
    removeItem,
    clearCart,
    promoCode,
    discountPercent,
    applyPromo,
  } = useCart();

  const { placeOrder } = useOrders();
  const { isDark } = useTheme();

  const [promo, setPromo] = useState('');

  const subtotal = items.reduce(
    (sum, item) =>
      sum +
      Number(item.price) *
        item.quantity,
    0
  );

  const discount =
    subtotal *
    (discountPercent / 100);

  const service =
    (subtotal - discount) * 0.05;

  const tax =
    (subtotal - discount) * 0.15;

  const total =
    subtotal -
    discount +
    service +
    tax;

  const background = isDark
    ? '#111827'
    : '#f5f7fb';

  const text = isDark
    ? '#ffffff'
    : '#111827';

  const handlePlaceOrder = () => {
    if (items.length === 0) {
      Alert.alert(
        'Empty Cart',
        'Please add items before placing an order.'
      );
      return;
    }

    const order = placeOrder({
      items,
      subtotal,
      discount,
      service,
      tax,
      total,
      type: 'Takeaway',
    });

    clearCart();

    Alert.alert(
      'Order Placed Successfully! 🎉',
      `Your order ${order.id} has been placed.\n\nYou can now track your order from the Orders tab.`,
      [
        {
          text: 'Track Order',
          onPress: () =>
            onOrderPlaced(),
        },
      ]
    );
  };

  return (
    <SafeAreaView
      style={[
        styles.container,
        {
          backgroundColor: background,
        },
      ]}
    >
      <View style={styles.screenHeader}>
        <Text
          style={[
            styles.screenTitle,
            { color: text },
          ]}
        >
          Your Cart
        </Text>

        <Text style={styles.headerSubtitle}>
          {items.length} item(s)
        </Text>
      </View>

      {items.length === 0 ? (
        <View style={styles.emptyBox}>
          <Text
            style={[
              styles.emptyText,
              { color: text },
            ]}
          >
            🛒 Your cart is empty
          </Text>

          <Text style={styles.emptySubtext}>
            Add delicious Pakistani food from the Menu.
          </Text>
        </View>
      ) : (
        <>
          <FlatList
            data={items}
            keyExtractor={(item) =>
              String(item.id)
            }
            contentContainerStyle={
              styles.menuList
            }
            showsVerticalScrollIndicator={false}
            renderItem={({ item }) => (
              <View
                style={[
                  styles.cartItem,
                  {
                    backgroundColor:
                      isDark
                        ? '#1f2937'
                        : '#ffffff',
                  },
                ]}
              >
                <View
                  style={
                    styles.cartItemTop
                  }
                >
                  <View
                    style={{
                      flex: 1,
                    }}
                  >
                    <Text
                      style={[
                        styles.menuName,
                        { color: text },
                      ]}
                    >
                      {item.name}
                    </Text>

                    <Text
                      style={
                        styles.price
                      }
                    >
                      PKR{' '}
                      {Number(
                        item.price
                      ).toLocaleString()}
                    </Text>
                  </View>

                  <Pressable
                    onPress={() =>
                      removeItem(
                        item.id
                      )
                    }
                  >
                    <Text
                      style={
                        styles.removeText
                      }
                    >
                      Remove
                    </Text>
                  </Pressable>
                </View>

                <View
                  style={
                    styles.quantityRow
                  }
                >
                  <Pressable
                    onPress={() =>
                      decrement(
                        item.id
                      )
                    }
                    style={
                      styles.quantityButton
                    }
                  >
                    <Text>-</Text>
                  </Pressable>

                  <Text
                    style={[
                      styles.quantity,
                      { color: text },
                    ]}
                  >
                    {item.quantity}
                  </Text>

                  <Pressable
                    onPress={() =>
                      increment(
                        item.id
                      )
                    }
                    style={
                      styles.quantityButton
                    }
                  >
                    <Text>+</Text>
                  </Pressable>
                </View>
              </View>
            )}
          />

          <View
            style={[
              styles.summaryBox,
              {
                backgroundColor:
                  isDark
                    ? '#1f2937'
                    : '#ffffff',
              },
            ]}
          >
            <View
              style={
                styles.promoRow
              }
            >
              <TextInput
                value={promo}
                onChangeText={setPromo}
                placeholder="Promo code"
                placeholderTextColor="#9ca3af"
                style={[
                  styles.promoInput,
                  { color: text },
                ]}
              />

              <Pressable
                onPress={() => {
                  const success =
                    applyPromo(
                      promo
                    );

                  if (!success) {
                    Alert.alert(
                      'Invalid Promo',
                      'Try WELCOME10 or FEAST20.'
                    );
                  } else {
                    Alert.alert(
                      'Promo Applied',
                      `${promo.toUpperCase()} applied successfully.`
                    );
                  }
                }}
                style={
                  styles.promoButton
                }
              >
                <Text
                  style={
                    styles.primaryButtonText
                  }
                >
                  Apply
                </Text>
              </Pressable>
            </View>

            {promoCode ? (
              <Text
                style={
                  styles.promoText
                }
              >
                {promoCode} —{' '}
                {discountPercent}% discount
              </Text>
            ) : null}

            <View
              style={
                styles.summaryLine
              }
            >
              <Text style={{ color: text }}>
                Subtotal
              </Text>

              <Text style={{ color: text }}>
                PKR{' '}
                {subtotal.toLocaleString()}
              </Text>
            </View>

            <View
              style={
                styles.summaryLine
              }
            >
              <Text style={{ color: text }}>
                Discount
              </Text>

              <Text
                style={{
                  color: '#16a34a',
                }}
              >
                - PKR{' '}
                {discount.toLocaleString()}
              </Text>
            </View>

            <View
              style={
                styles.summaryLine
              }
            >
              <Text style={{ color: text }}>
                Service 5%
              </Text>

              <Text style={{ color: text }}>
                PKR{' '}
                {service.toLocaleString()}
              </Text>
            </View>

            <View
              style={
                styles.summaryLine
              }
            >
              <Text style={{ color: text }}>
                Tax 15%
              </Text>

              <Text style={{ color: text }}>
                PKR{' '}
                {tax.toLocaleString()}
              </Text>
            </View>

            <View
              style={[
                styles.summaryLine,
                {
                  marginTop: 10,
                },
              ]}
            >
              <Text
                style={[
                  styles.total,
                  { color: text },
                ]}
              >
                Total
              </Text>

              <Text
                style={[
                  styles.total,
                  { color: '#16a34a' },
                ]}
              >
                PKR{' '}
                {total.toLocaleString()}
              </Text>
            </View>

            <Pressable
              onPress={handlePlaceOrder}
              style={styles.placeOrderButton}
            >
              <Text
                style={
                  styles.primaryButtonText
                }
              >
                🛍️ Place Order
              </Text>
            </Pressable>
          </View>
        </>
      )}
    </SafeAreaView>
  );
}

/* =========================================================
   ORDER TRACKING
========================================================= */

function OrderTrackingScreen() {
  const { orders } = useOrders();
  const { isDark } = useTheme();

  const background = isDark
    ? '#111827'
    : '#f5f7fb';

  const text = isDark
    ? '#ffffff'
    : '#111827';

  const latestOrder = orders[0];

  const getProgress = (status) => {
    if (status === 'Pending') return 25;
    if (status === 'Preparing') return 50;
    if (status === 'Ready') return 75;
    if (status === 'Served') return 100;

    return 0;
  };

  const progress = latestOrder
    ? getProgress(
        latestOrder.status
      )
    : 0;

  const elapsed = latestOrder
    ? Math.floor(
        (Date.now() -
          latestOrder.timestamp) /
          1000
      )
    : 0;

  return (
    <SafeAreaView
      style={[
        styles.container,
        {
          backgroundColor: background,
        },
      ]}
    >
      <View style={styles.screenHeader}>
        <Text
          style={[
            styles.screenTitle,
            { color: text },
          ]}
        >
          Order Tracking
        </Text>
      </View>

      {!latestOrder ? (
        <View style={styles.emptyBox}>
          <Text
            style={[
              styles.emptyText,
              { color: text },
            ]}
          >
            📦 No orders yet
          </Text>

          <Text style={styles.emptySubtext}>
            Place an order and track it here.
          </Text>
        </View>
      ) : (
        <ScrollView
          contentContainerStyle={
            styles.trackingContainer
          }
        >
          <View
            style={[
              styles.trackingCard,
              {
                backgroundColor:
                  isDark
                    ? '#1f2937'
                    : '#ffffff',
              },
            ]}
          >
            <Text
              style={[
                styles.orderId,
                { color: text },
              ]}
            >
              {latestOrder.id}
            </Text>

            <Text
              style={[
                styles.statusTitle,
                { color: text },
              ]}
            >
              {latestOrder.status}
            </Text>

            <Text
              style={
                styles.headerSubtitle
              }
            >
              Estimated progress
            </Text>

            <View
              style={
                styles.progressBackground
              }
            >
              <View
                style={[
                  styles.progressFill,
                  {
                    width: `${progress}%`,
                  },
                ]}
              />
            </View>

            <Text
              style={[
                styles.progressText,
                { color: text },
              ]}
            >
              {progress}% Complete
            </Text>

            <Text
              style={[
                styles.elapsedText,
                { color: text },
              ]}
            >
              Elapsed time: {elapsed}s
            </Text>

            <View
              style={
                styles.statusList
              }
            >
              <StatusStep
                title="Order Received"
                active
                completed={
                  progress >= 25
                }
              />

              <StatusStep
                title="Preparing"
                active={
                  latestOrder.status ===
                    'Preparing' ||
                  progress > 50
                }
                completed={
                  progress >= 50
                }
              />

              <StatusStep
                title="Ready"
                active={
                  latestOrder.status ===
                    'Ready' ||
                  progress > 75
                }
                completed={
                  progress >= 75
                }
              />

              <StatusStep
                title="Served"
                active={
                  latestOrder.status ===
                  'Served'
                }
                completed={
                  progress >= 100
                }
              />
            </View>

            <Text
              style={[
                styles.orderTotal,
                { color: text },
              ]}
            >
              Total: PKR{' '}
              {latestOrder.total.toLocaleString()}
            </Text>
          </View>
        </ScrollView>
      )}
    </SafeAreaView>
  );
}

function StatusStep({
  title,
  completed,
}) {
  return (
    <View
      style={
        styles.statusStep
      }
    >
      <View
        style={[
          styles.statusCircle,
          completed &&
            styles.statusCircleActive,
        ]}
      >
        <Text
          style={
            styles.statusCircleText
          }
        >
          {completed ? '✓' : ''}
        </Text>
      </View>

      <Text
        style={
          styles.statusStepText
        }
      >
        {title}
      </Text>
    </View>
  );
}

/* =========================================================
   PROFILE
========================================================= */

function ProfileScreen() {
  const { user, logout } = useAuth();
  const { isDark, toggleTheme } =
    useTheme();

  const background = isDark
    ? '#111827'
    : '#f5f7fb';

  const card = isDark
    ? '#1f2937'
    : '#ffffff';

  const text = isDark
    ? '#ffffff'
    : '#111827';

  return (
    <SafeAreaView
      style={[
        styles.container,
        {
          backgroundColor: background,
        },
      ]}
    >
      <View style={styles.screenHeader}>
        <Text
          style={[
            styles.screenTitle,
            { color: text },
          ]}
        >
          Profile
        </Text>
      </View>

      <View
        style={[
          styles.profileCard,
          {
            backgroundColor: card,
          },
        ]}
      >
        <Text
          style={[
            styles.profileName,
            { color: text },
          ]}
        >
          {user?.name}
        </Text>

        <Text
          style={
            styles.profileInfo
          }
        >
          {user?.email}
        </Text>

        <Text
          style={
            styles.profileInfo
          }
        >
          Role: {user?.role}
        </Text>

        <View
          style={styles.switchRow}
        >
          <Text style={{ color: text }}>
            Dark Mode
          </Text>

          <Switch
            value={isDark}
            onValueChange={
              toggleTheme
            }
          />
        </View>

        <Pressable
          onPress={logout}
          style={styles.logoutButton}
        >
          <Text
            style={
              styles.logoutText
            }
          >
            Logout
          </Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

/* =========================================================
   MANAGER DASHBOARD
========================================================= */

function ManagerDashboardScreen() {
  const { user, logout } =
    useAuth();

  const { isDark } =
    useTheme();

  const background = isDark
    ? '#111827'
    : '#f5f7fb';

  const card = isDark
    ? '#1f2937'
    : '#ffffff';

  const text = isDark
    ? '#ffffff'
    : '#111827';

  return (
    <SafeAreaView
      style={[
        styles.container,
        {
          backgroundColor:
            background,
        },
      ]}
    >
      <ScrollView
        contentContainerStyle={
          styles.dashboard
        }
      >
        <Text
          style={[
            styles.dashboardTitle,
            { color: text },
          ]}
        >
          Manager Dashboard
        </Text>

        <Text
          style={
            styles.dashboardSubtitle
          }
        >
          Welcome, {user?.name}
        </Text>

        <View
          style={[
            styles.statCard,
            {
              backgroundColor:
                card,
            },
          ]}
        >
          <Text
            style={
              styles.statNumber
            }
          >
            12
          </Text>

          <Text style={{ color: text }}>
            Incoming Orders
          </Text>
        </View>

        <View
          style={[
            styles.statCard,
            {
              backgroundColor:
                card,
            },
          ]}
        >
          <Text
            style={
              styles.statNumber
            }
          >
            5
          </Text>

          <Text style={{ color: text }}>
            Reservations
          </Text>
        </View>

        <View
          style={[
            styles.statCard,
            {
              backgroundColor:
                card,
            },
          ]}
        >
          <Text
            style={
              styles.statNumber
            }
          >
            15
          </Text>

          <Text style={{ color: text }}>
            Menu Items
          </Text>
        </View>

        <View
          style={[
            styles.managerPanel,
            {
              backgroundColor:
                card,
            },
          ]}
        >
          <Text
            style={[
              styles.panelTitle,
              { color: text },
            ]}
          >
            Incoming Orders
          </Text>

          <Text
            style={
              styles.panelText
            }
          >
            ORD-1001 — Preparing
          </Text>

          <Text
            style={
              styles.panelText
            }
          >
            ORD-1002 — Pending
          </Text>

          <Text
            style={
              styles.panelText
            }
          >
            ORD-1003 — Ready
          </Text>
        </View>

        <View
          style={[
            styles.managerPanel,
            {
              backgroundColor:
                card,
            },
          ]}
        >
          <Text
            style={[
              styles.panelTitle,
              { color: text },
            ]}
          >
            Reservations
          </Text>

          <Text
            style={
              styles.panelText
            }
          >
            Table 4 — 2 guests
          </Text>

          <Text
            style={
              styles.panelText
            }
          >
            Table 7 — 4 guests
          </Text>

          <Text
            style={
              styles.panelText
            }
          >
            Table 10 — 6 guests
          </Text>
        </View>

        <View
          style={[
            styles.managerPanel,
            {
              backgroundColor:
                card,
            },
          ]}
        >
          <Text
            style={[
              styles.panelTitle,
              { color: text },
            ]}
          >
            Menu Management
          </Text>

          <Text
            style={
              styles.panelText
            }
          >
            Add menu item
          </Text>

          <Text
            style={
              styles.panelText
            }
          >
            Edit menu price
          </Text>

          <Text
            style={
              styles.panelText
            }
          >
            Toggle availability
          </Text>
        </View>

        <Pressable
          onPress={logout}
          style={styles.logoutButton}
        >
          <Text
            style={
              styles.logoutText
            }
          >
            Logout
          </Text>
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
}

/* =========================================================
   MAIN APP
========================================================= */

function MainApp() {
  const { user } = useAuth();

  const [tab, setTab] =
    useState(
      user?.role === 'manager'
        ? 'dashboard'
        : 'menu'
    );

  useEffect(() => {
    setTab(
      user?.role === 'manager'
        ? 'dashboard'
        : 'menu'
    );
  }, [user?.role]);

  if (user?.role === 'manager') {
    return (
      <SafeAreaView
        style={styles.container}
      >
        {tab === 'dashboard' && (
          <ManagerDashboardScreen />
        )}

        {tab === 'profile' && (
          <ProfileScreen />
        )}

        <BottomNavigation
          tabs={[
            {
              id: 'dashboard',
              label: 'Dashboard',
              icon: '📊',
            },
            {
              id: 'profile',
              label: 'Profile',
              icon: '👤',
            },
          ]}
          activeTab={tab}
          setTab={setTab}
        />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView
      style={styles.container}
    >
      {tab === 'menu' && (
        <MenuScreen />
      )}

      {tab === 'cart' && (
        <CartScreen
          onOrderPlaced={() =>
            setTab('orders')
          }
        />
      )}

      {tab === 'orders' && (
        <OrderTrackingScreen />
      )}

      {tab === 'profile' && (
        <ProfileScreen />
      )}

      <BottomNavigation
        tabs={[
          {
            id: 'menu',
            label: 'Menu',
            icon: '🍽️',
          },
          {
            id: 'cart',
            label: 'Cart',
            icon: '🛒',
          },
          {
            id: 'orders',
            label: 'Orders',
            icon: '📦',
          },
          {
            id: 'profile',
            label: 'Profile',
            icon: '👤',
          },
        ]}
        activeTab={tab}
        setTab={setTab}
      />
    </SafeAreaView>
  );
}

/* =========================================================
   BOTTOM NAVIGATION
========================================================= */

function BottomNavigation({
  tabs,
  activeTab,
  setTab,
}) {
  return (
    <View style={styles.bottomNavigation}>
      {tabs.map((item) => (
        <Pressable
          key={item.id}
          onPress={() =>
            setTab(item.id)
          }
          style={[
            styles.bottomTab,
            activeTab === item.id &&
              styles.activeBottomTab,
          ]}
        >
          <Text
            style={
              styles.bottomIcon
            }
          >
            {item.icon}
          </Text>

          <Text
            style={[
              styles.bottomLabel,
              activeTab === item.id &&
                styles.activeBottomLabel,
            ]}
          >
            {item.label}
          </Text>
        </Pressable>
      ))}
    </View>
  );
}

/* =========================================================
   APP CONTENT
========================================================= */

function AppContent() {
  const { user } = useAuth();

  return user ? (
    <MainApp />
  ) : (
    <LoginScreen />
  );
}

/* =========================================================
   ROOT APP
========================================================= */

export default function App() {
  return (
    <AuthProvider>
      <ThemeProvider>
        <CartProvider>
          <OrderProvider>
            <AppContent />
          </OrderProvider>
        </CartProvider>
      </ThemeProvider>
    </AuthProvider>
  );
}

/* =========================================================
   STYLES
========================================================= */

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  loginContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 20,
  },

  loginCard: {
    padding: 24,
    borderRadius: 20,
    elevation: 4,
  },

  title: {
    fontSize: 28,
    fontWeight: '900',
    textAlign: 'center',
    marginBottom: 8,
  },

  subtitle: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 24,
  },

  input: {
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 12,
    padding: 14,
    marginBottom: 14,
    fontSize: 16,
    backgroundColor: '#ffffff',
  },

  label: {
    fontWeight: '800',
    marginBottom: 8,
  },

  roleRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 14,
  },

  roleButton: {
    flex: 1,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 10,
    alignItems: 'center',
  },

  selectedRole: {
    backgroundColor: '#dbeafe',
    borderColor: '#2563eb',
  },

  roleText: {
    fontWeight: '800',
  },

  switchRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 12,
  },

  primaryButton: {
    backgroundColor: '#2563eb',
    padding: 15,
    borderRadius: 12,
    alignItems: 'center',
    marginVertical: 10,
  },

  primaryButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '900',
  },

  linkText: {
    color: '#2563eb',
    textAlign: 'center',
    fontWeight: '800',
    marginVertical: 10,
  },

  demoBox: {
    marginTop: 18,
    padding: 15,
    backgroundColor: '#f3f4f6',
    borderRadius: 12,
  },

  demoTitle: {
    fontWeight: '900',
    marginBottom: 8,
  },

  menuHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 4,
  },

  screenHeader: {
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 8,
  },

  screenTitle: {
    fontSize: 27,
    fontWeight: '900',
  },

  headerSubtitle: {
    color: '#6b7280',
    fontSize: 13,
    marginTop: 3,
  },

  countText: {
    fontSize: 24,
    fontWeight: '900',
  },

  searchInput: {
    marginHorizontal: 16,
    marginVertical: 10,
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    backgroundColor: '#ffffff',
    fontSize: 15,
  },

  /* IMPORTANT:
     Compact horizontal category chips */

  categoryContainer: {
    paddingHorizontal: 16,
    paddingBottom: 10,
    gap: 8,
  },

  categoryChip: {
    height: 38,
    paddingHorizontal: 15,
    borderRadius: 20,
    backgroundColor: '#e5e7eb',
    alignItems: 'center',
    justifyContent: 'center',
  },

  activeCategoryChip: {
    backgroundColor: '#2563eb',
  },

  categoryChipText: {
    fontSize: 13,
    fontWeight: '800',
    color: '#374151',
  },

  activeCategoryText: {
    color: '#ffffff',
  },

  menuList: {
    paddingHorizontal: 16,
    paddingTop: 4,
    paddingBottom: 110,
  },

  menuCard: {
    borderRadius: 16,
    marginBottom: 12,
    elevation: 2,
    shadowOpacity: 0.08,
    shadowRadius: 4,
  },

  menuCardContent: {
    padding: 15,
  },

  menuTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  menuName: {
    fontSize: 17,
    fontWeight: '900',
    flex: 1,
  },

  menuDescription: {
    fontSize: 13,
    lineHeight: 19,
    marginTop: 6,
    marginBottom: 10,
  },

  menuBottomRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  price: {
    color: '#16a34a',
    fontSize: 16,
    fontWeight: '900',
  },

  specialBadge: {
    backgroundColor: '#fef3c7',
    color: '#92400e',
    fontSize: 9,
    fontWeight: '900',
    paddingHorizontal: 7,
    paddingVertical: 4,
    borderRadius: 8,
    marginLeft: 8,
  },

  addButton: {
    backgroundColor: '#2563eb',
    paddingHorizontal: 14,
    paddingVertical: 9,
    borderRadius: 10,
  },

  disabledButton: {
    backgroundColor: '#9ca3af',
  },

  addButtonText: {
    color: '#ffffff',
    fontWeight: '900',
    fontSize: 13,
  },

  emptyBox: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 30,
  },

  emptyText: {
    fontSize: 20,
    fontWeight: '900',
    textAlign: 'center',
  },

  emptySubtext: {
    color: '#6b7280',
    textAlign: 'center',
    marginTop: 8,
  },

  cartItem: {
    padding: 15,
    marginBottom: 10,
    borderRadius: 14,
    elevation: 2,
  },

  cartItemTop: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  removeText: {
    color: '#dc2626',
    fontWeight: '800',
  },

  quantityRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 12,
  },

  quantityButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#e5e7eb',
    alignItems: 'center',
    justifyContent: 'center',
  },

  quantity: {
    fontSize: 18,
    fontWeight: '900',
    marginHorizontal: 15,
  },

  summaryBox: {
    padding: 16,
    borderTopWidth: 1,
    borderColor: '#e5e7eb',
  },

  promoRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  promoInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 10,
    padding: 11,
    marginRight: 8,
    backgroundColor: '#ffffff',
  },

  promoButton: {
    backgroundColor: '#2563eb',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 10,
  },

  promoText: {
    color: '#16a34a',
    fontWeight: '900',
    marginVertical: 8,
  },

  summaryLine: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 4,
  },

  total: {
    fontSize: 21,
    fontWeight: '900',
  },

  placeOrderButton: {
    backgroundColor: '#16a34a',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 15,
  },

  /* =======================================================
     ORDER TRACKING
  ======================================================= */

  trackingContainer: {
    padding: 16,
    paddingBottom: 110,
  },

  trackingCard: {
    padding: 20,
    borderRadius: 18,
    elevation: 3,
  },

  orderId: {
    fontSize: 16,
    fontWeight: '800',
  },

  statusTitle: {
    fontSize: 30,
    fontWeight: '900',
    marginTop: 8,
  },

  progressBackground: {
    height: 12,
    backgroundColor: '#e5e7eb',
    borderRadius: 10,
    overflow: 'hidden',
    marginTop: 15,
  },

  progressFill: {
    height: '100%',
    backgroundColor: '#16a34a',
    borderRadius: 10,
  },

  progressText: {
    fontWeight: '800',
    marginTop: 8,
  },

  elapsedText: {
    marginTop: 4,
    color: '#6b7280',
  },

  statusList: {
    marginTop: 25,
  },

  statusStep: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },

  statusCircle: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: '#d1d5db',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },

  statusCircleActive: {
    backgroundColor: '#16a34a',
  },

  statusCircleText: {
    color: '#ffffff',
    fontWeight: '900',
  },

  statusStepText: {
    fontSize: 16,
    fontWeight: '700',
  },

  orderTotal: {
    fontSize: 20,
    fontWeight: '900',
    marginTop: 10,
  },

  /* =======================================================
     PROFILE
  ======================================================= */

  profileCard: {
    margin: 16,
    padding: 20,
    borderRadius: 18,
    elevation: 3,
  },

  profileName: {
    fontSize: 25,
    fontWeight: '900',
    marginBottom: 8,
  },

  profileInfo: {
    color: '#6b7280',
    marginBottom: 7,
  },

  logoutButton: {
    backgroundColor: '#dc2626',
    padding: 14,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 20,
  },

  logoutText: {
    color: '#ffffff',
    fontWeight: '900',
  },

  /* =======================================================
     BOTTOM NAVIGATION
  ======================================================= */

  bottomNavigation: {
    flexDirection: 'row',
    backgroundColor: '#ffffff',
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
    minHeight: 65,
    paddingTop: 5,
    paddingBottom: 5,
    elevation: 10,
  },

  bottomTab: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 4,
  },

  activeBottomTab: {
    backgroundColor: '#eff6ff',
    borderRadius: 12,
    marginHorizontal: 3,
  },

  bottomIcon: {
    fontSize: 19,
  },

  bottomLabel: {
    color: '#6b7280',
    fontSize: 11,
    fontWeight: '700',
    marginTop: 2,
  },

  activeBottomLabel: {
    color: '#2563eb',
    fontWeight: '900',
  },

  /* =======================================================
     MANAGER
  ======================================================= */

  dashboard: {
    padding: 20,
    paddingBottom: 110,
  },

  dashboardTitle: {
    fontSize: 29,
    fontWeight: '900',
  },

  dashboardSubtitle: {
    color: '#6b7280',
    marginTop: 4,
    marginBottom: 18,
  },

  statCard: {
    padding: 18,
    borderRadius: 16,
    marginBottom: 10,
    elevation: 2,
  },

  statNumber: {
    color: '#2563eb',
    fontSize: 29,
    fontWeight: '900',
  },

  managerPanel: {
    padding: 18,
    borderRadius: 16,
    marginTop: 8,
    marginBottom: 10,
    elevation: 2,
  },

  panelTitle: {
    fontSize: 18,
    fontWeight: '900',
    marginBottom: 10,
  },

  panelText: {
    color: '#6b7280',
    marginBottom: 7,
  },
});
