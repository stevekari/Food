export const CATEGORIES = [
  { id: 'all', name: 'All Cravings', icon: 'Sparkles', count: 18 },
  { id: 'burgers', name: 'Gourmet Burgers', icon: 'Beef', count: 4 },
  { id: 'pizza', name: 'Artisanal Pizzas', icon: 'Pizza', count: 4 },
  { id: 'asian', name: 'Asian Bowls & Wok', icon: 'Soup', count: 3 },
  { id: 'healthy', name: 'Fresh & Green', icon: 'Salad', count: 3 },
  { id: 'desserts', name: 'Sweets & Bakes', icon: 'Cake', count: 2 },
  { id: 'drinks', name: 'Brews & Mocktails', icon: 'Coffee', count: 2 },
];

export const DIETARY_FILTERS = [
  { id: 'all', label: 'All' },
  { id: 'bestseller', label: '🔥 Best Sellers' },
  { id: 'vegetarian', label: '🌱 Vegetarian' },
  { id: 'spicy', label: '🌶️ Spicy Kick' },
  { id: 'chef', label: '⭐ Chef Specials' },
];

export const FOOD_ITEMS = [
  {
    id: 'b1',
    name: 'Truffle Umami Smash Burger',
    category: 'burgers',
    price: 16.99,
    originalPrice: 19.99,
    rating: 4.9,
    reviewsCount: 342,
    prepTime: '15-20 min',
    calories: '720 kcal',
    spiceLevel: 1, // 0 - 3
    isBestseller: true,
    isChefSpecial: true,
    dietary: ['bestseller', 'chef'],
    image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=800&q=80',
    description: 'Double Angus beef patties smashed with black truffle aioli, aged Gruyère cheese, caramelized balsamic onions on a toasted brioche bun.',
    ingredients: ['Angus Beef', 'Truffle Mayo', 'Gruyère Cheese', 'Balsamic Onions', 'Brioche Bun', 'Arugula'],
    addons: [
      { id: 'bacon', name: 'Smoked Crispy Bacon', price: 2.50 },
      { id: 'extra_patty', name: 'Extra Angus Patty', price: 4.00 },
      { id: 'truffle_fries', name: 'Side of Truffle Parm Fries', price: 5.50 },
      { id: 'extra_aioli', name: 'Extra Black Truffle Aioli', price: 1.50 },
    ]
  },
  {
    id: 'b2',
    name: 'Crispy Nashville Hot Chicken',
    category: 'burgers',
    price: 14.50,
    rating: 4.8,
    reviewsCount: 289,
    prepTime: '15-25 min',
    calories: '680 kcal',
    spiceLevel: 3,
    isBestseller: true,
    dietary: ['bestseller', 'spicy'],
    image: 'https://images.unsplash.com/photo-1625813506062-0aeb1d7a094b?auto=format&fit=crop&w=800&q=80',
    description: 'Crispy buttermilk fried chicken breast dipped in cayenne chili oil, spicy slaw, honey drizzle, and house pickles on a sesame seed potato bun.',
    ingredients: ['Buttermilk Fried Chicken', 'Nashville Hot Oil', 'Jalapeno Slaw', 'Dill Pickles', 'Honey Glaze'],
    addons: [
      { id: 'cheese_melt', name: 'Melted Cheddar', price: 1.75 },
      { id: 'double_pickles', name: 'Extra Jalapeno Pickles', price: 1.00 },
      { id: 'waffle_fries', name: 'Cajun Waffle Fries', price: 4.50 },
    ]
  },
  {
    id: 'b3',
    name: 'Smoked BBQ Bacon & Brisket Burger',
    category: 'burgers',
    price: 17.50,
    rating: 4.9,
    reviewsCount: 195,
    prepTime: '20-25 min',
    calories: '850 kcal',
    spiceLevel: 1,
    dietary: ['chef'],
    image: 'https://images.unsplash.com/photo-1550547660-d9450f859349?auto=format&fit=crop&w=800&q=80',
    description: 'Smoked prime beef patty topped with 14-hour pulled brisket, hickory BBQ glaze, crispy onion rings, and sharp cheddar.',
    ingredients: ['Prime Beef', 'Smoked Brisket', 'Hickory BBQ', 'Crispy Onion Strings', 'Cheddar Cheese'],
    addons: [
      { id: 'extra_brisket', name: 'Double Smoked Brisket', price: 4.50 },
      { id: 'fried_egg', name: 'Sunny Side Egg', price: 1.95 },
      { id: 'slaw_side', name: 'Apple Cider Slaw', price: 3.50 }
    ]
  },
  {
    id: 'b4',
    name: 'Avocado Garden Plant-Burger',
    category: 'burgers',
    price: 15.25,
    rating: 4.7,
    reviewsCount: 154,
    prepTime: '15-20 min',
    calories: '520 kcal',
    spiceLevel: 0,
    dietary: ['vegetarian'],
    image: 'https://images.unsplash.com/photo-1585238342024-78d387f4a707?auto=format&fit=crop&w=800&q=80',
    description: 'Charred pea-protein savory patty, Hass avocado mash, sun-ripened beefsteak tomatoes, pickled red onion, and garlic-herb vegan mayo.',
    ingredients: ['Plant Patty', 'Fresh Avocado', 'Pickled Red Onions', 'Heirloom Tomato', 'Vegan Brioche'],
    addons: [
      { id: 'vegan_cheese', name: 'Smoked Vegan Provolone', price: 2.00 },
      { id: 'sweet_potato', name: 'Sweet Potato Crisp Fries', price: 4.75 },
    ]
  },
  {
    id: 'p1',
    name: 'Burrata & San Marzano Margherita',
    category: 'pizza',
    price: 18.99,
    originalPrice: 21.50,
    rating: 5.0,
    reviewsCount: 410,
    prepTime: '18-22 min',
    calories: '780 kcal',
    spiceLevel: 0,
    isBestseller: true,
    isChefSpecial: true,
    dietary: ['bestseller', 'vegetarian', 'chef'],
    image: 'https://images.unsplash.com/photo-1604382354936-07c5d9983bd3?auto=format&fit=crop&w=800&q=80',
    description: 'Neapolitan sourdough crust fermented for 48 hours, sweet San Marzano tomato sauce, whole creamy pugliese burrata, fresh Genovese basil & extra virgin olive oil.',
    ingredients: ['48h Sourdough', 'San Marzano D.O.P.', 'Fresh Burrata', 'Genovese Basil', 'EVOO'],
    addons: [
      { id: 'prosciutto', name: '24-Mo Aged Prosciutto di Parma', price: 4.50 },
      { id: 'hot_honey', name: 'Artisan Hot Honey Drizzle', price: 2.00 },
      { id: 'truffle_oil', name: 'White Truffle Oil Drizzle', price: 2.50 },
      { id: 'extra_burrata', name: 'Extra Mini Burrata Ball', price: 3.50 }
    ]
  },
  {
    id: 'p2',
    name: 'Spicy Calabrian Diavola',
    category: 'pizza',
    price: 19.50,
    rating: 4.8,
    reviewsCount: 220,
    prepTime: '15-20 min',
    calories: '840 kcal',
    spiceLevel: 2,
    dietary: ['spicy', 'bestseller'],
    image: 'https://images.unsplash.com/photo-1534308983496-4fabb1a015ee?auto=format&fit=crop&w=800&q=80',
    description: 'Spicy Calabrian soppressata salami, crushed chili flakes, fiore di latte mozzarella, roasted red peppers, and organic hot honey glaze.',
    ingredients: ['Calabrian Salami', 'Fiore di Latte', 'Crushed Hot Chili', 'Roasted Peppers', 'Hot Honey'],
    addons: [
      { id: 'gorgonzola', name: 'Crumbled Gorgonzola Dolce', price: 2.50 },
      { id: 'olives', name: 'Kalamata Wild Olives', price: 1.75 },
      { id: 'garlic_dip', name: 'Roasted Garlic Herb Crust Dip', price: 1.50 }
    ]
  },
  {
    id: 'p3',
    name: 'Wild Mushroom & Black Truffle',
    category: 'pizza',
    price: 21.00,
    rating: 4.9,
    reviewsCount: 178,
    prepTime: '20-25 min',
    calories: '760 kcal',
    spiceLevel: 0,
    dietary: ['vegetarian', 'chef'],
    image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=800&q=80',
    description: 'Roasted chantarelle and cremini wild mushrooms, garlic crema base, fontina cheese, fresh thyme, and shaved summer truffle.',
    ingredients: ['Wild Foraged Mushrooms', 'Garlic Ricotta Crema', 'Fontina Cheese', 'Shaved Truffle', 'Fresh Thyme'],
    addons: [
      { id: 'caramelized_shallots', name: 'Caramelized Crispy Shallots', price: 1.75 },
      { id: 'parmesan_crust', name: 'Parmigiano-Reggiano Stuffed Crust', price: 3.50 }
    ]
  },
  {
    id: 'p4',
    name: 'Fire-Roasted Garden Primavera',
    category: 'pizza',
    price: 17.50,
    rating: 4.6,
    reviewsCount: 112,
    prepTime: '15-20 min',
    calories: '650 kcal',
    spiceLevel: 0,
    dietary: ['vegetarian'],
    image: 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?auto=format&fit=crop&w=800&q=80',
    description: 'Charred zucchini ribbons, cherry heirloom tomatoes, roasted artichoke hearts, pesto sauce, and smoked buffalo mozzarella.',
    ingredients: ['Zucchini', 'Artichoke Hearts', 'Basil Pesto', 'Buffalo Mozzarella', 'Cherry Tomatoes'],
    addons: [
      { id: 'balsamic_glaze', name: 'Modena Aged Balsamic Glaze', price: 1.50 },
      { id: 'pine_nuts', name: 'Toasted Pine Nuts', price: 2.25 }
    ]
  },
  {
    id: 'a1',
    name: 'Tokyo Teriyaki Salmon Bowl',
    category: 'asian',
    price: 19.25,
    originalPrice: 22.00,
    rating: 4.9,
    reviewsCount: 310,
    prepTime: '15-20 min',
    calories: '620 kcal',
    spiceLevel: 1,
    isBestseller: true,
    dietary: ['bestseller', 'chef'],
    image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=800&q=80',
    description: 'Pan-seared Atlantic salmon fillet glazed in ginger-mirin teriyaki, steamed sushi rice, edamame, pickled cucumber, and toasted nori.',
    ingredients: ['Atlantic Salmon', 'Sushi Rice', 'Ginger Teriyaki', 'Edamame', 'Avocado', 'Pickled Cucumber'],
    addons: [
      { id: 'tamago', name: 'Japanese Soft Tamago Egg', price: 2.00 },
      { id: 'kimchi', name: 'Aged Spicy Kimchi', price: 2.25 },
      { id: 'extra_salmon', name: 'Extra Salmon Fillet', price: 6.00 }
    ]
  },
  {
    id: 'a2',
    name: 'Spicy Dan Dan Pork Noodles',
    category: 'asian',
    price: 16.50,
    rating: 4.8,
    reviewsCount: 245,
    prepTime: '12-18 min',
    calories: '710 kcal',
    spiceLevel: 3,
    dietary: ['spicy'],
    image: 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?auto=format&fit=crop&w=800&q=80',
    description: 'Hand-pulled spring noodles in rich Sichuan chili sesame broth, seasoned minced Berkshire pork, bok choy, and crispy crushed peanuts.',
    ingredients: ['Hand-Pulled Noodles', 'Minced Pork', 'Sichuan Chili Oil', 'Sesame Paste', 'Baby Bok Choy'],
    addons: [
      { id: 'extra_chili', name: 'Extra Sichuan Chili Crisp', price: 1.00 },
      { id: 'crispy_gyoza', name: '3pc Pork Potstickers', price: 3.75 },
      { id: 'marinated_egg', name: 'Soy-Marinated Ramen Egg', price: 1.75 }
    ]
  },
  {
    id: 'a3',
    name: 'Golden Thai Coconut Chicken Curry',
    category: 'asian',
    price: 17.80,
    rating: 4.9,
    reviewsCount: 189,
    prepTime: '20-25 min',
    calories: '670 kcal',
    spiceLevel: 2,
    dietary: ['chef', 'spicy'],
    image: 'https://images.unsplash.com/photo-1455619452474-d2be8b1e70cd?auto=format&fit=crop&w=800&q=80',
    description: 'Aromatic yellow curry simmered with rich coconut milk, tender lemongrass chicken, bamboo shoots, bell peppers, served with jasmine fragrant rice.',
    ingredients: ['Lemongrass Chicken', 'Coconut Milk', 'Yellow Curry Paste', 'Jasmine Rice', 'Thai Basil'],
    addons: [
      { id: 'roti', name: 'Flaky Golden Roti Bread (2pc)', price: 3.50 },
      { id: 'prawns', name: 'Add Jumbo Black Tiger Prawns (3pc)', price: 4.95 }
    ]
  },
  {
    id: 'h1',
    name: 'Rainbow Quinoa Power Bowl',
    category: 'healthy',
    price: 14.99,
    rating: 4.8,
    reviewsCount: 165,
    prepTime: '10-15 min',
    calories: '450 kcal',
    spiceLevel: 0,
    dietary: ['vegetarian', 'bestseller'],
    image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=800&q=80',
    description: 'Tri-color organic quinoa, baby spinach, roasted sweet potatoes, charred chickpeas, creamy avocado rose, and lemon-tahini vinaigrette.',
    ingredients: ['Tri-Color Quinoa', 'Avocado', 'Roasted Sweet Potato', 'Crispy Chickpeas', 'Tahini Dressing'],
    addons: [
      { id: 'grilled_tofu', name: 'Charred Herb Tofu', price: 3.00 },
      { id: 'grilled_chicken', name: 'Free-Range Grilled Herb Chicken', price: 4.00 },
      { id: 'hemp_seeds', name: 'Organic Hemp & Chia Seed Mix', price: 1.50 }
    ]
  },
  {
    id: 'h2',
    name: 'Mediterranean Grilled Chicken Salad',
    category: 'healthy',
    price: 15.75,
    rating: 4.7,
    reviewsCount: 140,
    prepTime: '12-16 min',
    calories: '480 kcal',
    spiceLevel: 0,
    dietary: ['chef'],
    image: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=800&q=80',
    description: 'Lemon-herb marinated chicken breast, crisp romaine, Kalamata olives, Persian cucumbers, Greek sheep feta, and oregano red wine vinaigrette.',
    ingredients: ['Grilled Chicken Breast', 'Feta Cheese', 'Kalamata Olives', 'Persian Cucumber', 'Oregano Dressing'],
    addons: [
      { id: 'pita_chips', name: 'Warm Zaatar Pita Wedges', price: 2.50 },
      { id: 'extra_feta', name: 'Extra Crumbled Feta', price: 1.75 }
    ]
  },
  {
    id: 'h3',
    name: 'Ahi Tuna Sesame Poke Bowl',
    category: 'healthy',
    price: 18.50,
    rating: 4.9,
    reviewsCount: 230,
    prepTime: '10-15 min',
    calories: '530 kcal',
    spiceLevel: 1,
    dietary: ['bestseller'],
    image: 'https://images.unsplash.com/photo-1543339308-43e59d6b73a6?auto=format&fit=crop&w=800&q=80',
    description: 'Sashimi grade yellowfin ahi tuna cubes tossed in sesame ponzu, brown rice, edamame, wakame seaweed salad, mango slices, and spicy sriracha drizzle.',
    ingredients: ['Yellowfin Ahi Tuna', 'Sesame Ponzu', 'Brown Rice', 'Seaweed Salad', 'Fresh Mango', 'Tobiko'],
    addons: [
      { id: 'crispy_shallots', name: 'Crispy Tempura Flakes', price: 1.00 },
      { id: 'extra_tuna', name: 'Double Ahi Tuna Portion', price: 5.50 }
    ]
  },
  {
    id: 'd1',
    name: 'Molten Belgian Chocolate Lava Cake',
    category: 'desserts',
    price: 9.50,
    rating: 5.0,
    reviewsCount: 380,
    prepTime: '10-12 min',
    calories: '490 kcal',
    spiceLevel: 0,
    isBestseller: true,
    dietary: ['bestseller', 'vegetarian'],
    image: 'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?auto=format&fit=crop&w=800&q=80',
    description: 'Warm dark Valrhona chocolate cake with a molten flowing center, served with Madagascar vanilla bean gelato and raspberry coulis.',
    ingredients: ['Valrhona Dark Chocolate', 'Madagascar Vanilla Bean', 'Raspberry Coulis', 'Organic Butter'],
    addons: [
      { id: 'extra_gelato', name: 'Extra Scoop of Vanilla Gelato', price: 2.50 },
      { id: 'pistachio_crush', name: 'Toasted Pistachio Crumbs', price: 1.50 }
    ]
  },
  {
    id: 'd2',
    name: 'Velvety Basque Burnt Cheesecake',
    category: 'desserts',
    price: 8.99,
    rating: 4.9,
    reviewsCount: 215,
    prepTime: '5-8 min',
    calories: '420 kcal',
    spiceLevel: 0,
    dietary: ['vegetarian', 'chef'],
    image: 'https://images.unsplash.com/photo-1533134242443-d4fd215305ad?auto=format&fit=crop&w=800&q=80',
    description: 'Caramelized crust with an ultra-creamy, custard-like molten interior, dusted with powdered organic vanilla sugar and wild berries.',
    ingredients: ['Cream Cheese', 'Fresh Farm Cream', 'Wild Berry Compote', 'Organic Vanilla'],
    addons: [
      { id: 'salted_caramel', name: 'Sea Salt Caramel Drizzle', price: 1.25 }
    ]
  },
  {
    id: 'dr1',
    name: 'Passionfruit Dragonfruit Fizz',
    category: 'drinks',
    price: 5.99,
    rating: 4.8,
    reviewsCount: 160,
    prepTime: '5 min',
    calories: '120 kcal',
    spiceLevel: 0,
    dietary: ['vegetarian'],
    image: 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?auto=format&fit=crop&w=800&q=80',
    description: 'Fresh squeezed tropical passionfruit, diced magenta dragonfruit, crushed mint leaves, sparkling spring water and agave nectar.',
    ingredients: ['Passionfruit Puree', 'Dragonfruit', 'Fresh Mint', 'Agave Nectar', 'Sparkling Mineral Water'],
    addons: [
      { id: 'boba_popping', name: 'Mango Popping Boba', price: 1.25 },
      { id: 'extra_mint', name: 'Extra Mint & Lime Splash', price: 0.50 }
    ]
  },
  {
    id: 'dr2',
    name: 'Iced Caramel Cloud Cold Brew',
    category: 'drinks',
    price: 6.25,
    rating: 4.9,
    reviewsCount: 290,
    prepTime: '5 min',
    calories: '180 kcal',
    spiceLevel: 0,
    dietary: ['vegetarian', 'bestseller'],
    image: 'https://images.unsplash.com/photo-1517701550927-30cf4ba1dba5?auto=format&fit=crop&w=800&q=80',
    description: '18-hour steep single-origin Ethiopian cold brew coffee topped with fluffy sea-salt caramel cold foam and dark chocolate shavings.',
    ingredients: ['Ethiopian Cold Brew', 'Oat Milk Cold Foam', 'Salted Caramel', 'Dark Chocolate Shavings'],
    addons: [
      { id: 'espresso_shot', name: 'Extra Single Origin Espresso Shot', price: 1.50 },
      { id: 'vanilla_syrup', name: 'Sugar-Free Vanilla Bean Pump', price: 0.75 }
    ]
  }
];

