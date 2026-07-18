export type BackendUserSearchResult = {
  user_id: number;
  username: string;
  image_url: string | null;
  country_flag: string | null;
  country: string | null;
  badge_id: string;
  is_online: boolean;
  status: "active" | "blocked";
};

export type BackendUserSearchResponse = {
  items: BackendUserSearchResult[];
};
