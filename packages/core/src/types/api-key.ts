/** API key record — raw key shown once on creation, only hash stored */
export interface ApiKey {
  keyHash: string;        // SHA-256 of raw key (partition key)
  userId: string;
  label: string;          // "Production", "CI Pipeline"
  prefix: string;         // "mf_live_a3f2" — first 12 chars for identification
  isActive: boolean;
  lastUsedAt: string | null;
  createdAt: string;
}
