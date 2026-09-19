import { supabase } from "../config/supabase.config";
import { NIGERIAN_BANKS } from "../data/nigerianBanks";

export { supabase };


/**
 * Normalizes Supabase records to match frontend property names (camelCase, _id mapping)
 */
export const formatRecord = (record) => {
  if (!record) return record;
  if (Array.isArray(record)) return record.map(formatRecord);
  if (typeof record !== "object") return record;

  const formatted = { ...record };
  if (formatted.id && !formatted._id) {
    formatted._id = formatted.id;
  }
  if (formatted.user_id && !formatted.userId) {
    formatted.userId = formatted.user_id;
  }
  if (formatted.task_id && !formatted.taskId) {
    formatted.taskId = formatted.task_id;
  }
  if (formatted.created_at && !formatted.createdAt) {
    formatted.createdAt = formatted.created_at;
  }
  if (formatted.updated_at && !formatted.updatedAt) {
    formatted.updatedAt = formatted.updated_at;
  }
  if (formatted.is_email_verified !== undefined && formatted.isEmailVerified === undefined) {
    formatted.isEmailVerified = formatted.is_email_verified;
  }
  if (formatted.is_member !== undefined) {
    formatted.isMember = Boolean(formatted.is_member === true);
  } else if (formatted.isMember !== undefined) {
    formatted.isMember = Boolean(formatted.isMember === true);
  } else {
    formatted.isMember = false;
  }
  if (formatted.is_banned !== undefined && formatted.isBanned === undefined) {
    formatted.isBanned = formatted.is_banned;
  }
  if (formatted.is_nin_verified !== undefined && formatted.isNINVerified === undefined) {
    formatted.isNINVerified = formatted.is_nin_verified;
  }
  if (formatted.referred_by !== undefined && formatted.referredBy === undefined) {
    formatted.referredBy = formatted.referred_by;
  }
  if (formatted.pending_balance !== undefined && formatted.pendingBalance === undefined) {
    formatted.pendingBalance = Number(formatted.pending_balance);
  }
  if (formatted.balance !== undefined) {
    formatted.balance = Number(formatted.balance);
  }
  if (formatted.avatar_url !== undefined) {
    formatted.avatarUrl = formatted.avatar_url;
    formatted.image = formatted.avatar_url;
  }
  if (formatted.avatarUrl && !formatted.image) {
    formatted.image = formatted.avatarUrl;
  }
  if (formatted.bank_name && !formatted.bankName) {
    formatted.bankName = formatted.bank_name;
  }
  if (formatted.account_number && !formatted.accountNumber) {
    formatted.accountNumber = formatted.account_number;
  }
  if (formatted.account_name && !formatted.accountName) {
    formatted.accountName = formatted.account_name;
  }
  return formatted;
};

// ==============================================================================
// 1. AUTH SERVICE
// ==============================================================================

export const authService = {
  async getSession() {
    try {
      const { data, error } = await supabase.auth.getSession();
      if (error) return null;
      return data?.session;
    } catch {
      return null;
    }
  },

  async getUser() {
    try {
      const { data, error } = await supabase.auth.getUser();
      if (error) return null;
      return data?.user;
    } catch {
      return null;
    }
  },

  async signUp({ email, password, firstname, lastname, username, phone, accountType, referredBy }) {
    const formattedUsername = username?.replaceAll(" ", "").toLowerCase().replaceAll("@", "");
    const emailRedirectTo = typeof window !== "undefined" ? `${window.location.origin}/verify-email` : undefined;
    const cleanEmail = (email || "").trim().toLowerCase();

    // Check if email already exists in users table
    if (cleanEmail) {
      try {
        const { data: existingEmail } = await supabase
          .from("users")
          .select("id, email")
          .eq("email", cleanEmail)
          .maybeSingle();

        if (existingEmail) {
          throw new Error("An account with this email address already exists. Please log in.");
        }
      } catch (err) {
        if (err.message?.includes("already exists")) throw err;
      }
    }

    // Check if username already exists in users table
    if (formattedUsername) {
      try {
        const { data: existingUsername } = await supabase
          .from("users")
          .select("id, username")
          .eq("username", formattedUsername)
          .maybeSingle();

        if (existingUsername) {
          throw new Error("This username is already taken. Please choose another username.");
        }
      } catch (err) {
        if (err.message?.includes("already taken")) throw err;
      }
    }

    const { data, error } = await supabase.auth.signUp({
      email: cleanEmail,
      password,
      options: {
        emailRedirectTo,
        data: {
          firstname: (firstname || "").trim() || "User",
          lastname: (lastname || "").trim() || "",
          username: formattedUsername || cleanEmail.split("@")[0],
          phone: phone ? String(phone).trim() : "",
          account_type: accountType === "advertiser" ? "advertiser" : "earner",
          referred_by: (referredBy || "").trim() || "admin",
          is_member: false,
        },
      },
    });

    if (error) {
      if (
        error.message?.toLowerCase().includes("user already registered") ||
        error.message?.toLowerCase().includes("already registered") ||
        error.message?.toLowerCase().includes("email address is already")
      ) {
        throw new Error("An account with this email address already exists. Please log in.");
      }
      throw error;
    }

    if (data?.user && Array.isArray(data.user.identities) && data.user.identities.length === 0) {
      throw new Error("An account with this email address already exists. Please log in.");
    }

    // Ensure a corresponding user row exists in the users table
    if (data?.user) {
      try {
        await userService.upsertUser({
          id: data.user.id,
          email: data.user.email,
          firstname: (firstname || "").trim() || "User",
          lastname: (lastname || "").trim() || "",
          username: formattedUsername || cleanEmail.split("@")[0],
          phone: phone ? String(phone).trim() : "",
          referred_by: (referredBy || "").trim() || "admin",
          is_email_verified: !!data.session,
          is_member: false,
          balance: 0,
          pending_balance: 0,
        });
      } catch (err) {
        console.warn("User row upsert notice:", err);
      }

      // Send Welcome Email from Joscor of ZAR
      try {
        emailService.sendWelcomeEmail({
          to: data.user.email,
          name: (firstname || "").trim() || formattedUsername || "Earner",
        }).catch(() => {});
      } catch {}
    }

    return data;
  },

  async signIn({ email, password }) {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) throw error;
    return data;
  },

  async signInWithGoogle() {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: window.location.origin + "/dashboard",
      },
    });
    if (error) throw error;
    return data;
  },

  async signOut() {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  },

  async verifyOtp({ email, token, tokenHash, type = "signup" }) {
    let params = { type };
    if (tokenHash) {
      params.token_hash = tokenHash;
    } else {
      params.email = (email || "").trim().toLowerCase();
      params.token = (token || "").trim();
    }

    let { data, error } = await supabase.auth.verifyOtp(params);

    // If type 'signup' fails, try 'email' as fallback if token & email provided
    if (error && !tokenHash && params.email && params.token && type === "signup") {
      const fallbackRes = await supabase.auth.verifyOtp({
        email: params.email,
        token: params.token,
        type: "email",
      });
      if (!fallbackRes.error && fallbackRes.data) {
        data = fallbackRes.data;
        error = null;
      }
    }

    if (error) {
      const msg = error.message || "";
      if (msg.toLowerCase().includes("rate limit") || msg.toLowerCase().includes("over_email_send_rate_limit")) {
        throw new Error("Rate limit exceeded. Please wait a few moments before trying again.");
      }
      if (msg.toLowerCase().includes("invalid") || msg.toLowerCase().includes("expired")) {
        throw new Error("The verification code is invalid or has expired. Please request a new code.");
      }
      throw error;
    }
    return data;
  },

  async resendVerification({ email, type = "signup" }) {
    const cleanEmail = (email || "").trim().toLowerCase();
    const emailRedirectTo = typeof window !== "undefined" ? `${window.location.origin}/verify-email` : undefined;
    const { data, error } = await supabase.auth.resend({
      type,
      email: cleanEmail,
      options: {
        emailRedirectTo,
      },
    });
    if (error) {
      const msg = error.message || "";
      if (msg.toLowerCase().includes("rate limit") || msg.toLowerCase().includes("over_email_send_rate_limit")) {
        throw new Error("Email sending rate limit reached. Please wait a few minutes before requesting another code.");
      }
      throw error;
    }
    return data;
  },

  async resetPassword(email) {
    const emailRedirectTo = typeof window !== "undefined" ? `${window.location.origin}/forgot-password` : undefined;
    const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: emailRedirectTo,
    });
    if (error) throw error;
    return data;
  },

  async updatePassword(password) {
    const { data, error } = await supabase.auth.updateUser({
      password,
    });
    if (error) throw error;
    return data;
  },
};

