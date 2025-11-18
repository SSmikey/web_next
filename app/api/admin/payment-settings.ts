// Global payment settings storage (in production, this should be in a database)
let globalPaymentSettings = {
  bankName: '',
  accountName: '',
  accountNumber: '',
  qrCodeImage: '' // Store file path instead of URL
};

// Export function to get payment settings
export function getGlobalPaymentSettings() {
  return globalPaymentSettings;
}

// Export function to update payment settings
export function updateGlobalPaymentSettings(settings: any) {
  globalPaymentSettings = settings;
}