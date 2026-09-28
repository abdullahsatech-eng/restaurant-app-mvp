import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useReducer,
  useRef,
  useState,
} from 'react';

import {
  ActivityIndicator,
  Alert,
  FlatList,
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';

/* =========================================================
   MOCK DATA
========================================================= */

const users = [
  {
    id: 1,
    name: 'Demo Customer',
    email: 'customer@example.com',
    password: 'Customer123',
    role: 'customer',
  },
  {
    id: 2,
    name: 'Demo Manager',
    email: 'manager@example.com',
    password: 'Manager123',
    role: 'manager',
  },
];

const fallbackMenu = [
  {id: 1, name: 'Chicken Biryani', description: 'Aromatic Pakistani rice with tender chicken.', price: 450, category: 'Main', isSpecial: true, isAvailable: true},
  {id: 2, name: 'Beef Biryani', description: 'Traditional spicy beef biryani.', price: 550, category: 'Main', isSpecial: false, isAvailable: true},
  {id: 3, name: 'Chicken Karahi', description: 'Classic Pakistani chicken karahi.', price: 850, category: 'Main', isSpecial: true, isAvailable: true},
  {id: 4, name: 'Beef Nihari', description: 'Slow-cooked beef with traditional spices.', price: 700, category: 'Main', isSpecial: false, isAvailable: true},
  {id: 5, name: 'Chicken Handi', description: 'Creamy chicken cooked in traditional handi style.', price: 800, category: 'Main', isSpecial: false, isAvailable: true},
  {id: 6, name: 'Seekh Kebab', description: 'Juicy minced beef kebabs with spices.', price: 500, category: 'Starters', isSpecial: false, isAvailable: true},
  {id: 7, name: 'Chicken Tikka', description: 'Grilled chicken with Pakistani spices.', price: 550, category: 'Starters', isSpecial: true, isAvailable: true},
  {id: 8, name: 'Samosa', description: 'Crispy pastry filled with spiced potatoes.', price: 120, category: 'Starters', isSpecial: false, isAvailable: true},
  {id: 9, name: 'Pakora', description: 'Crispy mixed vegetable fritters.', price: 180, category: 'Starters', isSpecial: false, isAvailable: true},
  {id: 10, name: 'Gulab Jamun', description: 'Soft sweet dumplings in sugar syrup.', price: 220, category: 'Desserts', isSpecial: false, isAvailable: true},
  {id: 11, name: 'Kheer', description: 'Traditional creamy rice pudding.', price: 250, category: 'Desserts', isSpecial: true, isAvailable: true},
  {id: 12, name: 'Gajar Ka Halwa', description: 'Warm carrot dessert with nuts.', price: 280, category: 'Desserts', isSpecial: false, isAvailable: true},
  {id: 13, name: 'Fresh Lime', description: 'Refreshing fresh lime drink.', price: 180, category: 'Drinks', isSpecial: false, isAvailable: true},
  {id: 14, name: 'Mango Lassi', description: 'Creamy Pakistani mango yogurt drink.', price: 250, category: 'Drinks', isSpecial: true, isAvailable: true},
  {id: 15, name: 'Chai', description: 'Traditional Pakistani milk tea.', price: 150, category: 'Drinks', isSpecial: false, isAvailable: true},
];

const categories = ['All', 'Starters', 'Main', 'Desserts', 'Drinks'];

const promoCodes = {
  WELCOME10: 10,
  FEAST20: 20,
};

const mockTables = [
  {id: 1, seats: 2},
  {id: 2, seats: 2},
  {id: 3, seats: 4},
  {id: 4, seats: 4},
  {id: 5, seats: 6},
  {id: 6, seats: 8},
  {id: 7, seats: 10},
  {id: 8, seats: 12},
];

/* =========================================================
   THEME
========================================================= */

const lightColors = {
  background: '#F7F7F7',
  card: '#FFFFFF',
  text: '#111827',
  muted: '#6B7280',
  border: '#E5E7EB',
  accent: '#B45309',
  danger: '#DC2626',
  success: '#15803D',
};

const darkColors = {
  background: '#111827',
  card: '#1F2937',
  text: '#F9FAFB',
  muted: '#9CA3AF',
  border: '#374151',
  accent: '#F59E0B',
  danger: '#F87171',
  success: '#4ADE80',
};

const ThemeContext = createContext(null);

function ThemeProvider({children}) {
  const [isDark, setIsDark] = useState(false);

  const toggleTheme = useCallback(() => {
    setIsDark(value => !value);
  }, []);

  const value = useMemo(
    () => ({
      isDark,
      toggleTheme,
      colors: isDark ? darkColors : lightColors,
    }),
    [isDark, toggleTheme],
  );

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
}

function useTheme() {
  const value = useContext(ThemeContext);

  if (!value) {
    throw new Error('useTheme must be used inside ThemeProvider');
  }

  return value;
}

/* =========================================================
   AUTH
========================================================= */

const AuthContext = createContext(null);

function AuthProvider({children}) {
  const [user, setUser] = useState(null);

  const login = useCallback(value => {
    setUser(value);
  }, []);

  const logout = useCallback(() => {
    setUser(null);
  }, []);

  const value = useMemo(
    () => ({
      user,
      login,
      logout,
    }),
    [user, login, logout],
  );

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

function useAuth() {
  const value = useContext(AuthContext);

  if (!value) {
    throw new Error('useAuth must be used inside AuthProvider');
  }

  return value;
}

/* =========================================================
   CART REDUCER
========================================================= */

const initialCart = {
  items: [],
  promoCode: '',
  discountPercent: 0,
};

function cartReducer(state, action) {
  switch (action.type) {
    case 'ADD_ITEM': {
      const existing = state.items.find(
        item => item.id === action.item.id,
      );

      if (existing) {
        return {
          ...state,
          items: state.items.map(item =>
            item.id === action.item.id
              ? {...item, quantity: item.quantity + 1}
              : item,
          ),
        };
      }

      return {
        ...state,
        items: [
          ...state.items,
          {
            ...action.item,
            quantity: 1,
            note: '',
          },
        ],
      };
    }

    case 'REMOVE_ITEM':
      return {
        ...state,
        items: state.items.filter(
          item => item.id !== action.id,
        ),
      };

    case 'INCREMENT':
      return {
        ...state,
        items: state.items.map(item =>
          item.id === action.id
            ? {...item, quantity: item.quantity + 1}
            : item,
        ),
      };

    case 'DECREMENT':
      return {
        ...state,
        items: state.items
          .map(item =>
            item.id === action.id
              ? {...item, quantity: item.quantity - 1}
              : item,
          )
          .filter(item => item.quantity > 0),
      };

    case 'UPDATE_NOTE':
      return {
        ...state,
        items: state.items.map(item =>
          item.id === action.id
            ? {...item, note: action.note}
            : item,
        ),
      };

    case 'CLEAR_CART':
      return initialCart;

    case 'APPLY_PROMO':
      return {
        ...state,
        promoCode: action.code,
        discountPercent: action.discountPercent,
      };

    case 'REMOVE_PROMO':
      return {
        ...state,
        promoCode: '',
        discountPercent: 0,
      };

    default:
      return state;
  }
}

const CartContext = createContext(null);

function CartProvider({children}) {
  const [cart, dispatch] = useReducer(
    cartReducer,
    initialCart,
  );

  const value = useMemo(
    () => ({
      cart,
      dispatch,
    }),
    [cart],
  );

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
}

function useCart() {
  const value = useContext(CartContext);

  if (!value) {
    throw new Error('useCart must be used inside CartProvider');
  }

  return value;
}

/* =========================================================
   FORM HOOK
========================================================= */

function useForm(initialValues, validate) {
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState({});

  const handleChange = useCallback((field, value) => {
    setValues(current => ({
      ...current,
      [field]: value,
    }));

    setErrors(current => ({
      ...current,
      [field]: '',
    }));
  }, []);

  const handleSubmit = useCallback(() => {
    const result = validate(values);
    setErrors(result);
    return Object.keys(result).length === 0;
  }, [values, validate]);

  const reset = useCallback(() => {
    setValues(initialValues);
    setErrors({});
  }, [initialValues]);

  return {
    values,
    errors,
    setErrors,
    handleChange,
    handleSubmit,
    reset,
    isValid: Object.keys(errors).length === 0,
  };
}

/* =========================================================
   DEBOUNCE HOOK
========================================================= */

function useDebounce(value, delay = 400) {
  const [debounced, setDebounced] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebounced(value);
    }, delay);

    return () => clearTimeout(timer);
  }, [value, delay]);

  return debounced;
}