export const PROMO_CODES = {
  'STEVE20': { discountPercent: 20, description: '20% off entire order (STEVE FOOD Special)' },
  'CRAVE20': { discountPercent: 20, description: '20% off entire order' },
  'FREEDEL': { freeDelivery: true, description: 'Free Express Delivery' },
  'YUMMY10': { discountAmount: 10, minSpend: 30, description: '€10 off orders over €30' },
  'CHEF5': { discountAmount: 5, description: '€5 off chef favorites' }
};

export const REVIEWS = [
  {
    id: 1,
    name: 'Sophia Montgomery',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&q=80',
    role: 'Verified Foodie',
    rating: 5,
    comment: 'The Truffle Umami Smash Burger is genuinely restaurant-quality. Fast delivery and paying with my pre-loaded credits was completely instantaneous!',
    dish: 'Truffle Umami Smash Burger'
  },
  {
    id: 2,
    name: 'David Chen',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
    role: 'Gourmet Critic',
    rating: 5,
    comment: 'The 48h Burrata Margherita arrived piping hot with that gorgeous wood-fired blistered crust. The animations and checkout UX are so sleek.',
    dish: 'Burrata Margherita Pizza'
  },
  {
    id: 3,
    name: 'Elena Rostova',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
    role: 'Fitness Coach',
    rating: 5,
    comment: 'Rainbow Quinoa Power Bowl is packed with fresh flavors and balanced macros. Love the live courier tracking map!',
    dish: 'Rainbow Quinoa Power Bowl'
  }
];

