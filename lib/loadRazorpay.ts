declare global {
  interface RazorpayPaymentResponse {
    razorpay_payment_id: string;
    razorpay_order_id: string;
    razorpay_signature: string;
  }

  interface RazorpayPaymentFailedResponse {
    error?: {
      description?: string;
    };
  }

  interface RazorpayCheckoutOptions {
    key: string;
    amount: number;
    currency: string;
    order_id: string;
    name: string;
    description: string;
    modal?: {
      ondismiss?: () => void;
    };
    handler: (response: RazorpayPaymentResponse) => void | Promise<void>;
  }

  interface RazorpayCheckoutInstance {
    open: () => void;
    on: (
      event: "payment.failed",
      handler: (response: RazorpayPaymentFailedResponse) => void,
    ) => void;
  }

  interface Window {
    Razorpay?: new (
      options: RazorpayCheckoutOptions,
    ) => RazorpayCheckoutInstance;
  }
}

export function loadRazorpay(): Promise<boolean> {
  return new Promise((resolve) => {
    if (typeof window === "undefined") return resolve(false);
    if (window.Razorpay) return resolve(true);

    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
}

export {};