/* =========================================================
   MENU CARD - React.memo
========================================================= */

const MenuItemCard = React.memo(function MenuItemCard({
  item,
  colors,
  favorite,
  onFavorite,
  onAdd,
}) {
  console.log('MenuItemCard rendered:', item.name);

  return (
    <View
      style={[
        styles.card,
        {
          backgroundColor: colors.card,
          borderColor: colors.border,
          opacity: item.isAvailable ? 1 : 0.5,
        },
      ]}>
      <View style={{flex: 1}}>
        <Text style={[styles.cardTitle, {color: colors.text}]}>
          {item.isSpecial ? '⭐ ' : ''}
          {item.name}
        </Text>

        <Text style={{color: colors.muted, marginTop: 4}}>
          {item.description}
        </Text>

        <Text
          style={{
            color: colors.accent,
            fontWeight: '800',
            marginTop: 7,
          }}>
          Rs. {item.price}
        </Text>
      </View>

      <View style={{alignItems: 'center'}}>
        <Pressable onPress={() => onFavorite(item.id)}>
          <Text style={{fontSize: 23}}>
            {favorite ? '❤️' : '♡'}
          </Text>
        </Pressable>

        <Pressable
          disabled={!item.isAvailable}
          onPress={() => onAdd(item)}
          style={[
            styles.smallButton,
            {backgroundColor: colors.accent},
          ]}>
          <Text style={{color: '#fff', fontWeight: '700'}}>
            {item.isAvailable ? 'Add' : 'Unavailable'}
          </Text>
        </Pressable>
      </View>
    </View>
  );
});

/* =========================================================
   SHARED UI
========================================================= */

function Header({title, colors}) {
  return (
    <Text style={[styles.header, {color: colors.text}]}>
      {title}
    </Text>
  );
}

function Input({
  label,
  value,
  onChangeText,
  colors,
  secureTextEntry,
  keyboardType,
}) {
  return (
    <View style={{marginBottom: 10}}>
      <Text
        style={{
          color: colors.text,
          fontWeight: '700',
          marginBottom: 5,
        }}>
        {label}
      </Text>

      <TextInput
        value={value}
        onChangeText={onChangeText}
        secureTextEntry={secureTextEntry}
        keyboardType={keyboardType}
        placeholderTextColor={colors.muted}
        style={[
          styles.input,
          {
            backgroundColor: colors.card,
            color: colors.text,
            borderColor: colors.border,
          },
        ]}
      />
    </View>
  );
}

/* =========================================================
   LOGIN / SIGNUP
========================================================= */