// ==============================================================================
// 2. USER SERVICE
// ==============================================================================

export const userService = {
  async getProfile(userId, email) {
    if (!userId && !email) return null;
    try {
      let data = null;

      if (userId) {
        const res = await supabase
          .from("users")
          .select("*")
          .eq("id", userId)
          .maybeSingle();
        data = res.data;
      }

      // If not found by id, try finding by email
      if (!data && email) {
        const res = await supabase
          .from("users")
          .select("*")
          .eq("email", email)
          .maybeSingle();
        data = res.data;
      }

      if (!data) return null;

      const profile = formatRecord(data);

      // Fetch user_details if available
      try {
        const { data: details } = await supabase
          .from("user_details")
          .select("*")
          .eq("user_id", data.id)
          .maybeSingle();

        profile.gender = details?.gender || data.gender || profile.gender || "";
        profile.state = details?.state || data.state || profile.state || "";
        profile.lga = details?.lga || data.lga || profile.lga || "";
        profile.device = details?.device || data.device || profile.device || "Android";
        profile.religion = details?.religion || data.religion || profile.religion || "";
        profile.location = profile.state
          ? profile.lga
            ? `${profile.lga}, ${profile.state}`
            : profile.state
          : data.location || profile.location || "";
        
        const resolvedBankName = details?.bank_name || data.bank_name || profile.bankName || profile.bank_name || "";
        const resolvedAcctNum = details?.account_number || data.account_number || profile.accountNumber || profile.account_number || "";
        const resolvedAcctName = details?.account_name || data.account_name || profile.accountName || profile.account_name || "";

        profile.bankName = resolvedBankName;
        profile.accountNumber = resolvedAcctNum;
        profile.accountName = resolvedAcctName;
        profile.bankDetails = {
          bankName: resolvedBankName,
          accountNumber: resolvedAcctNum,
          accountName: resolvedAcctName,
        };
      } catch {
        profile.gender = data.gender || profile.gender || "";
        profile.state = data.state || profile.state || "";
        profile.lga = data.lga || profile.lga || "";
        profile.location = profile.state || data.location || profile.location || "";
        profile.bankDetails = {
          bankName: data.bank_name || profile.bankName || profile.bank_name || "",
          accountNumber: data.account_number || profile.accountNumber || profile.account_number || "",
          accountName: data.account_name || profile.accountName || profile.account_name || "",
        };
      }

      return profile;
    } catch {
      return null;
    }
  },

  async updateBankDetails({ userId, bankName, accountNumber, accountName }) {
    if (!userId) throw new Error("User ID is required");

    try {
      const { data: existing } = await supabase
        .from("user_details")
        .select("id")
        .eq("user_id", userId)
        .maybeSingle();

      const payload = {
        bank_name: bankName,
        account_number: accountNumber,
        account_name: accountName,
        updated_at: new Date().toISOString(),
      };

      if (existing) {
        await supabase
          .from("user_details")
          .update(payload)
          .eq("user_id", userId);
      } else {
        await supabase
          .from("user_details")
          .insert({
            user_id: userId,
            ...payload,
          });
      }

      // Also call backend update API
      try {
        await axios.post("/api/v1/user/edit-profile", {
          bankDetails: {
            bankName,
            accountNumber,
            accountName,
          },
        });
      } catch (e) {
        // Handled gracefully
      }

      return true;
    } catch (error) {
      console.error("updateBankDetails error:", error);
      throw error;
    }
  },

  async getProfileByEmail(email) {
    if (!email) return null;
    try {
      const { data, error } = await supabase
        .from("users")
        .select("*")
        .eq("email", email)
        .maybeSingle();

      if (error || !data) return null;
      return formatRecord(data);
    } catch {
      return null;
    }
  },

  async upsertUser(userData) {
    // Check if user already exists by email
    const existing = await this.getProfileByEmail(userData.email);
    if (existing) {
      try {
        await supabase
          .from("users")
          .update({
            firstname: existing.firstname || userData.firstname,
            lastname: existing.lastname || userData.lastname,
            phone: existing.phone || userData.phone,
            avatar_url: existing.avatar_url || userData.avatar_url || userData.avatarUrl,
          })
          .eq("email", userData.email);

        return await this.getProfile(existing.id, userData.email);
      } catch (err) {
        return existing;
      }
    }

    // Ensure username does not collide with existing usernames
    let chosenUsername = userData.username || userData.email?.split("@")[0] || "user";
    try {
      const { data: userWithUsername } = await supabase
        .from("users")
        .select("id")
        .eq("username", chosenUsername)
        .maybeSingle();

      if (userWithUsername && userWithUsername.id !== userData.id) {
        chosenUsername = `${chosenUsername}_${Math.floor(1000 + Math.random() * 9000)}`;
      }
    } catch {
      // Ignored
    }

    // Only send valid columns in users table
    const safePayload = {
      id: userData.id,
      email: userData.email,
      firstname: userData.firstname || "User",
      lastname: userData.lastname || "",
      username: chosenUsername,
      phone: userData.phone || "",
      is_email_verified: userData.is_email_verified ?? true,
      is_member: false,
      balance: userData.balance ?? 0,
      pending_balance: userData.pending_balance ?? 0,
      referred_by: userData.referred_by || "admin",
    };

    if (userData.avatar_url || userData.avatarUrl) {
      safePayload.avatar_url = userData.avatar_url || userData.avatarUrl;
    }

    const { data, error } = await supabase
      .from("users")
      .upsert(safePayload, { onConflict: "id" })
      .select()
      .maybeSingle();

    if (error) {
      return safePayload;
    }
    return formatRecord(data);
  },

  async updateProfile(userId, updates) {
    if (!userId) {
      const { data: authData } = await supabase.auth.getUser();
      userId = authData?.user?.id;
    }

    const userPayload = {};
    if (updates.firstname !== undefined) userPayload.firstname = updates.firstname;
    if (updates.lastname !== undefined) userPayload.lastname = updates.lastname;
    if (updates.username !== undefined) userPayload.username = updates.username;
    if (updates.phone !== undefined) userPayload.phone = updates.phone;
    if (updates.avatarUrl !== undefined) userPayload.avatar_url = updates.avatarUrl;
    if (updates.image !== undefined) userPayload.avatar_url = updates.image;
    if (updates.isMember !== undefined) userPayload.is_member = updates.isMember;
    if (updates.gender !== undefined) userPayload.gender = updates.gender;
    if (updates.state !== undefined) userPayload.state = updates.state;
    if (updates.lga !== undefined) userPayload.lga = updates.lga;
    if (updates.device !== undefined || updates.deviceType !== undefined || updates.device_type !== undefined) {
      userPayload.device = updates.device || updates.deviceType || updates.device_type;
    }
    if (updates.religion !== undefined) userPayload.religion = updates.religion;
    if (updates.bankName !== undefined) userPayload.bank_name = updates.bankName;
    if (updates.accountNumber !== undefined) userPayload.account_number = updates.accountNumber;
    if (updates.accountName !== undefined) userPayload.account_name = updates.accountName;

    if (userId && Object.keys(userPayload).length > 0) {
      const { error: updateErr } = await supabase
        .from("users")
        .update(userPayload)
        .eq("id", userId);

      if (updateErr) {
        console.warn("User table update retry by email:", updateErr.message);
        const { data: authData } = await supabase.auth.getUser();
        if (authData?.user?.email) {
          await supabase
            .from("users")
            .update(userPayload)
            .eq("email", authData.user.email);
        }
      }
    }

    // Update user_details table with only its existing columns
    const detailsPayload = {};
    if (updates.gender !== undefined) detailsPayload.gender = updates.gender;
    if (updates.state !== undefined) detailsPayload.state = updates.state;
    if (updates.lga !== undefined) detailsPayload.lga = updates.lga;
    if (updates.bankName !== undefined) detailsPayload.bank_name = updates.bankName;
    if (updates.accountNumber !== undefined) detailsPayload.account_number = updates.accountNumber;
    if (updates.accountName !== undefined) detailsPayload.account_name = updates.accountName;

    if (userId && Object.keys(detailsPayload).length > 0) {
      try {
        const { data: existingDetails } = await supabase
          .from("user_details")
          .select("id")
          .eq("user_id", userId)
          .maybeSingle();

        if (existingDetails) {
          await supabase
            .from("user_details")
            .update({ ...detailsPayload, updated_at: new Date().toISOString() })
            .eq("user_id", userId);
        } else {
          await supabase
            .from("user_details")
            .insert({ user_id: userId, ...detailsPayload });
        }
      } catch (err) {
        console.warn("user_details update notice:", err);
      }
    }

    // Also update Supabase Auth user metadata
    try {
      await supabase.auth.updateUser({
        data: {
          gender: updates.gender,
          state: updates.state,
          lga: updates.lga,
          device: updates.device || updates.deviceType,
          completed_onboarding: true,
        },
      });
    } catch {
      // Handled gracefully
    }

    return await this.getProfile(userId);
  },
  async becomeMember(userId, fee = 1000) {
    if (!userId) throw new Error("User ID is required");

    const profile = await this.getProfile(userId);
    if (!profile) throw new Error("User not found");
    if (profile.isMember) return { success: true, message: "You are already a Pro member." };

    const currentBalance = Number(profile.balance || 0);
    if (currentBalance < fee) {
      throw new Error(`Insufficient wallet balance (₦${currentBalance.toLocaleString()}). Please fund your wallet with at least ₦${fee.toLocaleString()} first.`);
    }

    const newBalance = currentBalance - fee;

    // Deduct fee & activate membership
    const { error: updateErr } = await supabase
      .from("users")
      .update({
        is_member: true,
        balance: newBalance,
      })
      .eq("id", userId);

    if (updateErr) throw updateErr;

    // Record membership fee transaction
    try {
      await supabase.from("funding").insert({
        user_id: userId,
        amount: -fee,
        reference: `mem_${Date.now()}`,
        payment_method: "Wallet Balance (Membership)",
        status: "success",
      });
    } catch {}

    // Trigger referral commission (60%) if user has a valid referrer
    if (profile.referredBy && profile.referredBy !== "admin") {
      try {
        const bonusAmount = Math.round(fee * 0.6);
        const { data: referrer } = await supabase
          .from("users")
          .select("id, balance, email")
          .eq("username", profile.referredBy.toLowerCase())
          .maybeSingle();

        if (referrer) {
          const refNewBal = Number(referrer.balance || 0) + bonusAmount;
          await supabase
            .from("users")
            .update({ balance: refNewBal })
            .eq("id", referrer.id);

          await supabase.from("notifications").insert({
            user_id: referrer.id,
            title: "Referral Commission Received! 🎁",
            message: `You received ₦${bonusAmount.toLocaleString()} instant bonus for referring @${profile.username}!`,
            type: "referral",
          });
        }
      } catch (err) {
        console.warn("Referral payout notice:", err);
      }
    }

    return { success: true, message: "VIP Pro Membership activated successfully!" };
  },
};

