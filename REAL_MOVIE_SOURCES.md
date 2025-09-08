# 🎬 إعداد مصادر الأفلام الحقيقية

## المصادر المدعومة

### 1. **أفلام مجانية ومفتوحة المصدر**
```typescript
// أفلام متاحة للجمهور
const freeMovies = {
  'big-buck-bunny': {
    title: 'Big Buck Bunny',
    sources: [
      {
        quality: '4K',
        url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
        size: '355MB'
      }
    ]
  },
  'sintel': {
    title: 'Sintel',
    sources: [
      {
        quality: 'HD',
        url: 'https://download.blender.org/durian/trailer/sintel_trailer-720p.mp4',
        size: '127MB'
      }
    ]
  }
};
```

### 2. **خدمات الأفلام التجارية (للتطبيقات الحقيقية)**

#### Netflix API Integration
```typescript
const netflixConfig = {
  apiKey: process.env.NETFLIX_API_KEY,
  baseUrl: 'https://api.netflix.com/v1',
  endpoints: {
    movies: '/movies',
    streaming: '/streaming'
  }
};
```

#### Amazon Prime Video API
```typescript
const primeVideoConfig = {
  accessKey: process.env.PRIME_ACCESS_KEY,
  secretKey: process.env.PRIME_SECRET_KEY,
  region: 'us-east-1'
};
```

#### Disney+ API
```typescript
const disneyPlusConfig = {
  apiKey: process.env.DISNEY_API_KEY,
  baseUrl: 'https://api.disneyplus.com/v1'
};
```

### 3. **خوادم الأفلام المخصصة**

#### تطبيق Plex Media Server
```typescript
const plexConfig = {
  serverUrl: 'http://your-plex-server:32400',
  token: process.env.PLEX_TOKEN,
  libraryId: '1'
};

async function getPlexMovies() {
  const response = await fetch(`${plexConfig.serverUrl}/library/sections/${plexConfig.libraryId}/all?X-Plex-Token=${plexConfig.token}`);
  return response.json();
}
```

#### Jellyfin Server
```typescript
const jellyfinConfig = {
  serverUrl: 'http://your-jellyfin-server:8096',
  apiKey: process.env.JELLYFIN_API_KEY,
  userId: process.env.JELLYFIN_USER_ID
};
```

### 4. **مصادر الأفلام المجانية والقانونية**

#### Internet Archive
```typescript
const internetArchiveMovies = {
  baseUrl: 'https://archive.org/download',
  movies: [
    {
      id: 'night-of-the-living-dead-1968',
      title: 'Night of the Living Dead (1968)',
      url: 'https://archive.org/download/night_of_the_living_dead_1968/night_of_the_living_dead_1968_512kb.mp4'
    },
    {
      id: 'plan-9-from-outer-space',
      title: 'Plan 9 from Outer Space',
      url: 'https://archive.org/download/Plan9FromOuterSpace_201301/Plan9FromOuterSpace.mp4'
    }
  ]
};
```

#### Creative Commons Movies
```typescript
const creativeCommonsMovies = [
  {
    title: 'Tears of Steel',
    url: 'https://download.blender.org/durian/trailer/sintel_trailer-1080p.mp4',
    license: 'CC BY'
  },
  {
    title: 'Elephant Dream',
    url: 'https://download.blender.org/ED/ED_1024.avi',
    license: 'CC BY'
  }
];
```

## 🔧 التكامل مع TMDB

### الحصول على معرفات الأفلام الحقيقية
```typescript
// تحديث دالة getMovieStreamingSources لتدعم أفلام حقيقية
export const getMovieStreamingSources = async (movieId: number): Promise<MovieStreamingData> => {
  // أفلام حقيقية متاحة مجاناً
  const realMovieDatabase: Record<string, MovieStreamingData> = {
    
    // Big Buck Bunny (متاح مجاناً)
    '10378': { // معرف TMDB الحقيقي
      sources: [
        {
          quality: '4K',
          url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
          format: 'mp4',
          size: '355MB'
        }
      ],
      subtitles: [
        {
          language: 'en',
          url: 'https://example.com/subtitles/big-buck-bunny-en.vtt',
          label: 'English'
        }
      ]
    },

    // Sintel (فيلم قصير مجاني)
    '45745': {
      sources: [
        {
          quality: 'HD',
          url: 'https://download.blender.org/durian/trailer/sintel_trailer-720p.mp4',
          format: 'mp4',
          size: '127MB'
        }
      ],
      subtitles: [
        {
          language: 'en',
          url: 'https://example.com/subtitles/sintel-en.vtt',
          label: 'English'
        }
      ]
    },

    // أفلام الملك العام (Public Domain)
    '123456': { // Night of the Living Dead
      sources: [
        {
          quality: 'HD',
          url: 'https://archive.org/download/night_of_the_living_dead_1968/night_of_the_living_dead_1968_512kb.mp4',
          format: 'mp4',
          size: '495MB'
        }
      ],
      subtitles: []
    }
  };

  return realMovieDatabase[movieId.toString()] || getDefaultSources();
};
```

## 🎯 نصائح للحصول على مصادر أفلام قانونية

### 1. **الأفلام المجانية القانونية**
- **Archive.org**: مجموعة كبيرة من الأفلام في الملك العام
- **Creative Commons**: أفلام مرخصة للاستخدام المجاني
- **YouTube Movies**: أفلام مجانية بإعلانات

### 2. **APIs التجارية**
- **Netflix Partner API**: للشركاء المعتمدين
- **Amazon Prime Video API**: للمطورين المصرح لهم
- **Roku Channel Store API**: للمحتوى المجاني

### 3. **الخوادم الشخصية**
- **Plex Media Server**: لمجموعتك الشخصية
- **Jellyfin**: بديل مفتوح المصدر لـ Plex
- **Emby**: خادم وسائط متطور

## ⚖️ اعتبارات قانونية

⚠️ **تنبيه هام**: 
- تأكد من أن لديك الحقوق القانونية لعرض الأفلام
- استخدم فقط المحتوى المرخص أو في الملك العام
- احترم حقوق الطبع والنشر في جميع الأوقات

## 🚀 التطبيق العملي

```typescript
// مثال لاستخدام مصادر أفلام حقيقية
const enhancedMovieService = {
  async getStreamingSources(movieId: number) {
    // 1. تحقق من الخادم المحلي أولاً
    const localSource = await checkLocalPlex(movieId);
    if (localSource) return localSource;

    // 2. تحقق من المصادر المجانية
    const freeSource = await checkFreeSources(movieId);
    if (freeSource) return freeSource;

    // 3. تحقق من الخدمات المدفوعة (إذا كان المستخدم مشترك)
    const premiumSource = await checkPremiumServices(movieId);
    if (premiumSource) return premiumSource;

    // 4. استخدم مصادر تجريبية
    return getDefaultSources();
  }
};
```

---

*ملاحظة: هذا الدليل يوضح كيفية إعداد مصادر أفلام قانونية للتطبيق. تأكد دائماً من الامتثال للقوانين المحلية وحقوق الطبع والنشر.* ⚖️
