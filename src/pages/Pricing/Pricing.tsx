import { Tabs } from "antd";
import "./Pricing.scss";

const Pricing = () => {
  return (
    <section className="pricing">
      <div className="pricing__header">
        <h1>Choose Your Plan</h1>
        <p>
          Elevate your professional storytelling with AI-driven rehearsal and
          real-time feedback. Unlock more power as you scale.
        </p>
      </div>

      <Tabs
        centered
        defaultActiveKey="monthly"
        className="pricing__tabs"
        items={[
          {
            key: "monthly",
            label: "Monthly",
            children: <Plans price={19} />,
          },
          {
            key: "yearly",
            label: (
              <span>
                Yearly <em>Save 20%</em>
              </span>
            ),
            children: <Plans price={15} />,
          },
        ]}
      />

      <div className="pricing__note">
        Secure payment processing. Cancel anytime. No hidden fees.
      </div>
    </section>
  );
};

const Plans = ({ price }: { price: number }) => (
  <div className="pricing__grid">
    {/* FREE */}
    <div className="plan">
      <span className="plan__type">FREE</span>

      <div className="plan__price">
        $0<span>/mo</span>
      </div>

      <p className="plan__desc">
        Perfect for trying out AI-driven rehearsal.
      </p>

      <button className="plan__btn plan__btn--secondary">
        Start for Free
      </button>

      <ul className="plan__features">
        <li>3 Sessions / month</li>
        <li>Basic AI Analysis</li>
        <li>Email support</li>
      </ul>
    </div>

    {/* PRO */}
    <div className="plan plan--pro">
      <span className="plan__badge">BEST VALUE</span>
      <span className="plan__type">PRO</span>

      <div className="plan__price">
        ${price}<span>/mo</span>
      </div>

      <p className="plan__desc">
        For professionals who need the absolute best.
      </p>

      <button className="plan__btn plan__btn--primary">
        Upgrade to Pro
      </button>

      <ul className="plan__features">
        <li>Unlimited Sessions</li>
        <li>Advanced AI Deck Improvement</li>
        <li>Custom PPT Export</li>
        <li>Priority AI Processing</li>
        <li>24/7 Priority Support</li>
      </ul>
    </div>
  </div>
);

export default Pricing;
