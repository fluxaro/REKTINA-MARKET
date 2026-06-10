import { 
  FiShield, FiTrendingUp, FiGift, FiAlertTriangle, FiUserCheck, 
  FiSlash, FiCreditCard, FiSettings, FiLock, FiInfo, FiAlertCircle, FiCheck
} from 'react-icons/fi';

export default function PolicyDocument() {
  const sections = [
    {
      id: 'pricing',
      title: '1. Pricing & Subscription Plans',
      icon: FiCreditCard,
      color: 'text-blue-600',
      content: (
        <div className="space-y-4">
          <p className="text-xs text-gray-500 leading-relaxed">
            Rektina Market operates on a subscription-based model. All users receive a free trial period upon registration. Continued access requires an active subscription.
          </p>
          <div className="overflow-x-auto rounded-xl border border-gray-100">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-gray-50 text-gray-400 font-bold uppercase tracking-wider border-b border-gray-100">
                  <th className="p-3">Plan</th>
                  <th className="p-3">Duration</th>
                  <th className="p-3">Price</th>
                  <th className="p-3">Savings</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-gray-700">
                <tr>
                  <td className="p-3 font-semibold text-gray-900">Monthly</td>
                  <td className="p-3">1 Month</td>
                  <td className="p-3 font-bold">₦1,850</td>
                  <td className="p-3 text-gray-400">—</td>
                </tr>
                <tr className="bg-blue-50/20">
                  <td className="p-3 font-semibold text-blue-600">Semester</td>
                  <td className="p-3">5 Months</td>
                  <td className="p-3 font-bold text-blue-600">₦8,500</td>
                  <td className="p-3 font-semibold text-emerald-600">Save ~₦750</td>
                </tr>
                <tr>
                  <td className="p-3 font-semibold text-purple-600">Full Session</td>
                  <td className="p-3">10 Months</td>
                  <td className="p-3 font-bold text-purple-600">₦15,900</td>
                  <td className="p-3 font-semibold text-emerald-600">Save ~₦2,600</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="space-y-2">
            <h4 className="text-xs font-bold text-gray-900">1.2 Free Trial Guidelines</h4>
            <ul className="list-disc pl-5 text-xs text-gray-500 space-y-1">
              <li>Every new member receives a 2-week free trial upon registration — no payment required upfront.</li>
              <li>Trial users have full access to platform features during the trial period.</li>
              <li>A reminder notification is sent on Day 10, Day 13, and Day 14 prompting conversion to a paid plan.</li>
              <li>Failure to subscribe after the trial ends will result in account restriction until a plan is activated.</li>
            </ul>
          </div>

          <div className="space-y-2">
            <h4 className="text-xs font-bold text-gray-900">1.3 Billing Principles</h4>
            <ul className="list-disc pl-5 text-xs text-gray-500 space-y-1">
              <li>Billing is aligned to semester and session cycles to match the academic calendar.</li>
              <li>Users will receive a renewal reminder 5 days before their subscription period ends.</li>
              <li>No automatic renewal occurs without prior notification and user confirmation.</li>
              <li>Subscriptions can be cancelled at any time — access continues until the end of the paid period.</li>
            </ul>
          </div>
        </div>
      )
    },
    {
      id: 'uvea',
      title: '2. Uvea — Transaction Oversight Feature',
      icon: FiShield,
      color: 'text-blue-600',
      content: (
        <div className="space-y-4">
          <div className="p-3 bg-blue-50/50 border border-blue-100 rounded-xl text-xs text-blue-800 italic">
            "Secure Your Deals With Uvea"
          </div>
          <p className="text-xs text-gray-500 leading-relaxed">
            Uvea is Rektina Market's built-in transaction oversight feature. It acts as a neutral intermediary that holds funds securely until both parties confirm a transaction is complete. Use of Uvea is optional but strongly recommended for all high-value transactions.
          </p>
          <div className="space-y-2 text-xs text-gray-500 leading-relaxed">
            <p><strong className="text-gray-900">2.1 How Uvea Works:</strong></p>
            <ul className="list-decimal pl-5 space-y-1">
              <li>Buyer initiates payment through Uvea — funds are held securely in escrow.</li>
              <li>Seller fulfils the order (delivers physical item or completes service).</li>
              <li>Buyer confirms receipt and satisfaction — Uvea releases funds to the seller.</li>
              <li>If the buyer raises a dispute, funds are frozen immediately pending resolution.</li>
              <li>Buyer must confirm or dispute within 48 hours of delivery. Silence after 48 hours auto-releases funds to the seller.</li>
            </ul>
          </div>

          <div className="space-y-2">
            <p className="text-xs font-bold text-gray-900">2.2 Uvea Fee Structure</p>
            <p className="text-xs text-gray-400">
              A blended, graduated fee model is used to prevent gaming of the threshold:
            </p>
            <div className="overflow-x-auto rounded-xl border border-gray-100 mt-2">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-gray-50 text-gray-400 font-bold uppercase border-b border-gray-100">
                    <th className="p-3">Transaction Value</th>
                    <th className="p-3">Fee Rate</th>
                    <th className="p-3">Application Model</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 text-gray-700">
                  <tr>
                    <td className="p-3 font-semibold">₦9,999 and below</td>
                    <td className="p-3 text-blue-600 font-bold">3.2%</td>
                    <td className="p-3">Applied to full transaction amount</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-semibold">₦10,000 and above</td>
                    <td className="p-3 text-blue-600 font-bold">5.6%</td>
                    <td className="p-3">3.2% on first ₦9,999 + 5.6% on remainder</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div className="p-3 bg-gray-50 rounded-xl text-[11px] text-gray-500">
              <strong>Example calculation:</strong> A ₦15,000 transaction = (₦10,000 × 3.2%) + (₦5,000 × 5.6%) = ₦320 + ₦280 = ₦600 total Uvea fee.
            </div>
          </div>
        </div>
      )
    },
    {
      id: 'referrals',
      title: '3. Referral Programme',
      icon: FiGift,
      color: 'text-emerald-500',
      content: (
        <div className="space-y-4">
          <p className="text-xs text-gray-500 leading-relaxed">
            Rektina Market operates an activity-based referral system. Rewards are only activated when referred users complete genuine transactions — ensuring platform liquidity and filtering inactive accounts.
          </p>

          <div className="overflow-x-auto rounded-xl border border-gray-100">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-gray-50 text-gray-400 font-bold uppercase border-b border-gray-100">
                  <th className="p-3">Referred User Type</th>
                  <th className="p-3">Activation Condition</th>
                  <th className="p-3">Reward to Referrer</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-gray-700">
                <tr>
                  <td className="p-3 font-semibold">Vendor (Seller)</td>
                  <td className="p-3 text-gray-500">Must complete at least 1 sale</td>
                  <td className="p-3 font-bold text-emerald-600">1 free week of premium</td>
                </tr>
                <tr>
                  <td className="p-3 font-semibold">Buyer</td>
                  <td className="p-3 text-gray-500">Must complete at least 1 purchase</td>
                  <td className="p-3 font-bold text-emerald-600">1 free week of premium</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="space-y-2 text-xs text-gray-500 space-y-1">
            <p><strong className="text-gray-900">3.2 Referral Terms:</strong></p>
            <ul className="list-disc pl-5 space-y-1">
              <li>Referred users must complete their qualifying transaction within 30 days of joining, or the referral expires.</li>
              <li>Invite 4 people who each complete their qualifying transaction = 1 free week added to your subscription.</li>
              <li>There is no cap on the number of referral rewards a user can earn.</li>
              <li>Referral progress is visible in the user dashboard (e.g. '3 of 4 invites completed').</li>
              <li>Rektina reserves the right to void referrals suspected of being fraudulent or self-referral abuse.</li>
            </ul>
          </div>
        </div>
      )
    },
    {
      id: 'disputes',
      title: '4. Uvea Dispute Resolution Policy',
      icon: FiAlertTriangle,
      color: 'text-amber-500',
      content: (
        <div className="space-y-4">
          <p className="text-xs text-gray-500 leading-relaxed">
            When a dispute is raised on a Uvea-protected transaction, Rektina Market acts as a neutral mediator. The following process governs all dispute resolution:
          </p>

          <div className="space-y-2">
            <h4 className="text-xs font-bold text-gray-900">4.1 Dispute Process</h4>
            <div className="grid grid-cols-1 gap-2 text-xs text-gray-600">
              <div className="p-2 bg-gray-50 rounded-lg"><span className="font-bold text-blue-600">Step 1:</span> Buyer raises a dispute — Uvea immediately freezes funds.</div>
              <div className="p-2 bg-gray-50 rounded-lg"><span className="font-bold text-blue-600">Step 2:</span> Both parties are notified and given 48–72 hours to submit evidence.</div>
              <div className="p-2 bg-gray-50 rounded-lg"><span className="font-bold text-blue-600">Step 3:</span> Rektina Support Team reviews all submitted evidence.</div>
              <div className="p-2 bg-gray-50 rounded-lg"><span className="font-bold text-blue-600">Step 4:</span> A resolution is issued within 5 business days of evidence submission.</div>
              <div className="p-2 bg-gray-50 rounded-lg"><span className="font-bold text-blue-600">Step 5:</span> Funds are released or refunded based on the ruling.</div>
            </div>
          </div>

          <div className="space-y-2">
            <h4 className="text-xs font-bold text-gray-900">4.2 Resolution Outcomes</h4>
            <div className="overflow-x-auto rounded-xl border border-gray-100">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-gray-50 text-gray-400 font-bold uppercase border-b border-gray-100">
                    <th className="p-3">Situation</th>
                    <th className="p-3">Outcome</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 text-gray-700">
                  <tr>
                    <td className="p-3 font-medium">Seller delivers as described</td>
                    <td className="p-3 text-emerald-600 font-semibold">Funds released to seller</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-medium">Item or service not delivered</td>
                    <td className="p-3 text-red-600 font-semibold">Full refund to buyer</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-medium">Partial delivery or quality issue</td>
                    <td className="p-3 text-blue-600 font-semibold">Negotiated split or partial refund</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-medium">Both parties unresponsive after 7 days</td>
                    <td className="p-3 text-gray-500 font-semibold">Escalated to senior review; funds held</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-medium">False dispute raised by buyer</td>
                    <td className="p-3 text-emerald-600 font-semibold">Dispute dismissed; funds released to seller</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <div className="space-y-2">
            <h4 className="text-xs font-bold text-gray-900">4.3 Strike System</h4>
            <div className="overflow-x-auto rounded-xl border border-gray-100">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-gray-50 text-gray-400 font-bold uppercase border-b border-gray-100">
                    <th className="p-3">Disputes Lost</th>
                    <th className="p-3">Consequence</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 text-gray-700">
                  <tr className="bg-amber-50/20">
                    <td className="p-3 font-semibold text-amber-600">2 Disputes Lost</td>
                    <td className="p-3">Official warning issued</td>
                  </tr>
                  <tr className="bg-red-50/20">
                    <td className="p-3 font-semibold text-red-500">3 Disputes Lost</td>
                    <td className="p-3 font-semibold text-red-600">Account suspended pending review</td>
                  </tr>
                  <tr className="bg-red-100/30">
                    <td className="p-3 font-black text-red-700">5 Disputes Lost</td>
                    <td className="p-3 font-black text-red-700">Permanent account ban</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-xs text-amber-800 flex gap-2">
              <FiAlertCircle className="shrink-0 mt-0.5" />
              <span><strong>Note:</strong> Transactions above ₦50,000 always require manual human review regardless of circumstances.</span>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 'accountability',
      title: '5. Seller & Buyer Accountability Policy',
      icon: FiUserCheck,
      color: 'text-indigo-600',
      content: (
        <div className="space-y-4 text-xs text-gray-500 leading-relaxed">
          <div>
            <h4 className="font-bold text-gray-900 mb-1">5.1 Seller Obligations</h4>
            <ul className="list-disc pl-5 space-y-1">
              <li>Verify university email before creating any listing.</li>
              <li>Post accurate descriptions and real photos for all physical items.</li>
              <li>Deliver within the agreed timeframe stated on the listing.</li>
              <li>Respond to buyer messages within 24 hours.</li>
              <li>Not list an item across multiple platforms while under an active Uvea hold.</li>
              <li>Honor the price listed at time of buyer commitment.</li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-gray-900 mb-1">5.2 Buyer Obligations</h4>
            <ul className="list-disc pl-5 space-y-1">
              <li>Confirm or dispute delivery within 48 hours of receiving — silence auto-releases funds to seller.</li>
              <li>Not raise false or malicious disputes — evidence of abuse leads to immediate suspension.</li>
              <li>Communicate respectfully and professionally with sellers.</li>
              <li>Uvea is strongly recommended for all transactions above ₦10,000.</li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-gray-900 mb-1">5.3 Reputation & Badge System</h4>
            <div className="overflow-x-auto rounded-xl border border-gray-100 mt-2">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-gray-50 text-gray-400 font-bold uppercase border-b border-gray-100">
                    <th className="p-3">Badge / Status</th>
                    <th className="p-3">Requirement</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 text-gray-700">
                  <tr>
                    <td className="p-3 font-semibold text-gray-900">Verified User</td>
                    <td className="p-3">University email confirmed</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-semibold text-blue-600">Trusted Seller/Buyer</td>
                    <td className="p-3">10+ successful transactions</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-semibold text-purple-600">Top Seller</td>
                    <td className="p-3">50+ transactions with 4.5+ star rating</td>
                  </tr>
                  <tr className="bg-red-50/20">
                    <td className="p-3 font-semibold text-red-600">Flagged Account</td>
                    <td className="p-3 text-red-600">Rating drops below 3.0 average</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 'prohibited',
      title: '6. Prohibited Items & Services Policy',
      icon: FiSlash,
      color: 'text-red-500',
      content: (
        <div className="space-y-4">
          <div className="p-3.5 bg-red-50 border border-red-100 text-xs rounded-xl text-red-800 space-y-2">
            <p className="font-bold flex items-center gap-1.5">
              <FiSlash className="shrink-0" /> 6.1 Strictly Banned — Instant Account Termination
            </p>
            <ul className="list-disc pl-5 space-y-1">
              <li>Alcohol, tobacco, or controlled substances of any kind</li>
              <li>Prescription medication</li>
              <li>Weapons or items capable of causing physical harm</li>
              <li>Stolen, counterfeit, or pirated goods</li>
              <li>Explicit or adult content</li>
              <li>Personal data, login credentials, or hacked accounts</li>
              <li>Completed assignments, essays, or exam answers for academic submission</li>
              <li>Impersonation services (sitting exams or completing coursework on behalf of another)</li>
              <li>Leaked exam questions or answer scripts</li>
            </ul>
          </div>

          <div className="p-3.5 bg-emerald-50/30 border border-emerald-100/30 text-xs rounded-xl text-emerald-800 space-y-2">
            <p className="font-bold flex items-center gap-1.5 text-emerald-700">
              <FiCheck className="shrink-0 text-emerald-600" /> 6.2 Allowed but Monitored
            </p>
            <ul className="list-disc pl-5 space-y-1 text-emerald-950">
              <li>Tutoring and academic coaching</li>
              <li>Lecture note summaries (original work only)</li>
              <li>Past questions (publicly available materials only)</li>
              <li>Freelance design, tech, and creative services</li>
              <li>Used textbooks, gadgets, furniture, and clothing</li>
              <li>Digital goods (templates, original digital products)</li>
            </ul>
          </div>

          <div className="space-y-2">
            <h4 className="text-xs font-bold text-gray-900">6.3 Violation Consequences</h4>
            <div className="overflow-x-auto rounded-xl border border-gray-100">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-gray-50 text-gray-400 font-bold uppercase border-b border-gray-100">
                    <th className="p-3">Offence</th>
                    <th className="p-3">Consequence</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 text-gray-700">
                  <tr>
                    <td className="p-3 font-semibold">First offence</td>
                    <td className="p-3">Warning issued + listing removed within 24 hours</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-semibold">Second offence</td>
                    <td className="p-3">30-day account suspension</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-semibold">Third offence</td>
                    <td className="p-3 text-red-600">Permanent ban from Rektina Market</td>
                  </tr>
                  <tr className="bg-red-50/30">
                    <td className="p-3 font-bold text-red-700">Severe violation (banned items)</td>
                    <td className="p-3 font-bold text-red-700">Immediate permanent ban; no warning</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 'refunds',
      title: '7. Subscription & Refund Policy',
      icon: FiCreditCard,
      color: 'text-blue-600',
      content: (
        <div className="space-y-4">
          <div className="overflow-x-auto rounded-xl border border-gray-100 text-xs">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50 text-gray-400 font-bold uppercase border-b border-gray-100">
                  <th className="p-3">Plan</th>
                  <th className="p-3">Price</th>
                  <th className="p-3">Duration</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-gray-700">
                <tr>
                  <td className="p-3 font-semibold">Monthly</td>
                  <td className="p-3 font-bold">₦1,850</td>
                  <td className="p-3">1 Month</td>
                </tr>
                <tr>
                  <td className="p-3 font-semibold">Semester</td>
                  <td className="p-3 font-bold">₦8,500</td>
                  <td className="p-3">5 Months (~8% discount)</td>
                </tr>
                <tr>
                  <td className="p-3 font-semibold">Full Session</td>
                  <td className="p-3 font-bold">₦15,900</td>
                  <td className="p-3">10 Months (~14% discount)</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="space-y-2">
            <h4 className="text-xs font-bold text-gray-900">7.2 Refund Rules</h4>
            <div className="overflow-x-auto rounded-xl border border-gray-100">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-gray-50 text-gray-400 font-bold uppercase border-b border-gray-100">
                    <th className="p-3">Situation</th>
                    <th className="p-3">Refund Outcome</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 text-gray-700">
                  <tr>
                    <td className="p-3">Cancel within 48 hours of subscribing</td>
                    <td className="p-3 text-emerald-600 font-semibold">Full refund issued</td>
                  </tr>
                  <tr>
                    <td className="p-3">Cancel after 48 hours</td>
                    <td className="p-3">No refund — access continues to end of period</td>
                  </tr>
                  <tr>
                    <td className="p-3">Billing error or double charge</td>
                    <td className="p-3 text-emerald-600 font-semibold">Full refund within 5 business days</td>
                  </tr>
                  <tr className="bg-red-50/20 text-red-700">
                    <td className="p-3">Account suspended for policy violation</td>
                    <td className="p-3 font-semibold">No refund</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <div className="space-y-2 text-xs text-gray-500">
            <h4 className="font-bold text-gray-900">7.3 Cancellation Terms</h4>
            <ul className="list-disc pl-5 space-y-1">
              <li>Users may cancel their subscription at any time with no penalty.</li>
              <li>Upon cancellation, access remains active until the end of the current billing period.</li>
              <li>Rektina will send a renewal reminder 5 days before any subscription period ends.</li>
              <li>No automatic renewal occurs without prior notification.</li>
            </ul>
          </div>
        </div>
      )
    },
    {
      id: 'rules',
      title: '8. Universal Platform Rules',
      icon: FiSettings,
      color: 'text-gray-600',
      content: (
        <ul className="list-disc pl-5 text-xs text-gray-500 space-y-2 leading-relaxed">
          <li>All users must agree to these policies at the point of account registration.</li>
          <li>Rektina LLC reserves the right to update any policy with a minimum of 7 days' notice to all users.</li>
          <li>Continued use of the platform following a policy update constitutes acceptance of the revised terms.</li>
          <li>All disputes and legal matters are governed under <strong className="text-gray-800">Nigerian law</strong>.</li>
          <li>Rektina Market operates under Rektina LLC — the parent company of all Rektina products.</li>
          <li>Users found to be operating multiple accounts to abuse policies or referrals will be permanently banned.</li>
          <li>Rektina reserves the right to suspend or terminate any account that poses a risk to platform integrity.</li>
        </ul>
      )
    },
    {
      id: 'privacy',
      title: '9. Privacy Policy',
      icon: FiLock,
      color: 'text-blue-600',
      content: (
        <div className="space-y-3 text-xs text-gray-500 leading-relaxed">
          <div>
            <h4 className="font-bold text-gray-900 mb-1">9.1 Information We Collect</h4>
            <p>
              To maintain the integrity of our student-only community, we collect your verified university email address (.edu), phone number, and physical campus location coordinates.
            </p>
          </div>
          <div>
            <h4 className="font-bold text-gray-900 mb-1">9.2 Escrow & Payment Protection</h4>
            <p>
              When transacting via Uvea, billing details are transmitted directly to our secure payment gateway providers (Flutterwave/Paystack). We do not store credit card or financial passwords directly on our servers.
            </p>
          </div>
          <div>
            <h4 className="font-bold text-gray-900 mb-1">9.3 Data Security & Disclosures</h4>
            <p>
              Peer contact details (e.g. phone number) are only displayed to the matching buyer/seller after a transaction has been confirmed or escrow has been initialized, to facilitate handoffs. We never sell your data to third parties.
            </p>
          </div>
          <div className="p-3 bg-blue-50/50 rounded-xl text-[11px] text-blue-900 font-medium">
            Rektina Market complies with the Nigeria Data Protection Regulation (NDPR) to guarantee secure processing of all member information.
          </div>
        </div>
      )
    }
  ];

  return (
    <div className="space-y-6">
      {sections.map((section) => {
        const Icon = section.icon;
        return (
          <div key={section.id} className="p-4 rounded-2xl border border-gray-100 bg-white shadow-sm space-y-3">
            <h3 className="text-xs font-bold text-gray-900 flex items-center gap-2">
              <Icon className={`shrink-0 ${section.color}`} size={16} />
              {section.title}
            </h3>
            <div className="pl-6 border-l border-gray-100">
              {section.content}
            </div>
          </div>
        );
      })}
      
      <div className="text-center pt-4 border-t border-gray-100 text-[10px] text-gray-400 font-medium space-y-1">
        <p>© 2025 Rektina LLC. All rights reserved. This document is confidential and intended for internal use only.</p>
        <p>Rektina Market • Powered by Uvea • rektina.com</p>
      </div>
    </div>
  );
}