function Login() {
  const {login} = useAuth();
  const {colors} = useTheme();

  const [signup, setSignup] = useState(false);
  const [role, setRole] = useState('customer');
  const [busy, setBusy] = useState(false);

  const validate = useCallback(
    values => {
      const errors = {};

      if (!values.email.includes('@')) {
        errors.email = 'Enter a valid email.';
      }

      if (
        values.password.length < 8 ||
        !/\d/.test(values.password)
      ) {
        errors.password =
          'Password must be 8+ characters and contain a digit.';
      }

      if (
        signup &&
        values.password !== values.confirmPassword
      ) {
        errors.confirmPassword = 'Passwords do not match.';
      }

      if (signup && !values.name.trim()) {
        errors.name = 'Name is required.';
      }

      return errors;
    },
    [signup],
  );

  const form = useForm(
    {
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
    },
    validate,
  );

  const submit = async () => {
    if (!form.handleSubmit()) return;

    setBusy(true);

    await new Promise(resolve => setTimeout(resolve, 600));

    const found = users.find(
      user =>
        user.email.toLowerCase() ===
          form.values.email.toLowerCase() &&
        user.password === form.values.password,
    );

    setBusy(false);

    if (found) {
      login(found);
      return;
    }

    if (signup) {
      login({
        id: Date.now(),
        name: form.values.name || 'New Customer',
        email: form.values.email,
        role,
      });
      return;
    }

    Alert.alert(
      'Login failed',
      'Use the mock credentials shown below.',
    );
  };

  return (
    <SafeAreaView
      style={[
        styles.safe,
        {backgroundColor: colors.background},
      ]}>
      <KeyboardAvoidingView
        style={{flex: 1}}
        behavior={
          Platform.OS === 'ios' ? 'padding' : undefined
        }>
        <ScrollView contentContainerStyle={styles.auth}>
          <Text
            style={[
              styles.logo,
              {color: colors.accent},
            ]}>
            🍽️ Restaurant App
          </Text>

          <Text
            style={[
              styles.subtitle,
              {color: colors.muted},
            ]}>
            {signup ? 'Create Account' : 'Welcome Back'}
          </Text>

          {signup && (
            <Input
              label="Full Name"
              colors={colors}
              value={form.values.name}
              onChangeText={v =>
                form.handleChange('name', v)
              }
            />
          )}

          <Input
            label="Email"
            colors={colors}
            value={form.values.email}
            onChangeText={v =>
              form.handleChange('email', v)
            }
            keyboardType="email-address"
          />

          <Input
            label="Password"
            colors={colors}
            value={form.values.password}
            onChangeText={v =>
              form.handleChange('password', v)
            }
            secureTextEntry
          />

          {signup && (
            <>
              <Input
                label="Confirm Password"
                colors={colors}
                value={form.values.confirmPassword}
                onChangeText={v =>
                  form.handleChange(
                    'confirmPassword',
                    v,
                  )
                }
                secureTextEntry
              />

              <Text
                style={{
                  color: colors.text,
                  fontWeight: '700',
                  marginBottom: 6,
                }}>
                Role
              </Text>

              <View style={styles.chips}>
                {['customer', 'manager'].map(value => (
                  <Pressable
                    key={value}
                    onPress={() => setRole(value)}
                    style={[
                      styles.chip,
                      {
                        backgroundColor:
                          role === value
                            ? colors.accent
                            : colors.card,
                        borderColor: colors.border,
                      },
                    ]}>
                    <Text
                      style={{
                        color:
                          role === value
                            ? '#fff'
                            : colors.text,
                      }}>
                      {value}
                    </Text>
                  </Pressable>
                ))}
              </View>
            </>
          )}

          <Pressable
            disabled={busy}
            onPress={submit}
            style={[
              styles.button,
              {backgroundColor: colors.accent},
            ]}>
            {busy ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.buttonText}>
                {signup ? 'Sign Up' : 'Login'}
              </Text>
            )}
          </Pressable>

          <Pressable
            onPress={() => {
              setSignup(v => !v);
              form.reset();
            }}>
            <Text
              style={{
                color: colors.accent,
                textAlign: 'center',
                marginTop: 15,
                fontWeight: '700',
              }}>
              {signup
                ? 'Already have an account? Login'
                : 'Create a new account'}
            </Text>
          </Pressable>

          <View
            style={[
              styles.demoBox,
              {
                backgroundColor: colors.card,
                borderColor: colors.border,
              },
            ]}>
            <Text
              style={[
                styles.cardTitle,
                {color: colors.text},
              ]}>
              Demo Credentials
            </Text>

            <Text style={{color: colors.muted}}>
              Customer: customer@example.com
            </Text>

            <Text style={{color: colors.muted}}>
              Password: Customer123
            </Text>

            <Text
              style={{
                color: colors.muted,
                marginTop: 7,
              }}>
              Manager: manager@example.com
            </Text>

            <Text style={{color: colors.muted}}>
              Password: Manager123
            </Text>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

/* =========================================================
   MENU
========================================================= */

function Menu({onGoCart, onGoOrders}) {
  const {colors} = useTheme();
  const {dispatch} = useCart();

  const [items] = useState(fallbackMenu);
  const [category, setCategory] = useState('All');
  const [query, setQuery] = useState('');
  const [sort, setSort] = useState('default');
  const [favorites, setFavorites] = useState([]);
  const [recentSearches, setRecentSearches] = useState([]);

  const searchRef = useRef(null);
  const listRef = useRef(null);
  const previousQueryRef = useRef('');
  const renderCount = useRef(0);

  renderCount.current += 1;

  const debouncedQuery = useDebounce(query, 400);

  const toggleFavorite = useCallback(id => {
    setFavorites(current =>
      current.includes(id)
        ? current.filter(value => value !== id)
        : [...current, id],
    );
  }, []);

  const add = useCallback(
    item => {
      dispatch({
        type: 'ADD_ITEM',
        item,
      });

      Alert.alert(
        'Added to Cart',
        `${item.name} was added to your cart.`,
      );
    },
    [dispatch],
  );

  useEffect(() => {
    const trimmed = debouncedQuery.trim();

    if (
      trimmed &&
      trimmed !== previousQueryRef.current
    ) {
      setRecentSearches(current => [
        trimmed,
        ...current.filter(
          value =>
            value.toLowerCase() !==
            trimmed.toLowerCase(),
        ),
      ].slice(0, 5));

      previousQueryRef.current = trimmed;
    }
  }, [debouncedQuery]);

  const filteredItems = useMemo(() => {
    let result = items.filter(item => {
      const categoryMatch =
        category === 'All' ||
        item.category === category;

      const searchMatch =
        !debouncedQuery.trim() ||
        item.name
          .toLowerCase()
          .includes(debouncedQuery.toLowerCase()) ||
        item.description
          .toLowerCase()
          .includes(debouncedQuery.toLowerCase());

      return categoryMatch && searchMatch;
    });

    if (sort === 'low') {
      result = [...result].sort(
        (a, b) => a.price - b.price,
      );
    }

    if (sort === 'high') {
      result = [...result].sort(
        (a, b) => b.price - a.price,
      );
    }

    if (sort === 'name') {
      result = [...result].sort((a, b) =>
        a.name.localeCompare(b.name),
      );
    }

    return result;
  }, [items, category, debouncedQuery, sort]);

  const handleScroll = event => {
    const offset =
      event.nativeEvent.contentOffset.y;

    if (offset > 300) {
      // Back-to-top button is displayed below.
    }
  };

  const clearSearch = () => {
    setQuery('');
    searchRef.current?.focus();
  };

  return (
    <View style={{flex: 1}}>
      <FlatList
        ref={listRef}
        data={filteredItems}
        keyExtractor={item => String(item.id)}
        onScroll={handleScroll}
        scrollEventThrottle={16}
        contentContainerStyle={{
          padding: 14,
          paddingBottom: 110,
        }}
        ListHeaderComponent={
          <>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                marginBottom: 10,
              }}>
              <View style={{flex: 1}}>
                <Header
                  title="Restaurant Menu"
                  colors={colors}
                />
              </View>

              <Text
                style={{
                  color: colors.muted,
                  fontSize: 12,
                }}>
                Renders: {renderCount.current}
              </Text>
            </View>

            <View style={styles.searchRow}>
              <TextInput
                ref={searchRef}
                value={query}
                onChangeText={setQuery}
                placeholder="Search food..."
                placeholderTextColor={colors.muted}
                style={[
                  styles.search,
                  {
                    backgroundColor: colors.card,
                    color: colors.text,
                    borderColor: colors.border,
                  },
                ]}
              />

              <Pressable
                onPress={clearSearch}
                style={[
                  styles.clearButton,
                  {backgroundColor: colors.accent},
                ]}>
                <Text style={{color: '#fff'}}>×</Text>
              </Pressable>
            </View>

            {!query && recentSearches.length > 0 && (
              <View style={{marginBottom: 8}}>
                <Text
                  style={{
                    color: colors.muted,
                    marginBottom: 5,
                  }}>
                  Recent searches
                </Text>

                <View style={styles.chips}>
                  {recentSearches.map(value => (
                    <Pressable
                      key={value}
                      onPress={() => setQuery(value)}
                      style={[
                        styles.chip,
                        {
                          backgroundColor: colors.card,
                          borderColor: colors.border,
                        },
                      ]}>
                      <Text style={{color: colors.text}}>
                        {value}
                      </Text>
                    </Pressable>
                  ))}
                </View>
              </View>
            )}

            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              style={{marginBottom: 8}}>
              {categories.map(value => (
                <Pressable
                  key={value}
                  onPress={() => setCategory(value)}
                  style={[
                    styles.chip,
                    {
                      backgroundColor:
                        category === value
                          ? colors.accent
                          : colors.card,
                      borderColor: colors.border,
                    },
                  ]}>
                  <Text
                    style={{
                      color:
                        category === value
                          ? '#fff'
                          : colors.text,
                      fontWeight: '600',
                    }}>
                    {value}
                  </Text>
                </Pressable>
              ))}
            </ScrollView>

            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              style={{marginBottom: 10}}>
              {[
                ['default', 'Default'],
                ['low', 'Price ↑'],
                ['high', 'Price ↓'],
                ['name', 'Name A-Z'],
              ].map(([value, label]) => (
                <Pressable
                  key={value}
                  onPress={() => setSort(value)}
                  style={[
                    styles.chip,
                    {
                      backgroundColor:
                        sort === value
                          ? colors.accent
                          : colors.card,
                      borderColor: colors.border,
                    },
                  ]}>
                  <Text
                    style={{
                      color:
                        sort === value
                          ? '#fff'
                          : colors.text,
                    }}>
                    {label}
                  </Text>
                </Pressable>
              ))}
            </ScrollView>

            <Text
              style={{
                color: colors.muted,
                marginBottom: 8,
              }}>
              Showing {filteredItems.length} items
            </Text>
          </>
        }
        renderItem={({item}) => (
          <MenuItemCard
            item={item}
            colors={colors}
            favorite={favorites.includes(item.id)}
            onFavorite={toggleFavorite}
            onAdd={add}
          />
        )}
        ListEmptyComponent={
          <Text
            style={{
              color: colors.muted,
              textAlign: 'center',
              marginTop: 30,
            }}>
            No menu items found.
          </Text>
        }
      />

      <View
        style={[
          styles.floating,
          {backgroundColor: colors.accent},
        ]}>
        <Pressable
          onPress={() =>
            listRef.current?.scrollToOffset({
              offset: 0,
              animated: true,
            })
          }>
          <Text style={{color: '#fff', fontWeight: '800'}}>
            ↑ Top
          </Text>
        </Pressable>
      </View>

      <Pressable
        onPress={onGoCart}
        style={[
          styles.floatingCart,
          {backgroundColor: colors.accent},
        ]}>
        <Text style={{color: '#fff', fontWeight: '800'}}>
          🛒 Cart
        </Text>
      </Pressable>
    </View>
  );
}

