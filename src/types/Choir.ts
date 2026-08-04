export interface ChoirMember {
  _id: string;
  user: string | {
    _id: string;
    firstName: string;
    lastName: string;
    email: string;
  };
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  voicePart: 'Soprano' | 'Alto' | 'Tenor' | 'Bass' | 'Soloist' | 'Instrumentalist';
  campus: string;
  state: string;
  country: string;
  experienceLevel: 'Beginner' | 'Intermediate' | 'Advanced' | 'Professional';
  musicalSkills: string[];
  availability: {
    days: string[];
    timePreference: 'Morning' | 'Afternoon' | 'Evening' | 'Any';
  };
  isActive: boolean;
  isLeader: boolean;
  joinedDate: string;
  attendance: Array<{
    date: string;
    present: boolean;
    rehearsal: string;
  }>;
  performances: Array<{
    eventName: string;
    date: string;
    location: string;
    role: string;
  }>;
  rehearsalSchedule: {
    day: string;
    time: string;
    venue: string;
  };
  profileImage: string;
  createdAt: string;
  updatedAt: string;
}

export interface ChoirEvent {
  _id: string;
  title: string;
  description: string;
  type: 'Rehearsal' | 'Performance' | 'Concert' | 'Competition' | 'Special Service' | 'Workshop';
  date: string;
  time: string;
  venue: string;
  location: {
    address: string;
    city: string;
    state: string;
    country: string;
  };
  coordinator: string | {
    _id: string;
    firstName: string;
    lastName: string;
    email: string;
  };
  participants: string[] | ChoirMember[];
  repertoire: Array<{
    songTitle: string;
    composer: string;
    arrangement: string;
    key: string;
  }>;
  requirements: {
    dressCode: string;
    preparation: string;
    specialNotes: string;
  };
  status: 'Upcoming' | 'Ongoing' | 'Completed' | 'Cancelled';
  maxParticipants: number;
  isPublic: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Song {
  _id: string;
  title: string;
  composer: string;
  arranger: string;
  genre: 'Gospel' | 'Hymn' | 'Contemporary' | 'Classical' | 'Spiritual' | 'Traditional';
  key: string;
  tempo: number;
  timeSignature: string;
  lyrics: string;
  chords: string;
  difficulty: 'Easy' | 'Medium' | 'Hard' | 'Advanced';
  parts: {
    soprano: string;
    alto: string;
    tenor: string;
    bass: string;
  };
  audioUrl: string;
  sheetMusicUrl: string;
  tags: string[];
  categories: string[];
  isActive: boolean;
  addedBy: string | {
    _id: string;
    firstName: string;
    lastName: string;
  };
  performancesCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface ChoirStats {
  totalMembers: number;
  leaders: number;
  voicePartStats: Array<{
    _id: string;
    count: number;
  }>;
  campusStats: Array<{
    _id: string;
    count: number;
  }>;
  upcomingEvents: number;
  totalSongs: number;
}