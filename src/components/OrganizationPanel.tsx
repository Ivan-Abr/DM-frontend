import React from 'react';
import { useParams } from 'react-router-dom';
import {
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  Legend
} from 'recharts';

// Заглушки для примера
const org = {
  name: 'GazProm',
  annotation:
      'ПАО «Газпром» — глобальная энергетическая компания. Основные направления деятельности — геологоразведка, добыча, транспортировка, хранение, переработка и реализация газа, газового конденсата и нефти, реализация газа в качестве моторного топлива, а также производство и сбыт тепло- и электроэнергии.',
  contacts: 'www.gazprom.ru',
};

const layers = [
  { name: 'Организационная культура' },
  { name: 'Кадры' },
  { name: 'Процессы' },
  { name: 'Продукты' },
  { name: 'Инфраструктура'},
];

const layerTexts = [
  'Корпоративная культура требует доработки: текущий уровень вовлеченности сотрудников немного ниже желаемого. Это может повлиять на эффективность командной работы и внедрение инноваций. Рекомендуется провести серию командных мероприятий, внедрить систему признания достижений сотрудников и создать более открытую коммуникационную среду для обмена идеями и обратной связи.',
  'Квалификация персонала на хорошем уровне, однако необходимо усилить программы обучения и развития, чтобы достичь оптимального уровня подготовки. Следует разработать индивидуальные планы развития для ключевых сотрудников, внедрить систему менторства и регулярно проводить оценку профессиональных компетенций. Также рекомендуется создать внутреннюю базу знаний и организовать регулярные обучающие сессии.',
  'Существующие бизнес-процессы нуждаются в значительной оптимизации. Разрыв между текущим и целевым состоянием говорит о необходимости пересмотра внутренних процедур. Необходимо провести аудит текущих процессов, выявить узкие места и внедрить автоматизацию рутинных операций. Рекомендуется также внедрить систему управления проектами и регулярно проводить ретроспективы для постоянного улучшения процессов.',
  'Качество продуктов соответствует ожиданиям, но есть возможности для улучшения, особенно в части адаптации к рынку и инноваций. Следует усилить фокус на исследованиях рынка и потребностей клиентов, внедрить регулярный сбор обратной связи от пользователей и создать процесс быстрого прототипирования новых идей. Рекомендуется также наладить более тесное взаимодействие между отделами разработки и маркетинга.',
  'Инфраструктура компании требует значительных улучшений, чтобы соответствовать современным требованиям. Необходимо обновить техническое оснащение, внедрить современные инструменты разработки и автоматизации, а также улучшить систему информационной безопасности. Рекомендуется также создать резервные системы и разработать план аварийного восстановления.',
];

const desired = [3, 3, 3, 2, 3];
const actual = [2.1, 2.3, 1.5, 2.0, 1.3];

const chartData = layers.map((layer, i) => ({
  subject: layer.name,
  desired: desired[i],
  actual: actual[i],
}));

const OrganizationPanel: React.FC = () => {
  const { id } = useParams();

  return (
      <div
          style={{
            maxWidth: 900,
            margin: '40px auto',
            padding: 32,
            background: '#fff',
            borderRadius: 16,
            boxShadow: '0 2px 8px #e3eafc',
          }}
      >
        <h2 style={{ color: '#1a237e', marginBottom: 24 }}>{org.name}</h2>
        <div style={{ marginBottom: 32 }}>
          <div style={{ marginBottom: 12 }}>
            <b>Аннотация:</b> {org.annotation}
          </div>
          <div style={{ marginBottom: 12 }}>
            <b>Контакты:</b> {org.contacts}
          </div>
        </div>
        <div style={{ marginBottom: 32 }}>
          <h3 style={{ color: '#1a237e', marginBottom: 16 }}>Результаты тестирования</h3>
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <RadarChart outerRadius={90} width={600} height={300} data={chartData}>
              <PolarGrid />
              <PolarAngleAxis dataKey="subject" />
              <PolarRadiusAxis angle={30} domain={[0, 3]} />
              <Radar
                  name="Желаемое"
                  dataKey="desired"
                  stroke="#4caf50"
                  fill="#4caf50"
                  fillOpacity={0.3}
              />
              <Radar
                  name="Действительное"
                  dataKey="actual"
                  stroke="#2196f3"
                  fill="#2196f3"
                  fillOpacity={0.3}
              />
              <Legend />
            </RadarChart>
          </div>
        </div>
        <div style={{ marginTop: 24 }}>
          <h3 style={{ color: '#1a237e', marginBottom: 16 }}>Рекомендации на основе результатов</h3>
          {layers.map((layer, idx) => {
            const difference = desired[idx] - actual[idx];
            let color = '#4caf50'; // green
            if (difference >= 1.6) {
              color = '#f44336'; // red
            } else if (difference >= 0.8) {
              color = '#ffc107'; // yellow
            }
            
            return (
              <p key={layer.name} style={{ marginBottom: 12 }}>
                <b>{layer.name}</b><b><span style={{ color: '#000' }}> (</span>
                <span style={{ color }}>{actual[idx]}</span>
                <span style={{ color }}>/</span>
                <span style={{ color }}>{desired[idx]}</span>
                <span style={{ color: '#000' }}>)</span></b>: {layerTexts[idx]}
              </p>
            );
          })}
        </div>
      </div>
  );
};

export default OrganizationPanel;
