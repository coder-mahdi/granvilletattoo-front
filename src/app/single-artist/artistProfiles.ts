export type ArtistProfile = {
  id: number;
  name: string;
  title: string;
  bio: string;
  specialties: string[];
  experience: string;
  location: string;
  /** Folder under `public/images` whose `.webp` files fill the portfolio grid (same file as `heroImage` is omitted). */
  imageFolder: string;
  heroImage: string;
  social: {
    instagram: string;
    facebook: string;
    website: string;
  };
  availability: {
    status: string;
    nextAppointment: string;
    bookingLink: string;
  };
};

export const ARTIST_PROFILES: Record<string, ArtistProfile> = {
  'kian-mokhtari': {
    id: 1,
    name: 'Kian Mokhtari',
    title: 'Realism & Portrait Specialist',
    bio: 'Kian crafts high-impact realism pieces with a cinematic touch, blending fine art training and tattoo craft. He loves transforming your references into hyper-detailed, story-driven tattoos.',
    specialties: ['Realistic Portraits', 'Black & Grey', 'Fine Line', 'Color Realism'],
    experience: '10+ Years',
    location: 'Vancouver, BC',
    imageFolder: 'Kian',
    heroImage: '/images/Kian/kian_hero.webp',
    social: {
      instagram: 'tattoo_kian',
      facebook: 'KianMokhtariTattoo',
      website: 'redtattoo.ca',
    },
    availability: {
      status: 'Available',
      nextAppointment: 'Next week',
      bookingLink: '#book',
    },
  },
  'masi-aghdam': {
    id: 2,
    name: 'Masi Aghdam',
    title: 'Fine Line & Script Specialist',
    bio: 'Masi focuses on refined fine-line compositions, bespoke lettering, and meaningful micro-realism pieces. Her work blends elegance with clean execution for long-lasting detail.',
    specialties: ['Fine Line', 'Script', 'Micro Realism', 'Color', 'Black & Grey'],
    experience: '8+ Years',
    location: 'Vancouver, BC',
    imageFolder: 'Masi',
    heroImage: '/images/Masi/Masi-1.webp',
    social: {
      instagram: 'masiworldtattoo',
      facebook: 'MasiAghdamTattoo',
      website: 'vansunstudio.com',
    },
    availability: {
      status: 'Available',
      nextAppointment: 'This week',
      bookingLink: '#book',
    },
  },
  'mina-khanian': {
    id: 3,
    name: 'Mina Khanian',
    title: 'Watercolor & Illustrative Artist',
    bio: 'Mina Khanian combines fluid watercolor gradients with precision line work, layering minimalist structure over emotive color to keep every piece vibrant and full of motion.',
    specialties: ['Fine Line', 'Minimalist', 'Color', 'Black & Grey', 'Watercolor'],
    experience: '8+ Years',
    location: 'Vancouver, BC',
    imageFolder: 'Mina',
    heroImage: '/images/Mina/Mina-1.webp',
    social: {
      instagram: 'minatattoominimal',
      facebook: 'MinaKhanianTattoo',
      website: 'redtattoo.ca',
    },
    availability: {
      status: 'Available',
      nextAppointment: 'This month',
      bookingLink: '#book',
    },
  },
  'mina-khani': {
    id: 3,
    name: 'Mina Khanian',
    title: 'Watercolor & Illustrative Artist',
    bio: 'Mina Khanian combines fluid watercolor gradients with precision line work, layering minimalist structure over emotive color to keep every piece vibrant and full of motion.',
    specialties: ['Fine Line', 'Minimalist', 'Color', 'Black & Grey', 'Watercolor'],
    experience: '8+ Years',
    location: 'Vancouver, BC',
    imageFolder: 'Mina',
    heroImage: '/images/Mina/Mina-1.webp',
    social: {
      instagram: 'minatattoominimal',
      facebook: 'MinaKhanianTattoo',
      website: 'redtattoo.ca',
    },
    availability: {
      status: 'Available',
      nextAppointment: 'This month',
      bookingLink: '#book',
    },
  },
  'sami-amiri': {
    id: 4,
    name: 'Sami Amiri',
    title: 'Fine Line, Color & Realism Artist',
    bio: 'Sami specializes in refined fine line work, bold color gradients, and realistic storytelling. Her minimalist approach channels depth without sacrificing emotion.',
    specialties: ['Fine Line', 'Minimalist', 'Blackwork', 'Color', 'Realism'],
    experience: '8+ Years',
    location: 'Vancouver, BC',
    imageFolder: 'sami',
    heroImage: '/images/sami/hero-sami.webp',
    social: {
      instagram: '@sami_amiri_art',
      facebook: 'SamiAmiriTattoos',
      website: 'samiamiri.com',
    },
    availability: {
      status: 'Available',
      nextAppointment: 'Next month',
      bookingLink: '#book',
    },
  },
};
