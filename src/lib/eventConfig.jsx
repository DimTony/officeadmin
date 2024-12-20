export const eventConfig = {
  "email-verification": {
    continue: {
      nextStep: "1",
      message: "",
    },
    cancel: {
      nextStep: "0",
      message: "We cannot authenticate you using that username.",
    },
  },
  "password-submission": {
    continue: {
      nextStep: "2",
      message: "",
    },
    cancel: {
      nextStep: "1",
      message: "Invalid password. Please try again.",
    },
  },
  "authenticator-select": {
    continue: {
      isVerifying: false,
      nextStep: "7",
    },
    authenticate: {
      isVerifying: true,
      nextStep: "3",
      message: "",
      action: "COMPLETE_AUTH",
    },
    cancel: {
      nextStep: "2",
      message:
        "Authentication failed. Please try again or choose another method.",
      action: "RESET_2FA",
    },
  },
  "verifycode-select": {
    continue: {
      isVerifying: false,
      nextStep: "8",
    },
    verify: {
      nextStep: "4",
      message: "",
      action: "PROCEED_TO_FINAL",
    },
    cancel: {
      nextStep: "4",
      message: "Invalid code. Please try again.",
      action: "RESET_CODE",
    },
  },
  "verify-click": {
    continue: {
      isVerifying: false,
      nextStep: "7",
    },
    cancel: {
      nextStep: "4",
      message: "Invalid code. Please try again.",
      action: "RESET_CODE",
    },
  },

  "text-select": {
    continue: {
      isVerifying: false,
      nextStep: "7",
    },
    approve: {
      nextStep: "5",
      message: "",
      action: "PROCEED_TO_FINAL",
    },
    cancel: {
      nextStep: "4",
      message: "Error sending verification code. Try again.",
      action: "RESET_CODE",
    },
  },
  "text-click": {
    continue: {
      isVerifying: false,
      nextStep: "7",
    },
    cancel: {
      nextStep: "4",
      message: "Invalid code. Please try again.",
      action: "RESET_CODE",
    },
  },
  "call-select": {
    continue: {
      isVerifying: false,
      nextStep: "7",
    },
    call: {
      nextStep: "6",
      message: "",
      action: "PROCEED_TO_FINAL",
    },
    cancel: {
      nextStep: "4",
      message: "Error sending verification code. Try again.",
      action: "RESET_CODE",
    },
  },
  // "phone-verification": {
  //   continue: {
  //     nextStep: "7",
  //     message: "Phone verification successful",
  //     action: "PROCEED_TO_FINAL",
  //   },
  //   cancel: {
  //     nextStep: "2",
  //     message: "Phone verification failed. Please try another method.",
  //     action: "RESET_PHONE",
  //   },
  // },
};
