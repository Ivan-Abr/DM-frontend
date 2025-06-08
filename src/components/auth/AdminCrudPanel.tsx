import React from 'react';
import { Tabs } from 'antd';
import LayerPanel from '../crud/LayerPanel';
import FactorPanel from '../crud/FactorPanel';
import QuestionPanel from '../crud/QuestionPanel';
import MilestonePanel from "../crud/MilestonePanel";
import RecommendationPanel from "../crud/RecommendationPanel";

const AdminCrudPanel: React.FC = () => {
  return (
    <div style={{ background: '#f5f7fa', minHeight: '100vh', paddingTop: 0 }}>
      <div style={{ background: '#1a237e', padding: '24px 0 24px 32px', marginBottom: 32 }}>
        <h1 style={{ color: '#fff', textAlign: 'left', margin: 0, fontWeight: 700, fontSize: 28 }}>
          Редактирование данных
        </h1>
      </div>
      <div
        style={{
          maxWidth: 1100,
          margin: '0 auto',
          background: '#fff',
          borderRadius: '0 0 16px 16px',
          boxShadow: '0 2px 12px #e3eafc',
          padding: '32px 24px 24px 24px',
          minHeight: 600,
        }}
      >
        <Tabs
          items={[
            { label: 'Слои ЦЗ', key: 'layers', children: <LayerPanel /> },
            { label: 'Факторы ЦЗ', key: 'factors', children: <FactorPanel /> },
            { label: 'Показатели', key: 'questions', children: <QuestionPanel /> },
            { label: 'Вехи', key: 'milestones', children: <MilestonePanel /> },
            { label: 'Рекомендации', key: 'recommendations', children: <RecommendationPanel /> }
          ]}
        />
      </div>
    </div>
  );
};

export default AdminCrudPanel; 