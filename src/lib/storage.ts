import { Collection, Artwork, ContactMessage } from "../types";

const SEED_COLLECTIONS: Collection[] = [
  {
    "id": "col-abstract",
    "name": "Ethereal Echoes",
    "description": "An exploration of fluid colors, textured canvases, and non-representational forms that touch the subconscious.",
    "coverImage": "https://images.unsplash.com/photo-1541701494587-cb58502866ab?auto=format&fit=crop&w=800&q=80"
  },
  {
    "id": "col-nature",
    "name": "Silent Horizons",
    "description": "Modernist landscape interpretations focusing on serenity, the interplay of light, and geographic simplicity.",
    "coverImage": "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?auto=format&fit=crop&w=800&q=80"
  },
  {
    "id": "col-sculpture",
    "name": "Tactile Realities",
    "description": "Three-dimensional structures using organic woods, metals, and plaster to redefine physical space.",
    "coverImage": "https://images.unsplash.com/photo-1605721911519-3dfeb3be25e7?auto=format&fit=crop&w=800&q=80"
  }
];

const SEED_ARTWORKS: Artwork[] = [
  {
    "id": "art-1",
    "title": "Vortices of Serenity",
    "description": "An intense, layered oil painting expressing the balance between chaos and stillness. Heavy brushstrokes and metallic accents.",
    "year": "2025",
    "medium": "Oil on Canvas",
    "dimensions": "120cm x 120cm",
    "collectionId": "col-abstract",
    "image": "https://images.unsplash.com/photo-1541701494587-cb58502866ab?auto=format&fit=crop&w=800&q=80",
    "isFeatured": true,
    "createdAt": "2026-06-28T10:15:37.468Z"
  },
  {
    "id": "art-2",
    "title": "Pastel Drift",
    "description": "Soft, geometric planes layered with fine acrylic washes. Evokes a feeling of passing clouds over an urban landscape.",
    "year": "2025",
    "medium": "Mixed Media & Acrylic",
    "dimensions": "90cm x 110cm",
    "collectionId": "col-abstract",
    "image": "https://images.unsplash.com/photo-1549887534-1541e9326642?auto=format&fit=crop&w=800&q=80",
    "isFeatured": false,
    "createdAt": "2026-06-28T10:15:37.468Z"
  },
  {
    "id": "art-3",
    "title": "Morning Mist",
    "description": "Minimalist interpretation of a river valley at dawn. Painted with soft horizontal gradients of sage, cream, and deep pine.",
    "year": "2026",
    "medium": "Acrylic on Linen",
    "dimensions": "150cm x 100cm",
    "collectionId": "col-nature",
    "image": "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?auto=format&fit=crop&w=800&q=80",
    "isFeatured": true,
    "createdAt": "2026-06-28T10:15:37.468Z"
  },
  {
    "id": "art-4",
    "title": "Monolithic Grace",
    "description": "Hand-carved cedarwood structure highlighted with fine brass wire. Explores tension and structural balance.",
    "year": "2024",
    "medium": "Cedarwood & Brass",
    "dimensions": "45cm x 20cm x 80cm",
    "collectionId": "col-sculpture",
    "image": "https://images.unsplash.com/photo-1605721911519-3dfeb3be25e7?auto=format&fit=crop&w=800&q=80",
    "isFeatured": true,
    "createdAt": "2026-06-28T10:15:37.468Z"
  },
  {
    "id": "art-5",
    "title": "Golden Hour Reflection",
    "description": "Warm, textured study capturing the final direct rays of the sun touching a rugged mountain ridge.",
    "year": "2026",
    "medium": "Oil with Palette Knife",
    "dimensions": "80cm x 80cm",
    "collectionId": "col-nature",
    "image": "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80",
    "isFeatured": false,
    "createdAt": "2026-06-28T10:15:37.468Z"
  }
];

// Helper to determine if we should default to LocalStorage/Static mode.
// We explicitly check if running on static hosting sites (Netlify, Vercel, GitHub Pages) or if the backend port isn't matching.
export const isStaticMode = (): boolean => {
  if (typeof window === "undefined") return true;
  const hostname = window.location.hostname;
  return (
    hostname.includes("netlify.app") ||
    hostname.includes("github.io") ||
    hostname.includes("vercel.app") ||
    (hostname !== "localhost" && hostname !== "127.0.0.1" && !window.location.port)
  );
};