/* =========================================================
   CART
========================================================= */

function Cart({onGoOrders}) {
  const {colors} = useTheme();
  const {cart, dispatch} = useCart();

  const subtotal = useMemo(
    () =>
      cart.items.reduce(
        (sum, item) =>
          sum + item.price * item.quantity,
        0,
      ),
    [cart.items],
  );

  const discount = useMemo(
    () => subtotal * (cart.discountPercent / 100),
    [subtotal, cart.discountPercent],
  );

  const service = useMemo(
    () => (subtotal - discount) * 0.05,
    [subtotal, discount],
  );

  const tax = useMemo(
    () => (subtotal - discount) * 0.15,
    [subtotal, discount],
  );

  const total = useMemo(
    () => subtotal - discount + service + tax,
    [subtotal, discount, service, tax],
  );

  const applyPromo = () => {
    const code = cart.promoCodeInput || '';

    Alert.prompt?.(
      'Promo Code',
      'Enter WELCOME10 or FEAST20',
      value => {
        const normalized = value.trim().toUpperCase();

        if (promoCodes[normalized]) {
          dispatch({
            type: 'APPLY_PROMO',
            code: normalized,
            discountPercent:
              promoCodes[normalized],
          });
        } else {
          Alert.alert(
            'Invalid Promo',
            'Use WELCOME10 or FEAST20.',
          );
        }
      },
    );

    if (!Alert.prompt) {
      const code = 'WELCOME10';

      dispatch({
        type: 'APPLY_PROMO',
        code,
        discountPercent: 10,
      });

      Alert.alert(
        'Promo Applied',
        'WELCOME10 gives 10% off.',
      );
    }
  };

  const placeOrder = () => {
    if (!cart.items.length) {
      Alert.alert(
        'Empty Cart',
        'Add items before placing an order.',
      );
      return;
    }

    onGoOrders();
  };

  return (
    <ScrollView
      contentContainerStyle={{
        padding: 14,
        paddingBottom: 110,
      }}>
      <Header title="Cart" colors={colors} />

      {cart.items.length === 0 ? (
        <Text style={{color: colors.muted}}>
          Your cart is empty.
        </Text>
      ) : (
        cart.items.map(item => (
          <View
            key={item.id}
            style={[
              styles.card,
              {
                backgroundColor: colors.card,
                borderColor: colors.border,
              },
            ]}>
            <View style={{flex: 1}}>
              <Text
                style={[
                  styles.cardTitle,
                  {color: colors.text},
                ]}>
                {item.name}
              </Text>

              <Text style={{color: colors.accent}}>
                Rs. {item.price} × {item.quantity}
              </Text>

              <TextInput
                value={item.note}
                onChangeText={note =>
                  dispatch({
                    type: 'UPDATE_NOTE',
                    id: item.id,
                    note,
                  })
                }
                placeholder="Special instructions"
                placeholderTextColor={colors.muted}
                style={[
                  styles.input,
                  {
                    marginTop: 7,
                    color: colors.text,
                    borderColor: colors.border,
                    backgroundColor: colors.background,
                  },
                ]}
              />

              <View style={styles.quantityRow}>
                <Pressable
                  onPress={() =>
                    dispatch({
                      type: 'DECREMENT',
                      id: item.id,
                    })
                  }
                  style={[
                    styles.qty,
                    {backgroundColor: colors.accent},
                  ]}>
                  <Text style={{color: '#fff'}}>−</Text>
                </Pressable>

                <Text style={{color: colors.text}}>
                  {item.quantity}
                </Text>

                <Pressable
                  onPress={() =>
                    dispatch({
                      type: 'INCREMENT',
                      id: item.id,
                    })
                  }
                  style={[
                    styles.qty,
                    {backgroundColor: colors.accent},
                  ]}>
                  <Text style={{color: '#fff'}}>+</Text>
                </Pressable>

                <Pressable
                  onPress={() =>
                    dispatch({
                      type: 'REMOVE_ITEM',
                      id: item.id,
                    })
                  }>
                  <Text
                    style={{
                      color: colors.danger,
                      fontWeight: '700',
                    }}>
                    Remove
                  </Text>
                </Pressable>
              </View>
            </View>
          </View>
        ))
      )}

      {cart.items.length > 0 && (
        <>
          <Pressable
            onPress={applyPromo}
            style={[
              styles.button,
              {backgroundColor: colors.accent},
            ]}>
            <Text style={styles.buttonText}>
              {cart.discountPercent
                ? `${cart.promoCode} Applied (${cart.discountPercent}%)`
                : 'Apply Promo Code'}
            </Text>
          </Pressable>

          {cart.discountPercent > 0 && (
            <Pressable
              onPress={() =>
                dispatch({type: 'REMOVE_PROMO'})
              }>
              <Text
                style={{
                  color: colors.danger,
                  textAlign: 'center',
                  marginBottom: 10,
                }}>
                Remove Promo
              </Text>
            </Pressable>
          )}

          <View
            style={[
              styles.summary,
              {
                backgroundColor: colors.card,
                borderColor: colors.border,
              },
            ]}>
            <SummaryLine
              label="Subtotal"
              value={subtotal}
              colors={colors}
            />

            <SummaryLine
              label="Service (5%)"
              value={service}
              colors={colors}
            />

            <SummaryLine
              label="Tax (15%)"
              value={tax}
              colors={colors}
            />

            <SummaryLine
              label="Discount"
              value={-discount}
              colors={colors}
            />

            <View
              style={[
                styles.divider,
                {backgroundColor: colors.border},
              ]}
            />

            <SummaryLine
              label="Grand Total"
              value={total}
              colors={colors}
              bold
            />
          </View>

          <Pressable
            onPress={placeOrder}
            style={[
              styles.button,
              {backgroundColor: colors.success},
            ]}>
            <Text style={styles.buttonText}>
              Place Order
            </Text>
          </Pressable>
        </>
      )}
    </ScrollView>
  );
}

