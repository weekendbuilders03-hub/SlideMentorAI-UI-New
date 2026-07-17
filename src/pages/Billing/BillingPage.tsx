import React from 'react';
import Button from '../../components/common/Button/Button';
import styles from './Billing.module.scss';

const INVOICES = [
  { date: 'Oct 1, 2023', desc: 'Pro Plan — October 2023', amount: '$24.00' },
  { date: 'Sep 1, 2023', desc: 'Pro Plan — September 2023', amount: '$24.00' },
  { date: 'Aug 1, 2023', desc: 'Pro Plan — August 2023', amount: '$24.00' },
];

const BillingPage: React.FC = () => (
  <>
    <div className={styles.grid}>
      {/* Current plan */}
      <div className={styles.card}>
        <div className={styles.cardH}>Current plan</div>
        <div className={styles.planRow}>
          <div>
            <div className={styles.planName}>Pro</div>
            <div className={styles.planPrice}>$24 / month · renews Nov 1, 2023</div>
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            <Button variant="secondary" size="sm" id="change-plan-btn">Change</Button>
            <Button variant="danger" size="sm" id="cancel-plan-btn">Cancel</Button>
          </div>
        </div>
      </div>

      {/* Payment method */}
      <div className={styles.card}>
        <div className={styles.cardH}>Payment method</div>
        <div className={styles.payRow}>
          <div className={styles.cardIcon}>VISA</div>
          <div>
            <div className={styles.cardDetailName}>Visa ending in 4242</div>
            <div className={styles.cardDetailSub}>Expires 09/26</div>
          </div>
          <Button variant="secondary" size="sm" style={{ marginLeft: 'auto' }} id="update-payment-btn">
            Update
          </Button>
        </div>
      </div>
    </div>

    {/* Invoice table */}
    <div className={styles.invoiceTable}>
      <div className={styles.invoiceRow} style={{ background: 'var(--surface-sunken)' }}>
        <div className={styles.invoiceDate}>Date</div>
        <div className={styles.invoiceDesc}>Description</div>
        <div className={styles.invoiceAmt}>Amount</div>
        <div className={styles.invoiceDl}>Receipt</div>
      </div>
      {INVOICES.map((inv) => (
        <div key={inv.date} className={styles.invoiceRow}>
          <div className={styles.invoiceDate}>{inv.date}</div>
          <div className={styles.invoiceDesc}>{inv.desc}</div>
          <div className={styles.invoiceAmt}>{inv.amount}</div>
          <div className={styles.invoiceDl} id={`dl-${inv.date.replace(/\s/g, '-')}`}>Download</div>
        </div>
      ))}
    </div>
  </>
);

export default BillingPage;
