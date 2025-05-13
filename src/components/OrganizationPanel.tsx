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
  { name: 'Инфраструктура\nи инструменты' },
];

const layerTexts = [
  'Корпоративная культура требует доработки: текущий уровень вовлеченности сотрудников немного ниже желаемого. Это может повлиять на эффективность командной работы и внедрение инноваций.',
  'Квалификация персонала на хорошем уровне, однако необходимо усилить программы обучения и развития, чтобы достичь оптимального уровня подготовки.',
  'Существующие бизнес-процессы нуждаются в значительной оптимизации. Разрыв между текущим и целевым состоянием говорит о необходимости пересмотра внутренних процедур.',
  'Качество продуктов соответствует ожиданиям, но есть возможности для улучшения, особенно в части адаптации к рынку и инноваций.',
  'Инфраструктура компании требует значительных улучшений, чтобы соответствовать современным требованиям. Это касается как инструментов, так и технической поддержки рабочих процессов.',
];

const desired = [3, 3, 3, 2, 3];
const actual = [2, 2, 1, 2, 1];

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
        <div style={{ display: 'flex', alignItems: 'flex-start', marginBottom: 32 }}>
          <div style={{ flex: '0 1 70%', maxWidth: '70%', paddingRight: 32 }}>
            <div style={{ marginBottom: 12 }}>
              <b>Аннотация:</b> {org.annotation}
            </div>
            <div style={{ marginBottom: 12 }}>
              <b>Контакты:</b> {org.contacts}
            </div>
          </div>
          <div
              style={{
                flex: '0 1 30%',
                minWidth: 320,
                maxWidth: 350,
                display: 'flex',
                justifyContent: 'flex-end',
              }}
          >
            <RadarChart outerRadius={90} width={300} height={300} data={chartData}>
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
          {layers.map((layer, idx) => (
              <p key={layer.name} style={{ marginBottom: 12 }}>
                <b>{layer.name}:</b> {layerTexts[idx]}
              </p>
          ))}
        </div>
      </div>
  );
};

export default OrganizationPanel;
