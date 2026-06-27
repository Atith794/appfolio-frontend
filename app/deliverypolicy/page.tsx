export default function TermsPage() {
  return (
    <main className="min-h-screen bg-white text-black">
      <section className="mx-auto max-w-4xl px-6 py-16 md:px-8">
        <div className="mb-10">
          <p className="mb-3 text-sm font-medium text-gray-500 font-serif">
            Legal
          </p>

          <h1 className="text-4xl font-bold tracking-tight text-black font-serif md:text-5xl">
            Shipping Policy / Service Delivery Policy
          </h1>

          <p className="mt-4 text-sm text-gray-500 font-serif">
            Last updated: 27 June , 2026
          </p>
        </div>

        <div className="space-y-8 text-gray-700 leading-7 font-serif">
          <p>
           This Shipping Policy / Service Delivery Policy applies to purchases made on AppShelves.
          </p>

          <section>
            <h2 className="mb-3 text-2xl font-bold text-black">
              1. Digital Service
            </h2>

            <p>
              AppShelves is a digital software/service platform. We do not sell, ship, or deliver any physical products.
              All services are delivered electronically through the user’s AppShelves account.
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-2xl font-bold text-black">
              2. No Physical Shipping
            </h2>

            <p>
              Since AppShelves provides digital services, there are no shipping charges, courier services, tracking numbers, 
              or physical delivery timelines involved.
              Any reference to “shipping” should be understood as digital service delivery or account activation.
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-2xl font-bold text-black">
              3. Service Activation
            </h2>

            <p>
              After successful payment, the purchased plan or premium features are usually activated immediately or within a short period.
            </p>

            <p>In some cases, activation may be delayed due to:</p>

            <ul className="mt-4 list-disc space-y-2 pl-6">
              <li>Payment confirmation delays</li>
              <li>Payment gateway issues</li>
              <li>Bank or card network delays</li>
              <li>Technical issues on our platform</li>
              <li>Account verification or security checks</li>
            </ul>
            
            <p>If the paid features are not activated after successful payment, the user may contact us at [suport@appshelves.com] with the payment details.</p>

          </section>

          <section>
            <h2 className="mb-3 text-2xl font-bold text-black">
              4. Delivery Method
            </h2>

            <p>
              The service is delivered through the user’s registered AppShelves account. Users are responsible for ensuring that they provide correct login, email, and account information while using the platform.

              AppShelves is not responsible for delays caused by incorrect account details, payment failures, or issues with third-party payment providers.
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-2xl font-bold text-black">
              5. Service Availability
            </h2>

            <p>
              We try to keep AppShelves available and functional at all times. However, temporary interruptions may occur due to maintenance, updates, technical issues, hosting provider downtime, or events beyond our control.
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-2xl font-bold text-black">
              6. Contact Us
            </h2>

            <p>
              For service delivery or activation-related queries, please contact:

              AppShelves Support
              Email: [suport@appshelves.com]
            </p>
          </section>
        </div>
      </section>
    </main>
  );
}