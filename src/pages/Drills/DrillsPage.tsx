import React, { useState } from 'react';
import Button from '../../components/common/Button/Button';
import { cn } from '../../utils/cn';
import styles from './Drills.module.scss';

const PLAN_ITEMS = [
  { num: 1, name: 'Filler Word Elimination', sub: 'Replace "um" and "uh" with confident pauses', time: '8 min' },
  { num: 2, name: 'Pacing Control', sub: 'Stay under 155 wpm on complex slides', time: '10 min' },
  { num: 3, name: 'Emphasis Mapping', sub: 'Stress one key word per sentence', time: '7 min' },
];

const CATEGORIES = [
  {
    id: 'cat1', glyph: '✂️', title: 'Filler Word Drills', sub: 'Eliminate "um", "uh", "like"',
    drills: [
      { id: 'd1', name: 'Cold Start', time: '5 min', level: 'Beginner', desc: 'Record 30 seconds with zero fillers.' },
      { id: 'd2', name: 'Slide Transition', time: '8 min', level: 'Intermediate', desc: 'Practise moving between slides without fillers.' },
    ],
  },
  {
    id: 'cat2', glyph: '🎯', title: 'Pacing Drills', sub: 'Find your ideal speaking rate',
    drills: [
      { id: 'd3', name: 'Slow Burn', time: '6 min', level: 'Beginner', desc: 'Deliver a dense slide at under 130 wpm.' },
      { id: 'd4', name: 'Metronome', time: '10 min', level: 'Advanced', desc: 'Match pacing to a ticking guide.' },
    ],
  },
];

const DrillsPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'plan' | 'drills'>('plan');

  return (
    <>
      <div className="filter-tabs" style={{ marginBottom: 24, display: 'inline-flex' }}>
        {(['plan', 'drills'] as const).map((tab) => (
          <button key={tab} id={`drills-tab-${tab}`}
            className={cn('filter-tab', activeTab === tab ? 'active' : undefined)}
            onClick={() => setActiveTab(tab)}>
            {tab === 'plan' ? 'Today\'s Plan' : 'All Drills'}
          </button>
        ))}
      </div>

      {activeTab === 'plan' && (
        <div className={styles.planCard}>
          <div className={styles.planTop}>
            <div>
              <div className={styles.planH}>Your practice plan for today</div>
              <div className={styles.planSub}>Based on your last session — filler words and pacing need work.</div>
            </div>
            <Button variant="spotlight" size="sm" id="start-plan-btn">Start plan →</Button>
          </div>
          <div className={styles.planItems}>
            {PLAN_ITEMS.map((item) => (
              <div key={item.num} className={styles.planItem}>
                <div className={styles.planItemNum}>{item.num}</div>
                <div style={{ flex: 1 }}>
                  <div className={styles.planItemName}>{item.name}</div>
                  <div className={styles.planItemSub}>{item.sub}</div>
                </div>
                <div className={styles.planItemTime}>{item.time}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'drills' && (
        <>
          {CATEGORIES.map((cat) => (
            <div key={cat.id} className={styles.catBlock}>
              <div className={styles.catHeader}>
                <span className={styles.catGlyph}>{cat.glyph}</span>
                <div>
                  <div className={styles.catTitle}>{cat.title}</div>
                  <div className={styles.catSub}>{cat.sub}</div>
                </div>
              </div>
              <div className={styles.drillGrid}>
                {cat.drills.map((drill) => (
                  <div key={drill.id} className={styles.drillCard}>
                    <div className={styles.drillHeader}>
                      <div className={styles.drillName}>{drill.name}</div>
                      <span className={styles.drillLevel}>{drill.level}</span>
                    </div>
                    <p className={styles.drillDesc}>{drill.desc}</p>
                    <div className={styles.drillFooter}>
                      <span className={styles.drillTime}>⏱ {drill.time}</span>
                      <Button variant="secondary" size="sm" id={`start-drill-${drill.id}`}>
                        Start
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </>
      )}
    </>
  );
};

export default DrillsPage;
