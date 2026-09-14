import { supabase } from "../config/supabase.config.js";
import { v4 as uuidv4, validate as isValidUUID } from "uuid";

/**
 * Adapter utility to normalize Supabase records to match frontend expectations
 * (e.g. mapping `id` to `_id` where expected, converting snake_case to camelCase)
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
  if (formatted.created_at && !formatted.createdAt) {
    formatted.createdAt = formatted.created_at;
  }
  if (formatted.updated_at && !formatted.updatedAt) {
    formatted.updatedAt = formatted.updated_at;
  }
  if (formatted.is_email_verified !== undefined && formatted.isEmailVerified === undefined) {
    formatted.isEmailVerified = formatted.is_email_verified;
  }
  if (formatted.is_member !== undefined && formatted.isMember === undefined) {
    formatted.isMember = formatted.is_member;
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
  return formatted;
};

// ==============================================================================
// 1. USER & AUTH SERVICES
// ==============================================================================

export const userService = {
  async findByEmail(email) {
    const { data, error } = await supabase
      .from("users")
      .select("*")
      .eq("email", email)
      .maybeSingle();
    if (error) throw error;
    return formatRecord(data);
  },

  async findByUsername(username) {
    const { data, error } = await supabase
      .from("users")
      .select("*")
      .eq("username", username)
      .maybeSingle();
    if (error) throw error;
    return formatRecord(data);
  },

  async findById(id) {
    const { data, error } = await supabase
      .from("users")
      .select("*")
      .eq("id", id)
      .maybeSingle();
    if (error) throw error;
    return formatRecord(data);
  },

  async findAdmin() {
    const { data, error } = await supabase
      .from("users")
      .select("*")
      .eq("role", "admin")
      .limit(1)
      .maybeSingle();
    if (error) throw error;
    return formatRecord(data);
  },

  async getAllUsers(limit = 100) {
    const { data, error } = await supabase
      .from("users")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(limit);
    if (error) throw error;
    return formatRecord(data || []);
  },

  async createUser(userData) {
    const payload = {
      firstname: userData.firstname,
      lastname: userData.lastname,
      username: userData.username,
      email: userData.email,
      phone: userData.phone || null,
      password: userData.password || null,
      role: userData.role || "user",
      is_email_verified: userData.isEmailVerified || false,
      is_member: userData.isMember || false,
      is_banned: userData.isBanned || false,
      is_nin_verified: userData.isNINVerified || false,
      referred_by: userData.referredBy || "admin",
      referrals: userData.referrals || [],
      balance: userData.balance || 0,
      pending_balance: userData.pendingBalance || 0,
      avatar_url: userData.avatarUrl || userData.image || null,
    };

    const { data, error } = await supabase
      .from("users")
      .insert(payload)
      .select()
      .single();
    if (error) throw error;
    return formatRecord(data);
  },

  async updateUser(id, updateData) {
    const payload = {};
    if (updateData.firstname !== undefined) payload.firstname = updateData.firstname;
    if (updateData.lastname !== undefined) payload.lastname = updateData.lastname;
    if (updateData.username !== undefined) payload.username = updateData.username;
    if (updateData.email !== undefined) payload.email = updateData.email;
    if (updateData.phone !== undefined) payload.phone = updateData.phone;
    if (updateData.password !== undefined) payload.password = updateData.password;
    if (updateData.role !== undefined) payload.role = updateData.role;
    if (updateData.isEmailVerified !== undefined) payload.is_email_verified = updateData.isEmailVerified;
    if (updateData.isMember !== undefined) payload.is_member = updateData.isMember;
    if (updateData.isBanned !== undefined) payload.is_banned = updateData.isBanned;
    if (updateData.isNINVerified !== undefined) payload.is_nin_verified = updateData.isNINVerified;
    if (updateData.referrals !== undefined) payload.referrals = updateData.referrals;
    if (updateData.balance !== undefined) payload.balance = updateData.balance;
    if (updateData.pendingBalance !== undefined) payload.pending_balance = updateData.pendingBalance;
    if (updateData.avatarUrl !== undefined) payload.avatar_url = updateData.avatarUrl;
    if (updateData.avatar_url !== undefined) payload.avatar_url = updateData.avatar_url;
    if (updateData.image !== undefined) payload.avatar_url = updateData.image;
    payload.updated_at = new Date().toISOString();

    const { data, error } = await supabase
      .from("users")
      .update(payload)
      .eq("id", id)
      .select()
      .single();
    if (error) throw error;
    return formatRecord(data);
  },

  async incrementBalance(id, amount) {
    const user = await this.findById(id);
    if (!user) throw new Error("User not found");
    const newBalance = (Number(user.balance) || 0) + Number(amount);
    return await this.updateUser(id, { balance: newBalance });
  },

  async decrementBalance(id, amount) {
    const user = await this.findById(id);
    if (!user) throw new Error("User not found");
    const newBalance = (Number(user.balance) || 0) - Number(amount);
    return await this.updateUser(id, { balance: newBalance });
  },
};

// ==============================================================================
// 2. USER DETAILS SERVICES
// ==============================================================================

export const userDetailsService = {
  async getByUserId(userId) {
    const { data, error } = await supabase
      .from("user_details")
      .select("*")
      .eq("user_id", userId)
      .maybeSingle();
    if (error) throw error;
    return formatRecord(data);
  },

  async upsertUserDetails(userId, details) {
    const existing = await this.getByUserId(userId);
    const payload = {
      user_id: userId,
      updated_at: new Date().toISOString(),
    };

    if (details.gender !== undefined) payload.gender = details.gender;
    if (details.state !== undefined) payload.state = details.state;
    if (details.lga !== undefined) payload.lga = details.lga;
    if (details.bankName !== undefined || details.bank_name !== undefined) {
      payload.bank_name = details.bankName || details.bank_name;
    }
    if (details.accountNumber !== undefined || details.account_number !== undefined) {
      payload.account_number = details.accountNumber || details.account_number;
    }
    if (details.accountName !== undefined || details.account_name !== undefined) {
      payload.account_name = details.accountName || details.account_name;
    }
    if (details.bvn !== undefined) payload.bvn = details.bvn;
    if (details.nin !== undefined) payload.nin = details.nin;
    if (details.religion !== undefined) payload.religion = details.religion;
    if (details.dateOfBirth !== undefined || details.date_of_birth !== undefined) {
      payload.date_of_birth = details.dateOfBirth || details.date_of_birth;
    }
    if (details.virtualAccountBank !== undefined || details.virtual_account_bank !== undefined) {
      payload.virtual_account_bank = details.virtualAccountBank || details.virtual_account_bank;
    }
    if (details.virtualAccountNumber !== undefined || details.virtual_account_number !== undefined) {
      payload.virtual_account_number = details.virtualAccountNumber || details.virtual_account_number;
    }
    if (details.virtualAccountName !== undefined || details.virtual_account_name !== undefined) {
      payload.virtual_account_name = details.virtualAccountName || details.virtual_account_name;
    }

    if (existing) {
      const { data, error } = await supabase
        .from("user_details")
        .update(payload)
        .eq("user_id", userId)
        .select()
        .single();
      if (error) throw error;
      return formatRecord(data);
    } else {
      const { data, error } = await supabase
        .from("user_details")
        .insert(payload)
        .select()
        .single();
      if (error) throw error;
      return formatRecord(data);
    }
  },
};

// ==============================================================================
// 2B. VIRTUAL ACCOUNT SERVICES
// ==============================================================================

export const virtualAccountService = {
  async getByUserId(userId) {
    if (!userId) return null;
    const { data, error } = await supabase
      .from("virtual_accounts")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle();
    if (error) {
      console.warn("virtualAccountService getByUserId error:", error.message);
      return null;
    }
    return formatRecord(data);
  },

  async getByAccountNumber(accountNumber) {
    if (!accountNumber) return null;
    const { data, error } = await supabase
      .from("virtual_accounts")
      .select("*, users:user_id(*)")
      .eq("account_number", String(accountNumber).trim())
      .maybeSingle();
    if (error) {
      console.warn("virtualAccountService getByAccountNumber error:", error.message);
      return null;
    }
    return formatRecord(data);
  },

  async saveVirtualAccount(userId, accountData) {
    if (!userId || !accountData?.accountNumber) return null;
    const payload = {
      user_id: userId,
      bank_name: (accountData.bankName || accountData.bank_name || "PAGA").toUpperCase(),
      account_number: String(accountData.accountNumber || accountData.account_number).trim(),
      account_name: accountData.accountName || accountData.account_name || "Zargigs Earner",
      provider: accountData.provider || "pocketfi",
      currency: "NGN",
      metadata: accountData.metadata || {},
      updated_at: new Date().toISOString(),
    };

    const { data, error } = await supabase
      .from("virtual_accounts")
      .upsert(payload, { onConflict: "account_number" })
      .select()
      .maybeSingle();

    if (error) {
      console.warn("virtualAccountService saveVirtualAccount error:", error.message);
    }
    return formatRecord(data);
  },
};

// ==============================================================================
// 3. TOKEN & OTP SERVICES
// ==============================================================================

export const tokenService = {
  async createToken(userId, token) {
    const { data, error } = await supabase
      .from("tokens")
      .insert({ user_id: userId, token })
      .select()
      .single();
    if (error) throw error;
    return formatRecord(data);
  },

  async findToken(userId, token) {
    let query = supabase.from("tokens").select("*").eq("token", token);
    if (userId) query = query.eq("user_id", userId);
    const { data, error } = await query.order("created_at", { ascending: false }).limit(1).maybeSingle();
    if (error) throw error;
    return formatRecord(data);
  },

  async deleteTokensByUser(userId) {
    const { error } = await supabase.from("tokens").delete().eq("user_id", userId);
    if (error) throw error;
    return true;
  },

  async createResetId(email, resetId, expiresAt) {
    const { data, error } = await supabase
      .from("reset_ids")
      .insert({ email, reset_id: resetId, expires_at: expiresAt || new Date(Date.now() + 3600000).toISOString() })
      .select()
      .single();
    if (error) throw error;
    return formatRecord(data);
  },

  async findResetId(resetId) {
    const { data, error } = await supabase
      .from("reset_ids")
      .select("*")
      .eq("reset_id", resetId)
      .maybeSingle();
    if (error) throw error;
    return formatRecord(data);
  },

  async deleteResetId(resetId) {
    const { error } = await supabase.from("reset_ids").delete().eq("reset_id", resetId);
    if (error) throw error;
    return true;
  },
};

// ==============================================================================
// 4. TASKS & ADVERTS SERVICES
// ==============================================================================

export const taskService = {
  async createAdvertTask(taskData) {
    const payload = {
      user_id: taskData.userId,
      title: taskData.title,
      caption: taskData.caption,
      media_url: taskData.mediaUrl,
      platform: taskData.taskPlatform || taskData.platform || "generic",
      task_type: "advert",
      gender: taskData.gender,
      location: taskData.location,
      religion: taskData.religion,
      number_of_tasks: taskData.numberOfTasks,
      tasks_done: 0,
      amount_paid: taskData.amountToPay || taskData.amountPaid || 0,
      earner_fee: taskData.earnerFee || 0,
      status: "pending",
    };
    const { data, error } = await supabase.from("advert_tasks").insert(payload).select().single();
    if (error) throw error;
    return formatRecord(data);
  },

  async createEngagementTask(taskData) {
    const payload = {
      user_id: taskData.userId,
      title: taskData.title,
      platform: taskData.taskPlatform || taskData.platform || "generic",
      task_type: "engagement",
      action_link: taskData.actionLink || taskData.link || "",
      gender: taskData.gender,
      location: taskData.location,
      religion: taskData.religion,
      number_of_tasks: taskData.numberOfTasks,
      tasks_done: 0,
      amount_paid: taskData.amountToPay || taskData.amountPaid || 0,
      earner_fee: taskData.earnerFee || 0,
      status: "pending",
    };
    const { data, error } = await supabase.from("engagement_tasks").insert(payload).select().single();
    if (error) throw error;
    return formatRecord(data);
  },

  async getAdvertTasks(filter = {}) {
    let query = supabase.from("advert_tasks").select("*").order("created_at", { ascending: false });
    if (filter.status) query = query.eq("status", filter.status);
    if (filter.userId) query = query.eq("user_id", filter.userId);
    const { data, error } = await query;
    if (error) throw error;
    return formatRecord(data || []);
  },

  async getEngagementTasks(filter = {}) {
    let query = supabase.from("engagement_tasks").select("*").order("created_at", { ascending: false });
    if (filter.status) query = query.eq("status", filter.status);
    if (filter.userId) query = query.eq("user_id", filter.userId);
    const { data, error } = await query;
    if (error) throw error;
    return formatRecord(data || []);
  },

  async getTaskById(taskId, taskType = "advert") {
    if (!taskId || typeof taskId !== "string" || !isValidUUID(taskId)) return null;
    const table = taskType === "engagement" ? "engagement_tasks" : "advert_tasks";
    const { data, error } = await supabase.from(table).select("*").eq("id", taskId).maybeSingle();
    if (error) throw error;
    return formatRecord(data);
  },

  async allocateTask(userId, taskId, taskType = "advert") {
    const payload = {
      user_id: userId,
      task_id: taskId,
      task_type: taskType,
      status: "allocated",
      expires_at: new Date(Date.now() + 86400000).toISOString(),
    };
    const { data, error } = await supabase.from("allocated_tasks").insert(payload).select().single();
    if (error) throw error;
    return formatRecord(data);
  },

  async submitProofOfWork(proofData) {
    let resolvedTaskId = proofData.taskId || proofData.id || proofData.parentId;
    if (!resolvedTaskId || typeof resolvedTaskId !== "string" || !isValidUUID(resolvedTaskId)) {
      resolvedTaskId = uuidv4();
    }

    const payload = {
      user_id: proofData.userId,
      task_id: resolvedTaskId,
      task_type: proofData.taskType || proofData.type || "advert",
      image_proof: proofData.imageProof || proofData.image || "",
      username_proof: proofData.usernameProof || proofData.username || "",
      notes: proofData.notes || "",
      status: "submitted",
    };
    const { data, error } = await supabase.from("proof_of_work").insert(payload).select().single();
    if (error) throw error;
    return formatRecord(data);
  },

  async getCompletedTasks(userId) {
    let query = supabase.from("completed_tasks").select("*").order("created_at", { ascending: false });
    if (userId) query = query.eq("user_id", userId);
    const { data, error } = await query;
    if (error) throw error;
    return formatRecord(data || []);
  },

  async getPendingTasks(userId) {
    let query = supabase.from("pending_tasks").select("*").order("created_at", { ascending: false });
    if (userId) query = query.eq("user_id", userId);
    const { data, error } = await query;
    if (error) throw error;
    return formatRecord(data || []);
  },

  async getInReviewTasks(userId) {
    let query = supabase.from("in_review_tasks").select("*").order("created_at", { ascending: false });
    if (userId) query = query.eq("user_id", userId);
    const { data, error } = await query;
    if (error) throw error;
    return formatRecord(data || []);
  },
};

// ==============================================================================
// 5. WALLET, FUNDING, TRANSFERS & WITHDRAWALS
// ==============================================================================

export const walletService = {
  async createFunding(fundingData) {
    const payload = {
      user_id: fundingData.userId,
      amount: fundingData.amount,
      reference: fundingData.reference,
      payment_method: fundingData.paymentMethod || "paystack",
      status: fundingData.status || "pending",
      receipt_url: fundingData.receiptUrl || null,
    };
    const { data, error } = await supabase.from("funding").insert(payload).select().single();
    if (error) throw error;
    return formatRecord(data);
  },

  async getFundingByReference(reference) {
    const { data, error } = await supabase.from("funding").select("*").eq("reference", reference).maybeSingle();
    if (error) throw error;
    return formatRecord(data);
  },

  async updateFundingStatus(id, status) {
    const { data, error } = await supabase.from("funding").update({ status }).eq("id", id).select().single();
    if (error) throw error;
    return formatRecord(data);
  },

  async getUserFundings(userId) {
    const { data, error } = await supabase
      .from("funding")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false });
    if (error) throw error;
    return formatRecord(data || []);
  },

  async createTransfer(senderId, receiverId, amount, narration) {
    const payload = {
      sender_id: senderId,
      receiver_id: receiverId,
      amount,
      narration: narration || "Wallet transfer",
      status: "completed",
    };
    const { data, error } = await supabase.from("transfers").insert(payload).select().single();
    if (error) throw error;
    return formatRecord(data);
  },

  async getUserTransfers(userId) {
    const { data, error } = await supabase
      .from("transfers")
      .select("*")
      .or(`sender_id.eq.${userId},receiver_id.eq.${userId}`)
      .order("created_at", { ascending: false });
    if (error) throw error;
    return formatRecord(data || []);
  },

  async createWithdrawal(userId, amount, bankDetails) {
    const payload = {
      user_id: userId,
      amount,
      bank_name: bankDetails.bankName,
      account_number: bankDetails.accountNumber,
      account_name: bankDetails.accountName,
      status: "pending",
    };
    const { data, error } = await supabase.from("withdrawal_requests").insert(payload).select().single();
    if (error) throw error;
    return formatRecord(data);
  },

  async getUserWithdrawals(userId) {
    const { data, error } = await supabase
      .from("withdrawal_requests")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false });
    if (error) throw error;
    return formatRecord(data || []);
  },
};

// ==============================================================================
// 6. ADVERTISEMENTS (BANNERS)
// ==============================================================================

export const advertService = {
  async createAdvertisement(advertData) {
    const payload = {
      name: advertData.name,
      link: advertData.link,
      description: advertData.description,
      banner: advertData.banner,
      duration: advertData.duration,
      posted_by: advertData.postedBy,
      expires_at: new Date(Date.now() + (advertData.duration || 1) * 86400000).toISOString(),
    };
    const { data, error } = await supabase.from("advertisements").insert(payload).select().single();
    if (error) throw error;
    return formatRecord(data);
  },

  async getActiveAdvertisements() {
    const now = new Date().toISOString();
    const { data, error } = await supabase
      .from("advertisements")
      .select("*")
      .gt("expires_at", now)
      .order("created_at", { ascending: false });
    if (error) throw error;
    return formatRecord(data || []);
  },
};

// ==============================================================================
// 7. NOTIFICATIONS, COMPLAINTS & ANNOUNCEMENTS
// ==============================================================================

export const notificationService = {
  async createNotification(userId, title, message) {
    const payload = {
      user_id: userId,
      title,
      message,
      is_read: false,
    };
    const { data, error } = await supabase.from("notifications").insert(payload).select().single();
    if (error) throw error;
    return formatRecord(data);
  },

  async getUserNotifications(userId) {
    const { data, error } = await supabase
      .from("notifications")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false });
    if (error) throw error;
    return formatRecord(data || []);
  },

  async markAsRead(id) {
    const { data, error } = await supabase.from("notifications").update({ is_read: true }).eq("id", id).select().single();
    if (error) throw error;
    return formatRecord(data);
  },

  async createComplaint(userId, subject, message) {
    const payload = {
      user_id: userId,
      subject,
      message,
      status: "open",
    };
    const { data, error } = await supabase.from("complaints").insert(payload).select().single();
    if (error) throw error;
    return formatRecord(data);
  },

  async getUserComplaints(userId) {
    const { data, error } = await supabase.from("complaints").select("*").eq("user_id", userId).order("created_at", { ascending: false });
    if (error) throw error;
    return formatRecord(data || []);
  },

  async getAnnouncements() {
    const { data, error } = await supabase.from("announcements").select("*").eq("is_active", true).order("created_at", { ascending: false });
    if (error) throw error;
    return formatRecord(data || []);
  },
};

// ==============================================================================
// 8. ADMIN & CONFIG
// ==============================================================================

export const adminService = {
  async getAdminSettings() {
    try {
      const { data, error } = await supabase.from("admin_settings").select("*").limit(1).maybeSingle();
      if (!error && data) {
        return formatRecord(data);
      }
    } catch (err) {
      // Fallback
    }
    return {
      id: "default",
      appName: "Zargigs",
      maintenanceMode: false,
      minWithdrawal: 1000,
      membershipFee: 1000,
      referralBonus: 500,
    };
  },
};


export default {
  userService,
  userDetailsService,
  virtualAccountService,
  tokenService,
  taskService,
  walletService,
  advertService,
  notificationService,
  adminService,
};
