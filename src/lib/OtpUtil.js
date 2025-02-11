/**
 * OtpUtil wraps the OTPless SDK and provides an easy-to-use interface
 * for sending and verifying OTPs. It automatically handles all OTP
 * response callbacks so you don't have to duplicate that logic in every component.
 */
class OtpUtil {
    constructor() {
      this.otpless = null;
      this.callbacks = {};
    }
  
    /**
     * Initializes the OTPless instance.
     *
     * @param {Object} callbacks - Callback functions for different OTP events.
     * @param {Function} [callbacks.onOneTap] - Called when an ONETAP response is received.
     * @param {Function} [callbacks.onOtpAutoRead] - Called when the OTP is auto-read.
     * @param {Function} [callbacks.onFailed] - Called when OTP sending/verification fails.
     * @param {Function} [callbacks.onDefault] - Called for any unhandled response types.
     *
     * @throws {Error} If the OTPless SDK is not loaded.
     */
    init(callbacks = {}) {
      if (typeof window === "undefined" || !window.OTPless) {
        throw new Error("OTPless SDK is not loaded or available.");
      }
      this.callbacks = callbacks;
      // Create a new OTPless instance using our internal callback handler.
      this.otpless = new window.OTPless(this.handleCallback.bind(this));
    }
  
    /**
     * Internal handler for OTP responses.
     *
     * @param {Object} param0 - The response object from OTPless.
     * @param {string} param0.responseType - The type of the response.
     * @param {*} param0.response - The response data.
     */
    handleCallback({ response, responseType }) {
      // Map known response types to callback keys.
      const callbackMapping = {
        ONETAP: "onOneTap",
        OTP_AUTO_READ: "onOtpAutoRead",
        FAILED: "onFailed",
      };
  
      // If the response type isn't one of the known types, fall back to "onDefault".
      const key = callbackMapping[responseType] || "onDefault";
      const callback = this.callbacks[key];
  
      if (typeof callback === "function") {
        callback(response, responseType);
      } else {
        console.warn(`Unhandled OTP callback [${responseType}]:`, response);
      }
    }
  
    /**
     * Sends an OTP to the specified phone number.
     *
     * @param {Object} params
     * @param {string} params.phone - The phone number to which the OTP is sent.
     * @param {string} [params.countryCode="+91"] - The country code.
     * @returns {Promise<any>} - The promise returned by OTPless's initiate method.
     *
     * @throws {Error} If OtpUtil is not initialized.
     */
    async sendOtp({ phone, countryCode = "+91" }) {
      if (!this.otpless) {
        throw new Error("OtpUtil not initialized. Call init() first.");
      }
      return await this.otpless.initiate({
        channel: "PHONE",
        phone,
        countryCode,
      });
    }
  
    /**
     * Verifies the OTP entered by the user.
     *
     * @param {Object} params
     * @param {string} params.phone - The phone number.
     * @param {string} params.otp - The OTP to verify.
     * @param {string} [params.countryCode="+91"] - The country code.
     * @returns {Promise<any>} - The promise returned by OTPless's verify method.
     *
     * @throws {Error} If OtpUtil is not initialized.
     */
    async verifyOtp({ phone, otp, countryCode = "+91" }) {
      if (!this.otpless) {
        throw new Error("OtpUtil not initialized. Call init() first.");
      }
      return await this.otpless.verify({
        channel: "PHONE",
        phone,
        otp,
        countryCode,
      });
    }
  }
  
  // Export a singleton instance so you can import it anywhere.
  const otpUtil = new OtpUtil();
  export default otpUtil;  