// ==============================================================================
// 3. TASK & MARKETPLACE SERVICE
// ==============================================================================

export const taskService = {
  async getTasks({ category, platform, search, limit = 50, workerUserId } = {}) {
    const results = [];

    // Query advert_tasks
    try {
      let advertQuery = supabase
        .from("advert_tasks")
        .select("*")
        .eq("status", "active")
        .limit(limit);

      if (platform && platform !== "all") {
        advertQuery = advertQuery.eq("platform", platform);
      }
      if (search) {
        advertQuery = advertQuery.ilike("title", `%${search}%`);
      }

      const { data: adverts } = await advertQuery;
      if (adverts) {
        results.push(...adverts.map((item) => ({
          ...formatRecord(item),
          category: "advert",
          cost_per_task: item.earner_fee || item.amount_paid || 50,
          total_participants: item.number_of_tasks || 10,
          completed_count: item.tasks_done || 0,
        })));
      }
    } catch {
      // Ignored
    }

    // Query engagement_tasks
    try {
      let engageQuery = supabase
        .from("engagement_tasks")
        .select("*")
        .eq("status", "active")
        .limit(limit);

      if (platform && platform !== "all") {
        engageQuery = engageQuery.eq("platform", platform);
      }
      if (search) {
        engageQuery = engageQuery.ilike("title", `%${search}%`);
      }

      const { data: engagements } = await engageQuery;
      if (engagements) {
        results.push(...engagements.map((item) => ({
          ...formatRecord(item),
          category: "engagement",
          cost_per_task: item.earner_fee || item.amount_paid || 30,
          total_participants: item.number_of_tasks || 10,
          completed_count: item.tasks_done || 0,
        })));
      }
    } catch {
      // Ignored
    }

    // Query marketplace_tasks (Surveys, App Testing, UGC, Custom Tasks)
    try {
      let mktQuery = supabase
        .from("marketplace_tasks")
        .select("*")
        .eq("status", "active")
        .order("created_at", { ascending: false })
        .limit(limit);

      if (category && category !== "all" && category !== "advert" && category !== "engagement") {
        mktQuery = mktQuery.eq("category", category);
      }
      if (search) {
        mktQuery = mktQuery.ilike("title", `%${search}%`);
      }

      const { data: marketplaceItems } = await mktQuery;
      if (marketplaceItems) {
        results.push(
          ...marketplaceItems.map((item) => ({
            ...formatRecord(item),
            cost_per_task: item.reward_per_worker || 100,
            reward: item.reward_per_worker || 100,
            total_participants: item.total_slots || 10,
            completed_count: item.slots_completed || 0,
            slots_remaining: item.slots_remaining || 0,
            target_url: item.target_url || item.guidelines?.target_url || null,
            steps: Array.isArray(item.guidelines) ? item.guidelines : item.guidelines?.steps || [],
          }))
        );
      }
    } catch {
      // Ignored
    }

    // Check worker's past submissions & active reservations to prevent duplicate entries
    if (workerUserId && results.length > 0) {
      try {
        const taskIds = results.map((t) => t.id);

        const { data: userSubmissions } = await supabase
          .from("task_submissions")
          .select("id, task_id, status, created_at, proof_text, proof_urls, survey_answers")
          .eq("worker_id", workerUserId)
          .in("task_id", taskIds);

        const { data: userReservations } = await supabase
          .from("task_reservations")
          .select("id, task_id, status, expires_at")
          .eq("worker_id", workerUserId)
          .eq("status", "active")
          .in("task_id", taskIds);

        const subMap = new Map((userSubmissions || []).map((s) => [s.task_id, s]));
        const resMap = new Map((userReservations || []).map((r) => [r.task_id, r]));

        return results.map((task) => {
          const userSub = subMap.get(task.id);
          const userRes = resMap.get(task.id);
          const isExpired = userRes && new Date(userRes.expires_at) < new Date();

          return {
            ...task,
            hasSubmitted: !!userSub,
            submissionStatus: userSub?.status || null,
            mySubmission: userSub ? formatRecord(userSub) : null,
            isReserved: !!userRes && !isExpired,
            activeReservationId: userRes && !isExpired ? userRes.id : null,
            reservationExpiresAt: userRes && !isExpired ? userRes.expires_at : null,
          };
        });
      } catch (err) {
        console.warn("Worker submission status lookup notice:", err);
      }
    }

    return results;
  },

  async getTaskById(taskId, workerUserId = null) {
    try {
      let task = null;

      // 1. Query marketplace_tasks first
      const { data: mktTask } = await supabase
        .from("marketplace_tasks")
        .select("*")
        .eq("id", taskId)
        .maybeSingle();

      if (mktTask) {
        task = {
          ...formatRecord(mktTask),
          reward_per_worker: Number(mktTask.reward_per_worker) || 100,
          total_slots: mktTask.total_slots || 10,
          slots_remaining: mktTask.slots_remaining || 10,
          target_url: mktTask.target_url || mktTask.guidelines?.target_url || null,
          steps: Array.isArray(mktTask.guidelines) ? mktTask.guidelines : mktTask.guidelines?.steps || [],
        };
      }

      // 2. Query advert_tasks
      if (!task) {
        const { data: advert } = await supabase
          .from("advert_tasks")
          .select("*")
          .eq("id", taskId)
          .maybeSingle();

        if (advert) {
          task = {
            ...formatRecord(advert),
            title: advert.title || `Post ${advert.platform?.toUpperCase() || "WhatsApp"} Advert`,
            category: advert.category || "advert",
            platform: advert.platform || "whatsapp",
            description: advert.caption || advert.description || "Download media and post on your social media status or feed.",
            instructions: advert.instructions || advert.caption || "Download the campaign media, copy the caption below, post it on your social media status, and submit a screenshot proof of work.",
            reward_per_worker: Number(advert.earner_fee) || Number(advert.amount_paid) || 100,
            total_slots: advert.number_of_tasks || 50,
            slots_remaining: Math.max(0, (advert.number_of_tasks || 50) - (advert.tasks_done || 0)),
            target_url: advert.link || null,
            media_url: advert.mediaUrl || advert.media_url || null,
            caption: advert.caption || null,
            guidelines: [
              { step: 1, title: "Download Campaign Media", instruction: "Save the image or video asset to your device." },
              { step: 2, title: "Post with Caption", instruction: advert.caption || "Post the image with the caption to your audience." },
              { step: 3, title: "Take Screenshot & Submit", instruction: "Take a clear screenshot showing views/post and upload it here." },
            ],
            proof_types: ["screenshot"],
          };
        }
      }

      // 3. Query engagement_tasks
      if (!task) {
        const { data: engagement } = await supabase
          .from("engagement_tasks")
          .select("*")
          .eq("id", taskId)
          .maybeSingle();

        if (engagement) {
          task = {
            ...formatRecord(engagement),
            title: engagement.title || `${engagement.platform?.toUpperCase() || "Social"} Engagement Task`,
            category: engagement.category || "engagement",
            platform: engagement.platform || "instagram",
            description: engagement.caption || engagement.description || "Follow, like, or engage with the target link.",
            instructions: engagement.instructions || "Click the target link, perform the required engagement (like/follow/comment), take a screenshot as proof, and upload below.",
            reward_per_worker: Number(engagement.earner_fee) || Number(engagement.amount_paid) || 30,
            total_slots: engagement.number_of_tasks || 50,
            slots_remaining: Math.max(0, (engagement.number_of_tasks || 50) - (engagement.tasks_done || 0)),
            target_url: engagement.link || engagement.target_url || null,
            caption: engagement.caption || null,
            guidelines: [
              { step: 1, title: "Open Link", instruction: "Visit the target social profile or post." },
              { step: 2, title: "Complete Action", instruction: "Follow the account or like the post." },
              { step: 3, title: "Submit Proof", instruction: "Upload screenshot proof of your completed action." },
            ],
            proof_types: ["screenshot"],
          };
        }
      }

      // 4. Query generic tasks
      if (!task) {
        const { data: generic } = await supabase
          .from("tasks")
          .select("*")
          .eq("id", taskId)
          .maybeSingle();

        if (generic) {
          task = {
            ...formatRecord(generic),
            title: generic.title || "Campaign Task",
            category: generic.category || "social",
            description: generic.caption || generic.description || "Complete social campaign task.",
            instructions: generic.instructions || "Follow the instructions and submit proof.",
            reward_per_worker: Number(generic.earningPerTask) || Number(generic.reward) || 50,
            target_url: generic.link || generic.action_link || null,
            guidelines: [],
            proof_types: ["screenshot"],
          };
        }
      }

      if (!task) return null;

      // Check worker submission & reservation state for this specific task
      if (workerUserId) {
        try {
          const { data: userSub } = await supabase
            .from("task_submissions")
            .select("*")
            .eq("task_id", taskId)
            .eq("worker_id", workerUserId)
            .maybeSingle();

          const { data: userRes } = await supabase
            .from("task_reservations")
            .select("*")
            .eq("task_id", taskId)
            .eq("worker_id", workerUserId)
            .eq("status", "active")
            .order("created_at", { ascending: false })
            .limit(1)
            .maybeSingle();

          const isExpired = userRes && new Date(userRes.expires_at) < new Date();

          return {
            ...task,
            hasSubmitted: !!userSub,
            submissionStatus: userSub?.status || null,
            mySubmission: userSub ? formatRecord(userSub) : null,
            activeReservation: userRes && !isExpired ? formatRecord(userRes) : null,
          };
        } catch (err) {
          console.warn("Worker single task check notice:", err);
        }
      }

      return task;
    } catch (err) {
      console.warn("getTaskById lookup error:", err);
      return null;
    }
  },

  async submitTaskProof({ taskId, workerUserId, reservationId, proofText, proofUrls = [], surveyAnswers = {} }) {
    if (!workerUserId) {
      throw new Error("You must be logged in to submit proof.");
    }

    // 1. Check if worker already submitted this task
    const { data: existingSub } = await supabase
      .from("task_submissions")
      .select("id, status, created_at")
      .eq("task_id", taskId)
      .eq("worker_id", workerUserId)
      .maybeSingle();

    if (existingSub) {
      throw new Error("You have already submitted this task. Duplicate submissions are not permitted.");
    }

    // 2. Fetch task details
    const task = await this.getTaskById(taskId);
    if (!task) {
      throw new Error("Task not found.");
    }

    const rewardAmount = Number(task.reward_per_worker || task.reward || 100);
    const autoApproveHours = task.review_window_hours || 48;
    const autoApproveAt = new Date(Date.now() + autoApproveHours * 3600 * 1000).toISOString();

    const insertPayload = {
      task_id: taskId,
      worker_id: workerUserId,
      reservation_id: reservationId || null,
      proof_text: proofText || "",
      proof_urls: proofUrls || [],
      survey_answers: surveyAnswers || {},
      status: "pending",
      reward_amount: rewardAmount,
      auto_approve_at: autoApproveAt,
    };

    const { data: submission, error } = await supabase
      .from("task_submissions")
      .insert(insertPayload)
      .select()
      .single();

    if (error) {
      throw error;
    }

    // 3. Mark reservation submitted
    if (reservationId) {
      try {
        await supabase
          .from("task_reservations")
          .update({ status: "submitted" })
          .eq("id", reservationId);
      } catch {}
    }

    // 4. Update task counter
    try {
      await supabase
        .from("marketplace_tasks")
        .update({
          slots_reserved: Math.max(0, (task.slots_reserved || 1) - 1),
          slots_completed: (task.slots_completed || 0) + 1,
        })
        .eq("id", taskId);
    } catch {}

    // 5. Notify Campaign Creator via Email & in-app notification
    const creatorUserId = task.creator_id || task.user_id;
    if (creatorUserId && creatorUserId !== workerUserId) {
      (async () => {
        try {
          const { data: creatorUser } = await supabase
            .from("users")
            .select("id, email, firstname, username")
            .eq("id", creatorUserId)
            .maybeSingle();

          const { data: workerUser } = await supabase
            .from("users")
            .select("username")
            .eq("id", workerUserId)
            .maybeSingle();

          if (creatorUser?.email) {
            emailService.sendNewSubmissionEmail({
              to: creatorUser.email,
              name: creatorUser.firstname || creatorUser.username || "Creator",
              taskTitle: task.title || "Campaign Task",
              workerUsername: workerUser?.username || "earner",
              manageUrl: `https://www.docszar.com/creator/campaigns/${taskId}`,
            }).catch(() => {});
          }

          // Check if campaign reached target
          const newCompleted = (task.slots_completed || 0) + 1;
          const totalSlots = task.slots_total || task.number_of_tasks || 1;
          if (newCompleted >= totalSlots && creatorUser?.email) {
            emailService.sendCampaignCompletedEmail({
              to: creatorUser.email,
              name: creatorUser.firstname || creatorUser.username || "Creator",
              taskTitle: task.title || "Campaign Task",
              totalParticipants: totalSlots,
            }).catch(() => {});
          }
        } catch {}
      })();
    }

    return formatRecord(submission);
  },

  async createTask(taskData) {
    const isAdvert = taskData.category === "advert" || taskData.type === "advert";
    const tableName = isAdvert ? "advert_tasks" : "engagement_tasks";

    const payload = {
      user_id: taskData.userId || taskData.creatorId,
      title: taskData.title,
      platform: taskData.platform || "instagram",
      number_of_tasks: Number(taskData.totalParticipants || taskData.quantity || 10),
      tasks_done: 0,
      amount_paid: Number(taskData.totalBudget || 500),
      earner_fee: Number(taskData.costPerTask || 50),
      status: "pending",
      ...(isAdvert
        ? { caption: taskData.caption || taskData.description, media_url: taskData.mediaUrl }
        : { action_link: taskData.taskLink || taskData.link || "https://instagram.com" }),
    };

    const { data, error } = await supabase
      .from(tableName)
      .insert(payload)
      .select()
      .maybeSingle();

    if (error) {
      console.warn(`Error inserting into ${tableName}:`, error.message);
      return payload;
    }

    // Broadcast Earner Alerts (Instant email for >= ₦100, Daily Digest for < ₦100)
    emailService.broadcastNewTaskAlert({
      taskTitle: taskData.title || (isAdvert ? "Social Status Advert" : "Social Engagement Task"),
      reward: taskData.costPerTask || 50,
      platform: taskData.platform || "social",
      availableSlots: taskData.totalParticipants || taskData.quantity || 10,
      taskUrl: isAdvert ? "https://www.docszar.com/earn/whatsapp-status" : "https://www.docszar.com/earn/instagram-followers",
    }).catch(() => {});

    return formatRecord(data);
  },

  async submitSubtask(subtaskData) {
    const payload = {
      task_id: subtaskData.taskId,
      user_id: subtaskData.userId,
      proof_id: subtaskData.proofUrl || "",
      task_type: subtaskData.category || "task",
      status: "in-review",
    };

    try {
      const { data } = await supabase
        .from("in_review_tasks")
        .insert(payload)
        .select()
        .maybeSingle();

      return formatRecord(data) || payload;
    } catch (err) {
      return payload;
    }
  },

  async cancelTask({ taskId, userId, taskType = "task", reason = "User cancelled task in progress" }) {
    if (!userId || !taskId) return { success: false, message: "Missing task or user ID" };

    try {
      // 1. Sync record directly into cancelled_tasks table
      await supabase.from("cancelled_tasks").insert({
        user_id: userId,
        task_id: taskId,
        task_type: taskType,
        reason: reason,
      }).catch((err) => console.warn("cancelled_tasks insert notice:", err));

      // 2. Mark active reservation as cancelled in task_reservations
      await supabase
        .from("task_reservations")
        .update({ status: "cancelled" })
        .eq("task_id", taskId)
        .eq("worker_id", userId)
        .eq("status", "active")
        .catch(() => {});

      // 3. Remove from pending_tasks and allocated_tasks if present
      await supabase
        .from("pending_tasks")
        .delete()
        .eq("task_id", taskId)
        .eq("user_id", userId)
        .catch(() => {});

      await supabase
        .from("allocated_tasks")
        .delete()
        .eq("task_id", taskId)
        .eq("user_id", userId)
        .catch(() => {});

      // 4. Restore slot counts on marketplace_tasks
      const { data: mktTask } = await supabase
        .from("marketplace_tasks")
        .select("slots_remaining, slots_reserved")
        .eq("id", taskId)
        .maybeSingle();

      if (mktTask) {
        await supabase
          .from("marketplace_tasks")
          .update({
            slots_remaining: (mktTask.slots_remaining || 0) + 1,
            slots_reserved: Math.max(0, (mktTask.slots_reserved || 1) - 1),
          })
          .eq("id", taskId)
          .catch(() => {});
      }

      // 5. In-app notification
      await supabase.from("notifications").insert({
        user_id: userId,
        title: "Task In Progress Cancelled",
        message: "You cancelled the task. Your reservation was released back to the task pool with no penalty.",
        is_read: false,
      }).catch(() => {});

      return { success: true, message: "Task cancelled and synced to database successfully." };
    } catch (err) {
      console.warn("cancelTask error:", err);
      return { success: false, message: err.message || "Failed to cancel task." };
    }
  },

  async getCancelledTasks(userId) {
    if (!userId) return [];
    try {
      const { data, error } = await supabase
        .from("cancelled_tasks")
        .select("*")
        .eq("user_id", userId)
        .order("created_at", { ascending: false });

      if (error || !data) return [];
      return formatRecord(data);
    } catch {
      return [];
    }
  },

  async getUserSubtasks(userId) {
    try {
      const { data } = await supabase
        .from("in_review_tasks")
        .select("*")
        .eq("user_id", userId)
        .order("created_at", { ascending: false });

      return formatRecord(data || []);
    } catch {
      return [];
    }
  },
};

