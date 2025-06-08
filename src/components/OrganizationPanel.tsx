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
}

const OrganizationPanel: React.FC = () => {
  const { id } = useParams();
  const [layerData, setLayerData] = useState<LayerData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Log the URL we're trying to fetch
        const url = `http://localhost:8080/api/answer/all/org/${id}`;
        console.log('Fetching from URL:', url);

        const response = await fetch(url, {
          method: 'GET',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
          },
        });

        // Log the response details
        console.log('Response status:', response.status);
        console.log('Response headers:', Object.fromEntries(response.headers.entries()));

        if (!response.ok) {
          const errorText = await response.text();
          console.error('Error response body:', errorText);
          throw new Error(`HTTP error! status: ${response.status}, body: ${errorText}`);
        }
        
        const contentType = response.headers.get("content-type");
        console.log('Content-Type:', contentType);

        if (!contentType || !contentType.includes("application/json")) {
          const text = await response.text();
          console.error('Received non-JSON response:', text);
          throw new Error("Server didn't return JSON");
        }

        const data = await response.json();
        console.log('Received data:', data);
        
        if (!Array.isArray(data)) {
          throw new Error("Invalid data format received");
        }

        const transformedData = data.map((item: any[]) => {
          if (!Array.isArray(item) || item.length < 4) {
            throw new Error("Invalid item format in data array");
          }
          return {
            score: Number(item[0]),
            layerName: String(item[1]),
            organizationName: String(item[2]),
            year: Number(item[3])
          };
        });

        setLayerData(transformedData);
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
            const difference = 3 - layer.score; // Assuming desired score is always 3
            let color = '#4caf50'; // green
            if (difference >= 1.6) {
              color = '#f44336'; // red
            } else if (difference >= 0.8) {
              color = '#ffc107'; // yellow
            }
            
            return (
              <p key={layer.layerName} style={{ marginBottom: 12 }}>
                <b>{layer.layerName}</b><b><span style={{ color: '#000' }}> (</span>
                <span style={{ color }}>{Number(layer.score.toFixed(2)).toString()}</span>
                <span style={{ color }}>/</span>
                <span style={{ color }}>3</span>
                <span style={{ color: '#000' }}>)</span></b>
              </p>
            );
          })}
        </div>
      </div>
  );
};

export default OrganizationPanel;
