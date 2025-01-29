import { supabase } from "./supabaseClient";

// Token Service
export const TokenService = {
  /**
   * Fetches the token details for the logged-in user.
   */
  async fetchUserTokens(userId: string) {
    const { data, error } = await supabase
      .from("user_tokens")
      .select("*")
      .eq("id", userId)
      .single();

    if (error) {
      console.error("Error fetching tokens:", error.message);
      return null;
    }

    return data;
  },

  /**
   * Adds a new token entry for the user (Used during signup).
   */
  async addUserTokens(userId: string, userType: string) {
    const initialTokens = userType === "free" ? 5000 : 10000; // Different limits per user type

    const { error } = await supabase.from("user_tokens").insert([
      {
        id: userId,
        user_type: userType,
        available_tokens: initialTokens,
      },
    ]);

    if (error) {
      console.error("Error adding tokens:", error.message);
      return false;
    }

    return true;
  },

  /**
   * Updates available tokens for the user.
   */
  async updateUserTokens(userId: string, tokensUsed: number) {
    const { data: userTokens, error: fetchError } = await supabase
      .from("user_tokens")
      .select("available_tokens")
      .eq("id", userId)
      .single();

    if (fetchError) {
      console.error("Error fetching user tokens:", fetchError.message);
      return false;
    }

    const newTokenCount = Math.max(0, userTokens.available_tokens - tokensUsed);

    const { error } = await supabase
      .from("user_tokens")
      .update({ available_tokens: newTokenCount })
      .eq("id", userId);

    if (error) {
      console.error("Error updating tokens:", error.message);
      return false;
    }

    return true;
  },

  /**
   * Resets user tokens by subtracting the given amount.
   */
  async resetUserTokens(userId: string, tokenCount: number) {
    const { data: userTokens, error: fetchError } = await supabase
      .from("user_tokens")
      .select("available_tokens")
      .eq("id", userId)
      .single();

    if (fetchError) {
      console.error("Error fetching user tokens:", fetchError.message);
      return false;
    }

    const newTokenCount = Math.max(0, userTokens.available_tokens - tokenCount);

    const { error } = await supabase
      .from("user_tokens")
      .update({ available_tokens: newTokenCount, last_updated: new Date() })
      .eq("id", userId);

    if (error) {
      console.error("Error resetting tokens:", error.message);
      return false;
    }

    return true;
  }
};
