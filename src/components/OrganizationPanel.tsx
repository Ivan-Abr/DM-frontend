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
import {ViewOrganizationDTO} from "../types";
import {message} from "antd";

interface LayerData {
  score: number;
  organizationName: string;
  year: number;
  layerId: string;
}

interface Layer {
  id: string;
  name: string;
  desiredValue: number;
}

interface Recommendation {
  annotation: string;
}

const OrganizationPanel: React.FC = () => {
  const { id } = useParams();
  const [layerData, setLayerData] = useState<LayerData[]>([]);
  const [layers, setLayers] = useState<{ [key: string]: Layer }>({});
  const [recommendations, setRecommendations] = useState<{ [key: string]: Recommendation }>({});
  const [organization, setOrganizations] = useState<ViewOrganizationDTO | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Загружаем все слои один раз
  useEffect(() => {
    const fetchLayers = async () => {
      try {
        const response = await api.get(API_ENDPOINTS.LAYER.BASE);
        const layersMap = response.data.reduce((acc: { [key: string]: Layer }, layer: Layer) => {
          acc[layer.id] = layer;
          return acc;
        }, {});
        setLayers(layersMap);
      } catch (error) {
        setError('Ошибка загрузки слоев');
      }
    };
    fetchLayers();
  }, []);

  useEffect(() => {
    const fetchOrganization = async () => {
      try {
        setLoading(true);
        setError(null);

        if (!id) {
          throw new Error("Organization ID is missing");
        }

        const response = await api.get(API_ENDPOINTS.ORGANIZATION.BY_ID(id));

        if (!response.data) {
          throw new Error("Organization data not found");
        }

        setOrganizations(response.data);
      } catch (error) {
        console.error("Failed to fetch organization:", error);
        setError(error instanceof Error ? error.message : "Failed to load organization");
        message.error("Ошибка загрузки организации");
      } finally {
        setLoading(false);
      }
    };
    fetchOrganization();
  }, [id]);

  // Загружаем ответы и рекомендации после загрузки слоев
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        const url = API_ENDPOINTS.ANSWER.ALL_BY_ORG(id!);
        const response = await fetch(url, {
          method: 'GET',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
          },
        });
        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(`HTTP error! status: ${response.status}, body: ${errorText}`);
        }
        const data = await response.json();
        if (!Array.isArray(data)) {
          throw new Error('Invalid data format received');
        }
        // Преобразуем данные ответов
        const transformedData: LayerData[] = data.map((item: any[], index: number) => {
          if (!Array.isArray(item) || item.length < 4) {
            throw new Error(`Invalid item format in data array at index ${index}`);
          }
          return {
            score: Number(item[0]),
            organizationName: String(item[1]),
            year: Number(item[2]),
            layerId: String(item[3])
          };
        });
        setLayerData(transformedData);
        // Загружаем рекомендации для каждого слоя
        for (const layer of transformedData) {
          const layerInfo = layers[layer.layerId];
          if (!layerInfo) continue;
          const difference = layerInfo.desiredValue - layer.score;
          try {
            const recResp = await api.get(`/api/recommendation/value/${difference}/layer/${layer.layerId}`);
            setRecommendations(prev => ({ ...prev, [layer.layerId]: recResp.data }));
          } catch (e) {
            // Можно залогировать ошибку
          }
        }
      } catch (error) {
        setError(error instanceof Error ? error.message : 'Failed to fetch data');
      } finally {
        setLoading(false);
      }
    };
    if (Object.keys(layers).length > 0) fetchData();
  }, [id, layers]);

  const chartData = layerData.map(layer => {
    const layerInfo = layers[layer.layerId];
    return {
      subject: layerInfo ? layerInfo.name : 'Unknown Layer',
      actual: layer.score,
      desired: layerInfo ? layerInfo.desiredValue : 0,
    };
  });

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '200px' }}>
        Loading...
      </div>
    );
  }
  if (error) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '200px', color: 'red' }}>
        Error: {error}
      </div>
    );
  }
  if (layerData.length === 0) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '200px' }}>
        No data available
      </div>
    );
  }

  if (!organization) {
    return (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '200px' }}>
          Organization data not available
        </div>
    );
  }

  return (
    <div style={{ maxWidth: 900, margin: '40px auto', padding: 32, background: '#fff', borderRadius: 16, boxShadow: '0 2px 8px #e3eafc' }}>
      <h2 style={{ color: '#1a237e', marginBottom: 24 }}>{organization.name}</h2>
      <div style={{ marginBottom: 32 }}>
        <div style={{ marginBottom: 12 }}>
          <b>Аннотация:</b> {organization.annotation}
        </div>
        <div style={{ marginBottom: 12 }}>
          <b>Контакты:</b> {organization.contacts}
        </div>
      </div>
      <div style={{ marginBottom: 32 }}>
        <h3 style={{ color: '#1a237e', marginBottom: 16 }}>Результаты тестирования</h3>
        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <RadarChart outerRadius={90} width={600} height={300} data={chartData}>
            <PolarGrid />
            <PolarAngleAxis dataKey="subject" />
            <PolarRadiusAxis angle={30} domain={[0, 3]} />
            <Radar name="Желаемое" dataKey="desired" stroke="#4caf50" fill="#4caf50" fillOpacity={0.3} />
            <Radar name="Действительное" dataKey="actual" stroke="#2196f3" fill="#2196f3" fillOpacity={0.3} />
            <Legend />
          </RadarChart>
        </div>
      </div>
      <div style={{ marginTop: 24 }}>
        <h3 style={{ color: '#1a237e', marginBottom: 16 }}>Рекомендации на основе результатов</h3>
        {layerData.map((layer) => {
          const layerInfo = layers[layer.layerId];
          if (!layerInfo) return null;
          const difference = layerInfo.desiredValue - layer.score;
          let color = '#4caf50';
          if (difference >= 1.6) color = '#f44336';
          else if (difference >= 0.8) color = '#ffc107';
          const recommendation = recommendations[layer.layerId];
          return (
            <div key={layer.layerId} style={{ marginBottom: 24 }}>
              <p style={{ marginBottom: 8 }}>
                <b>{layerInfo.name}</b><b><span style={{ color: '#000' }}> (</span>
                <span style={{ color }}>{Number(layer.score.toFixed(2)).toString()}</span>
                <span style={{ color }}>/</span>
                <span style={{ color }}>{layerInfo.desiredValue}</span>
                <span style={{ color: '#000' }}>)</span></b>
                {recommendation && (
                  <span style={{ display: 'inline', marginLeft: 6 }}>
                    <b style={{ marginRight: 4 }}>:</b>
                    <span style={{ color: '#666', fontSize: '0.9em' }}>{recommendation.annotation}</span>
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
