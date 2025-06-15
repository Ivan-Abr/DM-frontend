import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import {
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  Legend
} from 'recharts';
import { API_ENDPOINTS } from '../config';
import api from '../api';

// Заглушки для примера
const org = {
  name: 'GazProm',
  annotation:
      'ПАО «Газпром» — глобальная энергетическая компания. Основные направления деятельности — геологоразведка, добыча, транспортировка, хранение, переработка и реализация газа, газового конденсата и нефти, реализация газа в качестве моторного топлива, а также производство и сбыт тепло- и электроэнергии.',
  contacts: 'www.gazprom.ru',
};

interface LayerData {
  score: number;
  layerName: string;
  organizationName: string;
  year: number;
  layerId: string;
}

interface Recommendation {
  layerName: string;
  value: number;
  annotation: string;
}

interface Layer {
  id: string;
  name: string;
}

const OrganizationPanel: React.FC = () => {
  const { id } = useParams();
  const [layerData, setLayerData] = useState<LayerData[]>([]);
  const [layers, setLayers] = useState<Layer[]>([]);
  const [recommendations, setRecommendations] = useState<{ [key: string]: Recommendation }>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchLayers = async () => {
    try {
      const response = await api.get(API_ENDPOINTS.LAYER.BASE);
      console.log('Загруженные слои:', response.data);
      setLayers(response.data);
    } catch (error) {
      console.error("Ошибка загрузки слоев:", error);
    }
  };

  const fetchRecommendation = async (layerName: string, score: number, layerId: string) => {
    try {
      const difference = 3 - score;
      console.log(`Запрос рекомендации для слоя ${layerId} с разницей ${difference}`);

      const response = await api.get(`/api/recommendation/value/${difference}/layer/${layerId}`);
      console.log('Полученная рекомендация:', response.data);
      setRecommendations(prev => ({
        ...prev,
        [layerName]: response.data
      }));
    } catch (error) {
      console.error(`Ошибка получения рекомендации для слоя ${layerName}:`, error);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Сначала загружаем слои
        await fetchLayers();
        
        const url = API_ENDPOINTS.ANSWER.ALL_BY_ORG(id!);
        console.log('Fetching from URL:', url);

        const response = await fetch(url, {
          method: 'GET',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          const errorText = await response.text();
          console.error('Error response body:', errorText);
          throw new Error(`HTTP error! status: ${response.status}, body: ${errorText}`);
        }
        
        const contentType = response.headers.get("content-type");
        if (!contentType || !contentType.includes("application/json")) {
          const text = await response.text();
          console.error('Received non-JSON response:', text);
          throw new Error("Server didn't return JSON");
        }

        const data = await response.json();
        console.log('Received raw data:', data);
        
        if (!Array.isArray(data)) {
          throw new Error("Invalid data format received");
        }

        const transformedData = data.map((item: any[], index: number) => {
          console.log(`Processing item ${index}:`, item);
          if (!Array.isArray(item) || item.length < 5) {
            console.error('Invalid item format:', item);
            throw new Error(`Invalid item format in data array at index ${index}`);
          }
          return {
            score: Number(item[0]),
            layerName: String(item[1]),
            organizationName: String(item[2]),
            year: Number(item[3]),
            layerId: String(item[4])
          };
        });

        console.log('Transformed data:', transformedData);
        setLayerData(transformedData);

        // Загружаем рекомендации для каждого слоя
        console.log('Начинаем загрузку рекомендаций для слоев:', transformedData);
        for (const layer of transformedData) {
          await fetchRecommendation(layer.layerName, layer.score, layer.layerId);
        }

      } catch (error) {
        console.error('Error fetching data:', error);
        setError(error instanceof Error ? error.message : 'Failed to fetch data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  const chartData = layerData.map(layer => ({
    subject: layer.layerName,
    actual: layer.score,
    desired: 3, // Assuming desired score is always 3
  }));

  if (loading) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '200px' 
      }}>
        Loading...
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '200px',
        color: 'red' 
      }}>
        Error: {error}
      </div>
    );
  }

  if (layerData.length === 0) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '200px' 
      }}>
        No data available
      </div>
    );
  }

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
          {layerData.map((layer) => {
            const difference = 3 - layer.score;
            let color = '#4caf50';
            if (difference >= 1.6) {
              color = '#f44336';
            } else if (difference >= 0.8) {
              color = '#ffc107';
            }
            
            const recommendation = recommendations[layer.layerName];
            
            return (
              <div key={layer.layerName} style={{ marginBottom: 24 }}>
                <p style={{ marginBottom: 8 }}>
                  <b>{layer.layerName}</b><b><span style={{ color: '#000' }}> (</span>
                  <span style={{ color }}>{Number(layer.score.toFixed(2)).toString()}</span>
                  <span style={{ color }}>/</span>
                  <span style={{ color }}>3</span>
                  <span style={{ color: '#000' }}>)</span></b>
                  {recommendation && (
                    <span style={{ 
                      color: '#666',
                      fontSize: '0.9em',
                      marginLeft: '8px'
                    }}>
                      : {recommendation.annotation}
                    </span>
                  )}
                </p>
              </div>
            );
          })}
        </div>
      </div>
  );
};

export default OrganizationPanel;