function SummaryLine({
  label,
  value,
  colors,
  bold,
}) {
  return (
    <View
      style={{
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 7,
      }}>
      <Text
        style={{
          color: colors.text,
          fontWeight: bold ? '800' : '500',
        }}>
        {label}
      </Text>

      <Text
        style={{
          color: colors.text,
          fontWeight: bold ? '800' : '500',
        }}>
        Rs. {Math.round(value)}
      </Text>
    </View>
  );
}

/* =========================================================
   RESERVATIONS
========================================================= */

function Reserve({
  reservations,
  setReservations,
}) {
  const {colors} = useTheme();

  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [party, setParty] = useState('2');
  const [phone, setPhone] = useState('');

  const times = [
    '12:00',
    '13:00',
    '14:00',
    '15:00',
    '16:00',
    '17:00',
    '18:00',
    '19:00',
    '20:00',
    '21:00',
    '22:00',
  ];

  const formatDate = dateValue => {
    const y = dateValue.getFullYear();
    const m = String(
      dateValue.getMonth() + 1,
    ).padStart(2, '0');
    const d = String(
      dateValue.getDate(),
    ).padStart(2, '0');

    return `${y}-${m}-${d}`;
  };

  const today = new Date();

  const tomorrow = new Date(today);
  tomorrow.setDate(today.getDate() + 1);

  const minimumDate = formatDate(tomorrow);

  const isUnavailable = slot => {
    if (!date) return false;

    return reservations.some(
      reservation =>
        reservation.date === date &&
        reservation.time === slot &&
        reservation.status !== 'Cancelled',
    );
  };

  const isAtLeastOneHourAhead = () => {
    if (!date || !time) return false;

    const [hours, minutes] =
      time.split(':').map(Number);

    const booking = new Date(date);
    booking.setHours(hours, minutes, 0, 0);

    return (
      booking.getTime() - Date.now() >=
      60 * 60 * 1000
    );
  };

  const submit = () => {
    const partyNumber = Number(party);

    if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
      Alert.alert(
        'Invalid Date',
        'Use YYYY-MM-DD format.',
      );
      return;
    }

    if (date < formatDate(today)) {
      Alert.alert(
        'Invalid Date',
        'Date cannot be in the past.',
      );
      return;
    }

    if (
      !Number.isInteger(partyNumber) ||
      partyNumber < 1 ||
      partyNumber > 12
    ) {
      Alert.alert(
        'Invalid Party Size',
        'Party size must be between 1 and 12.',
      );
      return;
    }

    if (!/^03\d{2}-\d{7}$/.test(phone)) {
      Alert.alert(
        'Invalid Mobile',
        'Use Pakistani format 03XX-XXXXXXX.',
      );
      return;
    }

    if (!time) {
      Alert.alert(
        'Select Time',
        'Please select a time.',
      );
      return;
    }

    if (isUnavailable(time)) {
      Alert.alert(
        'Unavailable',
        'This time slot is already reserved.',
      );
      return;
    }

    if (!isAtLeastOneHourAhead()) {
      Alert.alert(
        'Too Soon',
        'Reservation must be at least 1 hour ahead.',
      );
      return;
    }

    const reservation = {
      id: Date.now(),
      date,
      time,
      party: partyNumber,
      phone,
      status: 'Pending',
    };

    setReservations(current => [
      reservation,
      ...current,
    ]);

    Alert.alert(
      'Reservation Confirmed',
      `Table reserved for ${partyNumber} guests on ${date} at ${time}.`,
    );

    setTime('');
  };

  const cancel = id => {
    Alert.alert(
      'Cancel Reservation',
      'Cancel this reservation?',
      [
        {text: 'No', style: 'cancel'},
        {
          text: 'Yes',
          style: 'destructive',
          onPress: () =>
            setReservations(current =>
              current.map(item =>
                item.id === id
                  ? {...item, status: 'Cancelled'}
                  : item,
              ),
            ),
        },
      ],
    );
  };

  return (
    <ScrollView
      contentContainerStyle={{
        padding: 14,
        paddingBottom: 110,
      }}>
      <Header
        title="Reservations"
        colors={colors}
      />

      <Text
        style={{
          color: colors.muted,
          marginBottom: 10,
        }}>
        Book a table from 12:00 to 22:00.
      </Text>

      <Input
        label={`Date (YYYY-MM-DD), minimum ${minimumDate}`}
        value={date}
        onChangeText={setDate}
        colors={colors}
      />

      <Input
        label="Pakistani Mobile"
        value={phone}
        onChangeText={setPhone}
        colors={colors}
        keyboardType="phone-pad"
      />

      <Input
        label="Party Size (1-12)"
        value={party}
        onChangeText={setParty}
        colors={colors}
        keyboardType="number-pad"
      />

      <Text
        style={{
          color: colors.text,
          fontWeight: '800',
          marginBottom: 6,
        }}>
        Available Time
      </Text>

      <View style={styles.chips}>
        {times.map(slot => {
          const unavailable = isUnavailable(slot);

          return (
            <Pressable
              key={slot}
              disabled={unavailable}
              onPress={() => setTime(slot)}
              style={[
                styles.chip,
                {
                  backgroundColor:
                    unavailable
                      ? '#9CA3AF'
                      : time === slot
                        ? colors.accent
                        : colors.card,
                  borderColor: colors.border,
                  opacity: unavailable ? 0.45 : 1,
                },
              ]}>
              <Text
                style={{
                  color:
                    unavailable || time === slot
                      ? '#fff'
                      : colors.text,
                }}>
                {slot}
              </Text>
            </Pressable>
          );
        })}
      </View>

      <Pressable
        onPress={submit}
        style={[
          styles.button,
          {backgroundColor: colors.accent},
        ]}>
        <Text style={styles.buttonText}>
          Reserve Table
        </Text>
      </Pressable>

      <Header
        title="My Reservations"
        colors={colors}
      />

      {reservations.length === 0 ? (
        <Text style={{color: colors.muted}}>
          No reservations yet.
        </Text>
      ) : (
        reservations.map(item => (
          <View
            key={item.id}
            style={[
              styles.card,
              {
                backgroundColor: colors.card,
                borderColor: colors.border,
              },
            ]}>
            <View style={{flex: 1}}>
              <Text
                style={[
                  styles.cardTitle,
                  {color: colors.text},
                ]}>
                {item.date} · {item.time}
              </Text>

              <Text style={{color: colors.muted}}>
                Guests: {item.party}
              </Text>

              <Text style={{color: colors.muted}}>
                {item.phone}
              </Text>

              <Text
                style={{
                  color:
                    item.status === 'Cancelled'
                      ? colors.danger
                      : colors.accent,
                  fontWeight: '800',
                  marginTop: 4,
                }}>
                {item.status}
              </Text>
            </View>

            {item.status !== 'Cancelled' && (
              <Pressable
                onPress={() => cancel(item.id)}
                style={[
                  styles.smallButton,
                  {backgroundColor: colors.danger},
                ]}>
                <Text
                  style={{
                    color: '#fff',
                    fontWeight: '700',
                  }}>
                  Cancel
                </Text>
              </Pressable>
            )}
          </View>
        ))
      )}
    </ScrollView>
  );
}