// ==============================================================================
// 4. WALLET & TRANSACTIONS SERVICE
// ==============================================================================

export const walletService = {
  async getTransactions(userId) {
    if (!userId) return [];
    try {
      const [fundingsRes, transfersRes, withdrawalsRes, earningsRes, completedTasksRes] = await Promise.allSettled([
        supabase
          .from("funding")
          .select("*")
          .eq("user_id", userId)
          .order("created_at", { ascending: false }),
        supabase
          .from("transfers")
          .select("*")
          .or(`sender_id.eq.${userId},receiver_id.eq.${userId}`)
          .order("created_at", { ascending: false }),
        supabase
          .from("withdrawal_requests")
          .select("*")
          .eq("user_id", userId)
          .order("created_at", { ascending: false }),
        supabase
          .from("task_submissions")
          .select(`
            *,
            task:task_id (
              id,
              title,
              category,
              reward_per_worker
            )
          `)
          .eq("worker_id", userId)
          .in("status", ["approved", "auto_approved"])
          .order("reviewed_at", { ascending: false }),
        supabase
          .from("completed_tasks")
          .select("*")
          .eq("user_id", userId)
          .order("created_at", { ascending: false }),
      ]);

      const fundings =
        fundingsRes.status === "fulfilled" && fundingsRes.value.data
          ? fundingsRes.value.data.map((f) => ({
              id: f.id,
              type: "deposit",
              amount: f.amount,
              amountPaid: f.amount,
              reference: f.reference,
              paymentGateway: f.payment_method || "PocketFi",
              status: f.status || "success",
              createdAt: f.created_at,
            }))
          : [];

      const transfers =
        transfersRes.status === "fulfilled" && transfersRes.value.data
          ? transfersRes.value.data.map((t) => ({
              id: t.id,
              type: "transfer",
              amount: t.amount,
              amountSent: t.amount,
              senderId: t.sender_id,
              receiverId: t.receiver_id,
              senderUsername: t.sender_id === userId ? "You" : "Peer User",
              receiverUsername: t.receiver_id === userId ? "You" : "Peer User",
              narration: t.narration || "Wallet transfer",
              status: t.status || "completed",
              createdAt: t.created_at,
            }))
          : [];

      const withdrawals =
        withdrawalsRes.status === "fulfilled" && withdrawalsRes.value.data
          ? withdrawalsRes.value.data.map((w) => ({
              id: w.id,
              type: "withdrawal",
              amount: w.amount,
              charges: w.charges || 0,
              status: w.status || "pending",
              bankDetails: {
                bankName: w.bank_name,
                accountNumber: w.account_number,
                accountName: w.account_name,
              },
              createdAt: w.created_at,
            }))
          : [];

      const earningsFromSubs =
        earningsRes.status === "fulfilled" && earningsRes.value.data
          ? earningsRes.value.data.map((sub) => ({
              id: `sub_${sub.id}`,
              type: "earning",
              amount: Number(sub.reward_amount || sub.task?.reward_per_worker || 100),
              amountEarned: Number(sub.reward_amount || sub.task?.reward_per_worker || 100),
              title: sub.task?.title || "Task Completion Reward",
              description: `Earnings for completed task: ${sub.task?.title || "Microtask"}`,
              reference: `EARN-${(sub.id || "").slice(0, 8).toUpperCase()}`,
              paymentGateway: "Task Marketplace",
              status: "success",
              createdAt: sub.reviewed_at || sub.updated_at || sub.created_at,
            }))
          : [];

      const earningsFromCompletedTasks =
        completedTasksRes.status === "fulfilled" && completedTasksRes.value.data
          ? completedTasksRes.value.data.map((ct) => ({
              id: `ct_${ct.id}`,
              type: "earning",
              amount: Number(ct.reward || 100),
              amountEarned: Number(ct.reward || 100),
              title: ct.title || `Social ${ct.task_type || "Advert"} Reward`,
              description: `Earnings for completed ${ct.task_type || "advert"} task`,
              reference: `TASK-${(ct.id || "").slice(0, 8).toUpperCase()}`,
              paymentGateway: "Earn Engine",
              status: "success",
              createdAt: ct.created_at,
            }))
          : [];

      // Combine all and sort by date descending
      const combined = [
        ...earningsFromSubs,
        ...earningsFromCompletedTasks,
        ...fundings,
        ...transfers,
        ...withdrawals,
      ].sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));

      return combined;
    } catch (err) {
      console.error("getTransactions error:", err);
      return [];
    }
  },

  async transferFunds({ senderId, receiverUsername, amount, charges = 0 }) {
    try {
      const { data, error } = await supabase.rpc("transfer_wallet_funds", {
        p_sender_id: senderId,
        p_receiver_username: receiverUsername,
        p_amount: Number(amount),
        p_charges: Number(charges || 0),
      });

      if (error) {
        throw error;
      }

      if (data && data.success === false) {
        throw new Error(data.message || "Transfer failed.");
      }

      return data;
    } catch (err) {
      console.error("transferFunds error:", err);
      throw err;
    }
  },

  async requestWithdrawal({ userId, amount, bankName, accountNumber, accountName }) {
    try {
      const res = await supabase.functions.invoke("process-withdrawal", {
        body: {
          userId,
          amount: Number(amount),
          bankName,
          accountNumber,
          accountName,
        },
      });

      if (res.data && res.data.success) {
        return res.data;
      }
      if (res.data && res.data.message) {
        throw new Error(res.data.message);
      }
      if (res.error) {
        throw new Error(res.error.message || "Failed to process withdrawal");
      }
    } catch (err) {
      if (err.message && !err.message.includes("FunctionsFetchError")) {
        throw err;
      }
    }

    // Direct database fallback if edge function is temporarily unreachable
    const payload = {
      user_id: userId,
      type: "withdrawal",
      amount: Number(amount),
      status: "pending",
      description: `Withdrawal to ${bankName} (${accountNumber})`,
      metadata: {
        bank_name: bankName,
        account_number: accountNumber,
        account_name: accountName,
      },
    };

    try {
      await supabase.from("withdrawal_requests").insert({
        user_id: userId,
        amount: Number(amount),
        charges: 50,
        bank_name: bankName,
        account_number: accountNumber,
        account_name: accountName,
        status: "pending",
      });

      const { data } = await supabase
        .from("transactions")
        .insert(payload)
        .select()
        .maybeSingle();

      return formatRecord(data) || payload;
    } catch (dbErr) {
      throw dbErr;
    }
  },

  async submitManualFunding({ userId, amount, senderName, proofUrl, reference }) {
    const payload = {
      user_id: userId,
      type: "deposit",
      amount: Number(amount),
      status: "pending",
      description: `Manual Bank Transfer - Ref: ${reference || senderName}`,
      metadata: {
        sender_name: senderName,
        proof_url: proofUrl,
        method: "manual_transfer",
      },
    };

    try {
      const { data } = await supabase
        .from("transactions")
        .insert(payload)
        .select()
        .maybeSingle();

      return formatRecord(data) || payload;
    } catch {
      return payload;
    }
  },

  async getVirtualAccount(userId) {
    if (!userId) return null;
    try {
      // 1. Direct query from Supabase dedicated virtual_accounts table
      const { data: dbAccount } = await supabase
        .from("virtual_accounts")
        .select("*")
        .eq("user_id", userId)
        .order("created_at", { ascending: false })
        .limit(1)
        .maybeSingle();

      if (dbAccount?.account_number) {
        return {
          bankName: dbAccount.bank_name || "PAGA",
          accountNumber: dbAccount.account_number,
          accountName: dbAccount.account_name,
        };
      }

      // 2. Direct query from Supabase user_details table
      const { data: ud } = await supabase
        .from("user_details")
        .select("virtual_account_bank, virtual_account_number, virtual_account_name")
        .eq("user_id", userId)
        .maybeSingle();

      if (ud?.virtual_account_number) {
        return {
          bankName: ud.virtual_account_bank || "PAGA",
          accountNumber: ud.virtual_account_number,
          accountName: ud.virtual_account_name,
        };
      }

      // 3. Query backend / Edge Function
      const edgeRes = await fetch(
        `https://itzqsxmjyjfgtbolfhmq.supabase.co/functions/v1/pocketfi-virtual-account?userId=${userId}`,
        {
          headers: { "x-user-id": userId },
        }
      ).catch(() => null);

      if (edgeRes && edgeRes.ok) {
        const json = await edgeRes.json();
        if (json?.walletDetails?.accountNumber) {
          return json.walletDetails;
        }
      }

      // 4. Direct query from Supabase tokens table
      const { data } = await supabase
        .from("tokens")
        .select("token")
        .eq("user_id", userId)
        .ilike("token", "pocketfi_va:%")
        .order("created_at", { ascending: false })
        .limit(1)
        .maybeSingle();

      if (data?.token && data.token.startsWith("pocketfi_va:")) {
        const parsed = JSON.parse(data.token.replace("pocketfi_va:", ""));
        if (parsed?.accountNumber) {
          return parsed;
        }
      }

      return null;
    } catch {
      return null;
    }
  },

  async generateVirtualAccount(payload) {
    const edgeRes = await fetch(
      "https://itzqsxmjyjfgtbolfhmq.supabase.co/functions/v1/pocketfi-virtual-account",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-user-id": payload.userId,
        },
        body: JSON.stringify(payload),
      }
    );

    const json = await edgeRes.json();
    if (!edgeRes.ok || json.status === "error") {
      throw new Error(json.message || "Failed to generate virtual account");
    }

    if (json.walletDetails && payload.userId) {
      await this.saveVirtualAccount(payload.userId, json.walletDetails).catch(() => {});
    }

    return json.walletDetails;
  },

  async saveVirtualAccount(userId, accountData) {
    if (!userId || !accountData?.accountNumber) return;
    try {
      // 1. Save to virtual_accounts table
      await supabase.from("virtual_accounts").upsert({
        user_id: userId,
        bank_name: (accountData.bankName || "PAGA").toUpperCase(),
        account_number: String(accountData.accountNumber).trim(),
        account_name: accountData.accountName || "DocsZAR Earner",
        provider: "pocketfi",
        currency: "NGN",
        updated_at: new Date().toISOString(),
      }, { onConflict: "account_number" });

      // 2. Save to user_details table
      await supabase.from("user_details").update({
        virtual_account_bank: (accountData.bankName || "PAGA").toUpperCase(),
        virtual_account_number: String(accountData.accountNumber).trim(),
        virtual_account_name: accountData.accountName || "DocsZAR Earner",
        updated_at: new Date().toISOString(),
      }).eq("user_id", userId);

      // 3. Save to tokens cache
      await supabase
        .from("tokens")
        .delete()
        .eq("user_id", userId)
        .ilike("token", "pocketfi_va:%");

      await supabase.from("tokens").insert({
        user_id: userId,
        token: `pocketfi_va:${JSON.stringify(accountData)}`,
      });
    } catch (err) {
      console.warn("saveVirtualAccount notice:", err);
    }
  },

  async getFundings(userId, page = 1, limit = 10) {
    if (!userId) return { data: [], totalPages: 1 };
    try {
      const from = (page - 1) * limit;
      const to = from + limit - 1;

      const { data, count, error } = await supabase
        .from("funding")
        .select("*", { count: "exact" })
        .eq("user_id", userId)
        .order("created_at", { ascending: false })
        .range(from, to);

      if (error) throw error;

      const formatted = (data || []).map((f) => ({
        id: f.id,
        _id: f.id,
        amount: f.amount,
        amountPaid: f.amount,
        reference: f.reference,
        paymentGateway: f.payment_method || "PocketFi",
        status: f.status,
        createdAt: f.created_at,
      }));

      return {
        data: formatted,
        totalPages: Math.ceil((count || 0) / limit) || 1,
      };
    } catch {
      return { data: [], totalPages: 1 };
    }
  },
};

