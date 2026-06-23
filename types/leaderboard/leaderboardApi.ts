export type BackendLeaderboardEntry = {
  user_id: number;
  username: string;
  country: string | null;
  country_flag: string | null;
  image_url: string | null;
  rank: number;
  freedom_points: number;
  badge_id: string;
  is_online: boolean;
  is_current_user: boolean;
};

export type BackendLeaderboardResponse = {
  items: BackendLeaderboardEntry[];
  viewer: BackendLeaderboardEntry | null;
  total_users: number;
  has_more: boolean;
  offset: number;
  limit: number;
};