/* =========================================================
   ORDERS
========================================================= */

function Orders({
  orders,
  setOrders,
}) {
  const {colors} = useTheme();

  useEffect(() => {
    if (!orders.length) return;

    const timer = setInterval(() => {
      setOrders(current =>
        current.map(order => {
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
        }),
      );
    }, 1000);

    return () => clearInterval(timer);
  }, [orders.length, setOrders]);

  return (
    <ScrollView
      contentContainerStyle={{
        padding: 14,
        paddingBottom: 110,
      }}>
      <Header
        title="Order Tracking"
        colors={colors}
      />

      {orders.length === 0 ? (
        <Text style={{color: colors.muted}}>
          No orders yet. Place an order from Cart.
        </Text>
      ) : (
        orders.map(order => (
          <View
            key={order.id}
            style={[
              styles.card,
              {
                backgroundColor: colors.card,
                borderColor: colors.border,
              },
            ]}>
            <Text
              style={[
                styles.cardTitle,
                {color: colors.text},
              ]}>
              Order #{String(order.id).slice(-5)}
            </Text>

            <Text style={{color: colors.muted}}>
              Type: {order.type}
            </Text>

            <Text
              style={{
                color: colors.accent,
                fontSize: 18,
                fontWeight: '800',
                marginTop: 8,
              }}>
              {order.status}
            </Text>

            <Text
              style={{
                color: colors.muted,
                marginTop: 5,
              }}>
              Progress: {
                order.status === 'Pending'
                  ? '25%'
                  : order.status === 'Preparing'
                    ? '50%'
                    : order.status === 'Ready'
                      ? '75%'
                      : '100%'
              }
            </Text>

            <Text
              style={{
                color: colors.text,
                fontWeight: '700',
                marginTop: 8,
              }}>
              Total: Rs. {order.total}
            </Text>
          </View>
        ))
      )}
    </ScrollView>
  );
}

/* =========================================================
   MANAGER
========================================================= */

