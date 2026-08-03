import React, { useState, useEffect } from 'react';
import Button from '../../components/common/Button/Button';
import { cn } from '../../utils/cn';
import { drillsService } from '../../api/services/drillsService';
import type { Drill, DrillCategory } from '../../types/drills';
import styles from './Drills.module.scss';

const DrillsPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'plan' | 'drills'>('plan');
  const [planDrills, setPlanDrills] = useState<Drill[]>([]);
  const [categories, setCategories] = useState<DrillCategory[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      drillsService.getDrills(),
      drillsService.getCategories(),
    ]).then(([d, c]) => {
      setPlanDrills(d);
      setCategories(c);
    }).catch(() => {
      setPlanDrills([]);
      setCategories([]);
    }).finally(() => {
      setLoading(false);
    });
  }, []);

  const handleStartDrill = (drillId: string) => {
    drillsService.submitDrill(drillId, { score: 100 }).catch(() => {});
  };

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

      {loading ? (
        <div style={{ padding: '24px 0', color: 'var(--ink-muted)' }}>Loading voice drills…</div>
      ) : activeTab === 'plan' ? (
        <div className={styles.planCard}>
          <div className={styles.planTop}>
            <div>
              <div className={styles.planH}>Your practice plan for today</div>
              <div className={styles.planSub}>Recommended drills based on your session feedback.</div>
            </div>
            <Button variant="spotlight" size="sm" id="start-plan-btn">Start plan →</Button>
          </div>
          {planDrills.length === 0 ? (
            <div style={{ padding: '20px', color: 'var(--ink-muted)', textAlign: 'center' }}>
              No custom drills scheduled for today. Explore "All Drills" tab to choose a practice drill!
            </div>
          ) : (
            <div className={styles.planItems}>
              {planDrills.map((item, index) => (
                <div key={item.id || index} className={styles.planItem}>
                  <div className={styles.planItemNum}>{index + 1}</div>
                  <div style={{ flex: 1 }}>
                    <div className={styles.planItemName}>{item.name}</div>
                    <div className={styles.planItemSub}>{item.description}</div>
                  </div>
                  <div className={styles.planItemTime}>
                    {item.durationMinutes ? `${item.durationMinutes} min` : item.estimatedTimeMinutes ? `${item.estimatedTimeMinutes} min` : '5 min'}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      ) : (
        <>
          {categories.length === 0 ? (
            <div style={{ padding: '20px', color: 'var(--ink-muted)' }}>
              No drill categories currently available.
            </div>
          ) : (
            categories.map((cat) => (
              <div key={cat.id} className={styles.catBlock}>
                <div className={styles.catHeader}>
                  <span className={styles.catGlyph}>{cat.glyph || '🎯'}</span>
                  <div>
                    <div className={styles.catTitle}>{cat.name}</div>
                    <div className={styles.catSub}>{cat.description || 'Targeted voice exercise'}</div>
                  </div>
                </div>
                <div className={styles.drillGrid}>
                  {cat.drills.map((drill) => (
                    <div key={drill.id} className={styles.drillCard}>
                      <div className={styles.drillHeader}>
                        <div className={styles.drillName}>{drill.name}</div>
                        <span className={styles.drillLevel}>{drill.level || drill.difficulty || 'Beginner'}</span>
                      </div>
                      <p className={styles.drillDesc}>{drill.description}</p>
                      <div className={styles.drillFooter}>
                        <span className={styles.drillTime}>
                          ⏱ {drill.durationMinutes ? `${drill.durationMinutes} min` : drill.estimatedTimeMinutes ? `${drill.estimatedTimeMinutes} min` : '5 min'}
                        </span>
                        <Button
                          variant="secondary"
                          size="sm"
                          id={`start-drill-${drill.id}`}
                          onClick={() => handleStartDrill(drill.id)}
                        >
                          Start
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))
          )}
        </>
      )}
    </>
  );
};

export default DrillsPage;
