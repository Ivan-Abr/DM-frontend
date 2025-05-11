import React, { useState, useEffect } from 'react';
import { Tabs, Button, notification } from 'antd';
import AdminRoute from './AdminRoute';
import LayerPanel from "../crud/LayerPanel";
import FactorPanel from "../crud/FactorPanel";
import QuestionPanel from "../crud/QuestionPanel";
import { UserOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
// import QuestionPanel from "../crud/QuestionPanel";

const AdminPanel: React.FC = () => {
    const navigate = useNavigate();
    return (
        <AdminRoute>
            <div className="admin-panel">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <h1>Административная панель</h1>
                    <Button
                        icon={<UserOutlined />}
                        onClick={() => navigate('/user')}
                        type="default"
                    >
                        Профиль
                    </Button>
                </div>
                <Tabs
                    items={[
                        { label: 'Слои ЦЗ', key: 'layers', children: <LayerPanel /> },
                        { label: 'Факторы ЦЗ', key: 'factors', children: <FactorPanel /> },
                        { label: 'Вопросы', key: 'questions', children: <QuestionPanel /> }
                    ]}
                />
            </div>
        </AdminRoute>
    );
};

export default AdminPanel;