function ManagerDashboard({
  orders,
  setOrders,
  menu,
  setMenu,
  reservations,
  setReservations,
}) {
  const {colors} = useTheme();
  const [tab, setTab] = useState('orders');

  const updateOrder = id => {
    setOrders(current =>
      current.map(order => {
        if (order.id !== id) return order;

        const next = {
          Pending: 'Preparing',
          Preparing: 'Ready',
          Ready: 'Served',
          Served: 'Served',
        };

        return {
          ...order,
          status: next[order.status],
        };
      }),
    );
  };

  const toggleAvailability = id => {
    setMenu(current =>
      current.map(item =>
        item.id === id
          ? {...item, isAvailable: !item.isAvailable}
          : item,
      ),
    );
  };

  return (
    <ScrollView
      contentContainerStyle={{
        padding: 14,
        paddingBottom: 110,
      }}>
      <Header
        title="Manager Dashboard"
        colors={colors}
      />

      <View style={styles.chips}>
        {[
          ['orders', 'Orders'],
          ['reservations', 'Reservations'],
          ['menu', 'Menu Management'],
        ].map(([value, label]) => (
          <Pressable
            key={value}
            onPress={() => setTab(value)}
            style={[
              styles.chip,
              {
                backgroundColor:
                  tab === value
                    ? colors.accent
                    : colors.card,
                borderColor: colors.border,
              },
            ]}>
            <Text
              style={{
                color:
                  tab === value
                    ? '#fff'
                    : colors.text,
              }}>
              {label}
            </Text>
          </Pressable>
        ))}
      </View>

      {tab === 'orders' && (
        <>
          {orders.length === 0 ? (
            <Text style={{color: colors.muted}}>
              No incoming orders.
            </Text>
          ) : (
            orders.map(order => (
              <View
                key={order.id}
                style={[
                  styles.card,
                  {
                    backgroundColor: colors.card,
                    borderColor: colors.border,
                  },
                ]}>
                <Text
                  style={[
                    styles.cardTitle,
                    {color: colors.text},
                  ]}>
                  Order #{String(order.id).slice(-5)}
                </Text>

                <Text style={{color: colors.muted}}>
                  Total: Rs. {order.total}
                </Text>

                <Text
                  style={{
                    color: colors.accent,
                    fontWeight: '800',
                    marginVertical: 6,
                  }}>
                  {order.status}
                </Text>

                <Pressable
                  onPress={() => updateOrder(order.id)}
                  style={[
                    styles.smallButton,
                    {
                      backgroundColor:
                        colors.accent,
                    },
                  ]}>
                  <Text
                    style={{
                      color: '#fff',
                      fontWeight: '700',
                    }}>
                    Update Status
                  </Text>
                </Pressable>
              </View>
            ))
          )}
        </>
      )}

      {tab === 'reservations' && (
        <>
          {reservations.length === 0 ? (
            <Text style={{color: colors.muted}}>
              No reservations.
            </Text>
          ) : (
            reservations.map(item => (
              <View
                key={item.id}
                style={[
                  styles.card,
                  {
                    backgroundColor: colors.card,
                    borderColor: colors.border,
                  },
                ]}>
                <Text
                  style={[
                    styles.cardTitle,
                    {color: colors.text},
                  ]}>
                  {item.date} · {item.time}
                </Text>

                <Text style={{color: colors.muted}}>
                  Guests: {item.party}
                </Text>

                <Text style={{color: colors.muted}}>
                  Status: {item.status}
                </Text>

                {item.status === 'Pending' && (
                  <View style={styles.quantityRow}>
                    <Pressable
                      onPress={() =>
                        setReservations(current =>
                          current.map(r =>
                            r.id === item.id
                              ? {
                                  ...r,
                                  status: 'Accepted',
                                }
                              : r,
                          ),
                        )
                      }
                      style={[
                        styles.smallButton,
                        {
                          backgroundColor:
                            colors.success,
                        },
                      ]}>
                      <Text style={{color: '#fff'}}>
                        Accept
                      </Text>
                    </Pressable>

                    <Pressable
                      onPress={() =>
                        setReservations(current =>
                          current.map(r =>
                            r.id === item.id
                              ? {
                                  ...r,
                                  status: 'Declined',
                                }
                              : r,
                          ),
                        )
                      }
                      style={[
                        styles.smallButton,
                        {
                          backgroundColor:
                            colors.danger,
                        },
                      ]}>
                      <Text style={{color: '#fff'}}>
                        Decline
                      </Text>
                    </Pressable>
                  </View>
                )}
              </View>
            ))
          )}
        </>
      )}

      {tab === 'menu' && (
        <>
          {menu.map(item => (
            <View
              key={item.id}
              style={[
                styles.card,
                {
                  backgroundColor: colors.card,
                  borderColor: colors.border,
                },
              ]}>
              <View style={{flex: 1}}>
                <Text
                  style={[
                    styles.cardTitle,
                    {color: colors.text},
                  ]}>
                  {item.name}
                </Text>

                <Text style={{color: colors.accent}}>
                  Rs. {item.price}
                </Text>

                <Text style={{color: colors.muted}}>
                  {item.isAvailable
                    ? 'Available'
                    : 'Unavailable'}
                </Text>
              </View>

              <Pressable
                onPress={() =>
                  toggleAvailability(item.id)
                }
                style={[
                  styles.smallButton,
                  {
                    backgroundColor:
                      item.isAvailable
                        ? colors.danger
                        : colors.success,
                  },
                ]}>
                <Text style={{color: '#fff'}}>
                  {item.isAvailable
                    ? 'Disable'
                    : 'Enable'}
                </Text>
              </Pressable>
            </View>
          ))}
        </>
      )}
    </ScrollView>
  );
}

/* =========================================================
   PROFILE
========================================================= */

function Profile() {
  const {user, logout} = useAuth();
  const {colors, isDark, toggleTheme} =
    useTheme();

  return (
    <ScrollView
      contentContainerStyle={{
        padding: 14,
        paddingBottom: 110,
      }}>
      <Header
        title="Profile"
        colors={colors}
      />

      <View
        style={[
          styles.card,
          {
            backgroundColor: colors.card,
            borderColor: colors.border,
          },
        ]}>
        <Text
          style={[
            styles.cardTitle,
            {color: colors.text},
          ]}>
          {user.name}
        </Text>

        <Text style={{color: colors.muted}}>
          {user.email}
        </Text>

        <Text
          style={{
            color: colors.accent,
            marginTop: 5,
            fontWeight: '800',
          }}>
          Role: {user.role}
        </Text>
      </View>

      <Pressable
        onPress={toggleTheme}
        style={[
          styles.button,
          {backgroundColor: colors.accent},
        ]}>
        <Text style={styles.buttonText}>
          {isDark
            ? '☀️ Switch to Light Theme'
            : '🌙 Switch to Dark Theme'}
        </Text>
      </Pressable>

      <Pressable
        onPress={logout}
        style={[
          styles.button,
          {backgroundColor: colors.danger},
        ]}>
        <Text style={styles.buttonText}>
          Logout
        </Text>
      </Pressable>
    </ScrollView>
  );
}

/* =========================================================
   MAIN APP
========================================================= */

