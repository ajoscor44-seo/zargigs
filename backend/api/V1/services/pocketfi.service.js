import axios from "axios";
import crypto from "crypto";
import dotenv from "dotenv";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const POCKETFI_BUSINESS_ID = process.env.POCKETFI_BUSINESS_ID || "30135";
const POCKETFI_BEARER_TOKEN =
  process.env.POCKETFI_BEARER_TOKEN ||
  "32438|LO9iG4rLGLnVzywfVDlhGoji0JWTpYywEIc3KHGxf837cb4b";
const POCKETFI_SECRET_KEY =
  process.env.POCKETFI_SECRET_KEY ||
  "1c85ecfb4714c1a3aa40e51eb1630a3c155ac3a53ef03d2f188379af677a120c";
const POCKETFI_BASE_URL =
  process.env.POCKETFI_BASE_URL || "https://api.pocketfi.ng/api/v1";

// In-memory & disk storage for virtual accounts
const VA_FILE_PATH = path.join(__dirname, "../../../data/virtual_accounts.json");

// Ensure data dir exists
const ensureDataDir = () => {
  const dir = path.dirname(VA_FILE_PATH);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  if (!fs.existsSync(VA_FILE_PATH)) {
    fs.writeFileSync(VA_FILE_PATH, JSON.stringify({}));
  }
};

const getStoredVirtualAccounts = () => {
  try {
    ensureDataDir();
    const data = fs.readFileSync(VA_FILE_PATH, "utf8");
    return JSON.parse(data || "{}");
  } catch (err) {
    return {};
  }
};

const saveStoredVirtualAccount = (userId, accountData) => {
  try {
    ensureDataDir();
    const accounts = getStoredVirtualAccounts();
    accounts[userId] = {
      ...accountData,
      updatedAt: new Date().toISOString(),
    };
    // Also index by account number for quick webhook lookup
    if (accountData.accountNumber) {
      accounts[`acct_${accountData.accountNumber}`] = {
        userId,
        ...accountData,
      };
    }
    fs.writeFileSync(VA_FILE_PATH, JSON.stringify(accounts, null, 2));
  } catch (err) {
    console.error("Error saving virtual account to file:", err.message);
  }
};

const getStoredVirtualAccountByNumber = (accountNumber) => {
  const accounts = getStoredVirtualAccounts();
  return accounts[`acct_${accountNumber}`] || null;
};

// Fallback bank list if external API is unreachable
const DEFAULT_BANKS = [
  { name: "Opay Digital Services Limited", code: "100004" },
  { name: "PALMPAY", code: "100033" },
  { name: "Moniepoint Microfinance Bank", code: "090405" },
  { name: "Kuda Bank", code: "090267" },
  { name: "Access Bank", code: "000014" },
  { name: "Access Bank PLC (Diamond)", code: "000005" },
  { name: "GTBank Plc", code: "000013" },
  { name: "First Bank of Nigeria", code: "000016" },
  { name: "United Bank for Africa (UBA)", code: "000004" },
  { name: "Zenith Bank PLC", code: "000015" },
  { name: "Fidelity Bank", code: "000007" },
  { name: "Wema Bank", code: "000017" },
  { name: "Sterling Bank", code: "000001" },
  { name: "Stanbic IBTC Bank", code: "000012" },
  { name: "Union Bank", code: "000018" },
  { name: "FCMB", code: "000003" },
  { name: "POLARIS BANK", code: "000008" },
  { name: "Ecobank Bank", code: "000010" },
  { name: "VFD MFB", code: "090110" },
  { name: "Rubies Bank", code: "090175" },
  { name: "Jaiz Bank", code: "000006" },
  { name: "Taj Bank", code: "000026" },
  { name: "Titan Trust Bank", code: "000025" },
  { name: "Providus Bank", code: "000023" },
  { name: "9 Payment Service Bank (9PSB)", code: "120001" },
  { name: "Hope PSBank", code: "120002" },
  { name: "Momo Payment Service Bank", code: "120003" },
  { name: "Smartcash PSB", code: "120004" },
  { name: "FairMoney Microfinance Bank", code: "090551" },
  { name: "Raven Bank", code: "090403" },
  { name: "Dot Microfinance Bank", code: "090470" },
  { name: "Mint Finex MFB", code: "090281" },
  { name: "Carbon", code: "100026" },
];