// ==============================================================================
// 5. ADMIN SETTINGS SERVICE
// ==============================================================================

export const adminService = {
  async getSettings() {
    try {
      const { data, error } = await supabase
        .from("admin_settings")
        .select("*")
        .limit(1)
        .maybeSingle();

      if (error || !data) {
        return {
          appName: "DocsZAR",
          membershipFee: 1000,
          withdrawalCharges: 50,
          minWithdrawal: 300,
          referralBonus: 600,
          fundingAccount: {
            bankName: "Moniepoint",
            accountNumber: "8123456789",
            accountName: "DocsZAR Technologies",
          },
        };
      }
      return formatRecord(data);
    } catch {
      return {
        appName: "DocsZAR",
        membershipFee: 1000,
        withdrawalCharges: 50,
        minWithdrawal: 300,
        referralBonus: 600,
        fundingAccount: {
          bankName: "Moniepoint",
          accountNumber: "8123456789",
          accountName: "DocsZAR Technologies",
        },
      };
    }
  },
};

// ==============================================================================
// 6. TRANSACTIONAL EMAIL SERVICE (SendByte via Supabase Edge Function)
// ==============================================================================

export const emailService = {
  async sendEmail({ to, subject, type, data, name, senderName = "Joscor from DocsZAR" }) {
    if (!to) return null;
    try {
      const res = await supabase.functions.invoke("send-email", {
        body: { to, subject, type, data, name, senderName },
      });
      return res?.data || null;
    } catch {
      return null;
    }
  },

  async sendWelcomeEmail({ to, name }) {
    try {
      return await this.sendEmail({
        to,
        name,
        type: "welcome_email",
        senderName: "Joscor from DocsZAR",
      });
    } catch {
      return null;
    }
  },

  async sendTaskApprovedEmail({ to, name, taskTitle, reward }) {
    try {
      return await this.sendEmail({
        to,
        name,
        type: "task_approved",
        data: { taskTitle, reward },
        senderName: "DocsZAR Rewards",
      });
    } catch {
      return null;
    }
  },

  async sendTaskRejectedEmail({ to, name, taskTitle, reason }) {
    try {
      return await this.sendEmail({
        to,
        name,
        type: "task_rejected",
        data: { taskTitle, reason },
        senderName: "DocsZAR Task Team",
      });
    } catch {
      return null;
    }
  },

  async sendNewSubmissionEmail({ to, name, taskTitle, workerUsername, manageUrl }) {
    try {
      return await this.sendEmail({
        to,
        name,
        type: "new_submission",
        data: { taskTitle, workerUsername, manageUrl },
        senderName: "DocsZAR Campaigns",
      });
    } catch {
      return null;
    }
  },

  async sendCampaignCompletedEmail({ to, name, taskTitle, totalParticipants }) {
    try {
      return await this.sendEmail({
        to,
        name,
        type: "campaign_completed",
        data: { taskTitle, totalParticipants },
        senderName: "DocsZAR Campaigns",
      });
    } catch {
      return null;
    }
  },

  /**
   * Broadcasts alerts when new tasks are available:
   * - High-price tasks (>= ₦100): Instant alert sent immediately to earners
   * - Low-price tasks (< ₦100): Daily digest sent at most once every 24 hours
   */
  async broadcastNewTaskAlert({ taskTitle, reward, platform, availableSlots, taskUrl }) {
    const rewardNum = parseFloat(reward || 0);
    const isHighPaying = rewardNum >= 100;

    try {
      if (isHighPaying) {
        // High Paying Task Alert: Send instant alert to verified earners
        const { data: earners } = await supabase
          .from("users")
          .select("id, email, firstname, username")
          .eq("is_email_verified", true)
          .limit(25);

        if (earners && earners.length > 0) {
          for (const earner of earners) {
            if (earner.email) {
              this.sendEmail({
                to: earner.email,
                name: earner.firstname || earner.username || "Earner",
                type: "high_paying_task_alert",
                data: {
                  taskTitle,
                  reward: rewardNum,
                  platform: platform || "Social Gig",
                  availableSlots: availableSlots || "Limited",
                  taskUrl: taskUrl || "https://www.docszar.com/tasks",
                },
                senderName: "DocsZAR High-Reward Alerts",
              }).catch(() => {});
            }
          }
        }
      } else {
        // Low Price Task: Send daily digest at most once every 24 hours
        const lastSentKey = "docszar_last_daily_task_digest";
        const lastSent = typeof localStorage !== "undefined" ? localStorage.getItem(lastSentKey) : null;
        const oneDayMs = 24 * 60 * 60 * 1000;

        if (!lastSent || Date.now() - Number(lastSent) > oneDayMs) {
          if (typeof localStorage !== "undefined") {
            localStorage.setItem(lastSentKey, String(Date.now()));
          }

          const { data: earners } = await supabase
            .from("users")
            .select("id, email, firstname, username")
            .eq("is_email_verified", true)
            .limit(25);

          if (earners && earners.length > 0) {
            for (const earner of earners) {
              if (earner.email) {
                this.sendEmail({
                  to: earner.email,
                  name: earner.firstname || earner.username || "Earner",
                  type: "daily_task_digest",
                  data: {
                    totalEstimatedRewards: 1000,
                  },
                  senderName: "DocsZAR Daily Digest",
                }).catch(() => {});
              }
            }
          }
        }
      }
    } catch (err) {
      console.warn("broadcastNewTaskAlert notice:", err.message);
    }
  },
};

