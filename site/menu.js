window.CAFE_CONFIG = {
  name: "Nuts coffee & cakes",
  city: "Бровари",
  mapsUrl: "https://maps.app.goo.gl/Ftq1DddzGV787sws5",
  instagramUrl: "#", // заглушка
  phoneDisplay: "", // додайте номер, коли буде відомий
  wifi: { ssid: "Nuts", password: "nuts2021" }
};

window.MENU_CATEGORIES = [
  { id: "coffee", label: "Кава" },
  { id: "cold", label: "Холодні напої" },
  { id: "hot", label: "Гарячі напої" },
  { id: "addons", label: "Додатки" }
];

// Ціни та об'єми взяті з крейдяної дошки — перевірте їх разом із власницею
window.MENU_ITEMS = [
  // Кава
  { id: "espresso", category: "coffee", name: "Еспресо", variants: [{ label: "30 мл", price: 45 }] },
  { id: "ristretto", category: "coffee", name: "Рістретто", variants: [{ label: "15 мл", price: 45 }] },
  { id: "doppio", category: "coffee", name: "Допіо", variants: [{ label: "60 мл", price: 75 }] },
  { id: "lungo", category: "coffee", name: "Лунго", variants: [{ label: "60 мл", price: 45 }] },
  { id: "macchiato", category: "coffee", name: "Макіато", variants: [{ label: "60 мл", price: 50 }] },
  { id: "americano", category: "coffee", name: "Американо", variants: [{ label: "120 мл", price: 45 }] },
  { id: "americano_milk", category: "coffee", name: "Американо з молоком", variants: [{ label: "250 мл", price: 55 }] },
  { id: "americano_cream", category: "coffee", name: "Американо з вершками", variants: [{ label: "250 мл", price: 60 }] },
  { id: "cappuccino", category: "coffee", name: "Капучино", badge: "Хіт", variants: [{ label: "250 мл", price: 60 }] },
  { id: "latte", category: "coffee", name: "Лате", variants: [{ label: "350 мл", price: 65 }] },
  { id: "mochaccino", category: "coffee", name: "Мокачино", variants: [{ label: "350 мл", price: 80 }] },
  { id: "palianytsia", category: "coffee", name: "Паляниця", badge: "Фірмовий", variants: [{ label: "350 мл", price: 85 }] },
  { id: "flat_white", category: "coffee", name: "Флет Уайт", variants: [{ label: "350 мл", price: 85 }] },

  // Холодні напої
  { id: "glace", category: "cold", name: "Глясе", variants: [{ label: "400 мл", price: 95 }] },
  { id: "ice_latte", category: "cold", name: "Айс Лате", variants: [{ label: "400 мл", price: 75 }] },
  { id: "ice_cocoa", category: "cold", name: "Айс Какао", variants: [{ label: "400 мл", price: 75 }] },
  { id: "frappe", category: "cold", name: "Фраппе", variants: [{ label: "400 мл", price: 85 }] },
  { id: "milkshake", category: "cold", name: "Молочний коктейль", variants: [{ label: "400 мл", price: 85 }] },
  { id: "affogato", category: "cold", name: "Аффогато (еспресо)", variants: [{ label: "80 мл", price: 70 }] },
  { id: "bumblebee", category: "cold", name: "Джміль", badge: "Фірмовий", variants: [{ label: "Порція", price: 100 }] },
  { id: "lemonade", category: "cold", name: "Лимонад", variants: [{ label: "400 мл", price: 75 }] },
  { id: "espresso_tonic", category: "cold", name: "Еспресо Тонік", variants: [{ label: "400 мл", price: 95 }] },

  // Гарячі напої
  { id: "tea_black", category: "hot", name: "Чай заварний", variants: [{ label: "Порція", price: 60 }] },
  { id: "cocoa_ny", category: "hot", name: "Какао New York", variants: [{ label: "Порція", price: 60 }] },
  { id: "hot_chocolate", category: "hot", name: "Гарячий шоколад", variants: [{ label: "Порція", price: 75 }] },
  { id: "tea_natural", category: "hot", name: "Натуральний чай", variants: [{ label: "Порція", price: 60 }] },

  // Додатки
  { id: "alt_milk", category: "addons", name: "Альтернативне молоко", variants: [{ label: "Заміна", price: 30 }] }
];
