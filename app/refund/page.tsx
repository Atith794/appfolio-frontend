export default function RefundPage() {
  return (
    <main className="min-h-screen bg-white text-black">
      <section className="mx-auto max-w-4xl px-6 py-16 md:px-8">
        <div className="mb-10">
          <p className="mb-3 text-sm font-medium text-gray-500 font-serif">
            Refund & Cancellation
          </p>

          <h1 className="text-4xl font-bold tracking-tight text-black font-serif md:text-5xl">
            Refund & Cancellation
          </h1>

          <p className="mt-4 text-sm text-gray-500 font-serif">
            Last updated: June 27, 2026
          </p>
        </div>

        <div className="space-y-8 text-gray-700 leading-7 font-serif">
          <p>
            This Refund and Cancellation Policy applies to purchases made on AppShelves through our website, app, or payment partners.
          </p>

          <section>
            <h2 className="mb-3 text-2xl font-bold text-black">
              1. Digital Product
            </h2>

            <p>
              AppShelves is a digital software/service platform. Our paid plans provide access to premium digital features, tools, 
              and account-based services. No physical product is sold or shipped.
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-2xl font-bold text-black">
              2. Subscription Cancellation
            </h2>

            <p>
              Users may cancel their paid subscription at any time from their account settings, billing page, or by contacting us at [suport@appshelves.com].

              After cancellation, the subscription will remain active until the end of the current billing period. Once the billing period ends, the account 
              will be moved to the free plan or access to paid features may be restricted.

              Cancellation does not automatically provide a refund for the current billing cycle unless required by applicable law or approved by AppShelves.
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-2xl font-bold text-black">
              3. Refund Eligibility
            </h2>

            <p>
              Since AppShelves provides digital services that are activated immediately after payment, payments are generally non-refundable.
            </p>

            <p>
              However, we may consider refunds in the following cases:
            </p>

            <ul className="mt-4 list-disc space-y-2 pl-6">
              <li>The payment was charged more than once for the same subscription.</li>
              <li>The paid features were not activated due to a technical issue from our side.</li>
              <li>The user was charged after successful cancellation due to a system or billing error..</li>
              <li>Any other case where AppShelves determines that a refund is reasonable.</li>
            </ul>

             <p>
              Refund requests must be submitted within 7 days of the payment date.
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-2xl font-bold text-black">
              4. Non-Refundable Cases
            </h2>

            <p>
              Refunds may not be provided in the following cases:
            </p>
            <ul className="mt-4 list-disc space-y-2 pl-6">
              <li>The user changed their mind after purchasing.</li>
              <li>The user did not use the service after payment.</li>
              <li>The user forgot to cancel before the renewal date.</li>
              <li>The user violated our Terms and Conditions.</li>
              <li>The user purchased the wrong plan due to incorrect information provided by them.</li>
            </ul>
          </section>

          <section>
            <h2 className="mb-3 text-2xl font-bold text-black">
              5. Refund Processing Time
            </h2>

            <p>
              If a refund is approved, it will be processed to the original payment method. 
              The refund timeline may depend on the payment provider, bank, card network, or 
              wallet provider. Typically, refunds may take 5–10 business days to reflect in 
              the user’s account.
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-2xl font-bold text-black">
              6. Failed or Pending Payments
            </h2>

            <p>
              If a payment fails but the amount is deducted from the user’s account, the amount 
              is usually reversed automatically by the payment provider or bank. If the amount is not reversed within the expected time, the user may contact us with the payment details.
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-2xl font-bold text-black">
              7. Contact Us
            </h2>

            <p>For cancellation or refund-related queries, please contact:</p>

            <p className="mt-4">
              AppShelves Support
              Email: [suport@appshelves.com]
            </p>
          </section>
        </div>
      </section>
    </main>
  );
}