// ==============================================================================
// 7. POCKETFI BANK LIST & VERIFICATION SERVICE
// ==============================================================================

const POCKETFI_BEARER_TOKEN = "32438|LO9iG4rLGLnVzywfVDlhGoji0JWTpYywEIc3KHGxf837cb4b";
const POCKETFI_API_BASE = "https://api.pocketfi.ng/api/v1";

const POPULAR_BANK_CODES = [
  "100004", // Opay
  "100033", // Palmpay
  "090405", // Moniepoint
  "090267", // Kuda
  "000014", // Access Bank
  "000013", // GTBank
  "000016", // First Bank
  "000015", // Zenith Bank
  "000004", // UBA
  "000007", // Fidelity Bank
  "000017", // Wema Bank
  "000001", // Sterling Bank
  "000012", // Stanbic IBTC
  "000018", // Union Bank
  "000003", // FCMB
  "000008", // Polaris Bank
  "000010", // Ecobank
  "090110", // VFD MFB
  "000023", // Providus Bank
  "000006", // Jaiz Bank
  "000026", // Taj Bank
  "120001", // 9PSB
];

const verifiedAccountCache = new Map();

export const bankService = {
  // Fetch full live list of Nigerian banks (instant synchronous fallback)
  async getBanks() {
    return cachedBanks && cachedBanks.length > 0 ? cachedBanks : NIGERIAN_BANKS;
  },

  // Verify Bank Account name using PocketFi via Supabase Edge Function Proxy
  async verifyAccount(accountNumber, bankCode, bankName) {
    const cleanNum = String(accountNumber || "").replace(/\D/g, "").trim();
    if (!cleanNum || cleanNum.length !== 10) {
      throw new Error("Please enter a valid 10-digit Nigerian account number.");
    }

    let codeToUse = String(bankCode || "").trim();

    // If bankCode is missing or looks like legacy 3-digit code, resolve it from NIGERIAN_BANKS
    if ((!codeToUse || codeToUse.length < 5) && bankName) {
      const bankLookup = NIGERIAN_BANKS;
      const matched = bankLookup.find(
        (b) => b.name.toLowerCase() === bankName.toLowerCase() ||
               b.name.toLowerCase().includes(bankName.toLowerCase()) ||
               bankName.toLowerCase().includes(b.name.toLowerCase())
      );
      if (matched) codeToUse = matched.code;
    }

    if (!codeToUse) {
      throw new Error("Please select a bank to verify account.");
    }

    const cacheKey = `${codeToUse}:${cleanNum}`;
    if (verifiedAccountCache.has(cacheKey)) {
      return verifiedAccountCache.get(cacheKey);
    }

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 6500);

      // Call Supabase Edge Function proxy (handles CORS & PocketFi securely)
      const edgeRes = await fetch("https://itzqsxmjyjfgtbolfhmq.supabase.co/functions/v1/pocketfi-banks", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json",
        },
        body: JSON.stringify({
          accountNumber: cleanNum,
          bankCode: codeToUse,
        }),
        signal: controller.signal,
      });
      clearTimeout(timeoutId);

      const edgeData = await edgeRes.json();
      const resolvedName = String(
        edgeData?.account_name ||
        edgeData?.data?.account_name ||
        edgeData?.accountName ||
        ""
      ).trim();

      const isInvalid =
        !resolvedName ||
        resolvedName.length < 2 ||
        resolvedName.toLowerCase().includes("unknown") ||
        resolvedName.toLowerCase().includes("invalid") ||
        resolvedName.toLowerCase().includes("error") ||
        resolvedName.toLowerCase().includes("not found");

      if (edgeRes.ok && (edgeData?.status === "success" || edgeData?.account_name) && !isInvalid) {
        const payload = {
          status: "success",
          accountName: resolvedName,
          bankCode: edgeData.bank_code || codeToUse,
        };
        verifiedAccountCache.set(cacheKey, payload);
        return payload;
      } else {
        const errMsg = edgeData?.message || "Could not verify account name. Please confirm your account number matches the selected bank.";
        throw new Error(errMsg);
      }
    } catch (err) {
      if (err.name === "AbortError") {
        throw new Error("Bank verification timed out. You can type your account name manually below or retry.");
      }
      console.warn("PocketFi bank verification notice:", err.message);
      throw new Error(err.message || "Failed to verify bank account.");
    }
  },
};