function MainApp() {
  const {user} = useAuth();
  const {colors} = useTheme();
  const {cart, dispatch} = useCart();

  const [tab, setTab] = useState(
    user.role === 'manager' ? 'manager' : 'menu',
  );

  const [orders, setOrders] = useState([]);
  const [reservations, setReservations] =
    useState([]);
  const [menu, setMenu] = useState(fallbackMenu);

  const cartCount = useMemo(
    () =>
      cart.items.reduce(
        (sum, item) => sum + item.quantity,
        0,
      ),
    [cart.items],
  );

  const placeOrder = () => {
    if (!cart.items.length) {
      Alert.alert(
        'Empty Cart',
        'Add items before placing an order.',
      );
      return;
    }

    const subtotal = cart.items.reduce(
      (sum, item) =>
        sum + item.price * item.quantity,
      0,
    );

    const discount =
      subtotal * (cart.discountPercent / 100);

    const service =
      (subtotal - discount) * 0.05;

    const tax =
      (subtotal - discount) * 0.15;

    const total =
      subtotal - discount + service + tax;

    const order = {
      id: Date.now(),
      items: cart.items,
      total: Math.round(total),
      type: 'Takeaway',
      status: 'Pending',
      timestamp: Date.now(),
    };

    setOrders(current => [
      order,
      ...current,
    ]);

    dispatch({type: 'CLEAR_CART'});

    setTab('orders');

    Alert.alert(
      'Order Placed Successfully!',
      'Your order is now being tracked.',
    );
  };

  let content = null;

  if (user.role === 'manager') {
    content = (
      <ManagerDashboard
        orders={orders}
        setOrders={setOrders}
        menu={menu}
        setMenu={setMenu}
        reservations={reservations}
        setReservations={setReservations}
      />
    );
  } else if (tab === 'menu') {
    content = (
      <Menu
        onGoCart={() => setTab('cart')}
        onGoOrders={() => {
          placeOrder();
        }}
      />
    );
  } else if (tab === 'cart') {
    content = (
      <Cart
        onGoOrders={() => {
          placeOrder();
        }}
      />
    );
  } else if (tab === 'orders') {
    content = (
      <Orders
        orders={orders}
        setOrders={setOrders}
      />
    );
  } else if (tab === 'reservations') {
    content = (
      <Reserve
        reservations={reservations}
        setReservations={setReservations}
      />
    );
  } else {
    content = <Profile />;
  }

  if (user.role === 'manager') {
    return (
      <SafeAreaView
        style={[
          styles.safe,
          {backgroundColor: colors.background},
        ]}>
        {content}

        <View
          style={[
            styles.bottom,
            {
              backgroundColor: colors.card,
              borderColor: colors.border,
            },
          ]}>
          <BottomButton
            label="Dashboard"
            active
            colors={colors}
            onPress={() => setTab('manager')}
          />

          <BottomButton
            label="Profile"
            colors={colors}
            onPress={() => setTab('profile')}
          />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView
      style={[
        styles.safe,
        {backgroundColor: colors.background},
      ]}>
      <View style={{flex: 1}}>
        {content}
      </View>

      <View
        style={[
          styles.bottom,
          {
            backgroundColor: colors.card,
            borderColor: colors.border,
          },
        ]}>
        <BottomButton
          label="Menu"
          active={tab === 'menu'}
          colors={colors}
          onPress={() => setTab('menu')}
        />

        <BottomButton
          label={`Cart${cartCount ? ` (${cartCount})` : ''}`}
          active={tab === 'cart'}
          colors={colors}
          onPress={() => setTab('cart')}
        />

        <BottomButton
          label="Orders"
          active={tab === 'orders'}
          colors={colors}
          onPress={() => setTab('orders')}
        />

        <BottomButton
          label="Reserve"
          active={tab === 'reservations'}
          colors={colors}
          onPress={() => setTab('reservations')}
        />

        <BottomButton
          label="Profile"
          active={tab === 'profile'}
          colors={colors}
          onPress={() => setTab('profile')}
        />
      </View>
    </SafeAreaView>
  );
}

function BottomButton({
  label,
  active,
  colors,
  onPress,
}) {
  return (
    <Pressable
      onPress={onPress}
      style={[
        styles.bottomButton,
        {
          backgroundColor: active
            ? colors.accent
            : 'transparent',
        },
      ]}>
      <Text
        style={{
          color: active
            ? '#fff'
            : colors.text,
          fontWeight: '700',
          fontSize: 12,
        }}>
        {label}
      </Text>
    </Pressable>
  );
}

/* =========================================================
   APP ROOT
========================================================= */

function AppContent() {
  const {user} = useAuth();

  return user ? <MainApp /> : <Login />;
}

export default function App() {
  return (
    <AuthProvider>
      <ThemeProvider>
        <CartProvider>
          <AppContent />
        </CartProvider>
      </ThemeProvider>
    </AuthProvider>
  );
}

/* =========================================================
   STYLES
========================================================= */

const styles = StyleSheet.create({
  safe: {
    flex: 1,
  },

  auth: {
    padding: 20,
    paddingBottom: 40,
    justifyContent: 'center',
    flexGrow: 1,
  },

  logo: {
    fontSize: 28,
    fontWeight: '900',
    textAlign: 'center',
    marginBottom: 5,
  },

  subtitle: {
    fontSize: 17,
    textAlign: 'center',
    marginBottom: 25,
  },

  header: {
    fontSize: 25,
    fontWeight: '900',
    marginBottom: 12,
  },

  input: {
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 11,
    fontSize: 15,
  },

  searchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },

  search: {
    flex: 1,
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },

  clearButton: {
    width: 42,
    height: 42,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 7,
  },

  chips: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 7,
    marginBottom: 8,
  },

  chip: {
    borderWidth: 1,
    borderRadius: 20,
    paddingHorizontal: 13,
    paddingVertical: 8,
  },

  card: {
    borderWidth: 1,
    borderRadius: 13,
    padding: 13,
    marginBottom: 10,
    flexDirection: 'row',
    gap: 10,
  },

  cardTitle: {
    fontSize: 16,
    fontWeight: '800',
  },

  button: {
    borderRadius: 11,
    paddingVertical: 13,
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 7,
  },

  buttonText: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '800',
  },

  smallButton: {
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 8,
    marginTop: 7,
    alignItems: 'center',
  },

  demoBox: {
    borderWidth: 1,
    borderRadius: 12,
    padding: 13,
    marginTop: 20,
  },

  summary: {
    borderWidth: 1,
    borderRadius: 12,
    padding: 14,
    marginVertical: 8,
  },

  divider: {
    height: 1,
    marginVertical: 7,
  },

  quantityRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginTop: 8,
  },

  qty: {
    width: 32,
    height: 32,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },

  bottom: {
    minHeight: 62,
    borderTopWidth: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    paddingHorizontal: 4,
    paddingBottom: 4,
  },

  bottomButton: {
    minWidth: 58,
    paddingHorizontal: 7,
    paddingVertical: 10,
    borderRadius: 10,
    alignItems: 'center',
  },

  floating: {
    position: 'absolute',
    right: 14,
    bottom: 75,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 22,
  },

  floatingCart: {
    position: 'absolute',
    left: 14,
    bottom: 75,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 22,
  },
});
