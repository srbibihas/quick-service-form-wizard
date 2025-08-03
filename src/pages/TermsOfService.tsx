import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';

const TermsOfService = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="mb-6">
          <Link to="/">
            <Button variant="ghost" className="mb-4">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Home
            </Button>
          </Link>
          <h1 className="text-3xl font-bold text-gray-900">Terms of Service</h1>
          <p className="text-gray-600 mt-2">Last updated: {new Date().toLocaleDateString()}</p>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-8 space-y-6">
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">1. Acceptance of Terms</h2>
            <p className="text-gray-700">
              By accessing and using our digital services platform, you accept and agree to 
              be bound by the terms and provision of this agreement. If you do not agree to 
              abide by the above, please do not use this service.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">2. Service Description</h2>
            <p className="text-gray-700">
              We provide digital services including but not limited to web development, 
              design, consulting, and related technology services. All services are provided 
              as described in your service agreement and are subject to these terms.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">3. Payment Terms</h2>
            <div className="text-gray-700 space-y-3">
              <p>
                All payments are processed through PayPal, a secure third-party payment processor. 
                By making a payment, you agree to PayPal's terms of service and privacy policy.
              </p>
              <ul className="list-disc pl-6 space-y-1">
                <li>Payment is required before service delivery begins</li>
                <li>All fees are non-refundable unless otherwise specified</li>
                <li>Prices are in USD and include all applicable taxes</li>
                <li>Payment disputes must be resolved through PayPal's dispute resolution process</li>
              </ul>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">4. Refund Policy</h2>
            <div className="text-gray-700 space-y-3">
              <p>We offer refunds under the following conditions:</p>
              <ul className="list-disc pl-6 space-y-1">
                <li>Service cancellation within 24 hours of booking (full refund)</li>
                <li>Service not delivered as promised (partial or full refund at our discretion)</li>
                <li>Technical issues preventing service delivery (full refund)</li>
                <li>Refund requests must be submitted within 30 days of payment</li>
              </ul>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">5. User Responsibilities</h2>
            <div className="text-gray-700">
              <p className="mb-3">You agree to:</p>
              <ul className="list-disc pl-6 space-y-1">
                <li>Provide accurate and complete information</li>
                <li>Maintain the confidentiality of your account</li>
                <li>Use the service for lawful purposes only</li>
                <li>Respect intellectual property rights</li>
                <li>Comply with all applicable laws and regulations</li>
              </ul>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">6. Intellectual Property</h2>
            <p className="text-gray-700">
              Upon full payment, you will own the rights to the delivered work product. 
              However, we retain the right to use general methodologies, know-how, and 
              techniques developed during the provision of services for future projects.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">7. Limitation of Liability</h2>
            <p className="text-gray-700">
              Our liability is limited to the amount paid for the specific service. We are 
              not liable for any indirect, incidental, special, or consequential damages 
              arising from the use of our services.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">8. Service Delivery</h2>
            <div className="text-gray-700 space-y-3">
              <p>Service delivery timelines are estimates and may vary based on:</p>
              <ul className="list-disc pl-6 space-y-1">
                <li>Project complexity and scope</li>
                <li>Client responsiveness and feedback</li>
                <li>Technical requirements and third-party dependencies</li>
                <li>Force majeure events beyond our control</li>
              </ul>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">9. Privacy and Data Protection</h2>
            <p className="text-gray-700">
              Your privacy is important to us. Please review our Privacy Policy, which 
              also governs your use of the service, to understand our practices.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">10. Dispute Resolution</h2>
            <p className="text-gray-700">
              Any disputes arising from these terms will be resolved through binding 
              arbitration in accordance with the rules of the American Arbitration Association. 
              For payment disputes, PayPal's dispute resolution process applies.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">11. Termination</h2>
            <p className="text-gray-700">
              We may terminate or suspend your access to our service immediately, without 
              prior notice, for conduct that we believe violates these terms or is harmful 
              to other users, us, or third parties.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">12. Changes to Terms</h2>
            <p className="text-gray-700">
              We reserve the right to modify these terms at any time. We will provide 
              notice of material changes. Your continued use of the service after such 
              modifications constitutes acceptance of the updated terms.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">13. Contact Information</h2>
            <p className="text-gray-700">
              If you have any questions about these Terms of Service, please contact us 
              at support@yourdomain.com or through our contact form.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
};

export default TermsOfService;