// ==============================================================================
// 8. DAILY STREAK & CHECK-IN REWARDS SERVICE
// ==============================================================================

const DAILY_REWARDS = [
  { day: 1, reward: 5, label: "Day 1" },
  { day: 2, reward: 10, label: "Day 2" },
  { day: 3, reward: 15, label: "Day 3" },
  { day: 4, reward: 20, label: "Day 4" },
  { day: 5, reward: 25, label: "Day 5" },
  { day: 6, reward: 35, label: "Day 6" },
  { day: 7, reward: 50, label: "Day 7", isMega: true },
];

export const streakService = {
  getRewardsList() {
    return DAILY_REWARDS;
  },

  getTodayDateString() {
    const d = new Date();
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
  },

  getYesterdayDateString() {
    const d = new Date();
    d.setDate(d.getDate() - 1);
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
  },

  async getStreakStatus(userId) {
    if (!userId) return null;
    const today = this.getTodayDateString();
    const yesterday = this.getYesterdayDateString();

    try {
      const { data } = await supabase
        .from("tokens")
        .select("token")
        .eq("user_id", userId)
        .ilike("token", "daily_streak:%")
        .order("created_at", { ascending: false })
        .limit(1)
        .maybeSingle();

      let streakData = {
        currentStreak: 0,
        lastCheckinDate: null,
        canClaimToday: true,
        todayReward: DAILY_REWARDS[0].reward,
        nextDayNumber: 1,
        totalClaimed: 0,
      };

      if (data?.token && data.token.startsWith("daily_streak:")) {
        try {
          const parsed = JSON.parse(data.token.replace("daily_streak:", ""));
          streakData = { ...streakData, ...parsed };
        } catch {}
      }

      if (streakData.lastCheckinDate === today) {
        streakData.canClaimToday = false;
        streakData.nextDayNumber = (streakData.currentStreak % 7) + 1;
        streakData.todayReward = DAILY_REWARDS[Math.min(Math.max(streakData.currentStreak - 1, 0), 6)]?.reward || 5;
      } else if (streakData.lastCheckinDate === yesterday) {
        streakData.canClaimToday = true;
        const nextDay = (streakData.currentStreak % 7) + 1;
        streakData.nextDayNumber = nextDay;
        streakData.todayReward = DAILY_REWARDS[nextDay - 1]?.reward || 5;
      } else {
        streakData.canClaimToday = true;
        streakData.nextDayNumber = 1;
        streakData.todayReward = DAILY_REWARDS[0].reward;
      }

      return streakData;
    } catch {
      return {
        currentStreak: 0,
        lastCheckinDate: null,
        canClaimToday: true,
        todayReward: 5,
        nextDayNumber: 1,
        totalClaimed: 0,
      };
    }
  },

  async claimDailyStreak(userId) {
    if (!userId) throw new Error("User ID is required");
    const status = await this.getStreakStatus(userId);
    if (!status.canClaimToday) {
      throw new Error("You have already checked in today! Come back tomorrow for your next reward.");
    }

    const today = this.getTodayDateString();
    const newStreak = status.nextDayNumber;
    const rewardAmount = DAILY_REWARDS[newStreak - 1]?.reward || 5;

    // 1. Get current balance & update in users table
    const { data: userRow } = await supabase
      .from("users")
      .select("balance")
      .eq("id", userId)
      .single();

    const currentBal = Number(userRow?.balance || 0);
    const newBal = currentBal + rewardAmount;

    await supabase
      .from("users")
      .update({ balance: newBal })
      .eq("id", userId);

    // 2. Insert transaction
    await supabase.from("transactions").insert({
      user_id: userId,
      amount: rewardAmount,
      fee: 0,
      type: "bonus",
      status: "completed",
      description: `Day ${newStreak} Daily Login Streak Bonus 🔥`,
    }).catch(() => {});

    // 3. Insert notification
    await supabase.from("notifications").insert({
      user_id: userId,
      title: "Daily Login Bonus Claimed! 🔥",
      message: `You earned ₦${rewardAmount}.00 for your Day ${newStreak} check-in streak. Keep logging in daily to unlock the Day 7 Mega Bonus!`,
      is_read: false,
    }).catch(() => {});

    // 4. Update streak token
    const newStreakData = {
      currentStreak: newStreak,
      lastCheckinDate: today,
      totalClaimed: (status.totalClaimed || 0) + rewardAmount,
    };

    await supabase
      .from("tokens")
      .delete()
      .eq("user_id", userId)
      .ilike("token", "daily_streak:%")
      .catch(() => {});

    await supabase.from("tokens").insert({
      user_id: userId,
      token: `daily_streak:${JSON.stringify(newStreakData)}`,
    });

    return {
      success: true,
      day: newStreak,
      reward: rewardAmount,
      newBalance: newBal,
    };
  },
};