const getStorageItem = <T>(key: string, defaultValue: T): T => {
  const data = localStorage.getItem(key);
  if (!data) return defaultValue;
  try {
    return JSON.parse(data) as T;
  } catch {
    return defaultValue;
  }
};

const setStorageItem = <T>(key: string, value: T): void => {
  localStorage.setItem(key, JSON.stringify(value));
};

export const initLocalStorage = (): void => {
  if (typeof window === "undefined") return;
  if (!localStorage.getItem("waterman_collections")) {
    setStorageItem("waterman_collections", SEED_COLLECTIONS);
  }
  if (!localStorage.getItem("waterman_artworks")) {
    setStorageItem("waterman_artworks", SEED_ARTWORKS);
  }
  if (!localStorage.getItem("waterman_messages")) {
    setStorageItem("waterman_messages", []);
  }
};

export const getLocalData = () => {
  initLocalStorage();
  return {
    collections: getStorageItem<Collection[]>("waterman_collections", SEED_COLLECTIONS),
    artworks: getStorageItem<Artwork[]>("waterman_artworks", SEED_ARTWORKS),
    messages: getStorageItem<ContactMessage[]>("waterman_messages", [])
  };
};

export const saveLocalArtwork = (artwork: Omit<Artwork, "id" | "createdAt">): Artwork => {
  initLocalStorage();
  const artworks = getStorageItem<Artwork[]>("waterman_artworks", SEED_ARTWORKS);
  const newArt: Artwork = {
    ...artwork,
    id: `art-${Date.now()}`,
    createdAt: new Date().toISOString()
  };
  artworks.push(newArt);
  setStorageItem("waterman_artworks", artworks);
  return newArt;
};

export const deleteLocalArtwork = (id: string): void => {
  initLocalStorage();
  const artworks = getStorageItem<Artwork[]>("waterman_artworks", SEED_ARTWORKS);
  const filtered = artworks.filter(art => art.id !== id);
  setStorageItem("waterman_artworks", filtered);
};

export const saveLocalCollection = (collection: Omit<Collection, "id">): Collection => {
  initLocalStorage();
  const collections = getStorageItem<Collection[]>("waterman_collections", SEED_COLLECTIONS);
  const newCol: Collection = {
    ...collection,
    id: `col-${Date.now()}`
  };
  collections.push(newCol);
  setStorageItem("waterman_collections", collections);
  return newCol;
};

export const deleteLocalCollection = (id: string): void => {
  initLocalStorage();
  const collections = getStorageItem<Collection[]>("waterman_collections", SEED_COLLECTIONS);
  const filtered = collections.filter(col => col.id !== id);
  setStorageItem("waterman_collections", filtered);

  // Re-assign artworks of deleted collection to uncategorized ("")
  const artworks = getStorageItem<Artwork[]>("waterman_artworks", SEED_ARTWORKS);
  const updatedArtworks = artworks.map(art => {
    if (art.collectionId === id) {
      return { ...art, collectionId: "" };
    }
    return art;
  });
  setStorageItem("waterman_artworks", updatedArtworks);
};

export const saveLocalMessage = (message: Omit<ContactMessage, "id" | "createdAt" | "isRead">): ContactMessage => {
  initLocalStorage();
  const messages = getStorageItem<ContactMessage[]>("waterman_messages", []);
  const newMsg: ContactMessage = {
    ...message,
    id: `msg-${Date.now()}`,
    createdAt: new Date().toISOString(),
    isRead: false
  };
  messages.push(newMsg);
  setStorageItem("waterman_messages", messages);
  return newMsg;
};

export const markLocalMessageRead = (id: string): void => {
  initLocalStorage();
  const messages = getStorageItem<ContactMessage[]>("waterman_messages", []);
  const updated = messages.map(msg => msg.id === id ? { ...msg, isRead: true } : msg);
  setStorageItem("waterman_messages", updated);
};

export const deleteLocalMessage = (id: string): void => {
  initLocalStorage();
  const messages = getStorageItem<ContactMessage[]>("waterman_messages", []);
  const filtered = messages.filter(msg => msg.id !== id);
  setStorageItem("waterman_messages", filtered);
};