let cachedBanks = null;
let cacheExpiry = 0;

export const pocketfiService = {
  /**
   * Get Axios HTTP Client configured for PocketFi
   */
  getClient() {
    return axios.create({
      baseURL: POCKETFI_BASE_URL,
      headers: {
        Authorization: `Bearer ${POCKETFI_BEARER_TOKEN}`,
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      timeout: 15000,
    });
  },

  /**
   * Fetch all supported Nigerian banks from PocketFi
   */
  async getBankList() {
    const now = Date.now();
    if (cachedBanks && cacheExpiry > now) {
      return cachedBanks;
    }

    try {
      const client = this.getClient();
      const response = await client.get("/payout/bank-list");
      const bankData =
        response.data?.banks || response.data?.data || response.data || [];

      if (Array.isArray(bankData) && bankData.length > 0) {
        // Deduplicate and format banks
        const seen = new Set();
        const formatted = [];

        for (const b of bankData) {
          const name = (b.name || "").trim();
          const code = (b.code || "").trim();
          if (name && code && !seen.has(`${name}_${code}`)) {
            seen.add(`${name}_${code}`);
            formatted.push({
              name,
              code,
            });
          }
        }

        // Sort alphabetically by bank name
        formatted.sort((a, b) => a.name.localeCompare(b.name));

        cachedBanks = formatted;
        cacheExpiry = now + 1000 * 60 * 60; // 1 hour cache
        return formatted;
      }
    } catch (err) {
      console.error("PocketFi getBankList error, using fallback:", err.message);
    }

    return DEFAULT_BANKS;
  },

  /**
   * Look up bank code from bank name or code
   */
  async resolveBankCode(bankIdentifier) {
    if (!bankIdentifier) return null;
    const identifier = String(bankIdentifier).trim().toLowerCase();

    const bankList = await this.getBankList();

    // Exact match by code
    const exactCode = bankList.find(
      (b) => b.code.toLowerCase() === identifier
    );
    if (exactCode) return exactCode.code;

    // Exact match by name
    const exactName = bankList.find(
      (b) => b.name.toLowerCase() === identifier
    );
    if (exactName) return exactName.code;

    // Partial search
    const partialMatch = bankList.find(
      (b) =>
        b.name.toLowerCase().includes(identifier) ||
        identifier.includes(b.name.toLowerCase())
    );
    if (partialMatch) return partialMatch.code;

    return null;
  },

  /**
   * Verify a Nigerian Bank Account Number (Name Enquiry)
   * @param {string} accountNumber 10-digit Bank Account Number
   * @param {string} bankCodeOrName 3-6 digit bank code or Bank Name
   */
  async verifyBankAccount(accountNumber, bankCodeOrName) {
    if (!accountNumber || accountNumber.length !== 10) {
      return {
        verified: false,
        message: "Invalid account number. Must be exactly 10 digits.",
      };
    }

    let bankCode = bankCodeOrName;
    // If user passed bank name, resolve to code
    if (!/^\d+$/.test(bankCodeOrName)) {
      bankCode = await this.resolveBankCode(bankCodeOrName);
    }

    if (!bankCode) {
      return {
        verified: false,
        message: "Unable to find the selected bank. Please select a valid bank.",
      };
    }

    try {
      const client = this.getClient();
      const response = await client.post("/payout/verify-bank", {
        account_number: accountNumber.trim(),
        bank_code: bankCode.trim(),
      });

      const data = response.data;
      const accountName = data?.account_name || data?.data?.account_name;

      if (accountName && accountName !== "Unknown Bank Code" && accountName !== "") {
        return {
          verified: true,
          status: "success",
          accountName: accountName.trim(),
          accountNumber: accountNumber.trim(),
          bankCode: bankCode.trim(),
        };
      }

      return {
        verified: false,
        status: "error",
        message:
          data?.message || "Could not verify account name. Please check details.",
      };
    } catch (err) {
      console.error("PocketFi verifyBankAccount error:", err.response?.data || err.message);
      return {
        verified: false,
        status: "error",
        message:
          err.response?.data?.message ||
          "Failed to verify bank account with PocketFi. Please double-check details.",
      };
    }
  },

  /**
   * Create or Retrieve a Dedicated Virtual Account for a User via PocketFi API
   */
  async getOrCreateVirtualAccount(user, forceNew = false) {
    if (!user) throw new Error("User required for virtual account");

    const userId = user.id || user._id;

    // Check stored virtual account if not forcing new creation
    if (!forceNew) {
      const stored = getStoredVirtualAccounts()[userId];
      if (stored && stored.accountNumber) {
        return {
          status: true,
          bankName: stored.bankName,
          accountNumber: stored.accountNumber,
          accountName: stored.accountName,
        };
      }
    }

    // Provision new virtual account directly from PocketFi
    let firstName = String(user.firstname || user.first_name || user.username || "Zargigs").trim();
    let lastName = String(user.lastname || user.last_name || "Earner").trim();
    if (!firstName || firstName.length < 2) firstName = "Zargigs";
    if (!lastName || lastName.length < 2) lastName = "Earner";

    let email = String(user.email || "").trim();
    if (!email || !email.includes("@")) {
      email = `user_${String(userId).replace(/[^a-zA-Z0-9]/g, "").slice(0, 10)}@zargigs.com`;
    }

    let rawPhone = String(user.phone || "").replace(/[^0-9]/g, "");
    let phone = "08123456789";
    if (rawPhone.startsWith("234") && rawPhone.length === 13) {
      phone = "0" + rawPhone.slice(3);
    } else if (rawPhone.startsWith("0") && rawPhone.length === 11) {
      phone = rawPhone;
    } else if (rawPhone.length === 10) {
      phone = "0" + rawPhone;
    } else if (rawPhone.length > 11) {
      phone = "0" + rawPhone.slice(-10);
    }

    const candidateBanks = ["paga", "kuda"];
    let createdAccount = null;
    let lastErrorMsg = null;

    const client = this.getClient();

    for (const bank of candidateBanks) {
      try {
        console.log(`Calling PocketFi API /virtual-accounts/create for bank: ${bank}...`);
        const response = await client.post("/virtual-accounts/create", {
          first_name: firstName,
          last_name: lastName,
          phone: phone,
          email: email,
          bank: bank,
          businessId: String(POCKETFI_BUSINESS_ID),
        });

        console.log("PocketFi API response:", response.data);

        if (response.data && response.data.status) {
          const banks = response.data.banks || [];
          if (banks.length > 0) {
            createdAccount = {
              bankName: (banks[0].bankName || bank).toUpperCase(),
              accountNumber: String(banks[0].accountNumber).trim(),
              accountName: banks[0].accountName || `${firstName} ${lastName}`.trim(),
            };
            break;
          }
        } else if (response.data?.message) {
          lastErrorMsg = response.data.message;
        }
      } catch (err) {
        console.error(`PocketFi /virtual-accounts/create (${bank}) error:`, err.response?.data || err.message);
        lastErrorMsg = err.response?.data?.message || err.message;
      }
    }

    if (createdAccount && createdAccount.accountNumber) {
      saveStoredVirtualAccount(userId, createdAccount);
      return {
        status: true,
        ...createdAccount,
      };
    }

    return {
      status: false,
      message: lastErrorMsg || "PocketFi could not provision virtual account. Please check your phone number and try again.",
    };
  },

  /**
   * Verify HMAC-SHA512 Webhook Signature
   */
  verifyWebhookSignature(rawPayload, signature) {
    if (!signature) return false;

    try {
      const hmac = crypto.createHmac("sha512", POCKETFI_SECRET_KEY);
      const computed = hmac.update(rawPayload).digest("hex");
      return computed.toLowerCase() === signature.toLowerCase().trim();
    } catch (err) {
      console.error("PocketFi verifyWebhookSignature error:", err.message);
      return false;
    }
  },

  getStoredVirtualAccounts,
  getStoredVirtualAccountByNumber,
  saveStoredVirtualAccount,
};

export default pocketfiService;
